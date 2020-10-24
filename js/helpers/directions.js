export const Directions = {
	UP: {i: 0, x: 0, y: -1},
	DOWN: {i: 1, x: 0, y: 1},
	LEFT: {i: 2, x: -1, y: 0},
    RIGHT: {i: 3, x: 1, y: 0},
}

export const DirectionsArray = [
    "UP",
    "DOWN",
    "LEFT",
    "RIGHT"
]

export const randomDirection = (exclude) => {
	let newDirection = Phaser.Math.Between(0, 3)
	while (newDirection === exclude) {
		newDirection = Phaser.Math.Between(0, 3)
    }
    // console.log(Directions[DirectionsArray[newDirection]])
	return Directions[DirectionsArray[newDirection]]
}