// Object with display information on assets
export const cryptos = {
	// We use ticker as identifier, name for nicer display
	DAI: {
		frame: 10,
		name: 'Dai',
		ticker: 'DAI',
		decimals: 18,
		mainnet: {
			token: 'dai.token.ethers.eth',
			atoken: '0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d'
		},
		kovan: {
			token: '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD',
			atoken: '0x4ef54e8babba6debef999bdf64878e39fb04a11f'
		}
	},
	REAL: {
		frame: 0,
		name: 'Real',
		ticker: 'REAL',
		decimals: 0,
		kovan: {
			token: '0xabd6ba4d19b35b3bee69aa87fd92ff2c4e7b0109'
		},
		ropsten: {
			token: '0xf83fA235C22276834cAFD018BF42Ca4469BdBf90'
		}
	},
	AAVE: {
		frame: 24,
		name: 'AAVE',
		ticker: 'AAVE',
		decimals: 18,
		mainnet: {
			token: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
			WethGateway: '0xDcD33426BA191383f1c9B431A342498fdac73488'
		},
		kovan: {
			ProtocolDataProvider: '0x3c73A5E5785cAC854D468F727c606C07488a29D6',
			WethGateway: '0xf8aC10E65F2073460aAD5f28E1EABE807DC287CF',
			token: '0xb597cd8d3217ea6477232f9217fa70837ff667af',
			lendingPool: '0xe0fba4fc209b4948668006b2be61711b7f465bae',
			aavegotchiOld: '0x16a2BA2F8d91f0D5e3B9dBAd7E716DaA428fBA85',
			aavegotchi: '0x67d2E9130Fa3BBbd859BAc65d686225c98e9C007'
		}
	},
	ETH: {
		frame: 8,
		name: 'Ether',
		ticker: 'ETH',
		decimals: 18,
		mainnet: {},
		kovan: {
			atoken: '0xd483b49f2d55d2c53d32be6eff735cb001880f79'
		}
	},
	USDC: {
		frame: 20,
		name: 'USDC',
		ticker: 'USDC',
		mainnet: {
			token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
		},
		kovan: {
			token: '0x2F375e94FC336Cdec2Dc0cCB5277FE59CBf1cAe5'
		},
		ropsten: {
			token: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'
		}
	},
	MATIC: {
		frame: 26,
		name: 'MATIC',
		ticker: 'MATIC',
		mainnet: {
			token: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0'
		},
		mumbai: {
			token: '0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae'
		}
	},
	MKR: {
		frame: 28,
		name: 'Maker',
		ticker: 'MKR',
		decimals: 18,
		mainnet: {
			token: '0xef13C0c8abcaf5767160018d268f9697aE4f5375'
		},
		kovan: {
			token: '0xef13C0c8abcaf5767160018d268f9697aE4f5375'
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
		kovan: {
			token: '0xd0A1E359811322d97991E03f863a0C30C2cF029C'
		}
	},
	WBTC: {
		frame: 22,
		name: 'Wrapped Bitcoin',
		ticker: 'WBTC',
		decimals: 18,
		mainnet: {
			token: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
		},
		kovan: {
			token: '0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb',
			atoken: '0xf203114673af345614cd5edffac13709f94ce4d3'
		}
	},
	LINK: {
		frame: 14,
		name: 'Link',
		ticker: 'LINK',
		decimals: 18,
		kovan: {
			token: '0x497a3dd7165869efc68ae0394ba19bce6ad5ae1b',
			atoken: '0x91034833923f32d548d375a0bb24457cb11db22a'
		}
	}
}

export const ERC20abi = [
	// Read-Only Functions
	'function balanceOf(address owner) view returns (uint256)',
	'function decimals() view returns (uint8)',
	'function symbol() view returns (string)',

	// Authenticated Functions
	'function transfer(address to, uint amount) returns (boolean)',

	// Events
	'event Transfer(address indexed from, address indexed to, uint amount)'
]
