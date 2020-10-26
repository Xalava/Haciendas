import globalEvents from './globalEvents.js'


export default class Network {

    constructor(scene) {
        this.socket = io('https://glacial-gorge-97084.herokuapp.com/')
        this.socket.on('says', (name, msg)=> globalEvents.emit('chat-says', name, msg))
        this.socket.on('position', (name,x, y, dir, char)=> globalEvents.emit('OtherPlayer', name, x, y, dir, char))
    }

    says (name,message) {
        this.socket.emit('says', name, message)
    }
    position (name,x, y,  dir, char) {
        this.socket.emit('position', name,x, y, dir, char)
    }
}