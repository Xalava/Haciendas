import {Directions, stdVelocity} from '../helpers/directions.js'
import globalEvents from '../helpers/globalEvents.js'

export default class networkPlayer extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture, frame, direction) {
		super(scene, x, y, texture, frame)
		this.direction = direction
	}

    handleBumpyCollision(player, obj) {
		this.x = this.x + Math.round((this.x - obj.x) / 2)
		this.y = this.y + Math.round((this.y - obj.y) / 2)
		this.tint = 0xff0000
		setTimeout(() => {
			this.clearTint()
		}, 500)
	}
	preUpdate(t, dt) {
		super.preUpdate(t, dt)
	}

	update( t, dt) {
        super.update(t, dt)
    }
}

Phaser.GameObjects.GameObjectFactory.register('networkPlayer', function (x, y, texture, frame, direction,id) {
    // TODO harmonize [char as for Player vs texture and frame ]
	var sprite = new networkPlayer(this.scene, x, y, texture, frame, direction)

	this.displayList.add(sprite)
	this.updateList.add(sprite)

    // sprite.playerId = id

	this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

	sprite.setDepth(6) // Tree level, should be just below
    
    sprite.body.setMaxVelocity(50, 50)
	sprite.body.setMass(10)
	sprite.body.setBounce(0.1)
	sprite.body.setSize(8, 12, true) // Smaller collision surface for our character (x,y, centered)
	// altsprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8)
	sprite.body.setCollideWorldBounds()

	return sprite
})
