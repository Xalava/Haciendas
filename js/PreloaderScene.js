import BaseScene from "./BaseScene.js"

export default class PreloaderScene extends BaseScene {
    constructor(){
        super("preloaderScene")
    }

    preload () {
        this.load.spritesheet('characters', 
            'assets/characters.png',
            { frameWidth: 16, frameHeight: 16 }
        )        
        this.load.spritesheet('things', 
            'assets/things.png',
            { frameWidth: 16, frameHeight: 16 }
        )
        this.load.spritesheet('things2', 
        'assets/things2.png',
        { frameWidth: 16, frameHeight: 16 }
        )  
        this.load.spritesheet('things-tall', 
        'assets/things-tall.png',
        { frameWidth: 16, frameHeight: 32 }
        )       
        this.load.spritesheet('cryptos', 
            'assets/cryptos.png',
            { frameWidth: 16, frameHeight: 16 }
        )
        this.load.spritesheet('pnj', 
            'assets/pnj.png',
            { frameWidth: 16, frameHeight: 16 }
        )
        this.load.spritesheet('actions', 
            'assets/actions.png',
            { frameWidth: 16, frameHeight: 16 }
        )
        
        this.load.image('outsideTiles', 'maps/Outside7.png')
        this.load.tilemapTiledJSON('miningMap', 'maps/mining.json')      

        this.load.audio('machine', 'assets/audio/net.wav')
        this.load.audio('MALE-hurt', 'assets/audio/male-hit.ogg')
        this.load.audio('FEMALE-hurt', 'assets/audio/female-hit.ogg')
        this.load.audio('holy','assets/audio/holy.ogg')
        this.load.audio('swing','assets/audio/swing.wav')

        // this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');

        // Helper
        //this.canvas = this.sys.game.canvas
    }

    create () {
        console.log("End preloading, launching welcome")
        // this.scene.start('gameScene')
        this.scene.start('welcomeScene')

    }

    update () {

    }
}