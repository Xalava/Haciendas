import globalEvents from '../helpers/globalEvents.js'
import EtherHelp from '../helpers/EtherHelp.js'

export const Type = {
	MALE: 0,
	FEMALE: 1,
	CYBORG: 2
}

export const TypeArray = ['MALE', 'FEMALE', 'CYBORG']

// PNJ is French for NPC.
export default class PNJ extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture, frame, name, type) {
		super(scene, x, y, texture, frame)
		this.name = name
		// If there is no gender provided we randomly assign one
		if (type == '') {
			this.type = TypeArray[Phaser.Math.Between(0, 1)]
		} else {
			this.type = type
		}
		if (DEBUG) console.log(`🙋`, this.name, `type was`, type, `and now`, this.type)

		this.createPNJtalks(scene, texture, frame, name) // ! We assume that talking movement are the next 2 frames
		// this.says("hello !")
		// scene.add.existing(this)

		//	scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this)

		// this.moveEvent = scene.time.addEvent({
		// 	delay: 2000,
		// 	callback: () => {
		// 		this.direction = randomDirection(this.direction)
		// 	},
		// 	loop: true
		// })
	}

	createPNJtalks(scene, texture, frame, name) {
		scene.anims.create({
			key: name + '-talks',
			frames: scene.anims.generateFrameNumbers(texture, {
				start: frame,
				end: frame + 2
			}),
			frameRate: 5,
			repeat: 1,
			hideOnComplete: false // just to remember the option
		})
	}
	says(message) {
		this.anims.play(this.name + '-talks')
		// Emits talking event
		globalEvents.emit('says', '[i]' + this.name + '[/i]: ' + message)
	}

	destroy(fromScene) {
		// this.moveEvent.destroy()
		super.destroy(fromScene)
	}

	handlePlayerCollision(player, obj) {
		this.isHurt()
		// Little jump in the opposite direction
		this.x = this.x + Math.round((this.x - player.x) / 2)
		this.y = this.y + Math.round((this.y - player.y) / 2)
	}

	handleTileCollision(obj, tile) {
		if (obj !== this) {
			// we are not concerned
			return
		}
		// this.direction = randomDirection(this.direction)
	}

	contact() {
		if (DEBUG) console.log(`Contact with`, this.name)
		switch (this.name) {
			case 'Fox':
				this.says(`Welcome stranger ! How about connecting your wallet?`)
				this.scene.sound.play('Fox-Welcome')

				setTimeout(async () => {
					globalEth
						.initialiseMetaMask()
						.then(async () => {
							// TODO : Registration in the game Smart Contract
							// const isparticipant = await globalEth.realContract.participants(globalEth.account)
							// if (isparticipant) {
							// 	this.says("Sly as a fox I see, you have already joined!")
							// 	globalEvents.emit('real-transaction', 0)
							const ethBalance = await globalEth.getETHBalance()

							if (globalEth.network.name != "kovan"){
								this.says(`Please connect to Kovan testnet and talk to me again.`)
							} else {
								if (!ethBalance) {
									this.says(
										'You seem to miss basic assets. Go the lake and press spacebar to open a faucet.'
									)
								} else {
									if (globalEth.ename) {
										this.says(
											`I see that you have already registered a name! Welcome ${globalEth.ename}.`
										)
									} else {
										this.says(`Have a look to the market in the East to exchange some of your tokens.`)
									}									
									// this.says("Great! Let me send 12 reales to you at" + globalEth.account)
									// globalEth.participate().then(() => {
									// 	globalEvents.emit('real-transaction', 12)
									// 	this.says("Have fun with this! You can go to the market in village and exchange them for USDC with them or buy a coffee! ")
									// })
								}
							}
						})
						.catch(err => {
							this.says(
								`I can't. Please use a browser wallet, such as Brave or MetaMask. Contact us if you have a prefered option.`
							)
						})
				}, 2800)
				break
			case 'Dexie':
				// this.says("Welcome to our decentralised exchange ! You can buy USDC here. The rate is 1 Real = 1/100 Ether ~ 3 USDC")
				this.says(
					`Welcome to our decentralised exchange ! You can buy DAI on your left and AAVE on your right. [i]It might not be fully operationnal yet. Join our Discord or follow us on Twitter to be update!.[/i]`
				)
				this.scene.sound.play('Dexie-Welcome')

				break
			case 'Unicorn':
				this.says(`I'm a Unicorn. What did you expect?`)
				this.scene.sound.play('glitter')
				break
			case 'Kevin':
				this.says(`Bem-vindo to The Block, a working café in Lisbon. Buy a coffee at the panel for 1 USDC`)
				this.scene.sound.play('Kevin-Welcome')
				break
			case 'engineer':
				this.says(`I've been optimising this mining hardware for years. Check it out!`)
				break
			case 'Laura':
				this.says(`¡Hola!\nTalk to the fisherman in the house North from here to learn fundamentals or to the Fox near the lake behind me to connect a wallet.`)
				this.scene.sound.play('Laura-Hola')
				break
			case 'Diara':
				this.says(`Welcome to our art gallery. Click on an art piece to see it better.`)
				break
			case 'Andrés':
				if (this.scene.player.quests['catch-transactions'] && this.scene.player.quests['catch-transactions'].isActive) {
					this.says(`Go to the mempool in the West and catch five green transactions using spacebar or the action button on mobiles`)
				} else {
					this.says(
						`Bienvenido! To learn the basics of blockchains, grab the net next to me and let's make a block!`
					)
					this.scene.sound.play('Andres-Bienvenido')

				}
				break
			case 'Guide':
				this.says(`Welcome to AAVE! You can deposit asset in the pool, take a loan or participate in the governance building`)
				this.scene.sound.play('Ghost-Welcome')

				break
			case 'GuideGov':
				this.says(`You are the chosen one... \n\n\nI'm kidding. Eternity is long, AAVE owner. Read proposals on the wall, discuss and vote.`)
				this.scene.sound.play('GhostGov-Welcome')
				setTimeout(() => {
					globalGame.scene.getScene('interfaceScene').jitsiChat()

				}, 10000);
				break
			case 'LoanOfficer':
				this.says(`Welcome! You need to make a deposit into the pool to be able to take a loan.`)
				break
			case 'matoken.eth':
				//TODO check if name is registered
				this.says(`Hi! let me open for you the page to register a name. Preferably use Ropsten.`)
				setTimeout(() => {
					window.open('https://app.ens.domains/')
				}, 3000);
				break
			default:
				this.says(`Hello!`)
				break
		}
	}

	preUpdate(t, dt) {
		super.preUpdate(t, dt)
	}

	isHurt() {
		this.tint = 0xff0000
		setTimeout(() => {
			this.clearTint()
		}, 500)
		this.body.setVelocity(0, 0)
		this.says(`Hey! That hurts!`)
		this.scene.sound.play(this.type + '-hurt')
	}
}

Phaser.GameObjects.GameObjectFactory.register('pnj', function (x, y, texture, frame, name, type) {
	var sprite = new PNJ(this.scene, x, y, texture, frame, name, type)

	this.displayList.add(sprite)
	this.updateList.add(sprite)

	this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

	sprite.setDepth(10)

	sprite.body.setSize(10, 14, true)
	sprite.body.setMaxVelocity(50, 50)
	sprite.body.setMass(10000)
	sprite.body.setCollideWorldBounds()

	return sprite
})
