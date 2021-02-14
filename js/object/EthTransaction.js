import {Directions, randomDirection} from "../helpers/directions.js"


export default class EthTransaction extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, texture, frame) {

		const isValid = true //Math.random() > 0.15
		const originX = x
		const originY = y
		x= x
		y= y-25 // It will be above the head of the player
		if (isValid) {
			super(scene, x, y, "things2", 13)
			this.anims.play('transaction-valid')

		} else {
			super(scene, x, y, "things2", 15)
			this.anims.play('transaction-invalid')

		}
		this.isValid = isValid
		// this.direction = Directions.DOWN
		this.speed = 30 //Phaser.Math.Between(40, 70)

		// scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this)

		// this.moveEvent = scene.time.addEvent({
		// 	delay: Phaser.Math.Between(1000, 5000),
		// 	callback: () => {
		// 		this.direction = randomDirection(this.direction.i)
		// 		if (this.isValid) {
		// 			this.anims.play('transaction-valid')

		// 		} else {
		// 			this.anims.play('transaction-invalid')

		// 		}
		// 	},
		// 	loop: true
		// })
	}

	destroy(fromScene) {
		// TODO : Change animation if ttransaction if valid, play a sound maybe
		this.body.enable = false
		this.body.stop() // dramatic stop
		setTimeout(() => {
			// this.moveEvent.destroy()

			super.destroy(fromScene)
		}, 300);
	}

	handleTileCollision(obj, tile) {

		if (obj !== this) {
			return
		}

		// this.direction = randomDirection(this.direction)
	}

	preUpdate(t, dt) {
		if (this.body.enable) { // This stops the transaction when captured

			super.preUpdate(t, dt)

			// this.setVelocity(this.speed * this.direction.x, this.speed * this.direction.y)
			this.setVelocity(this.speed * Math.cos((t)/(200)), this.speed * Math.sin((t)/(200))  )
		}


	}

	// update(t, dt) {
	// 	super.update(t, dt)
	// 	this.setX(this.originX + 40*sin(t))
	// 	this.setY(this.originY + 40*sin(t))
	// }
	
}

// texture and frame are optionnal/useless, the are predifined in this object
Phaser.GameObjects.GameObjectFactory.register('ethtransaction', function (x, y, texture, frame) {
	var sprite = new EthTransaction(this.scene, x, y, texture, frame)

	this.displayList.add(sprite)
	this.updateList.add(sprite)

	this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

	sprite.setDepth(9)

	sprite.body.setSize(10, 14, true)
	sprite.body.setMaxVelocity(50, 50)
	sprite.body.setMass(20)
	sprite.body.setCollideWorldBounds()
	// this.scene.physics.add.collider(sprite, this.scene.layers[6],sprite.handleTileCollision)

	return sprite
})