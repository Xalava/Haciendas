import BaseScene from "./BaseScene.js"
import globalEvents from "./helpers/globalEvents.js"
import createDebugSwitch from "./interface/debug.js"
// import createLibp2p from './helpers/clibp2p.js'

import createTextBox from "./interface/textBox.js"
import EtherHelp from "./helpers/EtherHelp.js"
import Network from "./helpers/network.js"
import {cryptos} from "./helpers/cryptos.js"


const BASEBLUE = 0x00031f6c
const BASEBROWN = 0x8b4513

// Mock, should be member of globalEth
const inventory = {DAI:10, REAL:2, AAVE:10, ETH:1323}

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
		this.load.html('pretransaction', 'html/pretransaction.html')

	}
	// Create base interface box
	roundedBox(x, y, w, h, color) {
		let graph = this.add.graphics()
		graph.lineStyle(1, 0xffffff)
		graph.fillStyle(color, 1)
		graph.fillRoundedRect(x, y, w, h,4)
		graph.strokeRoundedRect(x, y, w, h,4)
		// graph.visible = false
		return graph
	}

	createInventoryDialog(){
		// Inventory dialog, available pressing 'i', created once
		this.invGraphics = this.add.group()

		let invBox = this.roundedBox(20, 20, 220, 200,BASEBLUE)
		this.invGraphics.add(invBox)

		let playerSprite = this.add.image(30, 32, 'characters', this.gameScene.player.char.frame)
		this.invGraphics.add(playerSprite)

		// Create a of inventory slots and display them
		this.invSlots = this.add.group()
		this.inventorySlots = []
		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 2; j++) {
				const x = 36+ 32* i
				const y = 60+ 32* j
				const element = this.roundedBox(x, y, 26, 26,BASEBROWN)
				this.invGraphics.add(element)
				element.invX = x+13
				element.invY = y+13
				this.invSlots.add(element)
				this.inventorySlots.push(element)
			}
		}
		// this.invGraphics.add(this.invSlots)
		console.log(this.invSlots.getChildren())
		let i=0 
		// let inventoryCoinObjects=[]
		this.itemsGroup = this.add.group()
		for (const token in inventory) {
			let slot = this.inventorySlots[i++]
			let coin = this.add.image(0, 0,'cryptos',cryptos[token].frame )
			let txt = this.add.text(0, 0,inventory[token], { fontSize: 8,font: '"Press Start 2P"' , strokeThickness: 1, stroke: "#000"})
				// We need a solution to manage large numbers. Attempt : 
				// txt.setFixedSize(12, 0)

			// let coin = this.add.sprite(slot.invX, slot.invY,'cryptos',cryptos[token].frame ).setInteractive()
			// let txt = this.add.text(slot.invX+8, slot.invY+8,inventory[token], { fontSize: 8,font: '"Press Start 2P"' , strokeThickness: 1, stroke: "#000"})
			let item = this.add.container(slot.invX,slot.invY,[coin, txt])
			item.token = token // To keep it at hand 
			// item.add(coin)
			// item.add(txt)
			item.setSize(20, 20);
			item.setInteractive({ draggable: true })
			// item.alpha= 1
			this.input.setDraggable(item);
			item.on('pointerover', function () {
				// const brighter = new Phaser.Display.Color(255, 255, 255, 255);
				// coin.setTint(brighter);
				// item.setTint(0x44ff44)
				// Tooltip
				// let graph = this.add.graphics()
				// graph.lineStyle(1, 0xffffff)
				// graph.fillStyle(color, 1)
				// graph.fillRoundedRect(x, y, w, h,4)
				// graph.strokeRoundedRect(x, y, w, h,4)
			})
			item.on('pointerout', function () {

				// coin.clearTint();
		
			});
			// item.setInteractive()

			// this.invGraphics.add(txt)

			item.setDepth(20)
			this.itemsGroup.add(item)
			this.invGraphics.add(item)
			// inventoryCoinObjects.push(item)
			
		}
		// this.invGraphics.add(this.itemsGroup)
		// this.input.setDraggable(this.itemsGroup.getChildren());
		this.input.on('dragstart', function (pointer, gameObject) {
			console.log("drag start")
			// when draged we look darker
			if (gameObject.type == "Container"){
				gameObject.list[0].setTint(0x4f4f4f)
				gameObject.list[1].setStyle({color:'#999'})

			}
		});
	
		this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
			gameObject.x = dragX
			gameObject.y = dragY
	
		});
	
		this.input.on('dragend', function (pointer, gameObject, dropped) {
			if (!dropped) {
				gameObject.x = gameObject.input.dragStartX;
				gameObject.y = gameObject.input.dragStartY;
			}
			
			if (gameObject.type == "Container")
				gameObject.list[0].clearTint()
				gameObject.list[1].setStyle({ color : '#FFF', eeestrokeThickness: 1, stroke: "#000"})
		})

		// this.invGraphics.add(tokenText)
		this.invGraphics.setVisible(false)
			
	}

	// Open transactions panel, Created and destroyed each time.
	// CounterpartyName is an address for players and a name for NPC
	openTransactionDialog(action, player, counterpartyFrame, counterpartyAddress, counterpartyName ) {
		if (DEBUG)
			console.log("Open Transaction Dialog with Counterparty: (sprite)", counterpartyAddress)
		const INTERFACEFONT =  { fontSize: 10,font: '"Press Start 2P"' }
		// We first open the regular inventory panel
		this.invGraphics.setVisible(true)

		this.transactionDialog = this.add.group()
		let actionBox = this.roundedBox(254, 20, 60, 200, BASEBLUE)
		this.transactionDialog.add(actionBox)
		
		let spritesheet = ''
		switch (action) {
			// Mostly for reference
			case 'Send':
				spritesheet = 'characters'
				break;
				
			case 'Swap':
				spritesheet = 'cryptos'
				break;

			case 'Throw':
				spritesheet = 'things2'
				break;

			case 'Vote':
				// Needs a full different interface
				spritesheet = 'things2'
				break;
				
			default:
				break;
		}
					
		if (counterpartyName) {
			let nameTxt = this.add.text(275, 30,  counterpartyName.slice(0,10), INTERFACEFONT)
			this.transactionDialog.add(nameTxt)
		}
		if (counterpartyFrame){
			let playerSprite = this.add.image(264, 32, spritesheet,  counterpartyFrame)
			this.transactionDialog.add(playerSprite)
		}
		if (counterpartyAddress) {
			let addressTxt = this.add.text(270, 42,  counterpartyAddress.slice(0,6), INTERFACEFONT)
			this.transactionDialog.add(addressTxt)
		}
		// let actionText = this.add.text(275, 30, action, INTERFACEFONT)
		// this.transactionDialog.add(actionText)
		let slot = this.roundedBox(276, 78, 22, 22,BASEBROWN)
		this.transactionDialog.add(slot)
		
		
		this.input.on('drop', (pointer, gameObject, dropZone) => {

			gameObject.x = dropZone.x+20;
			gameObject.y = dropZone.y+20;
			// TODO MAYBE : handle if a coin is present already
			if(gameObject.token){
				// We have a token! 
				// Let's add the appropriate dialog
				const el = this.add.dom(285, 150).createFromCache('pretransaction')
				document.querySelector('#amount').value = inventory[gameObject.token]
				document.querySelector('#actionButton').innerHTML = action
				console.log(gameObject.token, inventory, inventory[gameObject.token])
				// let el = document.querySelector('#actionButton')
				el.addListener('click').on('click', (event) => {
					if (event.target.localName === 'button') {
						console.log("Button click", event)

						// TODO trigger transaction
						this.closeTransactionDialog()
					}
				})
				this.transactionDialog.add(el)
			}	
		});
	
		//  A drop zone
		var zone = this.add.zone(267, 69, 40, 40).setDropZone()
		zone.setOrigin(0) // otherwise zone is centered around point above. This is messy in the documentation and phaser examples

		//  Just a visual display of the drop zone
		if(DEBUG){
			var graphics = this.add.graphics()
			graphics.lineStyle(1, 0xffff00)
				console.log("Zone",zone, zone.getBounds())
			graphics.strokeRect(zone.x , zone.y , zone.input.hitArea.width, zone.input.hitArea.height)
			graphics.setDepth(19)
			this.invGraphics.add(graphics)
		}
		// let tokenText = this.add.text(40, 60, 'Tokens' , { fontSize: 10})
		// let iTokenText = this.add.text(40, 180, 'Interest bearing tokens', { fontSize: 10})
		
		this.input.keyboard
		.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
		.on('down', function (event) {
			this.closeTransactionDialog()
		}, this)

	}

	closeTransactionDialog(){
		this.transactionDialog.clear(true,true)
		// let elements = this.transactionDialog.getChildren()
		// console.log(elements)
		// let el = Phaser.Utils.Array.RemoveRandomElement(elements)
		// el.destroy(true)
		// this.transactionDialog.destroy(true) // true: destroy contained elements too
		if (this.transactionDialog){
			console.log(this.transactionDialog)
			// this.transactionDialog = null
		}
		this.invGraphics.setVisible(false)
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

		if (DEBUG) {
			// For debug purpose, we can open a transaction panel with ourselves

			this.input.keyboard
				.addKey(Phaser.Input.Keyboard.KeyCodes.E)
				.on('down', function (event) {
					if (!this.transactionDialog) {
						this.openTransactionDialog( "Send", this.gameScene.player, 7, "Ox2323", "Eloïse")
					} else {
						this.closeTransactionDialog()
					}
				}, this)
		}

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
		this.createInventoryDialog()


	






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
		globalEvents.on('connected', (account) => {
			this.connected = this.add.image(380, 10, "cryptos", cryptos['ETH'].frame)
			this.connected.setTint(0xa9c9a9)
			globalNetwork.sendNameUpdate(account, "")
			this.sound.play("holy")
		})
		globalEvents.on('adding-coffee', () => {
			this.coffee = this.add.image(380, 30, "coffee")
			// this.connected.setTint(0x9bfb9b)
			this.sound.play("holy")
		})
		globalEvents.on('says', (message) => createTextBox(this, message), this)
		globalEvents.on('chat-says', (name, message) => this.updateChat(name, message), this)
	}


	update() {

	}
}
