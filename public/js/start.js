function MetaBall(x, y) {
  this.x = x;
  this.y = y;
  this.angle = randomNumber(0, 2 * 3.14159265);
  this.xspeed = randomNumber(1, 3) * Math.cos(this.angle);
  this.yspeed = randomNumber(1, 3) * Math.sin(this.angle);
  this.r = randomNumber(1, 2);
}

MetaBall.prototype.update = function (width, height) {
  this.x += this.xspeed;
  this.y += this.yspeed;

  if (this.x > width || this.x < 0) {
    this.xspeed *= -1;
  };

  if (this.y > height || this.y < 0) {
    this.yspeed *= -1
  };
}

function Canvas(width, height, res) {
  this.control = document.getElementById("control");
  this.canvas = document.getElementById("canvas");
  this.ctx = this.canvas.getContext("2d");
  this.width = Math.round(width / res);
  this.height = Math.round(height / res);
  this.canvas.width = width;
  this.canvas.height = height;
  this.res = res
  this.grid = [];
  this.iter = 0;
  this.animation;
  this.metaBalls = [];
}

Canvas.prototype.initialise = function () {
  this.addMetaBalls();
  this.createMetaBallGrid();
  //this.createGrid();
  this.drawCanvas();
  this.drawPoints();
  this.drawLines();
}

Canvas.prototype.createGrid = function () {
  for (i = 0; i <= this.height; i++) {
    this.grid[i] = new Array(this.width);
    for (j = 0; j <= this.width; j++) {
      this.grid[i][j] = Math.round(Math.random());
    }
  }
}

Canvas.prototype.addMetaBalls = function () {
  for (i = 0; i <= 7; i++) {
    this.metaBalls.push(new MetaBall(randomNumber(0, this.height), randomNumber(0, this.width)));
  }
}

Canvas.prototype.updateMetaBalls = function () {
  for (i = 0; i < this.metaBalls.length; i++) {
    this.metaBalls[i].update(this.height, this.width);
  }
}

Canvas.prototype.createMetaBallGrid = function () {
  for (x = 0; x <= this.height; x++) {
    this.grid[x] = new Array(this.width);
    for (y = 0; y <= this.width; y++) {
      let sum = 0;
      for (i = 0; i < this.metaBalls.length; i++) {
        let xdif = x - this.metaBalls[i].x;
        let ydif = y - this.metaBalls[i].y;
        let d = Math.sqrt(xdif * xdif + ydif * ydif);
        sum += (2 * this.metaBalls[i].r) / d;
      }
      this.grid[x][y] = sum;
    }
  }
}

Canvas.prototype.getState = function (i, j) {
  var a = Math.floor(this.grid[i + 1][j]);
  var b = Math.floor(this.grid[i + 1][j + 1]);
  var c = Math.floor(this.grid[i][j + 1]);
  var d = Math.floor(this.grid[i][j]);

  return (a * 1) + (b * 2) + (c * 4) + (d * 8);
}

Canvas.prototype.drawCanvas = function () {
  this.ctx.fillStyle = "grey";
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

Canvas.prototype.clearCanvas = function () {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Canvas.prototype.drawPoint = function (i, j, radius) {
  this.ctx.beginPath();
  this.ctx.arc(j * this.res, i * this.res, radius, 0, 2 * Math.PI);
  this.ctx.fillStyle = `rgb(
    ${255 * this.grid[i][j]},
    ${255 * this.grid[i][j]},
    ${255 * this.grid[i][j]}
    )`;
  this.ctx.fill();
}

Canvas.prototype.drawPoints = function () {
  for (i = 0; i <= this.height; i++) {
    for (j = 0; j <= this.width; j++) {
      this.drawPoint(i, j, 1);
    }
  }
}

Canvas.prototype.drawLine = function (ax, ay, bx, by) {
  this.ctx.beginPath();
  this.ctx.moveTo(ax, ay);
  this.ctx.lineTo(bx, by);
  this.ctx.stroke();
}

Canvas.prototype.drawLines = function () {
  for (i = 0; i < this.height; i++) {
    for (j = 0; j < this.width; j++) {
      var x = j * this.res;
      var y = i * this.res;
      var step = this.res;
      var halfStep = this.res * 0.5;
      var state = this.getState(i, j);

      switch (state) {
        case 1:
        case 14:
          this.drawLine(x, y + halfStep, x + halfStep, y + step);
          break;
        case 2:
        case 13:
          this.drawLine(x + halfStep, y + step, x + step, y + halfStep);
          break;
        case 3:
        case 12:
          this.drawLine(x, y + halfStep, x + step, y + halfStep);
          break;
        case 4:
        case 11:
          this.drawLine(x + step, y + halfStep, x + halfStep, y);
          break;
        case 5:
          this.drawLine(x, y + halfStep, x + halfStep, y);
          this.drawLine(x + halfStep, y + step, x + step, y + halfStep);
          break;
        case 6:
        case 9:
          this.drawLine(x + halfStep, y + step, x + halfStep, y);
          break;
        case 7:
        case 8:
          this.drawLine(x, y + halfStep, x + halfStep, y);
          break;
        case 10:
          this.drawLine(x, y + halfStep, x + halfStep, y + step);
          this.drawLine(x + step, y + halfStep, x + halfStep, y);
      }
    }
  }
}

Canvas.prototype.iteration = function () {
  this.iter++
  this.updateMetaBalls();
  this.createMetaBallGrid();
  //this.createGrid();
  this.clearCanvas();
  this.drawCanvas();
  this.drawPoints();
  this.drawLines();
  this.startAnimation();
}

Canvas.prototype.startAnimation = function() {
  this.animation = setTimeout(Canvas.prototype.iteration.bind(this), 10);
  this.control.innerHTML = "Stop";
}

Canvas.prototype.stopAnimation = function() {
  window.clearTimeout(this.animation);
  this.control.innerHTML = "Start";
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(document).ready(function () {
  let canvas = new Canvas(window.innerWidth, window.innerHeight - 56, 15);

  canvas.initialise();

  canvas.control.onclick = function () {
    if (control.innerHTML == "Start") {
      canvas.startAnimation();
    } else {
      canvas.stopAnimation();
    }
  }
});