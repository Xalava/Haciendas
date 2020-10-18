
// Display collisions, from https://codepen.io/mikewesthad/pen/BVeoYP
export function debugCollisions (scene){
    // Turn on physics debugging to show player's hitbox
    scene.physics.world.createDebugGraphic();

    // Create worldLayer collision graphic above the player, but below the help text
    scene.layers.forEach( layer => {
        
        const graphics = scene.add
        .graphics()
        .setAlpha(0.75)
        .setDepth(20);
        layer.renderDebug(graphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        })
    });
}

// export debugCollisions