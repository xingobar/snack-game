var canvas = document.getElementById('snack_canvas');
var ctx = canvas.getContext('2d');

var bricks = {
	width: 25,
	height: 25,
	vy: 5,
	vx: 5,
	draw: function(offsetX, offsetY, color) {
		var positionX = canvas.width - offsetX;
		var positionY = canvas.height - offsetY;

		ctx.beginPath();
		ctx.rect(positionX, positionY, this.width, this.height);
		ctx.fillStyle = color;
		ctx.strokeStyle = 'black';
		ctx.stroke();
		ctx.fill();
		ctx.closePath();

		this.data.push({
			x: positionX,
			y: positionY,
			color: color
		});
	},
	drawAll: function() {
		var _this = this;
		for (var i = 0; i < _this.data.length; i++) {
			var brick = _this.data[i];
			if (brick) {
				ctx.beginPath();
				ctx.rect(brick.x, brick.y, _this.width, _this.height);
				// ctx.fillStyle = 'blue';
				ctx.fillStyle = brick.color;
				ctx.strokeStyle = 'black';
				ctx.stroke();
				ctx.fill();
				ctx.closePath();
			}
		}
	},
	data: [],
	changePosition: function(direction) {
		var _this = this;
		for (var i = 0; i < _this.data.length; i++) {
			v = _this.data[i];

			if (i == 0) {
				switch (direction) {
					case 'up':
						_this.data[i] = {
							x: v.x,
							y: v.y - _this.height,
							color: v.color
						};
						break;
					case 'down':
						_this.data[i] = {
							x: v.x,
							y: v.y + _this.height,
							color: v.color
						};
						break;
					case 'left':
						_this.data[i] = {
							x: v.x - _this.width,
							y: v.y,
							color: v.color
						};
						break;
					case 'right':
						_this.data[i] = {
							x: v.x + _this.width,
							y: v.y,
							color: v.color
						};
						break;
				}
			} else {
				_this.data[i] = {
					x: prevX,
					y: prevY,
					color: v.color
				};
			}
			prevX = v.x;
			prevY = v.y;
		}
	},
	move: function() {
		_this = this;
		if (keyboard.isUpPress) {
			//代表某個動作結束後才開始執行此動作
			_this.changePosition('up');
		} else if (keyboard.isLeftPress) {
			_this.changePosition('left');
		} else if (keyboard.isRightPress) {
			_this.changePosition('right');
		} else if (keyboard.isDownPress) {
			_this.changePosition('down');
		}
	}
};

var keyboard = {
	isUpPress: false,
	isDownPress: false,
	isLeftPress: false,
	isRightPress: false,
	keyUpHandler: function(e) {
		keyboard.triggerPress(e.keyCode);
	},
	keyDownHandler: function(e) {
		keyboard.triggerPress(e.keyCode);
		bricks.move();
	},
	togglePress: function(direction) {
		if (bricks.data.length >= 2) {
			var diffX = bricks.data[0].x - bricks.data[1].x;
			var diffY = bricks.data[0].y - bricks.data[1].y;

			switch (direction) {
				case 'up':
					if (diffX > 0 || diffX < 0 || diffY < 0) {
						this.isUpPress = !this.isUpPress;
					}
					break;
				case 'down':
					if (diffX > 0 || diffX < 0 || diffY > 0) {
						this.isDownPress = !this.isDownPress;
					}
					break;
				case 'left':
					if (diffX < 0 || diffY < 0 || diffY > 0) {
						this.isLeftPress = !this.isLeftPress;
					}
					break;
				case 'right':
					if (diffX > 0 || diffY < 0 || diffY > 0) {
						this.isRightPress = !this.isRightPress;
					}
					break;
			}
		}
	},
	triggerPress: function(keycode) {
		switch (keycode) {
			case 37: // left
				this.togglePress('left');
				break;
			case 38: // up
				this.togglePress('up');
				break;
			case 39: // right
				this.togglePress('right');
				break;
			case 40: //down
				this.togglePress('down');
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

bricks.draw(100, 100, 'blue');
bricks.draw(125, 100, 'red');
bricks.draw(150, 100, 'green');
bricks.draw(175, 100, 'gray');
bricks.draw(200, 100, 'gray');
draw();
