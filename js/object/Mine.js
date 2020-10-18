export default class Mine extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture, frame)
	}

	destroy(fromScene) {
		super.destroy(fromScene)
	}

	preUpdate(t, dt) {
			super.preUpdate(t, dt)

	}

	actionMine(pointer, object) {

		console.log("Mine actionned")
		object.anims.play('mineMove', true)

		var music = this.sound.add('machine');
		music.play();
		this.play("machine")
	}
	hashing(){
		
	}
}

// texture and frame are optionnal/useless, the are predifined in this object
Phaser.GameObjects.GameObjectFactory.register('mine', function (x, y, texture, frame) {

	var sprite = new Mine(this.scene, x, y, 'things', 51)

	this.displayList.add(sprite)
	this.updateList.add(sprite)

	this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)// Should be STATIC_BODY per the documentation
	sprite.body.immovable = true// as the line above does not seem to work
	//this.scene.physics.add.existing(sprite, true) // static = true
	sprite.setDepth(10);

	return sprite
})