import realAbi from '../../contracts/RealSimple.abi.js'
import globalEvents from './globalEvents.js'

// Config
const realAddress = "0xf83fA235C22276834cAFD018BF42Ca4469BdBf90"
const network = 'ropsten'
const portisID = '94f4cc1b-6e36-463d-8d48-11d6e84c1b4d'

export default class EtherHelp {

    constructor() {

    }

    initialisePortis() {
        return new Promise(async (resolve, reject) => {
            if (this.portis)
                reject()
            this.portis = new Portis(portisID, network, {
                gasRelay: true,
                registerPageByDefault: true
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