
import realAbi from '../../contracts/Real.abi.js';
import globalEvents from './globalEvents.js'

// Config
const realAddress = "0xfef8bb4cc57f1935f5e767207b98ae5dbf9b5039"
const network = 'ropsten'
const portisID = '94f4cc1b-6e36-463d-8d48-11d6e84c1b4d'

export default class EtherHelp {
    
    constructor(){

    }
    async initialisePortis(){
        this.portis = new Portis(portisID, network,  { 
            gasRelay: true,
            registerPageByDefault: true 
        })
        this.provider = new ethers.providers.Web3Provider(this.portis.provider);
        // (async () => {
            await  this.portis.provider.enable()
            const accounts = await this.provider.listAccounts();
            this.account = accounts[0]
            this.signer = this.provider.getSigner()
            this.realContract = await new ethers.Contract( realAddress , realAbi , this.signer )
            globalEvents.emit('connected',this.account)
            console.log("connected")
        // })();
    }
    async getRealBalance(){
        const realBalance = await this.realContract.balanceOf(this.account)
        console.log({realBalance})
        this.realBalance = ethers.utils.formatUnits(realBalance, 0)
        return this.realBalance
    }

    async isParticipant(){

        return await this.realContract.participants(this.account)
    }
  
    async participate(){
        this.portis.isLoggedIn().then(async ({ error, result }) => {
            await this.realContract.participate()
            return await this.getRealBalance()
        })
        .error( (err) => console.error(err) )
    }
}