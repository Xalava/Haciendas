import {charactersList} from "./chars/charactersList.js"

export default class WelcomeScene  extends Phaser.Scene {
    constructor() {
        super("welcomeScene")
    }

    preload () {
        this.load.html('form', 'html/form.html')
    }

    create () {
        if(DEBUG) {// debug shortcut
            this.scene.start('gameScene', { currentChar: charactersList.CYBORG })
        } else {
            const element = this.add.dom(200, 150).createFromCache('form')
            element.setPerspective(800)
            element.scale = 0.4
            this.sound.play("guitara")
            element.addListener('click').on('click', (event) => {
                console.log(event.target)
                if (event.target.className === 'choice-button') {
                    console.log("Choice", event.target.innerText)
                    if (event.target.innerText == "Boy")
                        this.currentChar = charactersList.BOY
    
                    if (event.target.innerText == "Cyborg")
                        this.currentChar = charactersList.CYBORG
    
                    if (event.target.innerText == "Girl")
                        this.currentChar = charactersList.GIRL
    
                    this.scene.start('gameScene', { currentChar: this.currentChar })
                }
            })
        }
    }

    update () {

    }
}