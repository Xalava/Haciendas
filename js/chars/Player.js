import {Directions, stdVelocity} from '../helpers/directions.js'
import globalEvents from '../helpers/globalEvents.js'
import {cryptos} from '../helpers/cryptos.js'
import Quests from '../helpers/quests.js'

export default class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, char) {
		super(scene, x, y, char.texture, char.frame)
		this.anims.play(char.name + '-idle-down')
		this.char = char
		this.direction = Directions.DOWN
		this.ongoingAction = false
		this.timerSinceReport = 0
		this.isAG = false
		// Complement for mouse control
		// this.scene.input.on('pointerdown',
		//     pointer => { if(pointer.worldX < this.x){
		//         this.direction = Directions.LEFT
		//         this.body.setVelocityX(-stdVelocity)
		//     this.anims.play(this.char.name+'-left', true)
		//     }}
		// )
		this.quests = new Quests()
	}

	action(sprite, frame) {
		const actionSprite = this.scene.add.image(
			this.x + 13 * this.direction.x,
			this.y + 14 * this.direction.y,
			sprite,
			frame
		)
		actionSprite.setDepth(15)
		if (frame == undefined) {
			actionSprite.actionType = -1
		} else {
			actionSprite.actionType = frame
		}
		this.scene.physics.add.existing(actionSprite)
		return actionSprite
	}

	handleBumpyCollision(player, obj) {
		this.x = this.x + Math.round((this.x - obj.x) / 2)
		this.y = this.y + Math.round((this.y - obj.y) / 2)
	}

	update(inputKeys, t, dt) {
		// if (document.activeElement === globalGame.scene.getScene('interfaceScene').chatInput) {
		// 	globalGame.scene.getScene('interfaceScene').chatInput.value = this.chatInput.value + 'X'
		// 	console.log('INPUT INTERCEPTION')
		// 	return
		// } 
		// console.log(this.isAG)
		// console.log(inputKeys, t, dt)
		if (inputKeys.left.isDown || inputKeys.leftA.isDown) {
			this.body.setVelocityX(-stdVelocity)
			if (!this.isAG) this.anims.play(this.char.name + '-left', true)
			// TODO (maybe)
			// this.play('steps')
			// var music = this.sound.add('steps')
			// music.play()
			if (this.direction != Directions.LEFT && globalNetwork)
				globalNetwork.reportPosition(this.x, this.y, Directions.LEFT, true)
			this.timerSinceReport = 0
			this.direction = Directions.LEFT
		} else if (inputKeys.right.isDown || inputKeys.rightA.isDown) {
			this.body.setVelocityX(stdVelocity)
			if (!this.isAG) this.anims.play(this.char.name + '-right', true)
			if (this.direction != Directions.RIGHT && globalNetwork)
				globalNetwork.reportPosition(this.x, this.y, Directions.RIGHT, true)
			this.timerSinceReport = 0
			this.direction = Directions.RIGHT
		} else if (inputKeys.up.isDown || inputKeys.upA.isDown) {
			this.body.setVelocityY(-stdVelocity)
			if (!this.isAG) this.anims.play(this.char.name + '-up', true)
			if (this.direction != Directions.UP && globalNetwork)
				globalNetwork.reportPosition(this.x, this.y, Directions.UP, true)
			this.timerSinceReport = 0
			this.direction = Directions.UP
		} else if (inputKeys.down.isDown || inputKeys.downA.isDown) {
			this.body.setVelocityY(stdVelocity)
			if (!this.isAG) this.anims.play(this.char.name + '-down', true)
			// ALT: this.flipX = false
			if (this.direction != Directions.DOWN && globalNetwork)
				globalNetwork.reportPosition(this.x, this.y, Directions.DOWN, true)
			this.timerSinceReport = 0
			this.direction = Directions.DOWN
		} else {
			if (this.body.speed != 0) {
				if (globalNetwork) globalNetwork.reportPosition(this.x, this.y, this.direction, false)
				this.timerSinceReport = 0
				this.body.setVelocityX(0)
				this.body.setVelocityY(0)
				if (this.anims.currentAnim && this.anims.currentAnim.key.substring(0, 4) !== 'idle') {
					if (!this.isAG) this.anims.play(this.char.name + '-idle-' + this.direction.name)
				}
			}
		}
		this.timerSinceReport += dt
		// console.log(dt)
		// Not a great solution, but avoid large discrepencies. It should be every 4 steps on average
		if ((this.timerSinceReport = 0 > 60)) {
			globalNetwork.reportPosition(this.x, this.y, this.direction, this.body.speed > 0 ? true : false)
		}

		// should be moved to interface to not catch chat space
		if (Phaser.Input.Keyboard.JustDown(inputKeys.space)) {
			// alt: inputKeys.space.Down
			// if (this.ongoingAction == false ){
			//     this.ongoingAction = true

			this.triggered = false
			if (DEBUG)console.log(`?`,this.quests)
			if (this.quests['catch-transactions'].isActive) {
				console.log('capture?')
				// We initialise this flag to allow one capture only
				const actionNet = this.action('actions', 0)

				//// Transactions interactions
				this.scene.physics.add.collider(actionNet, this.scene.transactions.getChildren(), (a, t) => {
					// The collision only works once per action
					if (this.triggered == false) {
						this.triggered = true
						console.log('We caught a transaction')
						if (t.isValid) {
							this.scene.transactionsCaptured += 1
							globalEvents.emit('transaction-captured', this.scene.transactionsCaptured)
							this.scene.sound.play('swing')
						} else {
							this.scene.transactionsCaptured = 0
							this.scene.sound.play('poo')
							this.scene.cameras.main.shake(100) // Alt: flash, fade
						}
						// Victory case
						if (this.scene.transactionsCaptured >= 5) {
							globalEvents.emit('catch-transactions-complete')
						}
						t.destroy()
					}
				})

				// PNJ interaction

				// Collisions between the actions and the NPCs
				this.scene.physics.add.collider(actionNet, this.scene.pnjsGroup.getChildren(), (a, p) => {
					if (this.triggered == false) {
						p.says("It doesn't work on me!")
						p.isHurt
						this.triggered = true
					}
				})

				setTimeout(() => {
					actionNet.destroy()
					// this.ongoingAction = false
				}, 650)
			} else {
				//// Generic action - Sprite will be transparent
				const actionSprite = this.action()
				// this.scene.actionsGroup.add(actionSprite)

				// Mining happens in the mine object

				console.log(`object launched and triggered is ${this.triggered}`)
				// Generic actionnable object
				this.scene.physics.add.overlap(actionSprite, this.scene.actionnableGroup, (as, a) => {
					if (this.triggered == false) {
						this.triggered = true
						//Action type is send. Currently : -1 for default action, 0 for net
						a.actionned(as.actionType)
					}
				})
				// Generic NPC interaction
				this.scene.physics.add.overlap(actionSprite, this.scene.pnjsGroup.getChildren(), (a, p) => {
					if (this.triggered == false) {
						console.log(`action contacted an NPC`)
						this.triggered = true
						p.contact()
					}
				})

				this.scene.physics.add.overlap(actionSprite, this.scene.faucet, (f, p) => {
					if (this.triggered == false) {
						window.open('https://faucet.matic.network/')
						this.triggered = true
					}
				})

				this.scene.physics.add.overlap(actionSprite, this.scene.playersGroup, (a, p) => {
					if (this.triggered == false) {
						globalGame.scene
							.getScene('interfaceScene')
							.openTransactionDialog(
								'Send',
								globalNetwork.players[p.playerId].char.frame,
								globalNetwork.players[p.playerId].address,
								globalNetwork.players[p.playerId].name
							)
						this.triggered = true
					}
				})
				this.scene.physics.add.overlap(actionSprite, this.scene.minesGroup.getChildren(), (a, m) => {
					if (this.triggered == false) {
						m.hashing()
						this.triggered = true
					}
				})


				this.scene.physics.add.overlap(
					actionSprite,
					this.scene.BuyCoffee,
					(a, p) => {
						if (this.triggered == false) {
							this.scene.sound.play('machine')
							if (globalEth) globalEth.buyCoffee()
							else globalEvents.emit('says', 'You must get connected first. Go see the fox')
							this.triggered = true
						}
					},
					null,
					this
				)

				this.scene.physics.add.overlap(
					actionSprite,
					this.scene.buyGroup.getChildren(),
					(a, p) => {
						if (globalEth) {
							if (this.triggered == false) {
								this.triggered = true
								if (!globalEth.account) {
									globalEvents.emit('says', 'You must get connected first. Go see the fox')
								} else if (globalEth) {
									globalGame.scene
										.getScene('interfaceScene')
										.openTransactionDialog(
											'Swap',
											cryptos['DAI'].frame,
											cryptos['DAI'].kovan.token,
											'Dai'
										)
									// globalEth.swapETHforDAI(1)
								} else {
									globalEvents.emit('says', 'You must get connected first. Go see the fox')
									this.triggered = true
								}
							}
						}
					},
					null,
					this
				)

				this.scene.physics.add.overlap(
					actionSprite,
					this.scene.proposalsGroup.getChildren(),
					(a, p) => {
						if (this.triggered == false) {
							this.triggered = true
							console.log(p)
							globalEvents.emit('says', p.propData.name)
						}
					},
					null,
					this
				)

				setTimeout(() => {
					actionSprite.destroy()
					this.triggered = false
				}, 650)
			}
		}
	}
}

Phaser.GameObjects.GameObjectFactory.register('player', function (x, y, char) {
	var sprite = new Player(this.scene, x, y, char)

	this.displayList.add(sprite)
	this.updateList.add(sprite)

	this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
	// this.physics.add.existing(this.player) (as it was in the scene)

	sprite.setDepth(6) // Tree level, should be just below

	sprite.body.setMass(10)
	sprite.body.setBounce(0.1)
	sprite.body.setSize(8, 12, true) // Smaller collision surface for our character (x,y, centered)
	// altsprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8)
	sprite.body.setCollideWorldBounds()

	// global group to add collisions from objects unless we move to a mouse interface first
	sprite.scene.actionsGroup = sprite.scene.physics.add.group()
	return sprite
})
