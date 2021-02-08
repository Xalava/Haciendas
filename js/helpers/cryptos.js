// Object with display information on assets
export const cryptos = {
    // We use ticker as identifier, name for nicer display
	DAI: {
        frame:10, name:"Dai", ticker:"DAI",decimals:18,
        mainnet: {
            token: "dai.token.ethers.eth", 
        },
        kovan: {
            token: "0xd0a1e359811322d97991e03f863a0c30c2cf029c" // Weth, just for test
            // token: "0x21b18ecaa320f5805697fda48818247ccbf84552"
            // token : "0xff795577d9ac8bd7d90ee22b6c1703490b6512fd"
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
            token: "0xb597cd8d3217ea6477232f9217fa70837ff667af",
            lendingPool: "0xe0fba4fc209b4948668006b2be61711b7f465bae",
            aavegotchiOld: "0x16a2BA2F8d91f0D5e3B9dBAd7E716DaA428fBA85",
            aavegotchi: "0x67d2E9130Fa3BBbd859BAc65d686225c98e9C007"
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


