import BaseScene from "./BaseScene.js"
import {charactersList} from "./chars/charactersList.js"
export default class WelcomeScene extends BaseScene {
    constructor() {
        super("welcomeScene")
    }

    preload () {
        this.load.html('form', 'html/form.html')

    }

    create () {
        if(DEBUG)// debug shortcut
            this.scene.start('gameScene')
        const element = this.add.dom(200, 150).createFromCache('form')
        element.setPerspective(800)
        element.scale = 0.3
        element.addListener('click').on('click', (event) => {
            console.log(event)
            if (event.target.localName === 'button') {
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

    update () {

    }
}