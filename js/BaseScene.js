export default class BaseScene extends Phaser.Scene {

    //Helper - not in use
   gameWidth() {
        return this.sys.game.config.width
    }

   gameHeight() {
        return this.sys.game.config.height
    }

}