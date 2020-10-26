import globalEvents from "../helpers/globalEvents.js"

// Display collisions, from https://codepen.io/mikewesthad/pen/BVeoYP
export default function createDebugSwitch(scene) {
    // Switch to debug mode if it was not set initially
    scene.input.keyboard.once("keydown_CAPS-LOCK", event => {
        DEBUG = true
        console.log('Switch to DEBUG mode')
        scene.physics.debug = true
        createDebugShortcuts(scene)
    })

    // If it was set, activate other shortcuts
    if (DEBUG) {
        createDebugShortcuts(scene)
    }


}

function createDebugShortcuts(scene) {
    var gameScene = scene.scene.get('gameScene')

    gameScene.input.keyboard.once("keydown_F", event => {
        globalEvents.emit('says', 'Welcome to Haciendas ! A decentralised game to learn and interact with decentralised digital assets   ')
    }, this)
    gameScene.input.keyboard.once("keydown_G", event => {
        debugCollisions(gameScene)
    })
    gameScene.input.keyboard.once("keydown_H", event => {
        globalEvents.emit("transactions-complete")
    })
    gameScene.input.keyboard.once("keydown_J", event => {
        globalEvents.emit("mining-complete")
    })
    gameScene.input.keyboard.once("keydown_C", event => {
        globalEvents.emit("connected")
    })
}


function debugCollisions(scene) {
    // Turn on physics debugging to show player's hitbox
    scene.physics.world.createDebugGraphic()

    // Create worldLayer collision graphic above the player, but below the help text
    scene.layers.forEach(layer => {

        const graphics = scene.add
            .graphics()
            .setAlpha(0.75)
            .setDepth(20)
        layer.renderDebug(graphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        })
    })
}