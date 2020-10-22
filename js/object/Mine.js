import globalEvents from "../helpers/globalEvents.js"

export default class Mine extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture, frame)
		this.triggered = false
	}

	destroy(fromScene) {
		super.destroy(fromScene)
	}

	preUpdate(t, dt) {
			super.preUpdate(t, dt)

	}

	displayHash(result, color){
		let txt = this.scene.add.text(this.x, this.y, result, { fontFamily: 'courrier', color: color, fontSize: '12px',}).setDepth(25)
		setTimeout(() => {
			txt.destroy()
		}, 800);3
		
	}
	hashing(s, a){
		s.anims.play('mineMove', true)
		if(s.triggered == false){
			s.triggered=true
			s.scene.sound.play("machine")
			if(DEBUG)
				console.log("Mine hashing", this)		
			this.play('mineMove')
			const result =  Phaser.Math.Between(0, 18000)
			if (result < 9000){
				this.displayHash(result, 'green')
				if(this.scene.quest == "mine a block"){
					globalEvents.emit("mining-complete")
				}
				const block = this.scene.add.sprite(this.x,this.y+20,'things-tall',0).setDepth(20)
				block.play('block')
			} else {
				this.displayHash(result, 'red')
			}
		}
		setTimeout(() => {
			this.triggered=false
		}, 700)
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
	sprite.setDepth(9);
	if(DEBUG)
		console.log("creating mine")
	this.scene.physics.add.overlap(sprite, this.scene.actionsGroup, (s,a)=>sprite.hashing(s,a))

	return sprite
})