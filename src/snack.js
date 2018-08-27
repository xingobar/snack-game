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
	isContinue: false, // 是否持續
	checkContinue: function() {
		// 檢查是否要持續
		if (keyboard.counter <= _this.data.length - 1 || keyboard.counter > _this.data.length)
			if (!this.isContinue) this.isContinue = true;
	},
	checkReset: function() {
		var _this = this;
		if (_this.isContinue) {
			keyboard.counter = 1;
			_this.isContinue = false;
		}
	},
	move: function() {
		_this = this;

		if (keyboard.isUpPress) {
			console.log('keypress up ');
			if (_this.data.length > 2) {
				_this.checkContinue();
				// 假如keyboard 按的個數小於總數的話，代表他須隨時變形
				// 否則只需直直走
				if (keyboard.counter <= _this.data.length - 1) {
					var i = keyboard.counter;
					var v = _this.data[i];
					var next = i + 1;

					if (next >= _this.data.length) next = _this.data.length - 1;

					if (_this.data[i].y - _this.data[next].y === 0) {
						for (var j = keyboard.counter; j < _this.data.length; j++) {
							v = _this.data[j];
							if (keyboard.counter >= 2) {
								_this.data[j] = {
									x: v.x + _this.width,
									y: v.y,
									color: v.color
								};
							} else {
								_this.data[j] = {
									x: v.x + _this.width,
									y: v.y + _this.height,
									color: v.color
								};
							}
						}

						if (keyboard.counter >= 2) {
							for (var z = 0; z < keyboard.counter; z++) {
								v = _this.data[z];
								_this.data[z] = {
									x: v.x,
									y: v.y - _this.height,
									color: v.color
								};
							}
						}
					}
				} else {
					for (var i = 0; i < _this.data.length; i++) {
						v = _this.data[i];
						_this.data[i] = {
							x: v.x,
							y: v.y - _this.height,
							color: v.color
						};
					}
				}
			}
		} else if (keyboard.isLeftPress) {
			console.log('keypress left');

			//代表某個動作結束後才開始執行此動作
			if (this.isContinue) {
				keyboard.counter = 1;
				this.isContinue = false;
			}
			console.log(`keyboard counter => ${keyboard.counter}`);
			if (_this.data.length > 2) {
				// 假如keyboard 按的個數小於總數的話，代表他須隨時變形
				// 否則只需直直走
				if (keyboard.counter <= _this.data.length - 1) {
					var i = keyboard.counter;
					var v = _this.data[i];
					var next = i + 1;

					if (next >= _this.data.length) next = _this.data.length - 1;

					if (_this.data[i].x - _this.data[next].x === 0) {
						for (var j = keyboard.counter; j < _this.data.length; j++) {
							v = _this.data[j];
							_this.data[j] = {
								x: v.x,
								y: v.y - _this.height,
								color: v.color
							};
						}

						if (keyboard.counter >= 1) {
							for (var z = 0; z < keyboard.counter; z++) {
								v = _this.data[z];
								_this.data[z] = {
									x: v.x - _this.width,
									y: v.y,
									color: v.color
								};
							}
						}
					} else if (_this.data[i].y - _this.data[next].y === 0) {
						// todo

						v = _this.data[keyboard.counter];
						_this.data[keyboard.counter] = {
							x: v.x,
							y: v.y - _this.height,
							color: v.color
						};

						for (var j = keyboard.counter + 1; j < _this.data.length; j++) {
							v = _this.data[j];
							_this.data[j] = {
								x: v.x + this.width,
								y: v.y,
								color: v.color
							};
						}

						for (var z = 0; z < keyboard.counter; z++) {
							v = _this.data[z];
							_this.data[z] = {
								x: v.x - _this.width,
								y: v.y,
								color: v.color
							};
						}
					}
				} else {
					for (var i = 0; i < _this.data.length; i++) {
						v = _this.data[i];
						_this.data[i] = {
							x: v.x - _this.width,
							y: v.y,
							color: v.color
						};
					}
				}
			}
		}
	}
};

var keyboard = {
	isUpPress: false,
	isDownPress: false,
	isLeftPress: false,
	isRightPress: false,
	counter: 0,
	keyUpHandler: function(e) {
		// press keyboard up
		// detect up down left right
		keyboard.triggerPress(e.keyCode);
	},
	keyDownHandler: function(e) {
		// press keyboard down
		// step1: detect up down left right
		keyboard.triggerPress(e.keyCode);

		// step2: move bricks
		bricks.move();
	},
	triggerPress: function(keycode) {
		switch (keycode) {
			case 37: // left
				this.isLeftPress = !this.isLeftPress;
				if (this.isLeftPress) {
					this.counter++;
				}
				break;
			case 38: // up
				this.isUpPress = !this.isUpPress;
				if (this.isUpPress) {
					this.counter++;
				}
				break;
			case 39: // right
				this.isRightPress = !this.isRightPress;
				//this.counter++;
				break;
			case 40: //down
				this.isDownPress = !this.isDownPress;
				//this.counter++;
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
draw();
