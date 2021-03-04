import {Directions, randomDirection} from '../helpers/directions.js'

export default class Transaction extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture, frame) {
		const isValid = Math.random() > 0.15

		if (isValid) {
			super(scene, x, y, 'things2', 13)
			this.anims.play('transaction-valid')
		} else {
			super(scene, x, y, 'things2', 15)
			this.anims.play('transaction-invalid')
		}
		this.isValid = isValid
		this.direction = Directions.DOWN
		this.speed = Phaser.Math.Between(40, 70)

		scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this)

		this.moveEvent = scene.time.addEvent({
			delay: Phaser.Math.Between(1000, 5000),
			callback: () => {
				this.direction = randomDirection(this.direction.i)
				if (this.isValid) {
					this.anims.play('transaction-valid')
				} else {
					this.anims.play('transaction-invalid')
				}
			},
			loop: true
		})
	}

	destroy(fromScene) {
		this.body.enable = false
		this.body.stop()
		setTimeout(() => {
			this.moveEvent.destroy()

			super.destroy(fromScene)
		}, 200)
	}

	handleTileCollision(obj, tile) {
		if (obj !== this) {
			return
		}

		this.direction = randomDirection(this.direction)
	}

	preUpdate(t, dt) {
		if (this.body.enable) {
			// This stops the transaction when captured
			super.preUpdate(t, dt)
			this.setVelocity(this.speed * this.direction.x, this.speed * this.direction.y)
		}
	}
}

// texture and frame are optionnal/useless, the are predifined in this object
Phaser.GameObjects.GameObjectFactory.register('transaction', function (x, y, texture, frame) {
	var sprite = new Transaction(this.scene, x, y, texture, frame)

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
