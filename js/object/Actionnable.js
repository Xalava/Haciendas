export default class Actionnable extends Phaser.Physics.Arcade.Image {

	constructor(scene, x, y, texture, frame, actionned) {
		super(scene, x, y, texture, frame)
		this.actionned = actionned
	}
}
Phaser.GameObjects.GameObjectFactory.register('actionnable', function (actionned, x, y,  texture, frame  ) {
	var sprite = new Actionnable(this.scene, x, y,  texture, frame,  actionned)

	this.displayList.add(sprite)
	this.updateList.add(sprite)

	sprite.setDepth(5)

	// Add to actionnable group for collision handling (and the phyics engine at the same time)
	this.scene.actionnableGroup.add(sprite)
	sprite.body.setCollideWorldBounds()
	return sprite
})