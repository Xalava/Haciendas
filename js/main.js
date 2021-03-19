import GameScene from './GameScene.js'
import WelcomeScene from './WelcomeScene.js'
import PreloaderScene from './PreloaderScene.js'
import InterfaceScene from './InterfaceScene.js'
import MarketScene from './MarketScene.js'

import EtherHelp from './helpers/EtherHelp.js'
import Network from './helpers/network.js'

const config = {
	title: 'Haciendas', 
	gameURL: 'https://haciendas.xyz',
	width: 400,
	height: 300,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		zoom: 2
	},
	backgroundColor: '#111111',
	render: {
		// supposed to avoid blur in scaling. I don't really see the difference
		pixelArt: true,
    },
	type: Phaser.AUTO,
	parent: 'game',
	scene: [
		PreloaderScene,
		WelcomeScene,
		GameScene,
		InterfaceScene
		// MarketScene
	],
	dom: {
		createContainer: true
	},
	physics: {
		default: 'arcade',
		arcade: {
			debug: DEBUG,
			gravity: {y: 0}
		}
	},
	// plugins: {
    //     scene: [{
    //         key: 'rexUI',
    //         plugin: 'rexuiplugin,
    //         mapping: 'rexUI'
    //     }]
    // }
}
console.log(`✓ Loading game`)
// const settings = new Settings()
globalGame = new Phaser.Game(config)
console.log(`✓ Game loaded`)

globalEth = new EtherHelp()
console.log(`✓ Eth loaded`)

// Necessary?
window.focus()
