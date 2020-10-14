export default class WelcomeScene extends Phaser.Scene {
    constructor(){
        super("welcomeScene")
    }

    preload () {

       // this.load.image('cat', 'assets/nyan.png');
        this.load.html('form', 'assets/form.html');

    }

    create () {
        // this.add.image(100, 40, 'cat');

       // const welcomeTxt = this.add.text(200,140,"Welcome to Haciendas",{ color: 'white', fontFamily: 'cursive', fontSize: '24px '})
      //  welcomeTxt.setOrigin(0.5,0.5)
        // setTimeout(() => {
        //     console.log("End welcome scene, launching game")
        //     this.scene.start('gameScene')

           
            
        // }, 100);

        const element = this.add.dom(200, 200).createFromCache('form')
        element.setPerspective(800)
        element.scale = 0.3
        element.addListener('click').on('click', (event) => {
            console.log(event)
            if (event.target.id === 'loginButton')
            {
                // var inputUsername = this.getChildByName('username')
                // var inputType = this.getChildByName('type')

                this.scene.start('gameScene')
            }
		})

    }

    update () {

    }
}