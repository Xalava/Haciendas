import GameScene from "./GameScene.js"
import WelcomeScene from "./WelcomeScene.js"
import PreloaderScene from "./PreloaderScene.js"
import InterfaceScene from "./InterfaceScene.js"

const config = {
    width: 400,
    height: 300,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 2,
    },
    backgroundColor: "#111111",
    pixelArt: true, // supposed to avoid blur in scaling. I didn't experience any anyway
    type: Phaser.AUTO,
    parent: "game",
    scene: [PreloaderScene, 
            WelcomeScene, 
            GameScene, 
            InterfaceScene
            ],
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: DEBUG,
            gravity:{y: 0},
        } 
    },

}
console.log("Loading game")
// const settings = new Settings()
const game = new Phaser.Game(config)
console.log("Game loaded")

// Necessary?
window.focus()