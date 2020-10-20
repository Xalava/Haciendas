// import { ethers } from "https://cdn.ethers.io/lib/ethers-5.0.esm.min.js";



export default class EtherHelp {
    
    constructor(){
        
    }
    async initialise(){
        // Doc is erratic
        // await window.ethereum.enable()
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            this.account = accounts[0];
            this.provider = new ethers.providers.Web3Provider(window.ethereum)
            this.signer = this.provider.getSigner()
        } catch (error) {
            console.error(error)
        }
    }
    
    async getBlock(){
        
        
        const cblock =  await provider.getBlockNumber()
        return cblock
    }
    
    async getBalance(){
        const balance = await provider.getBalance("ethers.eth")
        return balance
    }


}