import globalEvents from './globalEvents.js'


export default class Network {

    constructor(scene) {
        this.socket = io('ws://51.91.110.153:3232')
        this.socket.on('says', (name, msg)=> globalEvents.emit('chat-says', name, msg))
    }

    says (name,message) {
        this.socket.emit('says', name, message)
        
    }
}