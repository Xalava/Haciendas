export default class PreloaderScene extends Phaser.Scene {
	constructor() {
		super('preloaderScene')
	}

	preload() {
		this.load.spritesheet('characters', 'assets/characters.png', {
			frameWidth: 16,
			frameHeight: 16
		})
		this.load.spritesheet('things', 'assets/things.png', {
			frameWidth: 16,
			frameHeight: 16
		})
		this.load.spritesheet('things2', 'assets/things2.png', {
			frameWidth: 16,
			frameHeight: 16
		})
		this.load.spritesheet('things-tall', 'assets/things-tall.png', {
			frameWidth: 16,
			frameHeight: 32
		})
		this.load.spritesheet('cryptos', 'assets/cryptos.png', {
			frameWidth: 16,
			frameHeight: 16
		})
		this.load.spritesheet('pnj', 'assets/pnj.png', {
			frameWidth: 16,
			frameHeight: 16
		})
		this.load.spritesheet('actions', 'assets/actions.png', {
			frameWidth: 16,
			frameHeight: 16
		})
		this.load.spritesheet('real', 'assets/real.png', {
			frameWidth: 16,
			frameHeight: 16
		})

		this.load.image('outsideTiles', 'maps/Outside7.png')
		this.load.image('slot', 'assets/slot.png')
		this.load.image('coffee', 'assets/coffee.png')
		this.load.svg('myagsvg', 'assets/myag.svg')
		this.load.image('myagonly', 'assets/myagclean.png')
		this.load.spritesheet('portal', 'assets/portal.png', {
			frameWidth: 32,
			frameHeight: 32
		})
		this.load.spritesheet('myag', 'assets/myag.png', {
			frameWidth: 32,
			frameHeight: 32
		})
		// this.load.tilemapTiledJSON('miningMap', 'maps/mining.json')
		// this.load.tilemapTiledJSON('marketMap', 'maps/market.json')
		this.load.tilemapTiledJSON('majorMap', 'maps/major.json')

		this.load.audio('machine', 'assets/audio/net.mp3')
		this.load.audio('MALE-hurt', 'assets/audio/male-hit.ogg')
		this.load.audio('FEMALE-hurt', 'assets/audio/female-hit.ogg')
		this.load.audio('holy', 'assets/audio/holy.ogg')
		this.load.audio('swing', 'assets/audio/swing.mp3')
		this.load.audio('gold', 'assets/audio/gold.ogg')
		this.load.audio('glitter', 'assets/audio/glitter.mp3')
		this.load.audio('poo', 'assets/audio/poo.mp3')
		this.load.audio('coin', 'assets/audio/coin.mp3')
		this.load.audio('coin-muted', 'assets/audio/coin-muted.mp3')
		this.load.audio('coin-ringing', 'assets/audio/coin-ringing.mp3')


		this.load.audio('guitara', 'assets/audio/AsIFigure.mp3')
		this.load.audio('notas', 'assets/audio/AsIFigureShort.mp3')

		this.load.audio('Laura-Hola', 'assets/speech/Laura-Hola.mp3')
		this.load.audio('Andres-Bienvenido', 'assets/speech/Andres-Bienvenido.mp3')
		this.load.audio('Ghost-Welcome', 'assets/speech/Ghost-Welcome.mp3')
		this.load.audio('GhostGov-Welcome', 'assets/speech/GhostGov-Welcome.mp3')
		this.load.audio('Dexie-Welcome', 'assets/speech/Dexie-Welcome.mp3')
		this.load.audio('Fox-Welcome', 'assets/speech/Fox-Welcome.mp3')
		this.load.audio('Kevin-Welcome', 'assets/speech/Kevin-Welcome.mp3')

	}

	create() {
		// this.load.once('complete', function(){
		console.log(`✓ Create of PreloaderScene`)
		// })
		console.log(`✓ Launch of WelcomeScene`)
		this.scene.start('welcomeScene')
	}

	update() {}
}
