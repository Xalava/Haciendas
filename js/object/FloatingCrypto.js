import {Directions, randomDirection} from '../helpers/directions.js'
import {cryptos} from '../helpers/cryptos.js'

export default class FloatingCrypto extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, token) {
		if (DEBUG) console.log(`creating`, token)

		// TODO update with current ratio in liquidity pool

		super(scene, x, y, 'cryptos', cryptos[token].frame)

		// this.direction = Directions.LEFT
		this.direction = 1
		this.speed = Math.random() * 4 + 5 //*3 // For lines

		// scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this)
		// For lines
		// this.moveEvent = scene.time.addEvent({
		// 	delay: Phaser.Math.Between(500, 3000),
		// 	callback: () => {
		// 		this.direction = randomDirection(this.direction.i)
		// 		this.setVelocity(this.speed * this.direction.x, this.speed * this.direction.y)

		// 	},
		// 	loop: true
		// })
	}

	destroy(fromScene) {
		this.body.enable = false
		this.body.stop()
		setTimeout(() => {
			// for lines
			// this.moveEvent.destroy()

			super.destroy(fromScene)
		}, 200)
	}

	handleTileCollision() {
		// console.log(`tile collision for floating object`)
		//for waves
		this.direction = -this.direction
		// for lines
		// this.setVelocity(this.speed * this.direction.x, this.speed * this.direction.y)
	}

	preUpdate(t, dt) {
		super.preUpdate(t, dt)
		// for waves
		this.setVelocity(this.speed * this.direction, 10 * Math.sin(t / 200 + this.speed * 100))
	}
	// update(t, dt) {
	// 	super.update(t, dt)
	// }
}

// texture and frame are optionnal/useless, the are predifined in this object
Phaser.GameObjects.GameObjectFactory.register('floatingCrypto', function (x, y, token) {
	var sprite = new FloatingCrypto(this.scene, x, y, token)

	this.displayList.add(sprite)
	this.updateList.add(sprite)

	this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

	sprite.setDepth(9)
	sprite.setScale(0.8)

	sprite.body.setSize(14, 14, true)
	sprite.body.setMaxVelocity(50, 50)
	sprite.body.setMass(20)
	sprite.body.setCollideWorldBounds()
	this.scene.physics.add.collider(sprite, this.scene.layers[0], (s, t) => s.handleTileCollision(s, t))

	return sprite
})
