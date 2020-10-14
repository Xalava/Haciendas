import GameScene from "./GameScene.js"
import WelcomeScene from "./WelcomeScene.js"
import InterfaceScene from "./InterfaceScene.js"


const config = {
    width:400,
    height:300,
    scale: {
        // mode: Phaser.Scale.FIT,
        // autoCenter: Phaser.Scale.CENTER_BOTH,
       zoom:2,
    },
    backgroundColor: "#111111",

    type: Phaser.AUTO,
    parent: "game",
    scene: [PreloaderScene,WelcomeScene, GameScene, InterfaceScene],
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug:true,
            gravity:{y:0},
            //tileBias:20, // Max overlap with tile.  Default is 16 - Apparently distance at wich the engine start to check collision, important for higher speeds https://thoughts.amphibian.com/2016/02/dont-fall-through-tile-bias-in-phaser.html
            overlapBias: 1 // didn't get it
        } 
    },

}
console.log("Loading game")
const game = new Phaser.Game(config)
console.log("Game loaded")
