// import { ethers } from 'ethers'
// import { ethers } from "https://cdn.ethers.io/lib/ethers-5.0.esm.min.js";
import realAbi from '../../contracts/RealSimple.abi.js'
import lendingPoolAbi from '../../contracts/LendingPool.abi.js'
import aavegotchisAbi from '../../contracts/Aavegotchis.abi.js'
import globalEvents from './globalEvents.js'
import {NETWORK} from './ethConstants.js'
import {cryptos} from './cryptos.js'

// Config
const realAddress = "0xf83fA235C22276834cAFD018BF42Ca4469BdBf90"
const network = 'maticTestnet'

const portisID = '94f4cc1b-6e36-463d-8d48-11d6e84c1b4d'

// Base ERC20 ABI, from ethers doc
const ERC20abi = [
    // Read-Only Functions
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",

    // Authenticated Functions
    "function transfer(address to, uint amount) returns (boolean)",

    // Events
    "event Transfer(address indexed from, address indexed to, uint amount)"
];

// const LendingPoolabi = [
//     "function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode ) external override whenNotPaused"
// ]

export default class EtherHelp {

    constructor() {
        this.assets = {DAI:59, REAL:2, AAVE:10, ETH:3}
        this.ename = ""
        this.account = ""
    }

    initialisePortis() {
        return new Promise(async (resolve, reject) => {
            if (this.portis)
                reject()
            this.portis = new Portis(portisID, network, {
                // gasRelay: true,
                // registerPageByDefault: true
            })
            this.provider = new ethers.providers.Web3Provider(this.portis.provider)
            await this.portis.provider.enable()
            const accounts = await this.provider.listAccounts()
            this.account = accounts[0]
            this.signer = this.provider.getSigner()
            this.realContract = await new ethers.Contract(realAddress, realAbi, this.signer)
            globalEvents.emit('connected', this.account)
            console.log("connected")

            resolve()
        })
    }

    async initialiseMetaMask(){
        if(window.ethereum){
            if (ethereum.isConnected()){
                // Metamask connection
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
                this.account = accounts[0]
                // Ethers provider initialisation
                this.provider = new ethers.providers.Web3Provider(window.ethereum)
                this.signer = this.provider.getSigner()
                //Current network
                this.network = NETWORK(window.ethereum.networkVersion)
                console.log('📡 NETWORK ',  this.network)
                // Smart contract initialisation
                this.initialiseSmartContracts()// Run asynchronously
                // Interface functions
                if(this.network.name == 'ropsten' || this.network.name == 'mainnet'){
                    console.log('Getting ENS name')
                    this.ename = await this.provider.lookupAddress(this.account)
                }
                globalEvents.emit('connected', this.account, this.ename)
                console.log(`connected with ${this.account}`)
            } else {
                console.warn(`Ethereum not connected. Please refresh the page`)
            }
        } else {
            console.error(`Ethereum object not detected`)
        }
    }

    async initialiseSmartContracts(){
        this.tokenContract = {}
        //this.tokenContract.REAL = await new ethers.Contract(realAddress, realAbi, this.signer)
        this.tokenContract.DAI = await new ethers.Contract(cryptos['DAI'][this.network.name].token, ERC20abi, this.signer) 
        this.tokenContract.AAVE = await new ethers.Contract(cryptos['AAVE'][this.network.name].token, ERC20abi, this.signer) 
        this.udpateAssets()
        
        this.lendingPool = await new ethers.Contract(cryptos['AAVE'][this.network.name].lendingPool, lendingPoolAbi, this.signer)
        this.ag = await new ethers.Contract(cryptos['AAVE'][this.network.name].aavegotchi, aavegotchisAbi, this.signer)
        console.log(`AG contract`, this.ag)
        this.getAavegotchis()
    }
    async udpateAssets(){
        for (const token in this.tokenContract) {
            if (Object.hasOwnProperty.call(this.tokenContract, token)) {
                let val = await this.tokenContract[token].balanceOf(this.account)
                this.assets[token] = parseInt(ethers.utils.formatEther(val))
                console.log("Retrieved balance of", cryptos[token].name, "is",this.assets[token]  )
            }
        } 
        let balance = await this.provider.getBalance(this.account)
        this.assets['ETH'] = parseInt(ethers.utils.formatEther(balance))     

        globalGame.scene.getScene('interfaceScene').updateInventory()
    }

    getRealBalance() {
        return new Promise(async (resolve, reject) => {
            const realBalance = await this.realContract.balanceOf(this.account)
            console.log({
                realBalance
            })
            this.realBalance = ethers.utils.formatUnits(realBalance, 0)
            resolve(this.realBalance)
        })
    }

    async deposit(amount, token){
        if(token = 'ETH') {
            console.log(`Depositing ETH`)
            this.lendingPool.deposit("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            ethers.utils.parseEther(amount.toString()),
            this.account,   
            "")
        } else {
            console.error(`Token not available yet`)
        }
    }

    async getETHBalance() {
        console.log(`get eth balance`)
        let balance = await provider.getBalance(address);

        console.log(address + ':' + ethers.utils.formatEther(balance));
        this.ethBalance = ethers.utils.formatEther(balance)

    }
    async sendETH(address, amount){
        const tx = this.signer.sendTransaction({
            to: address,
            value: ethers.utils.parseEther(amount)
        });
    }

    getGovernanceItems(){
        let govItems = [{
            name: "Adding BAL on AAVE",
            yay: 262,
            nay: 184,
        },{
        
            name: "Aavenomcis quarterly Upgrade",
            yay: 0,
            nay: 0,

        }]
        return govItems
    }

    buyCoffee() {
        this.realContract.buyCoffee()
            // TODO,  deal better with the ongoing transaction
            .then(() => {
                console.log("we got coffee!")
                globalEvents.emit('usdc-transaction', -1)
                globalEvents.emit('adding-coffee')
            })
    }

    buyUSDC() {
        if (DEBUG)
            console.log("Calling", this.realContract)
        this.realContract.buyUSDC()
            .then(() => {
                console.log("we got USDC!")
                globalEvents.emit('real-transaction', -1)
                globalEvents.emit('usdc-transaction', 3)
            })
    }

    async findLiquidityPool(){
        const { data } = await axios.get('https://aave-api-v2.aave.com/data/tvl')
        console.log('liquidity pool data', data)
        // const totalValInUsd = data.
    }

    async isParticipant() {

        return await this.realContract.participants(this.account)
    }


    async swapETHforDAI(amount){
        let fromAddress = globalEth.account
        const reqString = `https://api.1inch.exchange/v2.0/swap?fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toTokenAddress=0x6b175474e89094c44da98b954eedeac495271d0f&amount=${amount}&fromAddress=${fromAddress}&slippage=1`
        console.log('req string in swap func', reqString)
        const { data } = await axios.get(reqString)
        console.log('tx in 1inch response', data.tx)
        globalEvents.emit("says", `So you want to swap your ETH for DAI? Let's start with ${amount} ETH which is equal to ${data.toTokenAmount.toLocaleString()} DAI`)

        console.log('window.ethers in swap func', window.ethers)
        await this.signer.sendTransaction(data.tx)
    }

    // async swapETHforAAVE(amount){
    //     let fromAddress = globalEth.account
    //     const reqString = `https://api.1inch.exchange/v2.0/swap?fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toTokenAddress=0x6b175474e89094c44da98b954eedeac495271d0f&amount=${amount}&fromAddress=${fromAddress}&slippage=1`
    //     console.log('req string in swap func', reqString)
    //     const { data } = await axios.get(reqString)
    //     console.log('data from 1inch response', data)
    //     globalEvents.emit("says", `So you want to swap your ETH for AAVE? Let's start with ${amount} ETH which is equal to ${data.toTokenAmount.toLocaleString()} AAVE`)
    // }

    async getAavegotchis(){
        // console.log(`getting AAVEGOTCHIs`, this.account)
        // let listAG = await this.ag.allAavegotchisOfOwner(this.account)
        // console.log("List of AG",listAG)
        // Hardcoding my cute Aavegotchi
        let ag = await this.ag.getAavegotchi(4567)
        let agsvg = await this.ag.getAavegotchiSvg(4567)
        globalGame.scene.getScene('gameScene').addAavegotchi(ag,agsvg)
    }

    async participate() {
        return new Promise(async (resolve, reject) => {
            this.portis.isLoggedIn().then(async ({
                error,
                result
            }) => {
                await this.realContract.participate()
                resolve()
            })
        })
        .catch( (err) => console.error(err) )
    }
}
