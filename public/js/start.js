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
}

Canvas.prototype.initialise = function () {
  this.createGrid();
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

Canvas.prototype.getState = function (i, j) {
  var a = this.grid[i + 1][j];
  var b = this.grid[i + 1][j + 1];
  var c = this.grid[i][j + 1];
  var d = this.grid[i][j];

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
  this.createGrid();
  this.clearCanvas();
  this.drawCanvas();
  this.drawPoints();
  this.drawLines();
  this.startAnimation();
}

Canvas.prototype.startAnimation = function() {
  this.animation = setTimeout(Canvas.prototype.iteration.bind(this), 400);
  this.control.innerHTML = "Stop";
}

Canvas.prototype.stopAnimation = function() {
  window.clearTimeout(this.animation);
  this.control.innerHTML = "Start";
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