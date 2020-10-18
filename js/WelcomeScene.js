import BaseScene from "./BaseScene.js"

export default class WelcomeScene extends BaseScene {
    constructor(){
        super("welcomeScene")
    }

    preload () {
         this.load.html('form', 'assets/form.html');

    }

    create () {

        if(this.physics.world.drawDebug)// debug shortcut
            this.scene.start('gameScene')
        const element = this.add.dom(200, 150).createFromCache('form')
        element.setPerspective(800)
        element.scale = 0.3
        element.addListener('click').on('click', (event) => {
            console.log(event)
            if (event.target.localName === 'button')
            {
                console.log("Choice", event.target.innerText)
                if (event.target.innerText == "Boy")
                    this.currentChar = 4

                if (event.target.innerText == "Cyborg")
                    this.currentChar = 1

                if (event.target.innerText == "Girl")
                    this.currentChar = 7

                this.scene.start('gameScene', { currentChar: this.currentChar })
            }
		})

    }

    update () {

    }
}