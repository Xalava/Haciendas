import globalEvents from './globalEvents.js'
import {stdVelocity} from './directions.js'

export default class Network {
	// Sockets event sent : says, reportPosition, "ethconnection" [connection] [disconnect]
	// Sockets listened to: says, playerUpdate, playersList, playerDeleteplayerAdd, nameupdate
	// Event emitted : playerUpdate
	// NB the player object used in network is slightly different from its local phaser representation
	// accessible via players[id].sprite and the Player phaser object
	constructor(player) {
		this.players = {}
		let serverURL = 'https://glacial-gorge-97084.herokuapp.com/'
		// testing local server
		// if(location.hostname == "127.0.0.1" || location.hostname == "localhost")
		//     serverURL = "ws://127.0.0.1:3232"

		this.socket = io(serverURL, {
			query: {
				x: player.x,
				y: player.y,
				dir: player.direction,
				char: JSON.stringify(player.char), // ! This is an object
				moves: false
			}
		})
		// We receive the full list, we simply copy it. It should happen once at connection
		this.socket.on('playersList', list => {
			this.players = list // shallow copy?
			if (DEBUG) console.log(`Players list`, this.players)
			for (const pid in this.players) {
				this.receiveAdd(this.players[pid])
			}
		})
		// We receive a message, the event is captured by the interface for display
		this.socket.on('says', (name, msg) => globalEvents.emit('chat-says', name, msg))
		// We receive the position of an user
		this.socket.on('playerAdd', player => this.receiveAdd(player))
		this.socket.on('playerUpdate', player => this.receiveUpdate(player))
		this.socket.on('playerDelete', pid => this.receiveDelete(pid))
		this.socket.on('nameupdate', player => this.receiveNameUpdate(player))
	}

	says(name, message) {
		this.socket.emit('says', name, message)
	}
	reportPosition(x, y, dir, moves) {
		let position = {}
		position.x = Math.round(x)
		position.y = Math.round(y)
		position.dir = Object.assign({}, dir) // bug later as it is an object and some copies are shallow
		position.moves = moves
		this.socket.emit('reportPosition', position)
		if (DEBUG_NETWORK)
			console.log(`report position:`, position)
	}
	receiveAdd(player) {
		// Skip if it is about the current player
		if (this.socket.id !== player.id) {
			this.players[player.id] = Object.assign({}, player)
			globalEvents.emit('playerAdd', player.id)
		}
	}
	receiveUpdate(netPlayer) {
		if (this.socket.id !== netPlayer.id) {
			//If we don't now this player, we simply add it instead
			if (this.players[netPlayer.id].sprite === undefined) {
				this.receiveAdd(netPlayer)
				if (DEBUG)
					console.log(`Added sprite update for`, this.socket.id)
				return
			}
			if (DEBUG_NETWORK)
				console.log(`received update for`, this.socket.id,`x was at`, this.players[netPlayer.id].sprite.body.x, `and now is`, netPlayer.x)
			// this.players[netPlayer.id].x = netPlayer.x
			// this.players[netPlayer.id].y = netPlayer.y
			this.players[netPlayer.id].dir = Object.assign({}, netPlayer.dir)
			this.players[netPlayer.id].moves = netPlayer.moves
			this.players[netPlayer.id].sprite.x = netPlayer.x // Body is key to keep collisions
			this.players[netPlayer.id].sprite.y = netPlayer.y 
			if (netPlayer.moves) {
				this.players[netPlayer.id].sprite.body.setVelocity(netPlayer.dir.x * stdVelocity, netPlayer.dir.y * stdVelocity)
				this.players[netPlayer.id].sprite.anims.play(netPlayer.char.name + '-' + netPlayer.dir.name)
			} else {
				this.players[netPlayer.id].sprite.body.setVelocity(0, 0)
				this.players[netPlayer.id].sprite.anims.play(netPlayer.char.name + '-' + 'idle-' + netPlayer.dir.name)
			}
		}
	}

	receiveDelete(pid) {
		if (this.socket.id !== pid) {
			if (this.players[pid].sprite) {
				this.players[pid].sprite.destroy()
			}
			delete this.players[pid]

			// globalEvents.emit('playerDelete', player.id)
		}
	}

	// We receive a name update, we just udpate the data
	receiveNameUpdate(player) {
		if (this.players[player.id]) {
			this.players[player.id].address = player.address
			this.players[player.id].ename = player.ename
		} else {
			console.log(`${player.id} not found`)
		}
	}

	sendNameUpdate(address, ename) {
		this.socket.emit('ethconnection', address, ename)
	}
}
