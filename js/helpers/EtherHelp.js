import realAbi from '../../contracts/RealSimple.abi.js'
import globalEvents from './globalEvents.js'

// Config
const realAddress = "0xf83fA235C22276834cAFD018BF42Ca4469BdBf90"
const network = 'maticTestnet'
const portisID = '94f4cc1b-6e36-463d-8d48-11d6e84c1b4d'


//AAVE Kovan addresses


export default class EtherHelp {

    constructor() {
        this.assets = {DAI:59, REAL:2, AAVE:10, ETH:3}
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
                // Smart contract initialisation 
                this.realContract = await new ethers.Contract(realAddress, realAbi, this.signer)
                // Interface functions
                globalEvents.emit('connected', this.account)
                console.log(`connected with ${this.account}`)
            } else {
                console.warn(`Ethereum not connected. Please refresh the page`)
            }
        } else {
            console.error(`Ethereum object not detected`)
        }
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

    async getETHBalance() {

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



    async isParticipant() {

        return await this.realContract.participants(this.account)
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
