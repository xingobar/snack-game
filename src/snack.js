var canvas = document.getElementById('snack_canvas');
var ctx = canvas.getContext('2d');

var bricks = {
	width: 25,
	height: 25,
	vy: 5,
	vx: 5,
	draw: function(offsetX, offsetY) {
		var positionX = canvas.width - offsetX;
		var positionY = canvas.height - offsetY;

		ctx.beginPath();
		ctx.rect(positionX, positionY, this.width, this.height);
		ctx.fillStyle = 'blue';
		ctx.strokeStyle = 'black';
		ctx.stroke();
		ctx.fill();
		ctx.closePath();

		this.data.push({
			x: positionX,
			y: positionY
		});

		console.log(this.data);
	},
	drawAll: function() {
		var _this = this;
		for (var i = 0; i < _this.data.length; i++) {
			var brick = _this.data[i];
			if (brick) {
				ctx.beginPath();
				ctx.rect(brick.x, brick.y, _this.width, _this.height);
				ctx.fillStyle = 'blue';
				ctx.strokeStyle = 'black';
				ctx.stroke();
				ctx.fill();
				ctx.closePath();
			}
		}
	},
	data: [],
	move: function() {
		_this = this;
		_this.data = _this.data.map(function(v, i) {
			if (keyboard.isUpPress) {
				return {
					x: v.x,
					y: v.y - _this.vy
				};
			} else if (keyboard.isDownPress) {
				return {
					x: v.x,
					y: v.y + _this.vy
				};
			} else if (keyboard.isLeftPress) {
				return {
					x: v.x - _this.vx,
					y: v.y
				};
			} else if (keyboard.isRightPress) {
				return {
					x: v.x + _this.vx,
					y: v.y
				};
			}
		});
	}
};

var keyboard = {
	isUpPress: false,
	isDownPress: false,
	isLeftPress: false,
	isRightPress: false,
	keyUpHandler: function(e) {
		// press keyboard up
		// detect up down left right
		console.log('[trigger keyboard up]');
		keyboard.triggerPress(e.keyCode);
	},
	keyDownHandler: function(e) {
		// press keyboard down
		// step1: detect up down left right
		console.log('[trigger keyboard down]');
		keyboard.triggerPress(e.keyCode);

		// step2: move bricks
		bricks.move();
	},
	triggerPress: function(keycode) {
		switch (keycode) {
			case 37: // left
				this.isLeftPress = !this.isLeftPress;
				break;
			case 38: // up
				this.isUpPress = !this.isUpPress;
				break;
			case 39: // right
				this.isRightPress = !this.isRightPress;
				break;
			case 40: //down
				this.isDownPress = !this.isDownPress;
				break;
		}
	}
};

document.addEventListener('keydown', keyboard.keyDownHandler, false);
document.addEventListener('keyup', keyboard.keyUpHandler, false);

function draw() {
	// drawSquare();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	bricks.drawAll();
	requestAnimationFrame(draw);
}

bricks.draw(100, 100);
bricks.draw(126, 100);
draw();
