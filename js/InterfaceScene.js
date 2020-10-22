import BaseScene from "./BaseScene.js"
import globalEvents from "./helpers/globalEvents.js"
import createDebugSwitch from "./interface/debug.js"
// import createLibp2p from './helpers/clibp2p.js'

import createTextBox from "./interface/textBox.js"

export default class InterfaceScene extends BaseScene
{
	constructor(){
		super({ key: 'interfaceScene' , active: true})

	}
	preload(){
		// the version from PreloaderScene does not seem available. 
        this.load.spritesheet('things2bis', 
        'assets/things2.png',
        { frameWidth: 16, frameHeight: 16 }
		)    
		this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        })
 
        this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png')		
		this.load.html('message', 'html/message.html');


	}

	handleTransactionsChange(nbTransactions){
		this.transactionsDisplay.children.each((obj, idx) => {
			if (idx < nbTransactions){
				obj.visible = true
			} else {
				obj.visible = false
			}
		})
	}
	handleRealChange(value){
		this.realDisplay.children.each((obj, idx) => {
			setTimeout(() => {
				if (idx < value){
					obj.visible = true
					if(idx%2)
						this.sound.play("gold")
				} else {
					obj.visible = false
				}				
			}, idx*800)
		})
	}

	handleUSDCChange(value){
		this.USDCDisplay.children.each((obj, idx) => {
			setTimeout(() => {
				if (idx < value){
					obj.visible = true
					if(idx%2)
						this.sound.play("gold")
				} else {
					obj.visible = false
				}				
			}, idx*800)
		})
	}

	create(){
		//// Inputs
        this.letterI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
		this.letterI.on('down', function(event) {
			if (this.invGraphics.visible)
				this.invGraphics.visible = false
			else 
				this.invGraphics.visible = true
		}, this)
		this.input.keyboard.once("keydown_M", event => {
			const element = this.add.dom(350, 230).createFromCache('message')
			element.scale = 0.5
			this.input.keyboard.once("keydown_ENTER", event => {

				console.log(document.getElementById('message').value)
				element.destroy()
			})
		})


		//// Debugging shortcuts       
		createDebugSwitch(this)

		////Interfaces

		// Dialog graphics 
		this.dialogGraphics = this.add.graphics();
		this.dialogGraphics.lineStyle(1, 0xffffff);
		this.dialogGraphics.fillStyle(0x031f6c, 1);        
		this.dialogGraphics.strokeRect(5, 240, 350, 50);
		this.dialogGraphics.fillRect(5, 240, 350, 50);
		this.dialogGraphics.visible = false

		// Inventory graphics available on pressing i
		this.invGraphics = this.add.graphics();
		this.invGraphics.lineStyle(1, 0xffffff);
		this.invGraphics.fillStyle(0x031f6c, 1);        
		this.invGraphics.strokeRect(5, 240, 350, 50);
		this.invGraphics.fillRect(5, 240, 350, 50);

		this.invGraphics.visible = false
		
		this.transactionsDisplay = this.add.group()

		this.transactionsDisplay.createMultiple({
			key: 'things2bis',
			frame: 13,
			setXY: {
				x: 10,
				y: 10,
				stepX: 16
			},
			quantity: 5,
			visible:false,
		})
		this.realDisplay = this.add.group()

		this.realDisplay.createMultiple({
			key: 'real',
			frame: [0,1],
			setXY: {
				x: 10,
				y: 10,
				stepX: 12
			},
			quantity: 24,
			visible:false,
			setScale: { x: 0.6, y: 0.6}
		})
		
		this.USDCDisplay = this.add.group()

		this.USDCDisplay.createMultiple({
			key: 'cryptos',
			frame: 8,
			setXY: {
				x: 10,
				y: 10,
				stepX: 12
			},
			quantity: 24,
			visible:false,
			setScale: { x: 0.6, y: 0.6}
		})


		//// Handling events
		globalEvents.on('transaction-captured', (nb)=>this.handleTransactionsChange(nb), this)	
		globalEvents.on('mining-complete', ()=>{		
			this.transactionsDisplay.children.each((obj, idx) => {
				obj.visible = false
			})
		})	
		globalEvents.on('real-transaction', (value)=>this.handleRealChange(value), this)	
		globalEvents.on('usdc-transaction', (value)=>this.handleUSDCChange(value), this)	

		globalEvents.on('says', (message)=>createTextBox(this, message), this)
	
	}

	update(){

	}
}
