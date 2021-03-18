//// Import tools
import BaseScene from './BaseScene.js'
import localStorageAvailable from './helpers/localStorageAvailable.js'

//// Import objects and characters
import Player from './chars/Player.js'
import Transaction from './object/Transaction.js'
import EthTransaction from './object/EthTransaction.js'

import PNJ from './chars/PNJ.js'
import Mine from './object/Mine.js'
import FloatingCrypto from './object/FloatingCrypto.js'
import Actionnable from './object/Actionnable.js'
// characters and objects helpers
import {charactersList} from './chars/charactersList.js'
import {createObjectsAnims, createCharAnims} from './chars/createAnims.js'

import {cryptos} from './helpers/cryptos.js'
import Quests from './helpers/quests.js'

//// Global objects
import globalEvents from './helpers/globalEvents.js'
import EtherHelp from './helpers/EtherHelp.js'

export default class GameScene extends BaseScene {
	constructor() {
		super('gameScene')
	}

	init(data) {
		// We expect a character choice from prior scene. Otherwise default is boy
		if (data.currentChar) this.currentChar = data.currentChar
		else this.currentChar = charactersList.BOY

		// this.inputKeys = this.input.keyboard.createCursorKeys()
		this.inputKeys = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			upA: Phaser.Input.Keyboard.KeyCodes.UP,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			downA: Phaser.Input.Keyboard.KeyCodes.DOWN,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			leftA: Phaser.Input.Keyboard.KeyCodes.LEFT,
			right: Phaser.Input.Keyboard.KeyCodes.D,
			rightA: Phaser.Input.Keyboard.KeyCodes.RIGHT,
			space: Phaser.Input.Keyboard.KeyCodes.SPACE
		})
	}

	preload() {}

	initialiseMap(mapKey) {
		//// Map loading (see layer below)
		const map = this.make.tilemap({
			key: mapKey
		})
		const tileset = map.addTilesetImage('Outside7', 'outsideTiles')
		console.log(`✓ Map and tiles loaded`)
		// Set start Position from map
		let startPosition = map.findObject('Helpers', obj => obj.name === 'startPosition')

		if (DEBUG) {
			if (localStorageAvailable()) {
				window.localStorage.setItem('blockQuestComplete', true)
			}
		}
		if (!startPosition)
			startPosition = {
				x: 600,
				y: 600
			}

		return {map, tileset, startPosition}
	}
	addGateway(fromStr, toStr, map, condition,callback) {
		// TODO : Gateways should be a distinct object build from the same parameters
		// From and to are strings for an object in Helpers
		// Condition is a function to check the availability for the current user
		// Returns true if it can, an error message otherwise
		const from = map.findObject('Helpers', obj => obj.name === fromStr)
		const to = map.findObject('Helpers', obj => obj.name === toStr)

		if (from && to) {
			let exitZone = this.add.image(from.x, from.y)
			this.physics.add.existing(exitZone)
			exitZone.setDepth(10)
			exitZone.body.immovable = true

			this.physics.add.collider(this.player, exitZone, (p, n) => {
				try {
					let cond = condition? condition() : true // ugly, I need some rest
					if (cond){
						console.log('ETeleport!')
						this.player.x = to.x
						this.player.y = to.y
						// this.scene.start('marketScene',  { currentChar: this.player.char })
						if(callback)
							callback()
					}
				} catch (error) {
					globalEvents.emit('says', `Sorry! You can't enter here. ${error}`)
					console.error(error)
				}
			})
		} else {
			console.error(`Zones not found`)
		}

	}
	addAavegotchi(ag, agsvg) {
		if (DEBUG) console.log('Adding ag', ag[1])
		// new File(loader, fileConfig)
		this.add
			.image(this.andres.x - 140, this.andres.y - 40, 'myag', 0)
			.setDepth(10)
			.setScale(0.1)
	}
	addPortal(x, y) {
		this.anims.create({
			key: 'portal-anim',
			frames: this.anims.generateFrameNumbers('portal', {
				start: 0,
				end: 4
			}),
			frameRate: 10,
			repeat: -1
		})

		this.anims.create({
			key: 'myag-anim',
			frames: this.anims.generateFrameNumbers('myag', {
				start: 0,
				end: 3
			}),
			frameRate: 5,
			repeat: -1
		})

		this.portal = this.add
			.sprite(x, y, 'portal', 0)
			.setDepth(5) // player is at 6
			.setScale(1)
		const portalObj = this.portal
		this.physics.add.existing(this.portal)
		this.portal.body.setMass(1000)

		this.portal.play('portal-anim', true)
		this.physics.add.overlap(
			this.player,
			this.portal,
			(pl, prt) => {
				prt.body.setVelocity(0, 0)
				if (!pl.isAG) {
					if (!pl.isChanging) {
						pl.isChanging = true
						this.tweens.add({
							targets: this.player,
							alpha: {start: 1, from: 0, to: 1},
							duration: 1000,
							ease: 'Cubic',
							//  function (t) {
							//     return Math.pow(Math.sin(t * 3), 3);
							// },
							delay: 100
						})
						pl.isAG = true
						this.time.addEvent({
							delay: 100,
							callback: () => {
								pl.setScale(0.5)
								pl.play('myag-anim')
							} // setTexture('myag'),
						})
						this.time.addEvent({
							delay: 5000,
							callback: () => {
								pl.isChanging = false
							}
						})
					}
				} else {
					if (!pl.isChanging) {
						pl.isChanging = true
						this.tweens.add({
							targets: this.player,
							alpha: {start: 1, from: 0, to: 1},
							duration: 1000,
							ease: 'Cubic',
							delay: 100
						})
						this.time.addEvent({
							delay: 100,
							callback: () => {
								pl.setScale(1)
								pl.play(pl.char.name + '-down', true)
								pl.isAG = false
								// setTexture('myag'),
							}
						})
						this.time.addEvent({
							delay: 5000,
							callback: () => {
								pl.isChanging = false
							}
						})
					}
				}
			},
			null,
			this
		)
	}

	addCharacterDynamically(name, svgFile) {
		this.load.svg(name, svgFile)
		this.add.image(x, y, name)
	}

	create() {
		//// Map loading
		const {map, tileset, startPosition} = this.initialiseMap('majorMap')

		//// World collision
		this.physics.world.setBounds(0, 0, map.width * 16, map.heigth * 16) // (x, y, width, height)
		//// Create animations
		createObjectsAnims(this.anims)

		for (var c in charactersList) {
			createCharAnims(this.anims, charactersList[c])
		}

		// Group that contains any object that can be triggered by an action.
		// They all have an actionned() function that will be triggered with an overlap with an action.
		this.actionnableGroup = this.physics.add.group()

		//// Player
		this.player = this.add.player(startPosition.x, startPosition.y, this.currentChar)
		//// Trying camera
		if (!DEBUG) {
			// debug shortcut
			this.cameras.main.centerOn(200, startPosition.y - 700)
			this.cameras.main.pan(startPosition.x, startPosition.y, 3000, 'Sine.easeInOut')
		}
		this.scene.launch('interfaceScene')
		this.input.setDefaultCursor('url(assets/cursor.png), pointer')

		//// Object on map management
		this.minesGroup = this.physics.add.group()
		const objectsLayer = map.getObjectLayer('Helpers')
		objectsLayer.objects.forEach(obj => {
			if (obj.name == 'mine') {
				const newMine = this.add.mine(obj.x, obj.y)
				// newMine.body.setImmovable() /// does not work either
				this.minesGroup.add(newMine)
			}
		})
		if (DEBUG) console.log('mines:', this.minesGroup) // give an array of sprites

		this.physics.add.collider(
			this.player,
			this.minesGroup.getChildren(),
			(p, m) => {
				m.body.setVelocity(0, 0)
			},
			null,
			this
		)

		//// PNJ
		this.pnjsGroup = this.physics.add.group()
		// We assume each object on the PNJ layer has a name and a first custom property "frame"
		const PNJsLayer = map.getObjectLayer('PNJs')
		PNJsLayer.objects.forEach(pnjObj => {
			// We extract type
			const prop = pnjObj.properties.find(p => p.name == 'type')
			const type = prop ? prop.value : ''
			// We extract frame. pnjObj.properties[0].value could work, this is more resiliend
			const frame = pnjObj.properties.find(p => p.name == 'frame').value
			if (DEBUG && frame == undefined) console.error(`No Frame for `, pnjObj)
			// Object creation
			const newPNJ = this.add.pnj(pnjObj.x, pnjObj.y, 'pnj', frame, pnjObj.name, type)
			this.pnjsGroup.add(newPNJ)
		})
		if (DEBUG) console.log("PNJs Group",this.pnjsGroup)

		// timeout is hack to avoid a random bug
		// setTimeout(() => {

		//   }, 3000)

		//// Layers Loading
		this.layers = []

		for (let i = 0; i < map.layers.length; i++) {
			// could use map.layers[i].name as name
			this.layers[i] = map.createLayer(i, tileset)
			this.layers[i].setDepth(i)
			this.layers[i].setCollisionByProperty({
				collides: true
			})
			if (i == 0) {
				// Layer 0 is for transactions only
			} else {
				this.physics.add.collider(this.player, this.layers[i]) // ALT: execMapCollision, checkMapCollision, this)
				this.physics.add.collider(this.pnjsGroup, this.layers[i], null, null, this)
			}
			console.log(map.layers[i].name, 'depth:', i)
		}
		// alt: to create a collidable layer: obstacles.setCollisionByExclusion([-1]);

		//// Control Player
		this.cameras.main.startFollow(this.player, true)
		// this.cameras.main.setLerp(0.5,0.5)

		// Trick to avoid bleeding
		//this.cameras.main.roundPixels = true;

		this.input.mouse.disableContextMenu()

		//// Quests
		// Object that contains all the quests is  this.player.quests, created in Player.js
		if (DEBUG) console.log(`👥 pnjsGroup`, this.pnjsGroup.getChildren())
		// Collisions between the player and the NPCs
		let NPCPlayerCollider = this.physics.add.collider(this.player, this.pnjsGroup.getChildren(), (p, j) => {
				if (DEBUG) console.log(`💥 collision between player and NPC`, j)
				j.handlePlayerCollision(p, j)
				p.handleBumpyCollision(p, j)
			}, null, this)
		if (DEBUG) console.log(`NPC/player collider added`, NPCPlayerCollider)

		const andres = this.pnjsGroup.getChildren().find(p => p.name === 'Andrés')
		this.andres = andres // dirty to faciltate test of aavegotchi
		if (andres) {
			this.player.quests.addQuest(
				'catch-transactions',
				andres,
				`You need to collect 5 transactions in the mempool, West from here. You can launch your net with the space bar. Be careful, you must only collect valid transactions in green!`,
				`Congratulations for collecting the transactions! `,
				'mine-a-block'
			)
			this.player.quests.addQuest(
				'mine-a-block',
				andres,
				`Now to mine a block of transactions, go to the mining farm in the South and activate one of the mining rigs pressing [i]space[/i] until you have a number below 1000.`,
				`Congratulations for mining a block! Join the fox near the lake to collect your reward`,
				''
			)

			// we probably need a generic picable object class
			const net = this.add.image(andres.x + 10, andres.y - 14, 'actions', 0)
			net.setDepth(10)
			this.physics.add.existing(net)
			this.physics.add.collider(this.player, net, (p, n) => {
				this.player.quests['catch-transactions'].activate()
				n.destroy()
			})
		} else {
			console.error(`Andres not found!`)
		}

		this.loanOfficer = this.pnjsGroup.getChildren().find(p => p.name === 'LoanOfficer')

		const fox = this.pnjsGroup.getChildren().find(p => p.name === 'Fox')
		if (DEBUG) globalGame.fox = fox
		const timeout = DEBUG ? 0 : 4000

		// if(localStorageAvailable() && window.localStorage.getItem('blockQuestComplete')){
		//     this.quest = "get a fox"
		//     setTimeout(() => {
		//         andres.says("Welcome back. You should go directly talk to the fox, just south from here")
		//     }, timeout);
		// } else {
		//     this.quest = "catch transactions"
		//     setTimeout(() => {
		//         andres.says("Welcome to Haciendas!            A decentralised game to learn and interact with digital assets.            To start, I need you to collect 5 transactions in the mempool, west from here. You can navigate with the arrow keys and launch your net with the space bar [i](Sorry mobile users, touch controls are on the roadmap).[/i] Be careful, you must only collect valid transactions!")

		//     }, timeout);
		// }
		//// New start
		setTimeout(() => {
			globalEvents.emit(
				'says',
				`Welcome to Haciendas!                    A decentralised game to learn and interact with digital assets.          Use WASD to move around and spacebar to talk or interact with objects. Note that this game is in early alpha.`
			)
			this.quest = 'get a fox'
		}, timeout)

		this.transactionsCaptured = 0
		//// Transactions logic
		this.transactions = this.physics.add.group()
		// We bounce on underlying layer
		this.physics.add.collider(this.transactions, this.layers[0])

		this.createRandomTransactions = this.time.addEvent({
			delay: 4000,
			callback: () => {
				if (this.transactions.children.size < 9) {
					const tr = this.add.transaction(10 * 16, 96 * 16)
					this.transactions.add(tr)
				}
			},
			loop: true
		})
		const portalObj = map.findObject('Helpers', obj => obj.name === 'Portal')
		this.addPortal(portalObj.x, portalObj.y)



		// Exit Zone
		// const toGovernanceCheat = map.findObject("Helpers", obj => obj.name === "toGovernanceCheat")
		// const startGovernance = map.findObject("Helpers", obj => obj.name === "startGovernance")
		this.addGateway('toGovernance', 'startGovernance', map, () => {
			if (globalEth.assets['AAVE'] > 0) return true
			else throw `You don't have any AAVE in your account`
		})
		if (DEBUG) this.addGateway('toGovernanceCheat', 'startGovernance', map)

		// const toMainland = map.findObject("Helpers", obj => obj.name === "toMainland")
		// const startMainland = map.findObject("Helpers", obj => obj.name === "startMainland")
		this.addGateway('toMainland', 'startMainland', map)

		// Faucet (interaction in handled with action in Player.js)
		const faucet = map.findObject('Helpers', obj => obj.name === 'Faucet')
		this.faucet = this.add.image(faucet.x + 30, faucet.y + 30)
		this.physics.add.existing(this.faucet)
		this.faucet.setDepth(10)
		// this.faucet = this.add.actionnable(
		//                     ()=> {window.open("https://faucet.matic.network/")},
		//                     faucet.x+30,faucet.y+30,
		//                 )

		//// Floating tokens
		this.poolTokensGroup = this.physics.add.group()
		// this.physics.add.collider(this.poolTokensGroup, this.layers[0])
		// In the faucet
		for (let i = 0; i < 2; i++) {
			let ftk = this.add.floatingCrypto(faucet.x + 30 + 40 * i, faucet.y + 30 + 20 * i, 'MATIC')
			this.poolTokensGroup.add(ftk)
		}
		// In the liquidity pool

		const DAIPool = map.findObject('Helpers', obj => obj.name === 'DaiPool')
		// this.AAVEpool = this.add.actionnable(
		//     x => {
		//         globalGame.scene.getScene('interfaceScene').openTransactionDialog("Deposit", 1581, 'outsideTiles', "Deposit")
		//     },
		//     DAIPool.x+30, DAIPool.y+30
		// )

		// this.DAIPool = this.add.image()
		// this.actionnableGroup.add(this.DAIPool)
		// DAIPool.actionned =
		// }
		// this.physics.add.existing(this.DAIPool)

		for (const token in cryptos) {
			if (Object.hasOwnProperty.call(cryptos, token)) {
				const element = cryptos[token]
				let ftk = this.add.floatingCrypto(DAIPool.x, DAIPool.y + cryptos[token].frame * 2, token)
				this.poolTokensGroup.add(ftk)
			}
		}

		// this.createRandomTransactions = this.time.addEvent({
		//     delay: 4000,
		//     callback: () => {
		//         if (this.poolTokensGroup.children.size < 12) {
		//             const tr = this.add.transaction(9 * 16, 95 * 16)
		//             this.transactions.add(tr)
		//         }
		//     },
		//     loop: true
		// })

		// Add swap cryptos
		this.buyGroup = this.physics.add.group()
		const BuyObjects = map.filterObjects('Helpers', obj => obj.name === 'Buy')
		BuyObjects.forEach(bo => {
			if (DEBUG) console.log(`adding`, bo)
			let token = bo.properties.find(p => p.name == 'token').value

			let buyImage = this.add
				.image(bo.x + 8 - 8, bo.y - 2, 'cryptos', cryptos[token].frame)
				.setScale(0.8)
				.setDepth(5)
			buyImage.token = token
			this.buyGroup.add(buyImage)
		})

		// Add governance items
		// TODO add only after connection

		this.govItems = globalEth.getGovernanceItems() // main data object
		if (DEBUG) console.log(`GOVITEMS`, this.govItems)
		this.proposalsGroup = this.physics.add.group()
		let i = 0 // represent the order in the
		const proposalsObjects = map.filterObjects('Helpers', obj => obj.name === 'Proposal')
		proposalsObjects.forEach(p => {
			if (DEBUG) console.log(`adding proposal`, p)
			let prop = this.add.image(p.x, p.y)
			prop.gameId = p.properties.find(pr => pr.name == 'prop').value
			prop.propId = i
			prop.propData = this.govItems[i++]
			this.proposalsGroup.add(prop)
		})

		this.votesGroup = this.physics.add.group()
		i = 0
		const yaysObjects = map.filterObjects('Helpers', obj => obj.name === 'yay')
		yaysObjects.forEach(p => {
			let vote = this.add.image(p.x, p.y, 'things', 10).setDepth(5)
			if (DEBUG) console.log(`adding this yay object`, p, vote)
			vote.gameId = vote.gameId = p.properties.find(pr => pr.name == 'prop').value
			this.votesGroup.add(vote)
		})
		i = 0
		const naysObjects = map.filterObjects('Helpers', obj => obj.name === 'nay')
		naysObjects.forEach(p => {
			let vote = this.add.image(p.x, p.y, 'things', 11).setDepth(5)
			vote.gameId = vote.gameId = p.properties.find(pr => pr.name == 'prop').value
			this.votesGroup.add(vote)
		})

		const BuyCoffeeObj = map.findObject('Helpers', obj => obj.name === 'BuyCoffee')
		this.BuyCoffee = this.add.image(BuyCoffeeObj.x, BuyCoffeeObj.y)
		this.BuyCoffee.setDepth(5)
		this.physics.add.existing(this.BuyCoffee)

		// Network players logic. Data in globalNetwork.players TODO move both to dedicated object
		this.playersGroup = this.physics.add.group()
		// Basic player collision
		this.physics.add.collider(this.player, this.playersGroup, (p, g) => {
			p.handleBumpyCollision(p, g)
			g.body.setVelocity(0, 0)
		})

		globalEvents.on('playerAdd', id => {
			const newPlayer = this.add.sprite(
				globalNetwork.players[id].x,
				globalNetwork.players[id].y,
				globalNetwork.players[id].char.texture,
				globalNetwork.players[id].char.frame
			)
			this.playersGroup.add(newPlayer)
			newPlayer.setDepth(10)

			newPlayer.playerId = id
			newPlayer.direction = globalNetwork.players[id].dir
			globalNetwork.players[id].sprite = newPlayer
			// console.log(` Network player added ${id}`,globalNetwork.players[id].sprite, `Full list`, globalNetwork.players)
		})

		globalEvents.on('ongoing-transaction', tx => {
			let txSprite = this.add.ethtransaction(this.player.x, this.player.y)
			tx.then(
				async result => {
					console.log({tx})
					await result.wait()
					txSprite.destroy()
				},
				() => {
					console.error(`Tx failed`, tx)
					txSprite.destroy()
				}
			)
			// await tx.wait()
		})
	}

	update(t, dt) {
		if (this.player) {
			this.player.update(this.inputKeys, t, dt)
		}
	}
	// addNetworkPlayer(){}
	// updateNetworkPlayer(){}
	// deleteNetworkPlayer(){}
}
