export function createObjectsAnims(anims) {
	anims.create({
		key: 'mineMove',
		frames: anims.generateFrameNumbers('things', {start: 51, end: 51 + 2}),
		frameRate: 4,
		repeat: 0,
		hideOnComplete: false // just to remember the option
	})
	anims.create({
		key: 'block',
		frames: anims.generateFrameNumbers('things-tall', {start: 0, end: 1}),
		frameRate: 5,
		repeat: -1,
		hideOnComplete: false // just to remember the option
	})

	anims.create({
		key: 'transaction-valid',
		frames: anims.generateFrameNumbers('things2', {start: 13, end: 14}),
		frameRate: 1,
		repeat: 3,
		hideOnComplete: false // just to remember the option
	})

	anims.create({
		key: 'transaction-invalid',
		frames: anims.generateFrameNumbers('things2', {start: 14, end: 15}),
		frameRate: 1,
		repeat: 3,
		hideOnComplete: false // just to remember the option
	})
}

// We use implicitely characters. But the full object is given so we don't need the corresponding file
export function createCharAnims(anims, char) {
	if (DEBUG) console.log('Creating animations for ', char)
	anims.create({
		key: char.name + '-left',
		frames: anims.generateFrameNumbers(char.texture, {start: char.frame + 11, end: char.frame + 13}),
		frameRate: 10,
		repeat: -1
	})
	anims.create({
		key: char.name + '-idle-left',
		frames: [{key: char.texture, frame: char.frame + 11 + 1}],
		frameRate: 1,
		repeat: 0
	})
	anims.create({
		key: char.name + '-right',
		frames: anims.generateFrameNumbers(char.texture, {start: char.frame + 11 + 12, end: char.frame + 13 + 12}),
		frameRate: 10,
		repeat: -1
	})
	anims.create({
		key: char.name + '-idle-right',
		frames: [{key: char.texture, frame: char.frame + 11 + 12 + 1}],
		frameRate: 1,
		repeat: 0
	})
	anims.create({
		key: char.name + '-up',
		frames: anims.generateFrameNumbers(char.texture, {start: char.frame + 11 + 24, end: char.frame + 13 + 24}),
		frameRate: 10,
		repeat: -1
	})
	anims.create({
		key: char.name + '-idle-up',
		frames: [{key: char.texture, frame: char.frame + 12 + 24}],

		frameRate: 1,
		repeat: 0
	})
	anims.create({
		key: char.name + '-down',
		frames: anims.generateFrameNumbers(char.texture, {start: char.frame - 1, end: char.frame + 1}),
		frameRate: 10,
		repeat: -1
	})

	anims.create({
		key: char.name + '-idle-down',
		frames: [{key: char.texture, frame: char.frame}],
		frameRate: 1,
		repeat: -1
	})
}
