// import { timeStamp } from "console"
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

export default class PNJ extends Phaser.Physics.Arcade.Sprite{

	constructor(scene, x, y, texture, frame, name,type)
	{
		super(scene, x, y, texture, frame)
		this.name = name
		// If there is no gender provided we randomly assign one
		console.log(type)
		if (type == undefined){
			this.type = TypeArray[Phaser.Math.Between(0, 1)]

		} else {
			this.type = type 
		}

		this.createPNJtalks(scene,texture,frame,name) // ! We assume that talking movement are the next 2 frames
		this.says("hello !")
		// scene.add.existing(this);

	//	scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this)

		// this.moveEvent = scene.time.addEvent({
		// 	delay: 2000,
		// 	callback: () => {
		// 		this.direction = randomDirection(this.direction)
		// 	},
		// 	loop: true
		// })
	}

	createPNJtalks(scene,texture,frame,name){
		console.log("generate PNJTalk",texture, frame, name)
        scene.anims.create({
            key: name+ '-talks',
            frames: scene.anims.generateFrameNumbers(texture, { start: frame, end: frame+2 }),
            frameRate: 5,
            repeat: 1,
            hideOnComplete: false // just to remember the option
        })
	}
	says(scene,message){
		// Emit talking event
		console.log(this.name+":"+message)
		// console.log(scene)
		//scene.anims.play(name+ '-talks')
		//scene.events.emit('talks', "hello! ")
	}

	destroy(fromScene){
		this.moveEvent.destroy()
		super.destroy(fromScene)
	}
	handlePlayerCollision(player, obj ){
		this.isHurt()
		// Little jump in the opposite direction
		this.x= this.x + Math.round((this.x - player.x)/2)
		this.y= this.y + Math.round((this.y - player.y)/2)
	}

	handleTileCollision(obj, tile)
	{
		if (obj !== this) { // we are not concerned
			return
		}
		// this.direction = randomDirection(this.direction)
	}

	preUpdate(t, dt)
	{
		super.preUpdate(t, dt)

		// const speed = 50

		// switch (this.direction)
		// {
		// 	case Direction.UP:
		// 		this.setVelocity(0, -speed)
		// 		break

		// 	case Direction.DOWN:
		// 		this.setVelocity(0, speed)
		// 		break

		// 	case Direction.LEFT:
		// 		this.setVelocity(-speed, 0)
		// 		break

		// 	case Direction.RIGHT:
		// 		this.setVelocity(speed, 0)
		// 		break
		// }
	}

	isHurt(){
        this.tint = 0xff0000
        setTimeout(() => {
            this.clearTint()
        }, 500);
        this.body.setVelocity(0,0)
		this.says(this,'Ouille!')
		this.scene.sound.play(this.type+"-hurt")
    }

}


Phaser.GameObjects.GameObjectFactory.register('pnj', function ( x, y, texture, frame, name) {
	var sprite = new PNJ(this.scene, x, y, texture, frame, name)

	this.displayList.add(sprite)
	this.updateList.add(sprite)

	this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
   
    sprite.setDepth(10);
    
	sprite.body.setSize(10,14,true) 
	sprite.body.setMaxVelocity(50,50)
	sprite.body.setMass(10000)
	sprite.body.setCollideWorldBounds()

	// this.scene.physics.add.collider(scene.player, this.pnj,  (p, j) => {
	// 	// this.player.setVelocity(0);    
	// 	this.pnj.gmal(j)
	// 	// this.pnj.setVelocity(0,0);
	// }, null, this);

	return sprite

	//Archive from gamescene
	// pnj.body.setSize(10,14,true) 
	// pnj.body.setMaxVelocity(50,50)
	// pnj.body.setMass(10000)
	// pnj.body.setCollideWorldBounds()
})
