// import Phaser from 'phaser'

import BaseScene from "./BaseScene.js"
import globalEvents from "./helpers/globalEvents.js"

export default class InterfaceScene extends BaseScene
{
	constructor(){
		super({ key: 'interfaceScene' , active: true})

	}
	preload(){
        this.load.spritesheet('things2bis', 
        'assets/things2.png',
        { frameWidth: 16, frameHeight: 16 }
        )    
	}

	handleTransactionsChange(nbTransactions){
		
		this.transactionsDisplay.children.each((obj, idx) => {
			const tx = obj
			if (idx < nbTransactions){
				obj.visible = true
			} else {
				obj.visble = false
			}
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

		//// Handling events
		globalEvents.on('transaction-captured', (nb)=>this.handleTransactionsChange(nb), this)	
	
	}

	update(){

	}
}
