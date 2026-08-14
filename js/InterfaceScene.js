import globalEvents from './helpers/globalEvents.js'
import createDebugSwitch from './interface/debug.js'

import createTextBox from './interface/textBox.js'
import EtherHelp from './helpers/EtherHelp.js'
import Network from './helpers/network.js'
import {cryptos} from './helpers/cryptos.js'
import {formatBalance, shortAddress, suggestedAmount} from './helpers/format.js'

const BASEBLUE = 0x00031f6c
const BASEBROWN = 0x8b4513
const BASEWHITE = 0xeeeeee
const MAXINVENTORY = 10

// Panels geometry
const PANEL = {x: 10, y: 10, w: 180, h: 148}
const SLOTS = {cols: 5, rows: 2, x: 23, y: 68, size: 24, step: 32}

const TRANSACTIONPANEL = {x:268, w: 80, sloty: 80}
const DROPZONESIZE = 40
const ACTIONSLOT = MAXINVENTORY + 1
const INTERFACEFONT = {fontSize: 8, font: '"Press Start 2P"'}
const INTERFACEFONTWITHBG = {fontSize: 8, font: '"Press Start 2P"', backgroundColor: 'rgba(20,20,20,0.6)'}
const PADDING = 24
const INTERLINE = 14

const DEBUGINTERFACE = false

const NAMES = [ 'Alex', 'Billie', 'Casey', 'Daniel', 'Erin', 'Harley', 'Jade','Isabella', 'Kim', 'Mateo', 'Yanet', 'Ximena', 'Zoe']
const randomName = NAMES[Math.floor(Math.random() * NAMES.length)] + Math.floor(Math.random()*99)

export default class InterfaceScene extends Phaser.Scene {
	constructor() {
		super({key: 'interfaceScene', active: false})
		this.lastSlot = -1
		this.invSlotsArray = [] // arrays of "slots", with .item attached
	}
	preload() {
		// the version from PreloaderScene does not seem available.
		this.load.spritesheet('things2bis', 'assets/things2.png', {frameWidth: 16, frameHeight: 16})
		const REX_CDN = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/e69398835e78c9b65e9de7347a6be7d9acd4b642'
		this.load.scenePlugin({
			key: 'rexuiplugin',
			url: `${REX_CDN}/dist/rexuiplugin.min.js`,
			sceneKey: 'rexUI'
		})
		this.load.plugin(
			'rexvirtualjoystickplugin',
			`${REX_CDN}/dist/rexvirtualjoystickplugin.min.js`,
	   		true
		)
		this.load.image('nextPage', `${REX_CDN}/assets/images/arrow-down-left.png`)
		this.load.html('message', 'html/message.html')
		this.load.html('pretransaction', 'html/pretransaction.html')
	}
	// Create base interface box
	roundedBox(x, y, w, h, color) {
		let graph = this.add.graphics()
		graph.lineStyle(1, 0xffffff)
		graph.fillStyle(color, 1)
		graph.fillRoundedRect(x, y, w, h, 4)
		graph.strokeRoundedRect(x, y, w, h, 4)
		graph.setAlpha(0.8)

		return graph
	}

	createSlot(x, y, index) {
		// Switched slots from roundedbox to image for facilitating
		let element = this.add.image(x, y, 'slot').setInteractive()
		element.setOrigin(0)
		element.invX = x + SLOTS.size / 2
		element.invY = y + SLOTS.size / 2
		element.on('pointerover', () => {
			if (DEBUGINTERFACE) console.log('hovering', index, element.item && element.item.token)
			this.lastSlot = index
		})
		// Without this, lastSlot keeps the last square the pointer *crossed*. Might be ok behavior
		element.on('pointerout', () => {
		    if (this.lastSlot === index) this.lastSlot = -1
		})
		return element
	}

	// How the player is named in the inventory header, the chat and Jitsi.
	get playerName() {
		return globalEth.ename || randomName
	}

	// Interesting idea to keep for the full wallet. It does not make sense within the game context
	// createExplorerLink(x, y) {
	// 	this.explorerText = this.add.text(x, y, '🔍', {...INTERFACEFONT, color: '#7fd0ff'})
	// 	this.explorerText.setInteractive({useHandCursor: true})
	// 	this.explorerText.on('pointerdown', () => window.open(globalEth.explorerWalletLink, '_blank'))
	// 	this.invGraphics.add(this.explorerText)
	// }

	updateWalletHeader() {
		if (!this.walletHeader) return // panel not built yet: a connection can beat it
		const {network} = globalEth
		this.walletHeader.setText(this.playerName)
		this.walletAddress.setText(shortAddress(globalEth.account))
		this.walletSubHeader.setText(globalEth.isConnected ? network.label || network.name : 'Not connected')
		this.walletSubHeader.setColor(network.color || '#ffffff')
		// this.explorerText.setVisible(!!this.inventoryOpen && !!this.explorerAddressLink)
	}

	// ── The inventory ────────────────────────────────────────────────────────────
	// Three structures, and keeping them straight is most of the panel's logic:
	//   globalEth.assets   the truth — ticker -> amount, owned by the wallet, rebuilt from the chain on  connection and network change
	//   this.items         one draggable Container per token, created on demand and then kept forever 
	//   invSlotsArray      the 10 squares of the grid, in reading order. A square that holds a coin has `.item`; an empty one has no such property

	createInventoryDialog() {
		// Inventory dialog, available pressing 'i', created once
		this.invGraphics = this.add.group()

		this.invGraphics.add(this.roundedBox(PANEL.x, PANEL.y, PANEL.w, PANEL.h, BASEBLUE))
		let playerSprite = this.add.image(PADDING, PADDING+2, 'characters', this.gameScene.player.char.frame)
		this.invGraphics.add(playerSprite)

		// Create a of inventory slots and display them
		//this.invSlotsGroup = this.add.group()
		for (let j = 0; j < SLOTS.rows; j++) {
			for (let i = 0; i < SLOTS.cols; i++) {
				const x = SLOTS.x + SLOTS.step * i
				const y = SLOTS.y + SLOTS.step * j
				const slot = this.createSlot(x,y , this.invSlotsArray.length)
				this.invGraphics.add(slot)
				this.invSlotsArray.push(slot)
			}
		}
		// if (DEBUG) console.log('inventory slots', this.invSlotsGroup.getChildren())

		this.items = {} // update logic within updateInventory

		// Header section
		this.walletHeader = this.add.text(PADDING +10, PADDING, '', INTERFACEFONT)
		this.walletAddress = this.add.text(PADDING +10 , PADDING + INTERLINE, '', INTERFACEFONT)
		// Right-aligned against the panel edge, so a long network name grows leftwards
		this.walletSubHeader = this.add.text(PANEL.x + PANEL.w - 10, PADDING + INTERLINE, '', INTERFACEFONT).setOrigin(1, 0)
		this.invGraphics.addMultiple([this.walletHeader, this.walletAddress, this.walletSubHeader])
		// this.createExplorerLink(PANEL.x + PANEL.w -14 , PANEL.y + PANEL.h - 14)

		this.input.setTopOnly(false)

		this.input.on('dragstart', (pointer, item) => {
			if (item.type !== 'Container') return
			if (DEBUGINTERFACE) console.log('↑ drag start from', this.lastSlot)
			// when draged we look darker
			item.list[0].setTint(0x4f4f4f)
			item.list[1].setStyle({color: '#999'})
		})

		this.input.on('drag', (pointer, item, dragX, dragY) => {
			item.x = dragX
			item.y = dragY
		})

	
		this.input.on('dragend', (pointer, item, dropped) => {
			if (DEBUGINTERFACE) console.log('↓ Dragend to', this.lastSlot)
			if (!dropped && !this.placeItem(item, this.invSlotsArray[this.lastSlot])) {
				item.x = item.input.dragStartX
				item.y = item.input.dragStartY
			}
			if (item.type !== 'Container') return
			item.list[0].clearTint()
			item.list[1].setStyle({color: '#FFF', eeestrokeThickness: 1, stroke: '#000'})
		})

		this.updateWalletHeader()
		this.updateInventory()
		this.setInventoryVisible(false)
	}

	slotOf(item) {
		return this.invSlotsArray.find(slot => slot.item === item)
	}

	placeItem(item, slot) {
		if (!slot || (slot.item && slot.item !== item)) return false
		const priorSlot = this.slotOf(item)
		if (priorSlot && priorSlot !== slot) delete priorSlot.item
		slot.item = item
		item.x = slot.invX
		item.y = slot.invY
		return true
	}

	createItem(token) {
		const coin = this.add.image(0, 0, 'cryptos', cryptos[token].frame)
		// Empty on purpose — updateInventory writes the balance immediately after creating an item and on every refresh afterwards. The text is drawn from its top-left, so it trails down and right of the coin.
		const label = this.add.text(0, 0, '', {
			fontSize: 8,
			font: '"Press Start 2P"',
			strokeThickness: 1,
			stroke: '#000'
		})

		// let coin = this.add.sprite(slot.invX, slot.invY,'cryptos',cryptos[token].frame ).setInteractive()
		// let txt = this.add.text(slot.invX+8, slot.invY+8,inventory[token], { fontSize: 8,font: '"Press Start 2P"' , strokeThickness: 1, stroke: "#000"})
		// MAYBETODO: a tooltip on hover, showing the unabbreviated balance
		const item = this.add.container(0, 0, [coin, label])
		item.token = token // to keep it at hand
		item.setSize(SLOTS.size, SLOTS.size)
		item.setInteractive({draggable: true})
		this.input.setDraggable(item)
		item.setDepth(20)
		item.setVisible(this.inventoryOpen)
		this.invGraphics.add(item)
		this.items[token] = item

		return item
	}

	// Give a coin a square, or take its square back once its balance reaches zero. To be renamed
	addItemToInventory(item) {
		const currentSlot = this.slotOf(item)
		if (globalEth.assets[item.token] > 0) {
			if (currentSlot) {
				item.setVisible(this.inventoryOpen)
				return
			}
			const emptySlot = this.invSlotsArray.find(slot => slot.item === undefined)
			if (!emptySlot) {
					// TODO check case above max size of the inventory
				console.warn(`No space left in inventory for ${item.token}`)
				return
			}
			if (DEBUGINTERFACE) console.log(`Placing ${item.token} in a free slot`, emptySlot)
			this.placeItem(item, emptySlot)
			item.setVisible(this.inventoryOpen)
		}else {
			item.setVisible(false)
			if (currentSlot) delete currentSlot.item
		}
	}

	setInventoryVisible(visible) {
		this.inventoryOpen = visible
		// Group.setVisible reaches every child, including the coins of empty tokens…
		this.invGraphics.setVisible(visible)
		// …so reconcile right after to hide those again
		if (visible) this.updateInventory()
	}

	toggleInventory() {
		this.setInventoryVisible(!this.inventoryOpen)
	}

	// Bring the panel back in line with globalEth.assets.
	updateInventory() {
		if (!this.items) return // panel not built yet

		for (const token in globalEth.assets) {
			if (!cryptos[token]) continue // no coin sprite for this ticker
			const item = this.items[token] || this.createItem(token)
			item.list[1].text = formatBalance(globalEth.assets[token])
			this.addItemToInventory(item)
		}
		for (const token in this.items) {
			if (globalEth.assets[token] === undefined) {
				this.addItemToInventory(this.items[token]) // no balance: hides it 
			}
		}
	}

	// Open transactions panel, Created and destroyed each time.
	// CounterpartyName is an address for players and a name for NPC	
	openTransactionDialog(action, counterpartyFrame, counterpartyAddress, counterpartyName) {
		if (DEBUG) console.log('Open Transaction Dialog with Counterparty: (sprite)', counterpartyAddress)
		this.closeTransactionDialog()
		// We first open the regular inventory panel
		this.setInventoryVisible(true)

		this.transactionDialog = this.add.group()
		const actionBox = this.roundedBox(TRANSACTIONPANEL.x, PANEL.y, TRANSACTIONPANEL.w, PANEL.h, BASEBLUE)
		this.transactionDialog.add(actionBox)

		if (!counterpartyName){
			console.warn("No counterparty name in dialog")
		}
		let spritesheet, label, actionFunction
		switch (action) {
			case 'Send':
				spritesheet = 'characters'
				label = counterpartyName && counterpartyName.slice(0, 10)
				actionFunction = (token, amount) => globalEth.sendToken(token, counterpartyAddress, amount)
				break

			case 'Swap':
				spritesheet = 'cryptos'
				label = counterpartyName && `Swap ${counterpartyName.slice(0, 4)}`
				actionFunction = (token, amount) => globalEth.swapETHforX(token, amount)
				break

			case 'Deposit':
				spritesheet = 'things2'
				label = 'Deposit'
				actionFunction = (token, amount) => globalEth.deposit(amount, token)
				break

			case 'Vote': 
				// Needs an interface of its own
				spritesheet = 'things2'
				break
			default:
				console.error("Action do not exist")

		}

		if (counterpartyFrame) {
			this.transactionDialog.add(this.add.image(TRANSACTIONPANEL.x + 14, PADDING+ 4, spritesheet, counterpartyFrame))
		}
		if (counterpartyAddress) {
			this.transactionDialog.add(this.add.text(TRANSACTIONPANEL.x + PADDING, PADDING, counterpartyAddress.slice(0, 6), INTERFACEFONT))
		}
		if (label) {
			const y = counterpartyAddress ? PADDING + INTERLINE : PADDING
			this.transactionDialog.add(this.add.text(TRANSACTIONPANEL.x + PADDING, y, label, INTERFACEFONT))
		}
		const actionSlot = this.createSlot(
			TRANSACTIONPANEL.x + (TRANSACTIONPANEL.w - SLOTS.size) / 2,
			TRANSACTIONPANEL.sloty,
			ACTIONSLOT
		)
		this.transactionDialog.add(actionSlot)

		this.dropHandler = (pointer, item, dropZone) => {
			if (!item.token) return
			// Check for a prior item
			if (this.droppedItem && this.droppedItem !== item) {
				this.placeItem(this.droppedItem, this.slotOf(this.droppedItem))
			}
			if (this.preTransactionForm) this.preTransactionForm.destroy()
			this.droppedItem = item
			item.x = dropZone.x
			item.y = dropZone.y
			const token = item.token
			
			const el = this.add.dom(TRANSACTIONPANEL.x + TRANSACTIONPANEL.w/2, PANEL.y + PANEL.h - 24).createFromCache('pretransaction')
			this.preTransactionForm = el
			const amountInput = document.querySelector('#amount')
			amountInput.value = suggestedAmount(globalEth.assets[token], cryptos[token].decimals)
			amountInput.max = globalEth.assets[token]
			// Default step is 1, which makes any fraction of ETH invalid. To be tested
			amountInput.step = cryptos[token].decimals === 0 ? 1 : 'any'
			document.querySelector('#actionButton').innerHTML = action
			if(DEBUG) console.log(`Drop of : ${token} (${globalEth.assets[token]})`)

			el.addListener('click').on('click', event => {
				if (event.target.localName !== 'button') return
				if (!globalEth.isConnected) {
					globalEvents.emit('says', 'Sorry, you need to be connected to do that. Talk to the fox.')
				} else if (actionFunction) {
					this.sound.play('notas')
					actionFunction(token, amountInput.value)
				} else {
					console.error(`No action available for ${action}`)
				}
				this.closeTransactionDialog()
			})
			this.transactionDialog.add(el)
		}
		this.input.on('drop', this.dropHandler)

		const zone = this.add.zone(actionSlot.invX, actionSlot.invY, DROPZONESIZE, DROPZONESIZE).setDropZone()
		this.transactionDialog.add(zone)

		//  Just a visual display of the drop zone
		if (DEBUG) {
			const bounds = zone.getBounds()
			const graphics = this.add.graphics()
			graphics.lineStyle(1, 0xffff00)
			graphics.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height)
			graphics.setDepth(19)
			this.transactionDialog.add(graphics)
		}
		// let tokenText = this.add.text(40, 60, 'Tokens' , { fontSize: 10})
		// let iTokenText = this.add.text(40, 180, 'Interest bearing tokens', { fontSize: 10})
	}


	closeTransactionDialog() {
		if (this.transactionDialog) {
			// true, true: remove from the group and destroy, taking the drop zone and form with it
			this.transactionDialog.clear(true, true)
			this.transactionDialog = null
		}
		if (this.dropHandler) {
			// Removed by reference. It is registered on the scene's input, not on the dialog.
			this.input.off('drop', this.dropHandler)
			this.dropHandler = null
		}
		this.preTransactionForm = null // destroyed with the group above
		if (this.droppedItem) this.placeItem(this.droppedItem, this.slotOf(this.droppedItem))
		this.droppedItem = null
		this.setInventoryVisible(false)
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
	updateChat(name, message) {
		const who = document.createElement('span')
		who.textContent = `${name}: `
		// Default Grey, Green for user, violet for the others. To be refined with colors
		if (name && name !== 'server') who.className = name === this.playerName ? 'me' : 'them'
		const line = document.createElement('div')
		line.append(who, message)
		this.chat.append(line)
		this.chat.scrollTop = this.chat.scrollHeight
	}

	jitsiChat(){
		if (!this.jistiIsUp){
			this.jistiIsUp = true
			let name = this.playerName

			const jitsiWindow = this.add
			.dom(-140, -50)
			.createFromHTML(
				'<div style="text-align:left"><div id="meet" ></div></div>'
			)
			jitsiWindow.scale = 0.3
	
			const domain = 'meet.jit.si';
			const options = {
				roomName: 'HaciendasXYZ',
				width: 400,
				height: 200,
				parentNode: document.querySelector('#meet'),
				userInfo: {
					// email: 'email@jitsiexamplemail.com',
					displayName: name
				},
				configOverwrite: { 
					hideLobbyButton: true,
					enableCalendarIntegration: false,
					disableProfile: true,
					startAudioOnly: true, 
					TOOLBAR_BUTTONS: [   'microphone', 'hangup', 'settings'], 
					TOOLBAR_ALWAYS_VISIBLE: true 
				},
				interfaceConfigOverwrite: { 
					APP_NAME: 'Haciendas',

					DEFAULT_BACKGROUND: '#57E757',
					DEFAULT_LOCAL_DISPLAY_NAME: 'me',
					DEFAULT_LOGO_URL: '../assets/hacienda.png',
					DEFAULT_REMOTE_DISPLAY_NAME: 'Haciendero',
					DEFAULT_WELCOME_PAGE_LOGO_URL: '../assets/hacienda.png',

					DISPLAY_WELCOME_FOOTER: false,
					SHOW_BRAND_WATERMARK: false,					
					DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
					DISABLE_VIDEO_BACKGROUND: true,					
					HIDE_INVITE_MORE_HEADER: true,
					SHOW_CHROME_EXTENSION_BANNER: false,
					SHOW_DEEP_LINKING_IMAGE: false,
					SHOW_JITSI_WATERMARK: false,
					SHOW_POWERED_BY: false,
					SHOW_PROMOTIONAL_CLOSE_PAGE: false,
					SHOW_WATERMARK_FOR_GUESTS: false,
					MOBILE_APP_PROMO: false,
				},
	
			}
			this.jitsiApi = new JitsiMeetExternalAPI(domain, options);
		}
	
	}
	nameChange(){
		this.jitsiApi.executeCommand('displayName', globalEth.ename);

		// this.jitsiApi.executeCommands({

		// 	displayName: [ globalEth.ename],
		// 		toggleAudio: []
		// })

	}

	create() {
		this.gameScene = this.scene.get('gameScene')
		
		//// Inputs
		this.letterI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)
		this.letterI.on(
			'down',
			function (event) {

				if (document.activeElement === this.chatInput) return
				this.toggleInventory()
			},
			this
		)
		if (TOUCH || DEBUG){
			let joystick = this.plugins.get('rexvirtualjoystickplugin').add(this,  {
				x: 46,
				y: 254,
				radius: 36,
				base: this.add.circle(0, 0, 36, 0x888888, 0.3), //
				thumb: this.add.circle(0, 0, 18, 0xcccccc, 0.6),
				// dir: '8dir',
				// forceMin: 16,
				// fixed: true,
				// enable: true
			}).on('update', ()=>{
				globalGame.scene.getScene('gameScene').inputKeys.jleft = joystick.left
				globalGame.scene.getScene('gameScene').inputKeys.jright = joystick.right
				globalGame.scene.getScene('gameScene').inputKeys.jup = joystick.up
				globalGame.scene.getScene('gameScene').inputKeys.jdown = joystick.down
				globalGame.scene.getScene('gameScene').inputKeys.jnokey = joystick.noKey
			}, 
			this)
			joystick.setVisible(true)

			// let touchAction = this.add.rectangle(370, 270, 30, 10, 0xcccccccc, 0.4)
			// A round target in the corner opposite the joystick, built the same way it is. To be adjusted with it
			let actionButton = this.add.circle(362, 264, 20, 0x888888, 0.3)
			this.add.text(362, 264, '🖐️', {...INTERFACEFONT, fontSize: 16}).setOrigin(0.5)
			actionButton.setInteractive({})
			actionButton.on('pointerdown', i => {
				globalGame.scene.getScene('gameScene').inputKeys.action = true
				// The icon carries no backgroundColor: Phaser would fill a rectangle behind it
				actionButton.setFillStyle(0xcccccc, 0.6)
				if(DEBUG) console.log(`tap on action`)
			})
			// press style
			actionButton.on('pointerup', i => actionButton.setFillStyle(0x888888, 0.4))
			actionButton.on('pointerout', i => actionButton.setFillStyle(0x888888, 0.4))

			// rect.on('tiledown', function(tap, tileXY) {
			// 	globalGame.scene.getScene('gameScene').inputKeys.action = true
			// 	if(DEBUG) console.log(`tap on action`)
			// })
		}

		// Super hacky to solve WASD collision with chat
		// this.input.keyboard.on('keydown_W', event => {
		// 	if (document.activeElement === chatInput) {
		// 		this.chatInput.value = this.chatInput.value + 'w'
		// 	} 
		// })
		// this.input.keyboard.on('keydown_A', event => {
		// 	if (document.activeElement === chatInput) {
		// 		this.chatInput.value = this.chatInput.value + 'a'
		// 	} 
		// })
		// this.input.keyboard.on('keydown_S', event => {
		// 	if (document.activeElement === chatInput) {
		// 		this.chatInput.value = this.chatInput.value + 's'
		// 	} 
		// })
		// this.input.keyboard.on('keydown_D', event => {
		// 	if (document.activeElement === chatInput) {
		// 		this.chatInput.value = this.chatInput.value + 'd'
		// 	} 
		// })

		// "T" to chat
		// this.input.keyboard.on("keydown_T", (event) => {
		//     event.preventDefault();
		//     this.chatInput.focus();
		// });

		// Debug function always available in dev phase
		if (DEBUG) {
			// For debug purpose, we can :
			// - open a transaction panel with ourselves
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E).on(
				'down',
				function (event) {
					if (!this.transactionDialog) {
						this.openTransactionDialog('Send', 7, '0xd4c5', 'Eloise.eth')
					} else {
						this.closeTransactionDialog()
					}
				},
				this
			)
			// - connect to Ethereum
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R).on(
				'down',
				function (event) {
					globalEth.initialiseMetaMask().catch(err => console.warn('Connection failed:', err.message))
				},
				this
			)

			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T).on(
				'down',
				function (event) {
					this.openTransactionDialog(
						'Swap',
						cryptos['DAI'].frame,
						'0x6B175474E89094C44Da98b954EedeAC495271d0F',
						'Dai Swap'
					)
				},
				this
			)
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y).on(
				'down',
				function (event) {
					globalGame.scene.getScene('interfaceScene').openTransactionDialog('Deposit', 20)
				},
				this
			)
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U).on(
				'down',
				function (event) {
					globalGame.scene.getScene('gameScene').loanOfficer.contact()
				},
				this
			)
		}

		this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on(
			'down',
			function (event) {
				this.closeTransactionDialog()
				// TODO Add close inventory anyway
				this.chatInput.blur()
			},
			this
		)

		// 'c' opens the chat. Once open, Enter sends
		this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C).on(
			'down',
			// Phaser passes the key first, then the DOM event
			function (key, event) {
				// While any field holds the focus, c is just a letter being typed
				if (document.activeElement?.tagName === 'INPUT') return
				this.chatInput.focus()
				// Focusing turned Phaser's own preventDefault off, so the c would land in the field
				event.preventDefault()
			},
			this
		)

		// chat
		globalNetwork = new Network(this.gameScene.player)
		// Centred on this point, so 88px wide keeps it inside the 400px canvas
		this.add.dom(358, 182).createFromCache('message')
		// this.chatElement.scale =
		this.chat = document.getElementById('chat')
		this.chatInput = document.getElementById('chatInput')
		const chatForm = document.getElementById('chatForm') // only needed here, unlike the two above
		// this.input.keyboard.on("keydown_TAB", event => {
		// TODO : Disable input on focus,
		// While the chat holds the focus the game pauses, so W/A/S/D type instead of walking
		this.chatInput.addEventListener('focus', event => {
			globalGame.input.keyboard.preventDefault = false
			this.gameScene.scene.pause()
			// globalGame.input.enabled = false
		})

		this.chatInput.addEventListener('focusout', event => {
			globalGame.input.keyboard.preventDefault = true
			this.gameScene.scene.resume()
			// globalGame.input.enabled = true

		})

		// One handler for both ways of sending: the Enter key and the button
		chatForm.addEventListener('submit', event => {
			event.preventDefault() // a real submit would reload the page
			const message = this.chatInput.value
			if (DEBUG) console.log(`Chat`, message)
			this.chatInput.value = ''
			this.chatInput.blur()
			if (message == '') return
			globalNetwork.says(this.playerName, message)
		})

		// A click must not leave the focus on the button, or Enter and Space would press it again
		chatForm.querySelector('button').addEventListener('mousedown', event => event.preventDefault())
		// TODO : we need to require an earlier connection





		// this.chatInput.addEventListener('submit', event => {
		// })
		// this.chatInput.addEventListener('focusout', function (e) {
		// 	// globalGame.input.enabled = true
		// })




		// this.input.keyboard.on('keydown_ENTER', event => {

		// })
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
			visible: false
		})
		// Top of the right-hand column, above the wallet badge and the coffee. It is a DOM
		// element, so it lives in a container above the canvas and takes the pointer from
		// anything it overlaps — hence the vertical spacing between the three.
		this.add
			.dom(380, 0)
			.createFromHTML(
				'<a href="https://discord.gg/n5xTJXNbwF"><button class="shyButton" style="font-size:2.5px"><i>Discord</i></button></a>'
			)
		//// Handling events
		globalEvents.on('transaction-captured', nb => this.handleTransactionsChange(nb), this)
		globalEvents.on('mining-complete', () => {
			this.transactionsDisplay.children.each((obj, idx) => {
				obj.visible = false
			})
		})
		// 'connected' fires on the first connection and again on every account or network change
		globalEvents.on('connected', (account, ename, network) => {
			if (!this.connectedImage) {
				this.connectedImage = this.add.image(380, PADDING, 'cryptos', cryptos['ETH'].frame)
				this.sound.play('holy')
			}

			//TODO: give a tint and link to the badge
			globalNetwork.sendNameUpdate(account, ename)
			this.updateWalletHeader()
			this.updateInventory()
		})
		globalEvents.on('disconnected', () => {
			if (this.connectedImage) {
				this.connectedImage.destroy()
				this.connectedImage = null
			}
			this.updateWalletHeader()
			this.updateInventory()
		})
		globalEvents.on('assets-updated', () => this.updateInventory(), this)
		globalEvents.on('adding-coffee', () => {
			this.coffee = this.add.image(380, 30, 'coffee')
			// this.connected.setTint(0x9bfb9b)
			this.sound.play('holy')
		})
		globalEvents.on('says', message => createTextBox(this, message), this)
		globalEvents.on('chat-says', (name, message) => this.updateChat(name, message), this)
	}

	update() {}
}
