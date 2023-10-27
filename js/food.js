"use strict";

const foodTypes = [
	{
		'type': 'normal',
		'size': 1,
		'speedAmplifier': 1,
		'color': 'blue',
		'chance': 85
	},
	{
		'type': 'large',
		'size': 2,
		'speedAmplifier': 2,
		'color': 'pink',
		'chance': 10
	},
	{
		'type': 'giant',
		'size': 3,
		'speedAmplifier': 3,
		'color': 'red',
		'chance': 4
	},
	{
		'type': 'ultra',
		'size': 4,
		'speedAmplifier': 4,
		'color': 'orange',
		'chance': 1
	}
];

export default class Food
{
	constructor(config)
	{
		this.context = config.context;
		this.tile = config.tile;
		this.gameArea = config.gameArea;
		this.gameAreaArray = config.gameAreaArray;
		
		this.position = {
			x: 0,
			y: 0
		};
		this.size = 1;
		this.speedAmplifier = 1;
		this.color = 'blue';
	}
	
	generate()
	{
		let foods = [];
		foodTypes.forEach(value => {
			for (let i = 0; i < value.chance; i++) {
				foods.push(value);
			}
		});
		
		let foodType = foods[Math.floor(Math.random() * foods.length)];
		this.size = foodType.size;
		this.speedAmplifier = foodType.speedAmplifier;
		this.color = foodType.color;
		
		let position = this.getNewPosition();
		this.position.x = position.x;
		this.position.y = position.y;
	}
	
	getNewPosition()
	{
		let availableTiles = [];
		for (let i = 0;  i < this.tile.horizontal; i++) {
			for (let j = 0; j < this.tile.vertical; j++) {
				if (this.gameAreaArray[i][j] === 0) {
					availableTiles.push({
						x: i,
						y: j
					});
				}
			}
		}
		let rndTileIndex = Math.floor(Math.random() * availableTiles.length);
		
		return {
			x: availableTiles[rndTileIndex].x,
			y: availableTiles[rndTileIndex].y
		}
	}
	
	draw()
	{
		let x = this.position.x * this.tile.width + (this.tile.width / 2);
		let y = this.position.y * this.tile.height + (this.tile.height / 2);
		
		let radius = 0;
		if (this.tile.width <= this.tile.height) {
			radius = (this.tile.width / 2) - 2;
		} else {
			radius = (this.tile.height / 2) - 2;
		}
		
		this.context.beginPath();
		this.context.arc(
				this.gameArea.x + x,
				this.gameArea.y + y,
				radius,
				0,
				Math.PI * 2
		)
		this.context.fillStyle = this.color;
		this.context.fill();
		this.context.closePath();
		
		this.context.textAlign = 'center';
		this.context.fillStyle = 'white';
		this.context.fillText(`${this.size}`, this.gameArea.x + x, this.gameArea.y + y + this.tile.height / 4);
	}
}