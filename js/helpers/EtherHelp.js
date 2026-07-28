// import { ethers } from 'ethers'
// import { ethers } from "https://cdn.ethers.io/lib/ethers-5.0.esm.min.js";
import realAbi from '../../contracts/RealSimple.abi.js'
import lendingPoolAbi from '../../contracts/LendingPool.abi.js'
import aavegotchisAbi from '../../contracts/Aavegotchis.abi.js'
import globalEvents from './globalEvents.js'
import {NETWORKS, GAME_NETWORK} from './ethConstants.js'
import {cryptos, ERC20abi} from './cryptos.js'
import fetchJSON from './fetchJSON.js'

// Temporary fix for ENS while waiting for migration
const ETHERS_V6 = 'https://cdn.jsdelivr.net/npm/ethers@6.17.0/+esm'

// Connection errors the interface can either switch on (code) or just display (message).
const walletError = (code, message) => Object.assign(new Error(message), {code})

// A wallet may report a chain id as a number, a decimal string or hex: `==` takes all three
const networkOfChainId = chainId => Object.values(NETWORKS).find(n => n.chainId == chainId)
const chainIdHex = chainId => '0x' + chainId.toString(16)

export default class EtherHelp {
	constructor() {
		// Default assets for testing and discovering the game
		this.assets = {DAI: 59, REAL: 2, AAVE: 10, ETH: 3}
		this.ename = ''
		this.account = ''
		this.network = {name: 'disconnected'}
		this.tokenContract = {}
	}

	get isConnected() {
		return this.account !== ''
	}

	get isOnGameNetwork() {
		return this.network.name === GAME_NETWORK
	}

	// Explorer link for a transaction or an address, '' when the network has none
	explorerLink(kind, value) {
		if (!this.network.blockExplorer) return ''
		return this.network.blockExplorer.replace(/\/$/, '') + `/${kind}/${value}`
	}

	get explorerWalletLink() {
		return globalEth.isConnected ? globalEth.explorerLink('address', globalEth.account) : ''
	}
		
	async configureENS() {
		const ensNetwork = NETWORKS[GAME_NETWORK]
		try {
			// Always the same chain, so build it once. chainChanged re-runs the whole of
			// useAccounts, and a new provider on every network switch buys nothing
			if (!this.ensProvider) {
				const {JsonRpcProvider} = await import(ETHERS_V6)
				this.ensProvider = new JsonRpcProvider(ensNetwork.rpcUrl, ensNetwork.chainId)
			}
			console.log('🏷 Getting ENS name')
			// null when the address has no primary name set, which is the common case
			this.ename = (await this.ensProvider.lookupAddress(this.account)) || ''
			console.log(this.ename ? `🏷 Name found: ${this.ename}` : `🏷 No name set for this address`)
		} catch (err) {
			console.warn('ENS lookup unavailable', err.message)
			this.ename = ''
		}
	}

	// Connect an injected wallet (MetaMask, Brave, Rabby…). 
	async initialiseMetaMask() {
		if (!window.ethereum) throw walletError('no-wallet', 'no wallet was found in this browser')

		let accounts
		try {
			accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
		} catch (err) {
			// Standard EIP-1193 error codes
			if (err.code === 4001) throw walletError('rejected', 'the connection was refused')
			if (err.code === -32002) throw walletError('pending', 'the wallet is already asking to connect')
			throw err
		}
		if (!accounts || accounts.length === 0) throw walletError('no-account', 'the wallet has no account to share')

		await this.useAccounts(accounts)
		this.listenToWallet()
	}

	async useAccounts(accounts) {
		this.account = accounts[0]
		// 'any' lets the provider follow the wallet across chains instead of throwing "underlying network changed" when the player switches network mid-game
		this.provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
		this.signer = this.provider.getSigner()
		const {chainId} = await this.provider.getNetwork()
		this.network = networkOfChainId(chainId) || {name: 'unknown', chainId}
		console.log('📡 NETWORK ', this.network)

		this.initialiseSmartContracts()
		await this.configureENS()
		globalEvents.emit('connected', this.account, this.ename, this.network)
		console.log(`🔗 connected with ${this.account} on ${this.network.name}`)
	}

	// Resync if network or wallet change
	listenToWallet() {
		if (this.listening || !window.ethereum) return
		this.listening = true

		window.ethereum.on('accountsChanged', async accounts => {
			// An empty list means the player revoked this site in their wallet
			if (!accounts || accounts.length === 0) {
				console.log('🔌 wallet disconnected')
				this.account = ''
				this.ename = ''
				this.assets = {}
				this.tokenContract = {}
				this.network = {name: 'disconnected'}
				globalEvents.emit('disconnected')
				globalEvents.emit('assets-updated', this.assets)
				return
			}
			console.log('👤 account changed')
			await this.useAccounts(accounts)
		})

		window.ethereum.on('chainChanged', async () => {
			if (!this.account) return
			console.log('⛓ network changed')
			await this.useAccounts([this.account])
		})
	}

	async switchNetwork(networkName = GAME_NETWORK) {
		const target = NETWORKS[networkName]
		if (!target) throw new Error(`Unknown network ${networkName}`)
		try {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{chainId: chainIdHex(target.chainId)}]
			})
		} catch (err) {
			if (err.code === 4902) {
				// 4902 = the wallet has never heard of this chain, so describe it fully.
				// This is why NETWORKS entries carry nativeCurrency and a hex chainId.
				await window.ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [
						{
							chainId: chainIdHex(target.chainId),
							chainName: target.label || target.name,
							rpcUrls: [target.rpcUrl],
							blockExplorerUrls: target.blockExplorer ? [target.blockExplorer] : [],
							nativeCurrency: target.nativeCurrency
						}
					]
				})
			} else {
				throw err
			}
		}
		// chainChanged then refreshes everything
	}

	// Every token of cryptos.js that has an address on the network we are on.
	get availableTokens() {
		return Object.keys(cryptos).filter(token => {
			const conf = cryptos[token][this.network.name]
			return conf && conf.token
		})
	}


	// Not async: nothing here is awaited, and updateAssets below is deliberately left to
	// land on its own. Awaiting this would not mean the balances are ready.
	initialiseSmartContracts() {
		this.tokenContract = {}
		for (const token of this.availableTokens) {
			const abi = token == 'REAL' ? realAbi : ERC20abi
			this.tokenContract[token] = new ethers.Contract(cryptos[token][this.network.name].token, abi, this.signer)
		}

		this.realContract = this.tokenContract.REAL
		this.updateAssets()

		this.lendingPool = null
		this.ag = null
		const aaveConf = cryptos['AAVE'][this.network.name]
		if (aaveConf && aaveConf.lendingPool) {
			this.lendingPool = new ethers.Contract(aaveConf.lendingPool, lendingPoolAbi, this.signer)
		}
		if (aaveConf && aaveConf.aavegotchi) {
			this.ag = new ethers.Contract(aaveConf.aavegotchi, aavegotchisAbi, this.signer)
			console.log(`AG contract`, this.ag)
			this.getAavegotchis()
		}
	}

	async updateAssets() {
		if (!this.account) return this.assets

		const assets = {}
		try {
			assets['ETH'] = await this.getETHBalance()
		} catch (err) {
			console.warn(`Could not read the native balance`, err.message)
		}

		await Promise.all(
			Object.keys(this.tokenContract).map(async token => {
				try {
					const val = await this.tokenContract[token].balanceOf(this.account)
					assets[token] = Number(ethers.utils.formatUnits(val, cryptos[token].decimals))
				} catch (err) {
					console.warn(`Could not read the ${token} balance`, err.message)
				}
			})
		)

		this.assets = assets
		if (DEBUG) console.log(`💰 balances`, this.assets)
		globalEvents.emit('assets-updated', this.assets)
		return this.assets
	}


	async getETHBalance() {
		//TODO : Should be dealt with other assets
		let balance = await this.provider.getBalance(this.account)
		// Number, not the string formatEther returns: callers test it for emptiness, and
		// '0.0' is truthy — a player with no ETH was told they had some
		this.assets['ETH'] = Number(ethers.utils.formatEther(balance))
		return this.assets['ETH']
	}
	async deposit(amount, token) {
		if (!this.lendingPool) {
			globalEvents.emit('says', `The lending pool is not open on ${this.network.name} yet. Come back soon!`)
			return
		}
		if (token === 'ETH') {
			console.log(`Depositing ETH`)
			this.lendingPool.deposit(
				'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
				ethers.utils.parseEther(amount.toString()),
				this.account,
				''
			)
		} else {
			console.error(`Token not available yet`)
		}
	}

	async sendETH(address, amount) {
		return this.sendToken('ETH', address, amount)
	}

	async sendToken(token, receiverAddress, amount) {
		if (!this.isConnected) {
			globalEvents.emit('says', 'You need to connect a wallet first. Talk to the fox.')
			return
		}
		if (!receiverAddress) {
			globalEvents.emit('says', 'I have no address to send this to.')
			return
		}

		let txPromise
		try {
			if (token == 'ETH') {
				txPromise = this.signer.sendTransaction({
					to: receiverAddress,
					value: ethers.utils.parseUnits(String(amount), 18)
				})
			} else {
				const contract = this.tokenContract[token]
				if (!contract) {
					globalEvents.emit('says', `${token} is not available on ${this.network.name}.`)
					return
				}
				txPromise = contract.transfer(receiverAddress, ethers.utils.parseUnits(String(amount), cryptos[token].decimals))
			}
		} catch (err) {
			console.error(err)
			globalEvents.emit('says', `${amount} is not a valid amount of ${token}.`)
			return
		}

		// GameScene flies a transaction sprite for as long as this promise is pending
		globalEvents.emit('ongoing-transaction', txPromise)

		try {
			// Two waits: `await txPromise` resolves when the wallet has signed and
			// broadcast, `tx.wait()` when a block includes it
			const tx = await txPromise
			console.log(`📤 tx sent`, this.explorerLink('tx', tx.hash) || tx.hash)
			globalEvents.emit('says', `Sending ${amount} ${token}… waiting for the network to confirm.`)
			await tx.wait()
			globalEvents.emit('says', `Done! ${amount} ${token} sent.`)
			this.updateAssets()
			return tx
		} catch (err) {
			console.error(`Transaction failed`, err)
			if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
				globalEvents.emit('says', 'You cancelled the transaction.')
			} else if (err.code === 'INSUFFICIENT_FUNDS') {
				globalEvents.emit('says', `Not enough funds. You also need some ETH to pay the gas fee.`)
			} else {
				globalEvents.emit('says', `The transaction failed: ${err.reason || err.message}`)
			}
		}
	}

	getGovernanceItems() {
		let govItems = [
			{
				name: 'Adding BAL on AAVE',
				yay: 262,
				nay: 184
			},
			{
				name: 'Aavenomcis quarterly Upgrade',
				yay: 0,
				nay: 0
			}
		]
		return govItems
	}

	buyCoffee() {
		if (!this.realContract) return
		this.realContract
			.buyCoffee()
			// TODO,  deal better with the ongoing transaction
			.then(() => {
				console.log('we got coffee!')
				this.updateAssets()
				globalEvents.emit('adding-coffee')
			})
			.catch(err => globalEvents.emit('says', `The machine refused: ${err.reason || err.message}`))
	}

	buyUSDC() {
		if (!this.realContract) console.warn("Real not deployed")
		if (DEBUG) console.log('Calling', this.realContract)
		this.realContract
			.buyUSDC()
			.then(() => {
				console.log('we got USDC!')
				//TODO: make transfer
				this.updateAssets() 
			})
			.catch(err => globalEvents.emit('says', `The exchange refused: ${err.reason || err.message}`))
	}

	async findLiquidityPool() {
		const data = await fetchJSON('https://aave-api-v2.aave.com/data/tvl')
		console.log('liquidity pool data', data)
		// const totalValInUsd = data.
	}

	async isParticipant() {
		return await this.realContract.participants(this.account)
	}


	async swapETHforX(token, amount) {
		//TODO : Take `token` into account and change addresses, names...
		let fromAddress = globalEth.account
		const reqString = `https://api.1inch.exchange/v2.0/swap?fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toTokenAddress=0x6b175474e89094c44da98b954eedeac495271d0f&amount=${amount}&fromAddress=${fromAddress}&slippage=1`
		console.log('req string in swap func', reqString)
		try {
			const data = await fetchJSON(reqString)
			console.log('tx in 1inch response', data.tx)
			globalEvents.emit(
				'says',
				`So you want to swap your ETH for DAI? Let's start with ${amount} ETH which is equal to ${data.toTokenAmount.toLocaleString()} DAI`
			)
			await this.signer.sendTransaction(data.tx)
		} catch (err) {
			console.warn('1inch swap unavailable', err.message)
			globalEvents.emit('says', `Our exchange desk is closed for renovation. Try sending tokens instead!`)
		}
	}

	async swapDAIforGHST(amount) {
		let fromAddress = globalEth.account
		const fromTokenAddress = '0x6b175474e89094c44da98b954eedeac495271d0f'
		const toTokenAddress = '0x3F382DbD960E3a9bbCeaE22651E88158d2791550'
		const reqString = `https://api.1inch.exchange/v2.0/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&fromAddress=${fromAddress}&slippage=1`
		console.log('req string in swap func', reqString)
		const data = await fetchJSON(reqString)
		console.log('tx in 1inch response', data)
		globalEvents.emit(
			'says',
			`So you want to swap your DAI for GHST? Let's start with ${amount} ETH which is equal to ${data.toTokenAmount.toLocaleString()} DAI`
		)

		console.log('window.ethers in swap func', window.ethers)
		// await window.ethers.Signer.sendTransaction(data.tx)
	}

	// async swapETHforAAVE(amount){
	//     let fromAddress = globalEth.account
	//     const reqString = `https://api.1inch.exchange/v2.0/swap?fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toTokenAddress=0x6b175474e89094c44da98b954eedeac495271d0f&amount=${amount}&fromAddress=${fromAddress}&slippage=1`
	//     console.log('req string in swap func', reqString)
	//     const data = await getJSON(reqString)
	//     console.log('data from 1inch response', data)
	//     globalEvents.emit("says", `So you want to swap your ETH for AAVE? Let's start with ${amount} ETH which is equal to ${data.toTokenAmount.toLocaleString()} AAVE`)
	// }

	async getAavegotchis() {
		// console.log(`getting AAVEGOTCHIs`, this.account)
		// let listAG = await this.ag.allAavegotchisOfOwner(this.account)
		// console.log("List of AG",listAG)
		// Hardcoding my cute Aavegotchi
		let ag = await this.ag.getAavegotchi(4567)
		let agsvg = await this.ag.getAavegotchiSvg(4567)
		globalGame.scene.getScene('gameScene').addAavegotchi(ag, agsvg)
	}

	async participate() {
		try {
			return await this.realContract.participate()
		} catch (err) {
			console.error(err)
		}
	}
}
