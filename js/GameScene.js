//// Import tools
import BaseScene from "./BaseScene.js"
import localStorageAvailable from "./helpers/localStorageAvailable.js"

//// Import objects and characters
import Player from "./chars/Player.js"
import Transaction from "./object/Transaction.js"
import PNJ from "./chars/PNJ.js"
import Mine from "./object/Mine.js"
// characters and objects helpers
import {charactersList} from "./chars/charactersList.js"
import {createObjectsAnims, createCharAnims} from "./chars/createAnims.js"

import {cryptos} from "./helpers/cryptos.js"

//// Global objects
import globalEvents from "./helpers/globalEvents.js"
import EtherHelp from "./helpers/EtherHelp.js"

export default class GameScene extends BaseScene {
    constructor() {
        super("gameScene")
    }

    init(data) {
        // We expect a character choice from prior scene. Otherwise default is boy
        if (data.currentChar)
            this.currentChar = data.currentChar
        else
            this.currentChar = charactersList.BOY

            // this.inputKeys = this.input.keyboard.createCursorKeys()
            this.inputKeys = this.input.keyboard.addKeys({
                up: Phaser.Input.Keyboard.KeyCodes.W,
                upA: Phaser.Input.Keyboard.KeyCodes.UP,
                down: Phaser.Input.Keyboard.KeyCodes.S,
                downA: Phaser.Input.Keyboard.KeyCodes.DOWN,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                leftA: Phaser.Input.Keyboard.KeyCodes.LEFT,
                right: Phaser.Input.Keyboard.KeyCodes.D,
                rightA: Phaser.Input.Keyboard.KeyCodes.RIGHT,
                space: Phaser.Input.Keyboard.KeyCodes.SPACE,
              })
    }

    preload() {

    }
    launchCatchQuest(NPC) {
        this.quest = "catch transactions"
        NPC.says("You need to collect 5 transactions in the mempool, west from here. You can navigate with the arrow keys and launch your net with the space bar [i](Sorry mobile users, touch controls are on the roadmap).[/i] Be careful, you must only collect valid transactions in green!")

    }
    initialiseMap(mapKey) {

        //// Map loading (see layer below)
        const map = this.make.tilemap({
            key: mapKey
        })
        const tileset = map.addTilesetImage('Outside7', 'outsideTiles')
        console.log("Map and tiles loaded")
        // Set start Position from map
        let startPosition = map.findObject("Helpers", obj => obj.name === "startPosition")

        if(DEBUG){
            if(localStorageAvailable()){
                window.localStorage.setItem('blockQuestComplete', true)
            }
        }
        if (!startPosition)
            startPosition = {
                x: 600,
                y: 600
            }

        return {map, tileset, startPosition}
    }
    addGateway(from, to){
        if (from && to){

            let exitZone = this.add.image(from.x+30,from.y+30)
            this.physics.add.existing(exitZone)
            exitZone.setDepth(10)
            this.physics.add.collider(this.player, exitZone,  (p,n) => {
                console.log("ETeleport!")
                this.player.x = to.x
                this.player.y = to.y
                // this.scene.start('marketScene',  { currentChar: this.player.char })
            })
        } else {
            console.error(`Zones not found`)
        }

    }

    create() {
        //// Map loading
        const {
            map,
            tileset,
            startPosition
        } = this.initialiseMap('majorMap')

        //// World collision
        this.physics.world.setBounds(0, 0, map.width * 16, map.heigth * 16) // (x, y, width, height)
        //// Create animations
        createObjectsAnims(this.anims)

        for(var c in charactersList) {
            createCharAnims(this.anims, charactersList[c])
        }


        //// Player
        this.player = this.add.player(startPosition.x, startPosition.y, this.currentChar)

        //// Trying camera
        if (!DEBUG){// debug shortcut
            this.cameras.main.centerOn(200, startPosition.y-700);
            this.cameras.main.pan(startPosition.x, startPosition.y, 3000, 'Sine.easeInOut')

        }
        this.scene.launch('interfaceScene')
        this.input.setDefaultCursor('url(assets/cursor.png), pointer');

        //// Object on map management
        this.minesGroup = this.physics.add.group()
        const objectsLayer = map.getObjectLayer('Helpers')
        objectsLayer.objects.forEach(obj => {
            if (obj.name == "mine") {
                const newMine = this.add.mine(obj.x, obj.y)
                // newMine.body.setImmovable() /// does not work either
                this.minesGroup.add(newMine)
            }
        })
        if(DEBUG)
            console.log("mines:", this.minesGroup) // give an array of sprites

        this.physics.add.collider(this.player, this.minesGroup, (p, m) => {
            m.body.setVelocity(0, 0)
        }, null, this)

        //// PNJ
        this.pnjsGroup = this.physics.add.group()

        // We assume each object on the PNJ layer has a name and a first custom property "frame"
        const PNJsLayer = map.getObjectLayer('PNJs')
        PNJsLayer.objects.forEach(pnjObj => {
            // We extract type
            const prop = pnjObj.properties.find(p => p.name == "type")
            const type = prop ? prop.value : ""
            // We extract frame. pnjObj.properties[0].value could work, this is more resiliend
            const frame = pnjObj.properties.find(p => p.name == "frame").value
            if (DEBUG && frame == undefined)
                console.error("No Frame for ", pnjObj)
            // Object creation
            const newPNJ = this.add.pnj(pnjObj.x, pnjObj.y, 'pnj', frame, pnjObj.name, type)
            this.pnjsGroup.add(newPNJ)
        })

        this.physics.add.collider(this.player, this.pnjsGroup, (p, j) => {
            j.handlePlayerCollision(p, j)
            p.handleBumpyCollision(p, j)
        }, null, this)

        //// Layers Loading
        this.layers = []

        for (let i = 0; i < map.layers.length; i++) {
            // could use map.layers[i].name as name
            this.layers[i] = map
                .createStaticLayer(i, tileset)
            this.layers[i].setDepth(i)
            this.layers[i].setCollisionByProperty({
                collides: true
            })
            if (i == 0) {
                // Layer 0 is for transactions only
            } else {
                this.physics.add.collider(this.player, this.layers[i]) // ALT: execMapCollision, checkMapCollision, this)
                this.physics.add.collider(this.pnjsGroup, this.layers[i], null, null, this)
            }
            console.log(map.layers[i].name, "depth:", i)
        }
        // alt: to create a collidable layer: obstacles.setCollisionByExclusion([-1]);

        //// Control Player
        this.cameras.main.startFollow(this.player, true)
        // this.cameras.main.setLerp(0.5,0.5)

        // Trick to avoid bleeding
        //this.cameras.main.roundPixels = true;

        this.input.mouse.disableContextMenu()

        //// Quests (To be factorised in an object?)
        if (DEBUG)
            console.log("pnjsGroup", this.pnjsGroup.getChildren())

        const andres = this.pnjsGroup.getChildren().find(p => p.name === "Andrés")
        if (andres) {
            // we probably need a generic picable object class
            const net = this.add.image(andres.x +10, andres.y - 14 , 'actions', 0)
            net.setDepth(10)
            this.physics.add.existing(net)
            this.physics.add.collider(this.player, net,  (p,n) => {
                this.launchCatchQuest(andres)
                n.destroy()
            })
        } else {
            console.error(`Andres not found!`)
        }

        const fox = this.pnjsGroup.getChildren().find(p => p.name === "Fox")
        if(DEBUG)
            globalGame.fox = fox
        const timeout = DEBUG ? 0 : 4000




        // if(localStorageAvailable() && window.localStorage.getItem('blockQuestComplete')){
        //     this.quest = "get a fox"
        //     setTimeout(() => {
        //         andres.says("Welcome back. You should go directly talk to the fox, just south from here")
        //     }, timeout);
        // } else {
        //     this.quest = "catch transactions"
        //     setTimeout(() => {
        //         andres.says("Welcome to Haciendas!            A decentralised game to learn and interact with digital assets.            To start, I need you to collect 5 transactions in the mempool, west from here. You can navigate with the arrow keys and launch your net with the space bar [i](Sorry mobile users, touch controls are on the roadmap).[/i] Be careful, you must only collect valid transactions!")

        //     }, timeout);
        // }
        //// New start
        setTimeout(() => {
            globalEvents.emit("says", "Welcome to Haciendas!                    A decentralised game to learn and interact with digital assets.                 Use the arrows to move around and the spacebar to talk to the fox.")
            this.quest = "get a fox"
        }, timeout);

        this.transactionsCaptured = 0
        //// Transactions logic
        this.transactions = this.physics.add.group()
        // We bounce on underlying layer
        this.physics.add.collider(this.transactions, this.layers[0])

        this.createRandomTransactions = this.time.addEvent({
            delay: 4000,
            callback: () => {
                if (this.transactions.children.size < 12) {
                    const tr = this.add.transaction(9 * 16, 95 * 16)
                    this.transactions.add(tr)
                }
            },
            loop: true
        })

        globalEvents.on("transactions-complete", () => {

            andres.says('Congratulations for collecting the transactions! Now to mine them, go to the mining farm in the south and activate one of the mining rigs pressing [i]space[/i] until you have a number below 9000. You must be the first one! ')
            this.quest = "mine a block"
            this.sound.play("holy")

        })

        globalEvents.on("mining-complete", () => {

            const eng = this.pnjsGroup.getChildren().find(p => p.name === "engineer")
            eng.says('Congratulations for mining a block! You have earned 12 Reales, an antique currency. To collect them and join the game, talk to the fox near the lake')
            this.quest = "get a fox"
            this.sound.play("holy")
            if(localStorageAvailable()){
                window.localStorage.setItem('blockQuestComplete', true)
            }

        })

        // Exit Zone
        const toGovernance = map.findObject("Helpers", obj => obj.name === "toGovernance")
        const startGovernance = map.findObject("Helpers", obj => obj.name === "startGovernance")
        this.addGateway(toGovernance,startGovernance)

        const toMainland = map.findObject("Helpers", obj => obj.name === "toMainland")
        const startMainland = map.findObject("Helpers", obj => obj.name === "startMainland")
        this.addGateway(toMainland,startMainland)

        // Faucet (interaction in handled with action in Player.js)
        const faucet = map.findObject("Helpers", obj => obj.name === "Faucet")
        this.faucet = this.add.image(faucet.x+30,faucet.y+30)
        this.physics.add.existing(this.faucet)

        this.faucet.setDepth(10)

        //Interact with liquidity pool
        const DAIPool = map.findObject("Helpers", obj => obj.name === "DaiPool")
        this.DAIPool = this.add.image(DAIPool.x+30, DAIPool.y+30)
        this.physics.add.existing(this.DAIPool)

        // Add swap cryptos
        this.buyGroup = this.physics.add.group()
        const BuyObjects = map.filterObjects("Helpers", obj => obj.name === "Buy")
        BuyObjects.forEach(bo => {
            console.log(`adding`, bo)
            let token = bo.properties.find(p => p.name == "token").value

            let buyImage = this.add.image(bo.x + 8-8, bo.y-2 , "cryptos", cryptos[token].frame).setScale(0.8).setDepth(5)
            buyImage.token = token
            this.buyGroup.add(buyImage)
            // if (DEBUG)
            //     console.log("BUYUSDC", this.BuyUSDC)
        })

        const BuyCoffeeObj = map.findObject("Helpers", obj => obj.name === "BuyCoffee")
        this.BuyCoffee = this.add.image(BuyCoffeeObj.x, BuyCoffeeObj.y)
        this.BuyCoffee.setDepth(5)
        this.physics.add.existing(this.BuyCoffee)

        // Network players logic. Data in globalNetwork.players TODO move both to dedicated object
        this.playersGroup = this.physics.add.group()
        // Basic player collision
        this.physics.add.collider(this.player, this.playersGroup,  (p,g) => {
            p.handleBumpyCollision(p,g)
            g.body.setVelocity(0,0)
        })

        globalEvents.on('playerAdd', (id)=>{
            const newPlayer = this.add.sprite(globalNetwork.players[id].x, globalNetwork.players[id].y, globalNetwork.players[id].char.texture, globalNetwork.players[id].char.frame);
            this.playersGroup.add(newPlayer)
            newPlayer.setDepth(10)

            newPlayer.playerId = id
            newPlayer.direction = globalNetwork.players[id].dir
            globalNetwork.players[id].sprite = newPlayer
            // console.log(` Network player added ${id}`,globalNetwork.players[id].sprite, `Full list`, globalNetwork.players)
        })

    }

    update(t, dt) {
        if (this.player) {
            this.player.update(this.inputKeys, t, dt)
        }
    }
    // addNetworkPlayer(){}
    // updateNetworkPlayer(){}
    // deleteNetworkPlayer(){}

}
