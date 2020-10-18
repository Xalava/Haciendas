
//// Import tools
import {debugCollisions} from "./debug.js"
import BaseScene from "./BaseScene.js"
import { createObjectsAnims, createCharAnims} from "./chars/createAnims.js"

//// Import objects and characters
import Player from "./chars/Player.js"
import Transaction from "./object/Transaction.js"
import PNJ from "./chars/PNJ.js"
import Mine from "./object/Mine.js"

export default class GameScene extends BaseScene {
    constructor() {
        super("gameScene")
    }

    init(data) {
        // We expect a character choice from prior scene. Otherwise default is 4
        if (data.currentChar)
            this.currentChar = data.currentChar
        else
            this.currentChar = 4

        this.inputKeys = this.input.keyboard.createCursorKeys()
    }

    preload() {

    }

    initialiseMap(mapKey) {

        //// Map loading (see layer below)
        const map = this.make.tilemap({
            key: mapKey
        })
        const tileset = map.addTilesetImage('Outside7', 'outsideTiles')
        console.log("Map and tiles loaded")
        // Set start Position from map
        const startPosition = map.findObject("Helpers", obj => obj.name === "startPosition")
        if (!startPosition)
            startPosition = {
                x: 600,
                y: 600
            }

        return {
            map,
            tileset,
            startPosition
        }
    }

    create() {
        //// Map loading
        const {
            map,
            tileset,
            startPosition
        } = this.initialiseMap('miningMap')

        //// World collision
        this.physics.world.setBounds(0, 0, map.width * 16, map.heigth * 16) // (x, y, width, height)

        //// Create animations
        createObjectsAnims(this.anims)
        createCharAnims(this.anims, this.currentChar)

        this.quest = "catch transactions"
        this.transactionsCaptured = 0

        //// Character
        this.player = this.add.player(startPosition.x, startPosition.y, 'characters', this.currentChar)
        this.player.body.setCollideWorldBounds()

        ////Trying camera 
        if (!this.physics.world.drawDebug) // debug shortcut
            this.cameras.main.pan(startPosition.x, startPosition.y, 4000, 'Sine.easeInOut')

        //// Object on map management
        this.minesGroup = this.physics.add.group()
        const objectsLayer = map.getObjectLayer('Helpers')
        objectsLayer.objects.forEach(obj => {
            console.log(obj)
            if (obj.name == "mine") {
                const newMine = this.add.mine(obj.x, obj.y)
                // newMine.body.setImmovable() /// does not work either
                this.minesGroup.add(newMine)
            }
        })

        console.log("mines:", this.minesGroup) // give an array of sprites

        this.physics.add.collider(this.player, this.minesGroup, (p,m)=>{m.body.setVelocity(0,0)}, null, this);

        //// PNJ 
        this.pnjsGroup = this.physics.add.group()

        // We assume each object on the PNJ layer has a name and a first custom property "frame"
        const PNJsLayer = map.getObjectLayer('PNJs')
        PNJsLayer.objects.forEach(pnjObj => {
            console.log(pnjObj)
            const newPNJ = this.add.pnj(pnjObj.x, pnjObj.y, 'pnj', pnjObj.properties[0].value, pnjObj.name, pnjObj.type)
            this.pnjsGroup.add(newPNJ)
        })

        this.physics.add.collider(this.player, this.pnjsGroup, (p, j) => {
            // this.player.setVelocity(0);    
            j.handlePlayerCollision(p, j)
            p.handleBumpyCollision(p, j)
            // this.pnj.setVelocity(0,0);
        }, null, this);

        //// Layers Loading
        this.layers = []

        for (let i = 0; i < map.layers.length; i++) {
            // could use map.layers[i].name as name
            this.layers[i] = map
                .createStaticLayer(i, tileset)
            this.layers[i].setDepth(i);
            if (i == 0) {
                // Layer 0 is for transactions only 
                this.layers[0].setCollisionByProperty({
                    collides: true
                })
            } else {
                this.layers[i].setCollisionByProperty({
                    collides: true
                })

                this.physics.add.collider(this.player, this.layers[i])// ALT: execMapCollision, checkMapCollision, this)
                this.physics.add.collider(this.pnjsGroup, this.layers[i], null, null, this)
            }
            console.log(map.layers[i].name, "depth:", i)
        }
        // alt: to create a collidable layer         obstacles.setCollisionByExclusion([-1]);

        //// Control Player
        this.cameras.main.startFollow(this.player, true)

        // Trick to avoid bleeding
        //this.cameras.main.roundPixels = true;

        // Debug graphics 
        this.input.keyboard.once("keydown_D", event => {
            debugCollisions(this)
        })

        this.input.mouse.disableContextMenu()

        //// Transactions logic
        this.transactions = this.physics.add.group()
        // We bounce on underlying layer 
        this.physics.add.collider(this.transactions, this.layers[0]) 

        this.createRandomTransactions = this.time.addEvent({
            delay: 4000,
            callback: () => {
                if (this.transactions.children.size < 12) {
                    const tr = this.add.transaction(9 * 16, 15 * 16)
                    this.transactions.add(tr)
                }
            },
            loop: true
        })

    }

    update(t, dt) {

        if (this.player) {
            this.player.update(this.inputKeys, t, dt)
        }

    }

}