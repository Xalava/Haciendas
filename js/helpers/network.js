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
        this.socket.on('playersList', (list)=> {
            this.players = list // shallow copy?
            if(DEBUG)
                console.log("Players list",this.players)
            for (const pid in this.players) {
                globalEvents.emit('playerAdd', pid)
            }
        })
        // We receive a message, the event is captured by the interface for display
        this.socket.on('says', (name, msg)=> globalEvents.emit('chat-says', name, msg))
        // We receive the position of an user
        this.socket.on('playerAdd', (player)=>  this.receiveAdd(player))
        this.socket.on('playerUpdate', (player)=> this.receiveUpdate(player))
        this.socket.on('playerDelete', (pid)=> this.receiveDelete(pid))
        this.socket.on('nameupdate', (player)=> this.receiveNameUpdate(player))
    }

    says (name,message) {
        this.socket.emit('says', name, message)
    }
    reportPosition (x, y, dir, moves) {
        let position = {}
        position.x = x
        position.y = y
        position.dir = Object.assign({},dir) // bug later as it is an object and some copies are shallow
        position.moves = moves
        this.socket.emit('reportPosition', position)
    }
    receiveAdd(player){
        // Skip if it is about the current player
        if (this.socket.id !== player.id){
            this.players[player.id] = Object.assign({},player)
            globalEvents.emit('playerAdd', player.id)
        }
    }
    receiveUpdate(player){
        if (this.socket.id !== player.id){
            console.log("received update")
            //If we don't now this player, we simply add it instead
            if(this.players[player.id].sprite === undefined){
                this.receiveAdd(player)
                return
            }
            this.players[player.id].x = player.x
            this.players[player.id].y = player.y
            this.players[player.id].dir = Object.assign({},player.dir)
            this.players[player.id].moves = player.moves
            this.players[player.id].sprite.x =  player.x
            this.players[player.id].sprite.y =  player.y
            if (player.moves){
                this.players[player.id].sprite.body.setVelocity(player.dir.x*stdVelocity,player.dir.y*stdVelocity)
                this.players[player.id].sprite.anims.play(player.char.name+'-'+player.dir.name)
            }
            else {
                this.players[player.id].sprite.body.setVelocity(0,0)
                this.players[player.id].sprite.anims.play(player.char.name+'-'+'idle-'+player.dir.name)
            }

        }
    }

    receiveDelete(pid){
        if (this.socket.id !== pid){

            if(this.players[pid].sprite){
                this.players[pid].sprite.destroy()
            }
            delete this.players[pid]

            // globalEvents.emit('playerDelete', player.id)
        }
    }

    // We receive a name update, we just udpate the data 
    receiveNameUpdate(player) {
        this.players[player.id].address = player.address
        this.players[player.id].ename = player.ename
    }

    sendNameUpdate (address, ename) {
        this.socket.emit('ethconnection', address, ename)
    }
   
}