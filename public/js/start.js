var res = 15;

//Calculate window size
var width = Math.floor(window.innerWidth / res);
var height = Math.floor(window.innerHeight / res);

function Canvas(width, height) {
    this.width = width;
    this.height = height;
    this.res = 15;
    this.grid = [];
}

Canvas.prototype.initialise = function() {
  this.createBoard();
}

Canvas.prototype.createBoard = function() {

    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 56;

    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (i = 0; i <= this.height; i++) {
      this.grid[i] = new Array(this.width);
      for (j = 0; j <= this.width; j++) {
        this.grid[i][j] = Math.round(Math.random());
      }
    }

    for (i = 0; i <= this.height; i++) {
      for (j = 0; j <= this.width; j++) {
        ctx.beginPath();
        ctx.arc(j * this.res, i * this.res, 2, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgb(' + (255 * this.grid[i][j]) + ',' + (255 * this.grid[i][j]) + ',' + (255 * this.grid[i][j]) + ')';
        ctx.fill();
      }
    }

    for (i = 0; i < this.height; i++) {
      for (j = 0; j < this.width; j++) {
        var x = j * this.res;
        var y = i * this.res;
        var step = this.res;
        var halfStep = this.res * 0.5;

        state = this.getState(i, j);
        
        switch (state) {
          case 1:
            this.drawLine(x, y + halfStep, x + halfStep, y + step);
            break;
          case 2:
            this.drawLine(x + halfStep, y + step, x + step, y + halfStep);
            break;
          case 3:
            this.drawLine(x, y + halfStep, x + step, y + halfStep);
            break;
          case 4:
            this.drawLine(x + step, y + halfStep, x + halfStep, y);
            break;
          case 5:
            this.drawLine(x, y + halfStep, x + halfStep, y);
            this.drawLine(x + halfStep, y + step, x + step, y + halfStep);
            break;
          case 6:
            this.drawLine(x + halfStep, y + step, x + halfStep, y);
            break;
          case 7:
            this.drawLine(x, y + halfStep, x + halfStep, y);
            break;
          case 8:
            this.drawLine(x, y + halfStep, x + halfStep, y);
            break;
          case 9:
            this.drawLine(x + halfStep, y + step, x + halfStep, y);
            break;
          case 10:
            this.drawLine(x, y + halfStep, x + halfStep, y + step);
            this.drawLine(x + step, y + halfStep, x + halfStep, y);
            break;
          case 11:
            this.drawLine(x + step, y + halfStep, x + halfStep, y);
            break;
          case 12:
            this.drawLine(x, y + halfStep, x + step, y + halfStep);
            break;
          case 13:
            this.drawLine(x + halfStep, y + step, x + step, y + halfStep);
            break;
          case 14:
            this.drawLine(x, y + halfStep, x + halfStep, y + step);
            break;
        }
      }
    }
}

Canvas.prototype.getState = function(i, j) {
  var a = this.grid[i+1][j  ];
  var b = this.grid[i+1][j+1];
  var c = this.grid[i  ][j+1];
  var d = this.grid[i  ][j  ];

  return (a * 1) + (b * 2) + (c * 4) + (d * 8);
}

Canvas.prototype.drawLine = function(ax, ay, bx, by) {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.stroke();
}

function setup() {
  let board = new Canvas(width, height);
  board.initialise();
  // startMarchingSquares();
}

function startMarchingSquares(board) {
  function timeout(index) {
    setTimeout(function () {

      board.iterations++;

    
      timeout(index++);
    }, 0);
  }
  timeout(0);
}

setup();