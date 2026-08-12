// Adapted from scaffold-eth -> https://github.com/austintgriffith/scaffold-eth

export const INFURA_ID = '6e5c698dd2a640079e23abe0231c4f9b'

// The chain the game is played on: a key of NETWORKS below
export const GAME_NETWORK = 'sepolia'

//MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
export const ETHERSCAN_KEY = 'PSW8C433Q667DVEX5BCRMGNAH9FSGFZ7Q8'

export const NETWORKS = {
	localhost: {
		name: 'localhost',
		color: '#a0a0a0',
		chainId: 31337,
		blockExplorer: '',
		rpcUrl: 'http://' + window.location.hostname + ':8545',
		nativeCurrency: {name: 'Ether', symbol: 'ETH', decimals: 18}
	},
	sepolia: {
		name: 'sepolia',
		label: 'Sepolia',
		color: '#b98cff',
		chainId: 11155111,
		rpcUrl: `https://sepolia.infura.io/v3/${INFURA_ID}`,
		blockExplorer: 'https://sepolia.etherscan.io/',
		nativeCurrency: {name: 'Sepolia Ether', symbol: 'ETH', decimals: 18}
	},
	mainnet: {
		name: 'mainnet',
		label: 'Ethereum',
		color: '#ff8b9e',
		chainId: 1,
		rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
		blockExplorer: 'https://etherscan.io/',
		nativeCurrency: {name: 'Ether', symbol: 'ETH', decimals: 18}
	},
	polygon: {
		name: 'polygon',
		label: 'Polygon',
		color: '#2bbdf7',
		chainId: 137,
		blockExplorer: 'https://polygonscan.com/',
		nativeCurrency: {name: 'POL', symbol: 'POL', decimals: 18}
	}
}
