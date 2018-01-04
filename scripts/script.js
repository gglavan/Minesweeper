var options = [];
var grid;

var Cell = function(i,j) {
  this.i = i;
  this.j = j;
  this.neighbors = 0;
  this.el = document.createElement('div');
  this.revealed = false;
  this.filled = false;
  this.bomb = false;
  $(this.el).bind('click', this.click.bind(this));
}

////////// Methods //////////
Cell.prototype.click = function() {
  if(!this.revealed) { 
    this.revealed = true;
    if(this.neighbors > 0) {       
      $(this.el).html(grid[this.i][this.j].neighbors);
      $(this.el).css("background-color","white");
    } else if(this.bomb) {
      this.startFill();
      console.log("GAME OVER!");
    } else {
      grid[this.i][this.j].reveal();
    }
  }
}

Cell.prototype.display = function() {
  $(this.el).addClass("spot").appendTo('#container');
}

Cell.prototype.countNeighbors = function() {
  if(this.bomb) {
    this.neighbors = -1;
    return;
  }
  for(var x = -1; x <= 1; x++) {
  for(var y = -1; y <= 1; y++) {
    var i = this.i + x;
    var j = this.j + y;
     if(i > -1 && i < rows && j > -1 && j < cols) {
        if(grid[i][j].bomb) {
          this.neighbors++;        
        }  
      }
    }
  }
  this.setColor();
}

Cell.prototype.setColor = function() {
  switch(this.neighbors) {
    case 1 : $(this.el).css("color","blue"); break;
    case 2 : $(this.el).css("color","green"); break;
    case 3 : $(this.el).css("color","red"); break;
    case 4 : $(this.el).css("color","darkblue"); break;
    case 5 : $(this.el).css("color","indigo"); break;
    case 6 : $(this.el).css("color","cadetblue"); break;
    case 7 : $(this.el).css("color","black"); break;
    case 8 : $(this.el).css("color","darkgrey"); break;
  }
}

Cell.prototype.reveal = function() {
  this.revealed = true;
  $(this.el).animate({backgroundColor: "white"}, 10, () => {
    if(this.neighbors > 0) {
      $(this.el).html(grid[this.i][this.j].neighbors);
    } else {
      $(this.el).html('');
      this.openSpots();
    }
  });
}

Cell.prototype.openSpots = function() {  
    for(var x = -1; x <= 1; x++) {
    for(var y = -1; y <= 1; y++) {
      var i = this.i + x;
      var j = this.j + y;
      if(i > -1 && i < rows && j > -1 && j < cols) {
        if(!grid[i][j].bomb && !grid[i][j].revealed) {
          grid[i][j].reveal();
        }  
      }
    }
  }
}

Cell.prototype.floodFill = function() {
  this.filled = true;
    if(this.bomb){
      $(this.el).animate({backgroundColor: "rgb(230,0,0)"}, 5, () => {
        $(this.el).children(":first").css("display", "block");
        this.startFill();
      });  
    }else {
      $(this.el).animate({backgroundColor: "white"}, 5, () => {
      if(this.neighbors > 0) {
        $(this.el).html(grid[this.i][this.j].neighbors);      
    }else {
      $(this.el).html('');
    }
    this.startFill();
    });
  }
}

Cell.prototype.startFill = function() {
  this.revealed = true;
  for(var x = -1; x <= 1; x++) {
    for(var y = -1; y <= 1; y++) {
      var i = this.i + x;
      var j = this.j + y;
      if(i > -1 &&  i <rows &&  j > -1 &&  j < cols) {
         if(!grid[i][j].filled) {
          grid[i][j].floodFill();
        }  
      }
    }
  }
}

////////// Functions //////////
function setBombs() {
  for(var n = 0; n < mines; n++){
    var bomb = document.createElement('i');
    var index = Math.floor(Math.random() * options.length);
    var choice = options[index];
    var i = choice[0];
    var j = choice[1];
    grid[i][j].bomb = true;
    $(bomb).addClass("fa fa-bomb bomb").appendTo(grid[i][j].el);
    $(bomb).css("display", "none");
    options.splice(index, 1);
  }
  for(var i = 0; i < rows; i++) {
    for(var j = 0; j < cols; j++) {
      grid[i][j].countNeighbors();
    }
  }
}

function createSpots() {
  $(document).ready(function() {
    grid = new Array(rows);
    for(var i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
      for(var j = 0; j < cols; j++) {
        grid[i][j] = new Cell(i, j);;
        grid[i][j].display();
        options.push([i, j]);
      }
    } 
  setBombs();
  });
}

function generate() {
  $("#container").empty();
  options = [];
  mines = parseInt($("#minesID").val(), 10);
  rows = parseInt($("#rowsID").val(), 10);
  cols = parseInt($("#colsID").val(), 10);
  $("#container").css({"width": cols * 20, "height": rows * 20});
  createSpots();
}

////////// On ready ////////// 
$(document).ready(function() {
  generate();
});