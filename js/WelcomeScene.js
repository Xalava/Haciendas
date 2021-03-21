import {charactersList} from './chars/charactersList.js'

export default class WelcomeScene extends Phaser.Scene {
	constructor() {
		super('welcomeScene')
	}

	preload() {
		this.load.html('form', 'html/form.html')
		this.load.spritesheet('fullscreen', '../assets/fullscreen.png', {
			frameWidth: 64,
			frameHeight: 64
		})
	}
	addFullscreenButton () {
		let button = this.add
			.image(this.cameras.main.width - 20, 20, 'fullscreen', 0)
			.setOrigin(1, 0)
			.setInteractive()
			.setScrollFactor(0)
			.setDepth(100)
			.setAlpha(0.2)
			.setScale(0.2)

		button.on('pointerup', () => {
			if (this.scale.isFullscreen) {
				button.setFrame(0)
				document.exitFullscreen();
				// Phaser way, didn't work
				// this.scale.stopFullscreen()
			} else {
			button.setFrame(1)
				document.documentElement.requestFullscreen();
				// Phaser way. didn't work
				//this.scale.startFullscreen()
			}			
		})
		return button
	}

	createMenu(){
		const element = this.add.dom(215, 150).createFromCache('form')
		element.setPerspective(800)
		element.scale = 0.5
		this.sound.play('guitara')
		element.addListener('click').on('click', event => {
			if (event.target.className === 'choice-button') {
				if (DEBUG) console.log('Choice', event.target.innerText)
				if (event.target.innerText == 'Boy') this.currentChar = charactersList.BOY
				if (event.target.innerText == 'Cyborg') this.currentChar = charactersList.CYBORG
				if (event.target.innerText == 'Girl') this.currentChar = charactersList.GIRL
				this.scene.start('gameScene', {
					currentChar: this.currentChar
				})
			}
		})
		this.tweens.add({
			targets: element,
			alpha: {from: 0, to:1},
			duration: 1000,
			ease: "Power2",
			yoyo: false,
			loop: 0
		})
	}

	create() {
		if (DEBUG) {
			// debug shortcut
			this.scene.start('gameScene', {
				currentChar: charactersList.CYBORG
			})
		} else {
			this.createMenu()
			this.addFullscreenButton()
		}

	}

	update() {}
}
