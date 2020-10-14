export default class GameScene extends Phaser.Scene {
    constructor(){
        super("gameScene")
    }

    preload () {

    }

    create () {
    
        //TODO Choose character
        const currentChar = 4

        //// Map loading (see layer below)

        const map = this.make.tilemap({ key: 'miningMap' })
        const tileset = map.addTilesetImage('Outside7', 'outsideTiles')

        // Set start Position from map
        const startPosition = map.findObject("Helpers", obj => obj.name === "startPosition");
        // const startPosition = {x: 600, y: 600}
        
        //// Character
        
        this.player = this.add.sprite(startPosition.x, startPosition.y, 'characters',currentChar)
        this.player.setDepth(20);
        this.physics.add.existing(this.player)

        this.player.body.setMass(10)
        this.player.body.setBounce(0.1)
        this.player.body.setSize(8,14,true) // Smaller collision (x,y, centered)

        function checkCollision (objet1, objet2) {
            return true
        //     if (objet1 == player && objet1.y < objet2.y) 
        //        return true;
        //     if (objet2 == player && objet1.y > objet2.y) 
        //        return true;
        //    return false;
        }
        function execCollision (objet1, objet2) {
            if (objet1 == this.player)
                this.player.tint = 0xff0000
        //     && objet1.y < objet2.y) 
        //        return true;
        //     if (objet2 == player && objet1.y > objet2.y) 
        //        return true;
        //    return false;
        }


        ////Trying camera 

        this.cameras.main.pan(startPosition.x, startPosition.y, 4000, 'Sine.easeInOut')

        // Not used
            //this.cameras.main.setZoom(4);
            // this.cameras.main.setScroll(800)
            // this.cameras.main.centerOn(800, 800);


        // Do not seem to work
            // this.cameras.fadeIn(6000, 255)

            // this.tweens.add({
            //     // targets: map,
            //     x: 800,
            //     ease: 'Sine.easeInOut',
            //     yoyo: true,
            //     repeat: -1,
            //     duration: 3000
            // });
                

        //// Layers Loading
        this.layers = []
        for (let i = 0; i < map.layers.length; i++) {
            // could use map.layers[i].name as name
            this.layers[i] = map
            .createStaticLayer(i, tileset)
            this.layers[i].setDepth(i*3); // First four layers are below
            // layer.scale = 3;
            this.layers[i].setCollisionByProperty({ collides: true })
            this.physics.add.collider(this.player, this.layers[i],execCollision, checkCollision)
            console.log(map.layers[i].name, "depth:", i*3)
        }


        // this.physics.add.collider(player, trampoline, (player, trampoline) => {
        //     player.setVelocityY(-800);
        //     sound_bounce.play();
        //      trampoline.destroy()https://www.youtube.com/watch?v=hkedWHfU_oQ
        //      trampoline.disableBody(true, true) rdisable plysics and hide
        //   }, null, this);



        // map.createStaticLayer('base grass', tileset)
        // const waterLayer = map.createStaticLayer('Eau', tileset)
        // map.createStaticLayer('Sol base', tileset)
        // const constructionsLayer = map.createStaticLayer('Human Constructions', tileset)
        // map.createStaticLayer('Arbres et vegetatinos', tileset)
        // map.createStaticLayer('Decoration objects', tileset)

        // waterLayer.setCollisionByProperty({ collides: true })
        // // this.physics.add.collider(this.player, waterLayer)
        // waterLayer.setDepth(2);
        // constructionsLayer.setDepth(3)
        // //Necessary?
        // // this.physics.add.collider(this.player, constructionsLayer)
        // constructionsLayer.setCollisionByProperty({ collides: true })



        
        //// Object on map management
        //         var coins = map.createFromObjects('Coin Object Layer', 26, { key: 'coin' });
        // console.log(coins) // give an array of sprites
        // You get an array of sprites, so you can iterate this array and add each coin a body.

        //     coins.forEach(coin => {
        //         this.physics.world.enable(coin);
        //     })
        //     console.log(coins) // each coin has now a body
        // Now you can create a collider between a player and coins array

        // this.physics.add.collider(player, coins, null, null, this);

		// this.knives = this.physics.add.group({
		// 	classType: Phaser.Physics.Arcade.Image,
		// 	maxSize: 3
		// })

		// this.faune = this.add.faune(128, 128, 'faune')
		// this.faune.setKnives(this.knives)

		// const chests = this.physics.add.staticGroup({
		// 	classType: Chest
		// })
		// const chestsLayer = map.getObjectLayer('Chests')
		// chestsLayer.objects.forEach(chestObj => {
		// 	chests.get(chestObj.x! + chestObj.width! * 0.5, chestObj.y! - chestObj.height! * 0.5, 'treasure')
		// })

        
		// this.lizards = this.physics.add.group({
            // 	classType: Lizard,
            // 	createCallback: (go) => {
                // 		const lizGo = go as Lizard
                // 		lizGo.body.onCollide = true
                // 	}
                // })
                
                // const lizardsLayer = map.getObjectLayer('Lizards')
                // lizardsLayer.objects.forEach(lizObj => {
                    // 	this.lizards.get(lizObj.x! + lizObj.width! * 0.5, lizObj.y! - lizObj.height! * 0.5, 'lizard')
                    // })
                    

                    
 
                    
                    

                    
        //// Control Player
        this.inputKeys = this.input.keyboard.createCursorKeys()
        this.cameras.main.startFollow(this.player, true)

        //// World colision
        // scene.physics.world.setBounds(x, y, width, height);
        //this.player.body.setCollideWorldBounds()


        //// Animartions
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('characters', { start: currentChar+11, end: currentChar+13 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'face',
            frames: [ { key: 'characters', frame: currentChar } ],
            frameRate: 20
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('characters', { start: currentChar+11+12, end: currentChar+13+12 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'top',
            frames: this.anims.generateFrameNumbers('characters', { start: currentChar+11+24, end: currentChar+13+24 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('characters', { start: currentChar-1, end: currentChar+1 }),
            frameRate: 10,
            repeat: -1
        })


/// OVERLAP COLLIDER FOR SWIMING
//        var collider = scene.physics.add.overlap(objectsA, objectsB, collideCallback);
//

   // // var collider = scene.physics.add.overlap(objectsA, objectsB, collideCallback, processCallback, callbackContext);

// Parameters

//     objectsA, objectsB :
//         A game object
//         An array contains Game objects (Add or remove game objects)
//         Physics group/Group (Add or remove game objects)
//         An array contains Physics group/Group
//     collideCallback :

// var collideCallback = function(gameObject1, gameObject2) {
//     // ...
// }

// processCallback : Fired when gameObject1 intersects gameObject2, optional.

// var processCallback = function(gameObject1, gameObject2) {
//     return true;  // return false will discard remaining collision checking
// }
// Desactivate
//collider.active = false; 

// Get data from tile
//var tile = map.getTileAt(tileX, tileY);

        // Debug graphics from https://codepen.io/mikewesthad/pen/BVeoYP
        this.input.keyboard.once("keydown_D", event => {
            // Turn on physics debugging to show player's hitbox
            this.physics.world.createDebugGraphic();

            // Create worldLayer collision graphic above the player, but below the help text
            this.layers.forEach( layer => {
             
                const graphics = this.add
                .graphics()
                .setAlpha(0.75)
                .setDepth(20);
                layer.renderDebug(graphics, {
                tileColor: null, // Color of non-colliding tiles
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
                })
            });
        })
    }

    update () {
        if (this.inputKeys.left.isDown)
        {
            this.player.body.setVelocityX(-120)

            this.player.anims.play('left', true)
        }
        else if (this.inputKeys.right.isDown)
        {
            this.player.body.setVelocityX(120)

            this.player.anims.play('right', true)
        }
        else if (this.inputKeys.up.isDown)
            {
                this.player.body.setVelocityY(-120)
    
                this.player.anims.play('top', true)
        }
        else if (this.inputKeys.down.isDown)
        {
            this.player.body.setVelocityY(120)

            this.player.anims.play('down', true)
        }
        else
        {
            this.player.body.setVelocityX(0)
            this.player.body.setVelocityY(0)

            this.player.anims.play('face');
        }

        // if (this.inputKeys.up.isDown && this.player.body.touching.down)
        // {
        //     this.player.body.setVelocityY(-330);
        // }
    }
}