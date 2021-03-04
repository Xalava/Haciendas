/// Import tools
import BaseScene from './BaseScene.js'
import localStorageAvailable from './helpers/localStorageAvailable.js'

//// Import objects and characters
import Player from './chars/Player.js'
import PNJ from './chars/PNJ.js'
// characters and objects helpers
import {charactersList} from './chars/charactersList.js'
import {createObjectsAnims, createCharAnims} from './chars/createAnims.js'

//// Global objects
import globalEvents from './helpers/globalEvents.js'
import EtherHelp from './helpers/EtherHelp.js'

export default class MarketScene extends BaseScene {
	constructor() {
		super({key: 'marketScene', active: false})
	}

	init(data) {
		console.log('Market init')
		// We expect a character choice from prior scene. Otherwise default is boy
		if (data.currentChar) this.currentChar = data.currentChar
		else this.currentChar = charactersList.BOY
	}
	initialiseMap(mapKey) {
		//// Map loading (see layer below)
		const map = this.make.tilemap({
			key: mapKey
		})
		const tileset = map.addTilesetImage('Outside7', 'outsideTiles')
		console.log(`Map and tiles loaded`)
		// Set start Position from map
		let startPosition = map.findObject('Helpers', obj => obj.name === 'startPosition')
		if (!startPosition)
			startPosition = {
				x: 30,
				y: 630
			}
		return {map, tileset, startPosition}
	}

	create() {
		console.log(`Starting the market Scene ! `)

		//// Map loading
		const {map, tileset, startPosition} = this.initialiseMap('marketMap')

		//// World collision
		this.physics.world.setBounds(0, 0, map.width * 16, map.heigth * 16) // (x, y, width, height)
		//// Create animations
		createObjectsAnims(this.anims)

		for (var c in charactersList) {
			createCharAnims(this.anims, charactersList[c])
		}

		//// Player
		console.log(this.currentChar)
		this.player = this.add.player(30, 630, this.currentChar)

		//// PNJ
		this.pnjsGroup = this.physics.add.group()

		// We assume each object on the PNJ layer has a name and a first custom property "frame"
		// const PNJsLayer = map.getObjectLayer('PNJs')
		// PNJsLayer.objects.forEach(pnjObj => {
		//     // We extract type
		//     const prop = pnjObj.properties.find(p => p.name == "type")
		//     const type = prop ? prop.value : ""
		//     // We extract frame. pnjObj.properties[0].value could work, this is more resiliend
		//     const frame = pnjObj.properties.find(p => p.name == "frame").value
		//     if (DEBUG && frame == undefined)
		//         console.error("No Frame for ", pnjObj)
		//     // Object creation
		//     const newPNJ = this.add.pnj(pnjObj.x, pnjObj.y, 'pnj', frame, pnjObj.name, type)
		//     this.pnjsGroup.add(newPNJ)
		// })

		this.physics.add.collider(
			this.player,
			this.pnjsGroup,
			(p, j) => {
				j.handlePlayerCollision(p, j)
				p.handleBumpyCollision(p, j)
			},
			null,
			this
		)

		//// Layers Loading
		this.layers = []

		for (let i = 0; i < map.layers.length; i++) {
			// could use map.layers[i].name as name
			this.layers[i] = map.createStaticLayer(i, tileset)
			this.layers[i].setDepth(i)
			if (i == 0) {
				// Layer 0 is for transactions only
				this.layers[0].setCollisionByProperty({
					collides: true
				})
			} else {
				this.layers[i].setCollisionByProperty({
					collides: true
				})

				this.physics.add.collider(this.player, this.layers[i]) // ALT: execMapCollision, checkMapCollision, this)
				this.physics.add.collider(this.pnjsGroup, this.layers[i], null, null, this)
			}
			console.log(map.layers[i].name, 'depth:', i)
		}
		// alt: to create a collidable layer: obstacles.setCollisionByExclusion([-1]);

		//// Control Player
		this.cameras.main.startFollow(this.player, true)

		this.input.mouse.disableContextMenu()

		//// Quests (To be factorised in an object?)
		const timeout = DEBUG ? 0 : 4000

		//// NETWORK
		// Network players logic. Data in globalNetwork.players TODO move both to dedicated object
		this.playersGroup = this.physics.add.group()
		// Basic player collision
		this.physics.add.collider(this.player, this.playersGroup, (p, g) => {
			p.handleBumpyCollision(p, g)

			g.body.setVelocity(0, 0)
		})

		// globalEvents.on('playerAdd', (id)=>{
		//     console.log("Players", globalNetwork.players, id)
		//     const newPlayer = this.add.sprite(globalNetwork.players[id].x, globalNetwork.players[id].y, globalNetwork.players[id].char.texture, globalNetwork.players[id].char.frame);
		//     this.playersGroup.add(newPlayer)
		//     newPlayer.setDepth(10)

		//     newPlayer.playerId = id
		//     newPlayer.direction = globalNetwork.players[id].dir
		//     globalNetwork.players[id].sprite = newPlayer
		//     console.log("New Player Sprite", globalNetwork.players[id].sprite)
		// })
	}
	update(t, dt) {
		if (this.player) {
			this.player.update(this.inputKeys, t, dt)
		}
	}
}
