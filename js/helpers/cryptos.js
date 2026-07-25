// Object with display information on assets
export const cryptos = {
	// We use ticker as identifier, name for nicer display
	DAI: {
		frame: 10,
		name: 'Dai',
		ticker: 'DAI',
		decimals: 18,
		mainnet: {
			token: '0x6B175474E89094C44Da98b954EedeAC495271d0F'
		},
		sepolia: {
			token: '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357'
		}
	},
	REAL: {
		frame: 0,
		name: 'Real',
		ticker: 'REAL',
		decimals: 0
	},
	AAVE: {
		frame: 24,
		name: 'AAVE',
		ticker: 'AAVE',
		decimals: 18,
		mainnet: {
			token: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9'
		},
		sepolia: {
			token: '0x25c4cb25e8bf582577f21bffa17a88b8074ff8ba'
		}
	},
	ETH: {
		frame: 8,
		name: 'Ether',
		ticker: 'ETH',
		decimals: 18,
		mainnet: {}
	},
	USDC: {
		frame: 20,
		name: 'USDC',
		ticker: 'USDC',
		decimals: 6,
		mainnet: {
			token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
		},
		sepolia: {
			token: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
		}
	},
	MATIC: {
		frame: 26,
		name: 'MATIC',
		ticker: 'MATIC',
		decimals: 18,
		mainnet: {
			token: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0'
		}
	},
	MKR: {
		frame: 28,
		name: 'Maker',
		ticker: 'MKR',
		decimals: 18,
		mainnet: {
			token: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2'
		}
	},
	WETH: {
		frame: 8,
		name: 'Wrapped Ether',
		ticker: 'WETH',
		decimals: 18,
		mainnet: {
			token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
		},
		sepolia: {
			token: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9'
		}
	},
	WBTC: {
		frame: 22,
		name: 'Wrapped Bitcoin',
		ticker: 'WBTC',
		decimals: 8,
		mainnet: {
			token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
		},
		sepolia: {
			token: '0x29f2D40B0605204364af54EC677bD022dA425d03'
		}
	},
	LINK: {
		frame: 14,
		name: 'Link',
		ticker: 'LINK',
		decimals: 18,
		mainnet: {
			token: '0x514910771AF9Ca656af840dff83E8264EcF986CA'
		},
		sepolia: {
			token: '0x779877A7B0D9E8603169DdbD7836e478b4624789'
		}
	}
}

export const ERC20abi = [
	// Read-Only Functions
	'function balanceOf(address owner) view returns (uint256)',
	'function decimals() view returns (uint8)',
	'function symbol() view returns (string)',

	// Authenticated Functions
	'function transfer(address to, uint amount) returns (bool)',

	// Events
	'event Transfer(address indexed from, address indexed to, uint amount)'
]
