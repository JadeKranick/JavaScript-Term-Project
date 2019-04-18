window.onscroll = function() {scrollFunction()};
  
  function scrollFunction() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      document.getElementById("navbar").style.padding = "30px 10px";
      document.getElementById("logo").style.fontSize = "3em;";
    } else {
      document.getElementById("navbar").style.padding = "80px 10px";
      document.getElementById("logo").style.fontSize = "3em;";
    }
  }
  window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
var myGamePiece;
var myBackground;
var myObstacles = [];
var myScore;
var myLevel;

function startGame() {
  myGamePiece = new component(90, 50, "media/garfield(1).png", 10, 120, "image");
  myScore = new component("30px", "Consolas", "white", 280, 40, "text");
  myLevel = new component("30px", "Consolas", "white", 80, 40, "text");
  myBackground = new component(900, 500, "media/sauceBackground.jpg", 0,0, "background")
  myGameArea.start();
}

var myGameArea = {
  canvas : document.getElementById("canvas"),
  start : function() {
      this.canvas.width = 700;
      this.canvas.height = 400;
      this.context = this.canvas.getContext("2d");
      // document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      this.frameNo = 0;
      this.interval = setInterval(updateGameArea, 20);
      window.addEventListener('keydown', function (e) {
          myGameArea.key = e.keyCode;
      })
      window.addEventListener('keyup', function (e) {
          myGameArea.key = false;
      })
      },
  clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
      clearInterval(this.interval);
  }
}

function component(width, height, color, x, y, type) {
  this.gamearea = myGameArea;
  this.type = type;
  if (type == "image" || type== "background") {
      this.image = new Image();
      this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;    
  this.x = x;
  this.y = y;    
  this.update = function() {
      ctx = myGameArea.context;
      if (this.type == "text") {
          ctx.font = this.width + " " + this.height;
          ctx.fillStyle = color;
          ctx.fillText(this.text, this.x, this.y);
      }
      else if (type == "image" || type== "background"){
          ctx.drawImage(this.image, 
              this.x, 
              this.y,
              this.width, this.height);
            if (type== "background"){
                ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
            }
      }  
      else {
          ctx.fillStyle = color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
      }
  }
  this.newPos = function() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.type =="background"){
          if(this.x == -(this.width)){
              this.x=0;
          }
      }        
  }
  this.crashWith = function(otherobj) {
      var myleft = this.x;
      var myright = this.x + (this.width);
      var mytop = this.y + 15;
      var mybottom = this.y + (this.height) - 19;
      var otherleft = otherobj.x;
      var otherright = otherobj.x + (otherobj.width);
      var othertop = otherobj.y;
      var otherbottom = otherobj.y + (otherobj.height);
      var crash = true;
      if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
          crash = false;
      }
      return crash;
  }
}

function updateGameArea() {
  var x, height, gap, minHeight, maxHeight, minGap, maxGap;
  for (i = 0; i < myObstacles.length; i += 1) {
      if (myGamePiece.crashWith(myObstacles[i])) {
          myGameArea.stop();
          return;
      } 
  }
  myGameArea.clear();
  myBackground.speedX=-1;
  myBackground.newPos();
  myBackground.update();

  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
  if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -1; }
  if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 1; }
  if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -1; }
  if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 1; }
  myGamePiece.newPos();    
  myGamePiece.update();

  myGameArea.frameNo += 1;
  if (myGameArea.frameNo == 1 || everyinterval(150)) {
      x = myGameArea.canvas.width;
      minHeight = 20;
      maxHeight = 200;
      height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
      minGap = 100;
      maxGap = 200;
      gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
  myObstacles.push(new component(60, height, "media/noodle.png", x, 0, "image"));
  myObstacles.push(new component(60, x-height-gap, "media/noodle.png", x, height+gap, "image"));
  //  myObstacles.push(new component(20, height, "crimson", x, 0));
  //     myObstacles.push(new component(20, x - height - gap, "goldenrod", x, height + gap));

  }
  for (i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].speedX = -1;
      myObstacles[i].newPos();
      myObstacles[i].update();
  }
  myScore.text="SCORE: " + myGameArea.frameNo;
  myScore.update();
  myLevel.text="Level: " + Math.round(myGameArea.frameNo/500);
  myLevel.update();
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}