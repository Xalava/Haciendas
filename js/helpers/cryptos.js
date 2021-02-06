// Object with display information on assets
export const cryptos = {
    // We use ticker as identifier, name for nicer display
	DAI: {
        frame:10, name:"Dai", ticker:"DAI",decimals:18,
        mainnet: {
            token: "dai.token.ethers.eth", 
        },
        kovan: {
            token : "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD"
        }
    },
    REAL: {frame:0,  name:"Real", ticker:"REAL", decimals:0},
    AAVE: {
        frame:24, name:"AAVE", ticker:"AAVE", decimals:18,
        mainnet: {
            token: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", 
            WethGateway:"0xDcD33426BA191383f1c9B431A342498fdac73488"
        },
        kovan: {
            ProtocolDataProvider : "0x3c73A5E5785cAC854D468F727c606C07488a29D6",
            WethGateway: "0xf8aC10E65F2073460aAD5f28E1EABE807DC287CF",
            token: "0xb597cd8d3217ea6477232f9217fa70837ff667af"
        }
    }, 
    ETH: {frame:8,  name:"Ether", ticker:"ETH", decimals:18},
    USDC: {frame:20,  name:"USDC", ticker:"USDC"},
    MATIC: {
        frame:26,  name:"MATIC", ticker:"MATIC",
        mainnet: {
            token: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0"
        },
        mumbai: {
            token: "0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae"
        }
    },
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


