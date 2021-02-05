// Object with display information on assets
export const cryptos = {
    // We use ticker as identifier, name for nicer display
	DAI: {frame:10, name:"Dai", ticker:"DAI"},
	REAL: {frame:0,  name:"Real", ticker:"REAL"},
    AAVE: {
            frame:24, name:"AAVE", ticker:"AAVE", 

    }, 
    ETH: {frame:8,  name:"Ether", ticker:"ETH"},
    USDC: {frame:20,  name:"USDC", ticker:"USDC"},

}

// Dedicated objects with data on used contracts
export const AAVE = {
    mainnet: {
        token: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", 
    },
    kovan: {
        ProtocolDataProvider : "0x3c73A5E5785cAC854D468F727c606C07488a29D6"


    }
}

export const DAI = {
    mainnet: {
        token: "dai.token.ethers.eth", 
    },
    kovan: {
        token : "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD"


    }
}

export const MATIC = {
    mumbai: {
        token: "0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae"
    }
}

export const ERC20abi = [
    // Read-Only Functions
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",

    // Authenticated Functions
    "function transfer(address to, uint amount) returns (boolean)",

    // Events
    "event Transfer(address indexed from, address indexed to, uint amount)"
];


