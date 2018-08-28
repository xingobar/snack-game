var canvas = document.getElementById('snack_canvas');
var ctx = canvas.getContext('2d');
var moveInterval = null;

var bricks = {
	width: 20,
	height: 20,
	vy: 5,
	vx: 5,
	newX: 0,
	newY: 0,
	isEaten: false,
	isShow: false,
	tmpPositionX: 0, // 供外面使用
	tmpPositionY: 0, // 供外面使用
	score: 0,
	eatDetection: function() {
		var _this = this;
		// 判斷頭是否有吃到
		if (_this.data[0].x === _this.newX && _this.data[0].y === _this.newY) {
			_this.data.push({
				x: _this.data[_this.data.length - 1].x + _this.width,
				y: _this.data[_this.data.length - 1].y + _this.height,
				color: 'yellow'
			});
			_this.isEaten = true;
			_this.isShow = false;
			_this.newX = 0;
			_this.newY = 0;
			_this.score++;
		} else {
			var firstBrick = _this.data[0];
			for (var i = 1; i < _this.data.length; i++) {
				if (firstBrick.x === _this.data[i].x && firstBrick.y === _this.data[i].y) {
					alert('game over');
					window.location.reload();
				}
			}
		}
	},
	collision: function() {
		// 是否已超出邊界
		var _this = this;
		if (
			_this.data[0].x + _this.width > canvas.width ||
			_this.data[0].y + _this.height > canvas.height ||
			_this.data[0].x < 0 ||
			_this.data[0].y < 0
		) {
			alert('game over');
			window.location.reload();
		}
	},
	random: function(max) {
		// 產生亂數
		return Math.floor(Math.random() * Math.floor(max));
	},
	generateNewPosition: function() {
		// 產生位置
		var widthMax = Math.floor(canvas.width / this.width);
		var heightMax = Math.floor(canvas.height / this.height);
		var widthRandom = this.random(widthMax) + 1;
		var heightRandom = this.random(heightMax) + 1;
		var positionX = canvas.width - widthRandom * this.width;
		var positionY = canvas.height - heightRandom * this.height;
		if (!this.isShow) {
			ctx.rect(positionX, positionY, this.width, this.height);
			this.newX = positionX;
			this.newY = positionY;
		} else {
			//供外面暫時存取用
			this.tmpPositionX = positionX;
			this.tmpPositionY = positionY;
		}
	},
	randomDraw: function() {
		ctx.beginPath();
		if (!this.isShow) {
			this.generateNewPosition();
		} else {
			ctx.rect(this.newX, this.newY, this.width, this.height);
		}
		ctx.fillStyle = 'yellow';
		ctx.strokeStyle = 'black';
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
	},
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
	drawScore: function() {
		ctx.font = '16px Arial';
		ctx.fillStyle = '#0095DD';
		ctx.fillText('Score: ' + this.score, 8, 20);
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

			if (i === 0) {
				_this.eatDetection();
				_this.collision();
			}
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
		//keyboard.triggerPress(e.keyCode);
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
						clearInterval = null;
						this.isUpPress = !this.isUpPress;
						this.isDownPress = false;
						this.isLeftPress = false;
						this.isRightPress = false;
					}
					break;
				case 'down':
					if (diffX > 0 || diffX < 0 || diffY > 0) {
						clearInterval = null;
						this.isDownPress = !this.isDownPress;
						this.isUpPress = false;
						this.isLeftPress = false;
						this.isRightPress = false;
					}
					break;
				case 'left':
					if (diffX < 0 || diffY < 0 || diffY > 0) {
						clearInterval = null;
						this.isLeftPress = !this.isLeftPress;
						this.isUpPress = false;
						this.isDownPress = false;
						this.isRightPress = false;
					}
					break;
				case 'right':
					if (diffX > 0 || diffY < 0 || diffY > 0) {
						clearInterval = null;
						this.isRightPress = !this.isRightPress;
						this.isUpPress = false;
						this.isDownPress = false;
						this.isLeftPress = false;
					}
					break;
			}
		} else {
			switch (direction) {
				case 'up':
					clearInterval = null;
					this.isUpPress = !this.isUpPress;
					this.isDownPress = false;
					this.isLeftPress = false;
					this.isRightPress = false;
					break;
				case 'down':
					clearInterval = null;
					this.isDownPress = !this.isDownPress;
					this.isUpPress = false;
					this.isLeftPress = false;
					this.isRightPress = false;
					break;
				case 'left':
					clearInterval = null;
					this.isLeftPress = !this.isLeftPress;
					this.isUpPress = false;
					this.isDownPress = false;
					this.isRightPress = false;
					break;
				case 'right':
					clearInterval = null;
					this.isRightPress = !this.isRightPress;
					this.isUpPress = false;
					this.isDownPress = false;
					this.isLeftPress = false;
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
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	bricks.drawAll();
	bricks.drawScore();

	if (bricks.isShow) bricks.randomDraw();
	if (!bricks.isShow) {
		bricks.randomDraw();
		bricks.isShow = true;
	}

	if (!moveInterval) {
		moveInterval = setInterval(function() {
			bricks.move();
		}, 500);
	}

	requestAnimationFrame(draw);
}

// bricks.draw(125, 100, 'red');
// bricks.draw(150, 100, 'green');
// bricks.draw(175, 100, 'gray');
// bricks.draw(200, 100, 'gray');
draw();

bricks.generateNewPosition();
var positionX = bricks.tmpPositionX;
var positionY = bricks.tmpPositionY;

if (positionX === bricks.newX && positionY === bricks.newY) {
	if (positionX === canvas.width) {
		positionX -= bricks.width;
	} else {
		positionX += bricks.width;
	}

	if (positionY === canvas.height) {
		positionY -= bricks.height;
	} else {
		positionY += bricks.height;
	}
}

bricks.draw(canvas.width - positionX, canvas.height - positionY, 'blue');
