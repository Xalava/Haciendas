export default class PreloaderScene extends Phaser.Scene {
    constructor(){
        super("preloaderScene")
    }

    preload () {
        this.load.spritesheet('characters', 
            'assets/characters.png',
            { frameWidth: 16, frameHeight: 16 }
        )        



		    this.load.image('outsideTiles', 'maps/Outside7.png')
				this.load.tilemapTiledJSON('miningMap', 'maps/mining.json')
    }

    create () {
        console.log("End preloading, launching welcome")
		this.scene.start('welcomeScene')

    }

    update () {

    }
}
