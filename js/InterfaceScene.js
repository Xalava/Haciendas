import globalEvents from "./helpers/globalEvents.js"
import createDebugSwitch from "./interface/debug.js"

import createTextBox from "./interface/textBox.js"
import EtherHelp from "./helpers/EtherHelp.js"
import Network from "./helpers/network.js"
import {cryptos} from "./helpers/cryptos.js"


const BASEBLUE = 0x00031f6c
const BASEBROWN = 0x8b4513
const BASEWHITE = 0xEEEEEE
const MAXINVENTORY = 12
const ACTIONSLOT = MAXINVENTORY + 1
// const HANDSLOT = MAXINVENTORY + 2
const INTERFACEFONT = { fontSize: 8,font: '"Press Start 2P"' }

const PADDING = 28
const INTERLINE = 14

const names =  ["Aiden", "Alex", "Billie", "Casey", "Erin", "Harley", "Jade", "Kim", "AE-X3"];
const playerName = names[Math.floor(Math.random() * names.length)];

export default class InterfaceScene extends Phaser.Scene {
	constructor() {
		super({ key: 'interfaceScene', active: false })
		this.lastSlot = -1
		this.invSlotsArray = [] // arrays of "slots", with .item attached

		// Legacy : 
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
		graph.setAlpha(0.8);

		return graph
	}

	createSlot(x,y,reference){
		//proto class
		
		// let element = this.add.rectangle(x, y, 24, 24, BASEBROWN).setInteractive()
		// element.setStrokeStyle(1.4, BASEWHITE)
		// Switch to image for facilitating 
		// const element = this.roundedBox(x, y, 26, 26,BASEBROWN)
		let element = this.add.image(x,y,'slot').setInteractive()
		element.setOrigin(0)
 		element.invX = x+12
		element.invY = y+12
		element.on('pointerover', pointer => {
			if(element.item){
				if(DEBUG) console.log("hovering", reference, element.item.token)
				this.lastSlot = reference
			} else {
				this.lastSlot = reference
				if(DEBUG) console.log("hovering empty", reference)

			}
		})
		// element.setOrigin(0) // not possible, graphics are not game object
		return element
	}

	createInventoryDialog(){
		// Inventory dialog, available pressing 'i', created once
		this.invGraphics = this.add.group()

		let invBox = this.roundedBox(20, 20, 220, 200,BASEBLUE)
		this.invGraphics.add(invBox)

		let playerSprite = this.add.image(30, 32, 'characters', this.gameScene.player.char.frame)
		this.invGraphics.add(playerSprite)

		// Create a of inventory slots and display them
		this.invSlotsGroup = this.add.group()
		for (let j = 0; j < 2; j++) {
			for (let i = 0; i < 6; i++) {
				const x = 36+ 32* i
				const y = 60+ 32* j
				let slot = this.createSlot(x,y,i+j*6)
				this.invSlotsGroup.add(slot)
				this.invGraphics.add(slot)
				this.invSlotsArray.push(slot)
			}
		}
		if(DEBUG)
			console.log("inventory slots", this.invSlotsGroup.getChildren())
		this.itemsGroup = this.add.group()
		for (const token in globalEth.assets) {
			this.createItem(token)// last step before new object	
		}
		// this.invGraphics.add(this.itemsGroup)
		// this.input.setDraggable(this.itemsGroup.getChildren());
		this.input.setTopOnly(false)
		this.input.on('dragstart', function (pointer, gameObject) {
			console.log("↑ drag start from", this.scene.lastSlot)
			// when draged we look darker
			if (gameObject.type == "Container"){
				gameObject.list[0].setTint(0x4f4f4f)
				gameObject.list[1].setStyle({color:'#999'})
				gameObject.priorPosition = this.scene.lastSlot

			}
		});
	
		this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
			gameObject.x = dragX
			gameObject.y = dragY
	
		});
	
		this.input.on('dragend', function (pointer, gameObject, dropped) {
			if (!dropped) {
				//Empty slot case
				// !! Context is input pluing
				let scene = this.scene
				if (DEBUG){
					console.log('↓ Dragend to', scene.lastSlot, "with", scene.invSlotsArray[scene.lastSlot].item)

				}
				if(scene.invSlotsArray[scene.lastSlot].item === undefined){
					// Controller
					scene.invSlotsArray[scene.lastSlot].item = gameObject
					delete scene.invSlotsArray[gameObject.priorPosition].item

					// View (could use a global refresh function)
					gameObject.x = scene.invSlotsArray[scene.lastSlot].invX
					gameObject.y = scene.invSlotsArray[scene.lastSlot].invY
				} else {
					gameObject.x = gameObject.input.dragStartX
					gameObject.y = gameObject.input.dragStartY
				}			
			}
			
			if (gameObject.type == "Container")
				gameObject.list[0].clearTint()
				gameObject.list[1].setStyle({ color : '#FFF', eeestrokeThickness: 1, stroke: "#000"})
		})

		// this.invGraphics.add(tokenText)
		this.updateInventory()
		this.invGraphics.setVisible(false)
			
	}
	createItem(token){

		let coin = this.add.image(0, 0,'cryptos',cryptos[token].frame )
		let txt = this.add.text(0, 0,globalEth.assets[token], { fontSize: 8,font: '"Press Start 2P"' , strokeThickness: 1, stroke: "#000"})
			// We need a solution to manage large numbers. Attempt : 
			// txt.setFixedSize(12, 0)

		// let coin = this.add.sprite(slot.invX, slot.invY,'cryptos',cryptos[token].frame ).setInteractive()
		// let txt = this.add.text(slot.invX+8, slot.invY+8,inventory[token], { fontSize: 8,font: '"Press Start 2P"' , strokeThickness: 1, stroke: "#000"})
		let item = this.add.container(0,0,[coin, txt])
		item.token = token // To keep it at hand 
		this.addItemToInventory(item)
		// item.add(coin)
		// item.add(txt)
		item.setSize(20, 20);
		item.setInteractive({ draggable: true })
		// item.alpha= 1
		this.input.setDraggable(item);
		item.on('pointerover', function () {
			// TODO display tooltip

			// const brighter = new Phaser.Display.Color(255, 255, 255, 255);
			// coin.setTint(brighter);
			// item.setTint(0x44ff44)
			// Tooltip
			// let graph = this.add.graphics()
			// graph.lineStyle(1, 0xffffff)
			// graph.fillStyle(color, 1)
			// graph.fillRoundedRect(x, y, w, h,4)
			// graph.strokeRoundedRect(x, y, w, h,4)		this.input.setDefaultCursor('url(assets/cursor.png), pointer');


		})
		item.on('pointerout', function () {

			// coin.clearTint();
	
		});
		// item.setInteractive()

		// this.invGraphics.add(txt)

		item.setDepth(20)
		item.setVisible(this.invGraphics.visible)
		this.itemsGroup.add(item)
		this.invGraphics.add(item)
		
		// inventoryCoinObjects.push(item)
	}
	addItemToInventory(item){
		if(globalEth.assets[item.token]>0){
			let idx = this.invSlotsArray.findIndex(x=>{ if(x) return x.token == item.token} )
			console.log(`token exists at ${idx}`)
			if (idx !== -1){
				 // the item is above 0 and exists is in a slot
				//  item.setVisible(true)
			} else {
				let emptyID = this.invSlotsArray.findIndex(x=> {if(x) return x.item === undefined})
				if (emptyID == -1 ){
					// TODO check case above max size of the inventory
					console.error(`No space left in inventory`)

				} else {

					if(DEBUG)
						console.log(`There is a slot`, this.invSlotsArray[emptyID])
					this.invSlotsArray[emptyID].item = item
					item.x = this.invSlotsArray[emptyID].invX
					item.y = this.invSlotsArray[emptyID].invY
					item.setVisible(true)
				}
			}

		} else {
			item.setVisible(false)
		}

	}
	updateInventory(){
		// this.itemsGroup.clear(true,true)
		let items = this.itemsGroup.getChildren()

		// console.log(items)
		for(let token in globalEth.assets){
			let item = items.find(x=> x.token == token)
			// item.
			// let idx = this.invSlotsArray.findIndex(x=> x.token == token)
			console.log(`refresh`, token, item.list[1].text, '>', globalEth.assets[token])
			if(globalEth.assets[token]>1000){
				item.list[1].text = Math.trunc(globalEth.assets[token]/1000)+'k'

			} else {
				item.list[1].text = Math.trunc(globalEth.assets[token])
			}
			// this.createItem(token)
		}
	}

	// Open transactions panel, Created and destroyed each time.
	// CounterpartyName is an address for players and a name for NPC
	openTransactionDialog(action, counterpartyFrame, counterpartyAddress, counterpartyName) {
		if (DEBUG)
			console.log("Open Transaction Dialog with Counterparty: (sprite)", counterpartyAddress)
		// We first open the regular inventory panel
		this.invGraphics.setVisible(true)

		this.transactionDialog = this.add.group()
		let actionBox = this.roundedBox(254, 20, 60, 200, BASEBLUE)
		this.transactionDialog.add(actionBox)
		
		let spritesheet = ''
		let actionFunction = undefined
		switch (action) {
			// Mostly for reference
			case 'Send':
				spritesheet = 'characters'
				if (counterpartyName) {
					let nameTxt = this.add.text(264, PADDING + INTERLINE,  counterpartyName.slice(0,10), INTERFACEFONT)
					this.transactionDialog.add(nameTxt)
				}
				actionFunction = (token, amount) => globalEth.sendETH(counterpartyAddress, amount)
				break;
				
			case 'Swap':
				spritesheet = 'cryptos'
				if (counterpartyName) {
					let nameTxt = this.add.text(264, PADDING + INTERLINE,  `Swap ` + counterpartyName.slice(0,4), INTERFACEFONT)
					this.transactionDialog.add(nameTxt)
				}
				actionFunction = (token, amount) =>  globalEth.swapETHforX(token, amount )
				break;

			case 'Deposit':
				spritesheet = 'things2'
				let nameTxt = this.add.text(275, PADDING ,  `Deposit`, INTERFACEFONT)
				this.transactionDialog.add(nameTxt)
				actionFunction = (amount) => globalEth.sendETH('0xd4c5CAcfD4C12C6516C144F5059e9CbF4650ab7a', amount)
				break;

			case 'Vote':
				// Needs a full different interface
				spritesheet = 'things2'
				break;
				
			default:
				break;
		}

		if (counterpartyFrame){
			let counterpartySprite = this.add.image(264, 32, spritesheet,  counterpartyFrame)
			this.transactionDialog.add(counterpartySprite)
		}
		if (counterpartyAddress) {
			let addressTxt = this.add.text(274, PADDING,  counterpartyAddress.slice(0,6), INTERFACEFONT)
			this.transactionDialog.add(addressTxt)
		}
		// let actionText = this.add.text(275, 30, action, INTERFACEFONT)
		// this.transactionDialog.add(actionText)
		let slot = this.createSlot(276, 78, ACTIONSLOT)
		this.transactionDialog.add(slot)
		
		
		this.input.on('drop', (pointer, gameObject, dropZone) => {

			gameObject.x = dropZone.x+20;
			gameObject.y = dropZone.y+20;
			// TODO MAYBE : handle if a coin is present already
			if(gameObject.token){
				// We have a token! 
				let token = gameObject.token
				// Let's add the appropriate dialog
				const el = this.add.dom(285, 150).createFromCache('pretransaction')
				document.querySelector('#amount').value = globalEth.assets[token]
				document.querySelector('#actionButton').innerHTML = action
				console.log(`Drop of : ${token} (${globalEth.assets[token]}`)
				// let el = document.querySelector('#actionButton')
				console.log({gameObject})
				el.addListener('click').on('click', (event) => {
					if (event.target.localName === 'button') {
						console.log("Transaction button click:", event, globalEth)
						if (globalEth.account === ""){
							globalEvents.emit('says','Sorry, you need to be connected to do that. Talk to the fox.')
						}else if (actionFunction){
							this.sound.play("notas")
							let amount = document.querySelector('#amount').value
							actionFunction(token, amount)									
						} else {
							console.error("Action not available")
						}
						this.closeTransactionDialog()
					}
				})
				this.transactionDialog.add(el)
			}	
		})
	
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
		


	}

	closeTransactionDialog(){
		// let elements = this.transactionDialog.getChildren()
		// console.log(elements)
		// let el = Phaser.Utils.Array.RemoveRandomElement(elements)
		// el.destroy(true)
		// this.transactionDialog.destroy(true) // true: destroy contained elements too
		if (this.transactionDialog){
			this.transactionDialog.clear(true,true)

			console.log(this.transactionDialog)
			this.transactionDialog = null
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
			if(document.activeElement === chatInput){
				this.chatInput.value = this.chatInput.value + "i"

			} else {
				this.updateInventory	()
				this.invGraphics.toggleVisible()
			}

		}, this)


		this.input.keyboard.on("keydown_SPACE", (event) => {
			if (document.activeElement === chatInput) {
				this.chatInput.value = this.chatInput.value + " ";
			}
		});

		// "T" to chat
		// this.input.keyboard.on("keydown_T", (event) => {
		//     event.preventDefault();
		//     this.chatInput.focus();
		// });

		// Debug function always available in dev phase
		if (1) {
			// For debug purpose, we can :
			// - open a transaction panel with ourselves
			this.input.keyboard
				.addKey(Phaser.Input.Keyboard.KeyCodes.E)
				.on('down', function (event) {
					if (!this.transactionDialog) {
						this.openTransactionDialog("Send", 7, "0xd4c5", "Eloise.eth")
					} else {
						this.closeTransactionDialog()
					}
				}, this)
			// - connect to Ethereum
			this.input.keyboard
			.addKey(Phaser.Input.Keyboard.KeyCodes.R)
			.on('down', function (event) {
				globalEth.initialiseMetaMask()
			}, this)	
			
			this.input.keyboard
			.addKey(Phaser.Input.Keyboard.KeyCodes.T)
			.on('down', function (event) {
				this.openTransactionDialog("Swap", cryptos["DAI"].frame,"0x6B175474E89094C44Da98b954EedeAC495271d0F","Dai Swap")
			}, this)	
			this.input.keyboard
			.addKey(Phaser.Input.Keyboard.KeyCodes.Y)
			.on('down', function (event) {
				globalGame.scene.getScene('interfaceScene').openTransactionDialog("Deposit", 20)
			}, this)	
			

			
		}

		this.input.keyboard
		.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
		.on('down', function (event) {
			this.closeTransactionDialog()
			// TODO Add close inventory anyway
			this.chatInput.blur()

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
			let myname = playerName
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
		globalEvents.on('connected', (account,ename) => {
			this.connected = this.add.image(380, 10, "cryptos", cryptos['ETH'].frame)
			this.connected.setTint(0xa9c9a9)
			globalNetwork.sendNameUpdate(account, ename)
			this.sound.play("holy")
			this.invGraphics.add(this.add.text(44, PADDING, account.slice(0,6),INTERFACEFONT).setVisible(this.invGraphics.visible))
			console.log("ename", ename)
			if(ename){
				this.invGraphics.add(this.add.text(40, PADDING + INTERLINE , ename,INTERFACEFONT).setVisible(this.invGraphics.visible))
			}
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
