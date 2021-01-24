import BaseScene from "./BaseScene.js"
import globalEvents from "./helpers/globalEvents.js"
import createDebugSwitch from "./interface/debug.js"
// import createLibp2p from './helpers/clibp2p.js'

import createTextBox from "./interface/textBox.js"
import EtherHelp from "./helpers/EtherHelp.js"
import Network from "./helpers/network.js"
import {cryptos} from "./helpers/cryptos.js"


const BASEBLUE = 0x031f6c
const BASEBROWN = 0x8b4513

// Mock, should be member of globalEth
const inventory = {DAI:10, REAL:2, AAVE:1, USDC:3}

export default class InterfaceScene extends BaseScene {
	constructor() {
		super({ key: 'interfaceScene', active: false })
		// Could be more coherent elsewhere
		this.usdc = 0
		this.real = 0
	}
	preload() {
		// the version from PreloaderScene does not seem available. 
		this.load.spritesheet('things2bis',
			'assets/things2.png',
			{ frameWidth: 16, frameHeight: 16 }
		)
		this.load.scenePlugin({
			key: 'rexuiplugin',
			url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/dc73922707dc7dc861f73a93d9be139ceca20fdc/dist/rexuiplugin.min.js',
			sceneKey: 'rexUI'
		})

		this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png')
		this.load.html('message', 'html/message.html')

	}
	// Create base blue interface box
	roundedBox(x, y, w, h, color) {
		let graph = this.add.graphics()
		graph.lineStyle(1, 0xffffff)
		graph.fillStyle(color, 1)
		graph.fillRoundedRect(x, y, w, h,4)
		graph.strokeRoundedRect(x, y, w, h,4)
		// graph.visible = false
		return graph
	}

	openTransactionDialog(counterparty) {
		this.invGraphics.setVisible(true)
		// sendbox
		let sendBox = this.roundedBox(255, 20, 60, 200, BASEBLUE)
		let playerSprite = this.add.image(265, 30, 'characters', counterparty.char.frame)
		let sendText = this.add.text(275, 30, 'Send', { fontSize: 10 })
		this.transactionDialog = this.add.group()
		this.transactionDialog.add(sendBox)
		this.transactionDialog.add(playerSprite)
		this.transactionDialog.add(sendText)
		let slot = this.roundedBox(276, 78, 22, 22,BASEBROWN)
		this.transactionDialog.add(slot)
		// let iTokenText = this.add.text(40, 180, 'Interest bearing tokens', { fontSize: 10})
		// this.invGraphics = this.add.group()	
		// this.invGraphics.add(invBox)
		// this.invGraphics.add(playerSprite)
		// // this.invGraphics.add(tokenText)
		// this.invGraphics.setVisible(false)
	}

	handleTransactionsChange(nbTransactions) {
		this.transactionsDisplay.children.each((obj, idx) => {
			if (idx < nbTransactions) {
				obj.visible = true
			} else {
				obj.visible = false
			}
		})
	}
	async handleRealChange(value) {
		if (DEBUG)
			console.log("real change...", this.real, value)

		if (this.real == 0 && value == 0) {
			// refreshing case
			this.real = parseInt(await this.gameScene.eth.getRealBalance())
			//Math.floor( floatvalue )
			if (DEBUG)
				console.log("Current balance", this.real)
		}
		this.real += value
		if (this.real == value) {
			// first time is a show
			this.realDisplay.children.each((obj, idx) => {
				setTimeout(() => {
					if (idx < this.real) {
						obj.visible = true
						if (idx % 2)
							this.sound.play("gold")
					} else {
						obj.visible = false
					}
				}, idx * 800)
			})
		} else {
			this.realDisplay.children.each((obj, idx) => {
				if (idx < this.real) {
					obj.visible = true
				} else {
					obj.visible = false
				}
			})
		}
	}

	handleUSDCChange(value) {
		if (DEBUG)
			console.log("USDC change...", this.usdc, value)

		this.usdc += value
		if (this.usdc == value) {
			this.USDCDisplay.children.each((obj, idx) => {
				setTimeout(() => {
					if (idx < this.usdc) {
						obj.visible = true
						if (idx % 2)
							this.sound.play("gold")
					} else {
						obj.visible = false
					}
				}, idx * 800)
			})
		} else {
			this.USDCDisplay.children.each((obj, idx) => {
				if (idx < this.usdc) {
					obj.visible = true
				} else {
					obj.visible = false
				}
			})
		}
	}

	updateChat(name, message) {
		this.chat.innerHTML += `<div> ${name}: <i>${message}</i></div>`
		this.chat.scrollTop = this.chat.scrollHeight;
	}

	create() {
		this.gameScene = this.scene.get('gameScene')

		//// Inputs
		this.letterI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)
		this.letterI.on('down', function (event) {
			this.invGraphics.toggleVisible()
			// Typical group
			// group.setVisible(value);

			// archive with obeject directly
			// if (this.invGraphics.visible)
			// 	this.invGraphics.visible = false
			// else 
			// 	this.invGraphics.visible = true
		}, this)

		this.input.keyboard
			.addKey(Phaser.Input.Keyboard.KeyCodes.E)
			.on('down', function (event) {
				if (!this.transactionDialog) {
					this.openTransactionDialog(this.gameScene.player)
				} else {
					this.transactionDialog.destroy(true) // true destroy contained elements too
					this.transactionDialog = null
					// this.transactionDialog.clear()
					// this.transactionDialog = 0
					this.invGraphics.setVisible(false)
				}
			}, this)

		// chat
		globalNetwork = new Network(this.gameScene.player)
		this.add.dom(380, 150).createFromCache('message')
		// this.chatElement.scale = 
		this.chat = document.getElementById('chat')
		this.chatInput = document.getElementById('chatInput')
		// this.input.keyboard.on("keydown_TAB", event => {
		// TODO : Disable input on focus, 
		// TODO : remove watch on letters
		this.chatInput.addEventListener('focus', (event) => {
			this.gameScene.scene.pause()
		});
		this.input.keyboard.on("keydown_ENTER", event => {
			this.gameScene.scene.resume()
			const message = this.chatInput.value
			if (message == "")
				return
			let myname = "Sato"
			if (this.gameScene.eth) {
				myname = this.gameScene.eth.account.substr(0, 6)
			}
			globalNetwork.says(myname, message)
			this.chatInput.value = ""
			this.chatInput.blur()
			// element.destroy()
		})
		// })

		//// Debugging shortcuts       
		createDebugSwitch(this)

		////Interfaces


		// Inventory graphics available on pressing i
		this.invGraphics = this.add.group()

		let invBox = this.roundedBox(20, 20, 220, 200,BASEBLUE)
		this.invGraphics.add(invBox)

		let playerSprite = this.add.image(30, 30, 'characters', this.gameScene.player.char.frame)
		this.invGraphics.add(playerSprite)

		this.inventorySlots = []
		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 2; j++) {
				const x = 40+ 32* i
				const y = 60+ 32* j
				const element = this.roundedBox(x, y, 22, 22,BASEBROWN)
				this.invGraphics.add(element)
				element.invX = x
				element.invY = y
				this.inventorySlots.push(element)
			}
		}
		let i=0 
		let inventoryCoinObjects=[]
		for (const token in inventory) {
			let slot = this.inventorySlots[i++]
			let coin = this.physics.add.sprite(slot.invX+11, slot.invY+11,'cryptos',cryptos[token].frame ).setInteractive()
			let txt = this.add.text(slot.invX+20, slot.invY+20,inventory[token], { fontSize: 10 })
			// let coinGroup = this.add.group()

			this.invGraphics.add(txt)

			coin.setDepth(20)
			inventoryCoinObjects.push(coin)
			this.invGraphics.add(coin)

		}
		this.input.setDraggable(inventoryCoinObjects);
		this.input.on('dragstart', function (pointer, gameObject) {
			// when draged we look darker
			gameObject.setTint(0x4f4f4f);
	
		});
	
		this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
	
			gameObject.x = dragX;
			gameObject.y = dragY;
	
		});
	
		this.input.on('dragend', function (pointer, gameObject) {
	
			gameObject.clearTint();
	
		});
		// let tokenText = this.add.text(40, 60, 'Tokens' , { fontSize: 10})
		// let iTokenText = this.add.text(40, 180, 'Interest bearing tokens', { fontSize: 10})
		
		
		// this.invGraphics.add(tokenText)
		this.invGraphics.setVisible(false)






		this.transactionsDisplay = this.add.group()

		this.transactionsDisplay.createMultiple({
			key: 'things2bis',
			frame: 13,
			setXY: {
				x: 10,
				y: 10,
				stepX: 16
			},
			quantity: 5,
			visible: false,
		})
		this.realDisplay = this.add.group()

		this.realDisplay.createMultiple({
			key: 'real',
			frame: [0, 1],
			setXY: {
				x: 10,
				y: 10,
				stepX: 12
			},
			quantity: 24,
			visible: false,
			setScale: { x: 0.6, y: 0.6 }
		})

		this.USDCDisplay = this.add.group()

		this.USDCDisplay.createMultiple({
			key: 'cryptos',
			frame: 10,
			setXY: {
				x: 10,
				y: 26,
				stepX: 12
			},
			quantity: 24,
			visible: false,
			setScale: { x: 0.6, y: 0.6 }
		})


		//// Handling events
		globalEvents.on('transaction-captured', (nb) => this.handleTransactionsChange(nb), this)
		globalEvents.on('mining-complete', () => {
			this.transactionsDisplay.children.each((obj, idx) => {
				obj.visible = false
			})
		})
		globalEvents.on('real-transaction', (value) => this.handleRealChange(value), this)
		globalEvents.on('usdc-transaction', (value) => this.handleUSDCChange(value), this)
		globalEvents.on('connected', () => {
			this.connected = this.add.image(380, 10, "cryptos", 4)
			this.connected.setTint(0xa9c9a9)
			this.sound.play("holy")
		})
		globalEvents.on('adding-coffee', () => {
			this.connected = this.add.image(380, 30, "coffee")
			// this.connected.setTint(0x9bfb9b)
			this.sound.play("holy")
		})
		globalEvents.on('says', (message) => createTextBox(this, message), this)
		globalEvents.on('chat-says', (name, message) => this.updateChat(name, message), this)
	}


	update() {

	}
}
