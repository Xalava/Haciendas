export default class PreloaderScene  extends Phaser.Scene {
    constructor() {
        super("preloaderScene")
    }

    preload() {
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
        this.load.spritesheet('real',
            'assets/real.png',
            { frameWidth: 16, frameHeight: 16 }
        )

        this.load.image('outsideTiles', 'maps/Outside7.png')
        this.load.image('slot', 'assets/slot.png')
        this.load.image('coffee', 'assets/coffee.png')
        this.load.svg('myag', 'assets/myag.svg')

        // this.load.tilemapTiledJSON('miningMap', 'maps/mining.json')
        // this.load.tilemapTiledJSON('marketMap', 'maps/market.json')
        this.load.tilemapTiledJSON('majorMap', 'maps/major.json')

        this.load.audio('machine', 'assets/audio/net.wav')
        this.load.audio('MALE-hurt', 'assets/audio/male-hit.ogg')
        this.load.audio('FEMALE-hurt', 'assets/audio/female-hit.ogg')
        this.load.audio('holy','assets/audio/holy.ogg')
        this.load.audio('swing','assets/audio/swing.wav')
        this.load.audio('gold','assets/audio/gold.ogg')

        this.load.audio('guitara','assets/audio/AsIFigure.mp3')
        this.load.audio('notas','assets/audio/AsIFigureShort.mp3')
    }

    create () {
        // this.load.once('complete', function(){
            console.log("2 Create of PreloaderScene")
        // })

        console.log("3 Launch of WelcomeScene")
        this.scene.start('welcomeScene')
    }

    update () {

    }
}
