// Faucets that hand out test funds, network by network.

import {NETWORKS} from './ethConstants.js'

export const FAUCETS = {
	sepolia: [
		{
			name: 'Google Cloud Web3',
			url: 'https://cloud.google.com/application/web3/faucet/ethereum/sepolia',
			gives: ['ETH'],
			amount: '0.05 ETH per day',
			requires: 'A Google account'
		},
		{
			name: 'pk910 PoW faucet',
			url: 'https://sepolia-faucet.pk910.de/',
			gives: ['ETH'],
			amount: 'As much as you mine',
			requires: 'It mines in your browser'
		},
		{
			name: 'Infura',
			url: 'https://www.infura.io/faucet/sepolia',
			gives: ['ETH'],
			amount: '0.5 ETH per day',
			requires: 'An Infura account'
		},
		{
			name: 'Circle',
			url: 'https://faucet.circle.com/',
			gives: ['USDC'],
			amount: '10 USDC per hour',
			requires: 'None'
		},
		{
			name: 'Chainlink',
			url: 'https://faucets.chain.link/sepolia',
			gives: ['ETH', 'LINK'],
			amount: '0.1 ETH and 25 LINK per day',
			requires: '1 LINK on Ethereum mainnet to obtain test ETH'
		},
		{
			name: 'Alchemy',
			url: 'https://www.alchemy.com/faucets/ethereum-sepolia',
			gives: ['ETH'],
			amount: '0.1 ETH per day',
			requires: 'ETH on Ethereum mainnet'
		},
	]
}

// One picnic card per faucet, the whole card being the link. The entries above are authored
// constants, so their text goes into the markup as it is.
const card = faucet => `<article class="faucetcard card"> <a href="${faucet.url}" target="_blank" rel="noopener">
	<p><b>${faucet.name}</b></p>
	<p>${faucet.gives.join(', ')} (${faucet.amount})</p>
	<p><i>Requires: ${faucet.requires}</i></p>
</a></article>`

// Every faucet we know of, listed network by network. No filtering: a network absent from the
// table above — mainnet, where the money is real — simply has nothing to show.
export const faucetsHTML = () =>
	Object.entries(FAUCETS)
		.map(([network, faucets]) => `<h3>${NETWORKS[network].label}</h3>${faucets.map(card).join('')}`)
		.join('')
