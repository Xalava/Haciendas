import globalEvents from "../helpers/globalEvents.js"
import EtherHelp from "../helpers/EtherHelp.js"

export const Type = {
	MALE: 0,
	FEMALE: 1,
	CYBORG: 2,
}

export const TypeArray = [
	"MALE",
	"FEMALE",
	"CYBORG",
]

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
		console.log(this.name, "type was", type, "and now", this.type)

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
		globalEvents.emit('says', "[i]" + this.name + "[/i]: " + message)
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
		if (obj !== this) { // we are not concerned
			return
		}
		// this.direction = randomDirection(this.direction)
	}

	contact() {
		if (this.name == "Fox") {
			this.says("Welcome stranger. You will learn to set up your wallet. Create or validate your account and I will give you Reales, the ingame currency ")

			// setTimeout(async () => {
				globalEth.initialiseMetaMask().then(async () => {
						if (DEBUG)
							console.log(globalEth)
						const isparticipant = await globalEth.realContract.participants(globalEth.account)
						const ethBalance = await globalEth.getETHBalance()

						if (isparticipant) {
							this.says("Sly as a fox I see, you have already joined!")
							globalEvents.emit('real-transaction', 0)

						} else if (!ethBalance){
							this.says("You seem to miss Matic or ETH. If you go the lake and press spacebar, you might open a faucet")
						} else {
							this.says("Great! Let me send 12 reales to you at" + globalEth.account)
							globalEth.participate().then(() => {
								globalEvents.emit('real-transaction', 12)
								this.says("Have fun with this! You can go to the market in village and exchange them for USDC with them or buy a coffee! ")
							})
						}
					})
					.catch((err) => console.log(err))
			// }, 2800);

		} else if (this.name == "Dexie") {
			this.says("Welcome to our decentralised exchange ! You can buy USDC here. The rate is 1 Real = 1/100 Ether ~ 3 USDC")

		} else if (this.name == "Unicorn") {
			this.says("I'm a Unicorn. What do you expect?")

		} else if (this.name == "Kevin") {
			this.says("Welcome The Block Café, a working café in Lisbon. Buy a coffee at the panel for 1 USDC")

		} else if (this.name == "Andrés"){
			if (this.quest != "catch transactions"){
				this.says("Bienvenido. If you want to learn how to learn the basics of blockhain, grap the net.")
			} else {
				this.says("Go to the mempool in the west and catch five green transactions")
			}
		} else {
			this.says("Hello!")
		}
	}

	preUpdate(t, dt) {
		super.preUpdate(t, dt)

	}

	isHurt() {
		this.tint = 0xff0000
		setTimeout(() => {
			this.clearTint()
		}, 500);
		this.body.setVelocity(0, 0)
		this.says('Hey! That hurts!')
		this.scene.sound.play(this.type + "-hurt")
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
