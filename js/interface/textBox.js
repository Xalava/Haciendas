// Adapted from https://codepen.io/rexrainbow/pen/MzGoJv

// needs load of rexuiplugin and image in the calling scene (primarely interfaceScene)
const COLOR_PRIMARY = 0x0a0a8e
const COLOR_LIGHT = 0x9b9b9b
const COLOR_DARK = 0x260e04

export default function createTextBox(scene, content) {
	var wrapWidth = 350
	var textBox = scene.rexUI.add
		.textBox({
			x: 5,
			y: 238,

			background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 2, COLOR_PRIMARY).setStrokeStyle(1, COLOR_LIGHT),
			// icon: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK),
			// text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
			text: getBBcodeText(scene, wrapWidth, 0, 0), //Additional parameters: fixedWidth, fixedHeight

			action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false).setScale(0.5),

			space: {
				left: 10,
				right: 10,
				top: 10,
				bottom: 10,
				icon: 5,
				text: 5
			}
		})
		.setOrigin(0)
		.layout()
		.start(content, 30)

	const letterEnter = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
	letterEnter.on(
		'down',
		function (event) {
			var icon = textBox.getElement('action').setVisible(false)
			textBox.resetChildVisibleState(icon)
			if (textBox.isTyping) {
				textBox.stop(true)
			} else {
				textBox.typeNextPage()
			}
		},
		this
	)
	textBox
		.setInteractive()
		.on(
			'pointerdown',
			function () {
				var icon = this.getElement('action').setVisible(false)
				this.resetChildVisibleState(icon)
				if (this.isTyping) {
					this.stop(true)
				} else {
					if (this.isLastPage) {
						this.destroy()
					} else {
						this.typeNextPage()
					}
				}
			},
			textBox
		)
		.on(
			'pageend',
			function () {
				if (this.isLastPage) {
					letterEnter.on(
						'down',
						function (event) {
							this.destroy()
						},
						this
					)
					setTimeout(() => {
						this.destroy()
					}, 800)
					return
				}

				var icon = this.getElement('action').setVisible(true)
				this.resetChildVisibleState(icon)
				icon.y -= 30
				var tween = scene.tweens.add({
					targets: icon,
					y: '+=30', // '+=100'
					ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
					duration: 500,
					repeat: 0, // -1: infinity
					yoyo: false
				})
			},
			textBox
		)
	//.on('type', function () {
	//})

	return textBox
}

var getBuiltInText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
	return scene.add
		.text(0, 0, '', {
			fontSize: '20px',
			wordWrap: {
				width: wrapWidth
			},
			maxLines: 3
		})
		.setFixedSize(fixedWidth, fixedHeight)
}

var getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
	return scene.rexUI.add.BBCodeText(0, 0, '', {
		fixedWidth: fixedWidth,
		fixedHeight: fixedHeight,
		// fontFamily: 'Press Start 2P',
		fontSize: '14px',
		wrap: {
			mode: 'word',
			width: wrapWidth
		},
		maxLines: 3
	})
}
