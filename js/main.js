var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');



var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight-36;

document.addEventListener("keyup", keyUpHandler, false);

function random(min, max){
    return Math.floor(Math.random()*(max - min + 1) + min);
}

var head = function(x, y, velX, velY) {
	this.x=x;
    this.y=y;
    this.velX = velX;
    this.velY = velY;
};

var body = function(par) {
    this.x=par.x+5;
    this.y=par.y;
    this.par = par; // body just above the current body i.e parent
};

var snake = function(x, y, velX, velY, len) {
    //var l=new coor(x,y);
    this.hd = new head( x, y, velX, velY);
    var front = this.hd;
    var bd = [];
    for(var i = 0; i < len-1 ; i++) {
        var x = new body(front);
        front = x;
        bd.push(x);
    }
    this.bd =bd;
    console.log(bd);
};

snake.prototype.addBody = function( n ) {
    front = this.bd[this.bd.length-1];
    for(var i = 0; i < n; i++) {
        var x = new body(front);
        front = x;
        this.bd.push(x);
    }
}

snake.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = "#2196F3";
    ctx.rect(this.hd.x, this.hd.y, 10, 10);
    //ctx.rect(this.bd[0].h.x +100,this.bd[0].par.y +100, 70,70 );
    //ctx.fill();
    for(var i=0 ; i < this.bd.length; i++){
        ctx.rect(this.bd[i].x, this.bd[i].y, 10, 10);
    }
    ctx.fill();
    ctx.closePath();
};

snake.prototype.update = function() {
    
    for(var i=this.bd.length-1; i>=0 ; i--){
        this.bd[i].x= this.bd[i].par.x;
        this.bd[i].y= this.bd[i].par.y;
    }
    
    this.hd.x = (this.hd.x+this.hd.velX + width) % width;
    this.hd.y = (this.hd.y+this.hd.velY + height) % height;
};

var testSnake = new snake(1700, 100, -5, 0 ,50);


function keyUpHandler(e) {
    if(e.keyCode == 39) {
        var temp=testSnake.hd.velY;
        testSnake.hd.velY = testSnake.hd.velX;
        testSnake.hd.velX = -temp;
    }
    else if(e.keyCode == 37) {
        var temp = testSnake.hd.velY;
        testSnake.hd.velY = -testSnake.hd.velX;
        testSnake.hd.velX = temp;
    }
};

var foodType = ['a','b','c'];

function food(x, y, t){
    this.x = x;
    this.y = y;
    this.t = foodType[t];
};

foods = [];//i know foods kuch nhi hota h :p

function generateFood( n ) {
    while(foods.length < n){
        foods.push(new food(random(0, width-7), random(0, height-7), 0));
    }
};

function drawFood() {
    for(var i=0; i < foods.length; i++){
        ctx.beginPath();
        ctx.fillStyle = "#2196F3";
        if(foods[i].t == 'a')
        ctx.fillRect(foods[i].x, foods[i].y, 8, 8);
        else if(foods[i].t == 'b')
        ctx.fillRect(foods[i].x, foods[i].y, 6, 6);
        else if(foods[i].t == 'c')
        ctx.fillRect(foods[i].x, foods[i].y, 7, 7);
        ctx.fill();
        ctx.closePath();
    }
}

snake.prototype.eatFood = function() {
    for(var i=0; i < foods.length; i++){
        if(((this.hd.x>=foods[i].x)&&(this.hd.x<foods[i].x+5))&&(((this.hd.y > foods[i].y)&&((this.hd.y) < foods[i].y+8))||((this.hd.y + 10 > foods[i].y)&&((this.hd.y + 10 < foods[i].y+8)))))
        {
            foods.splice(i,1);
            this.addBody(5);
        }
        else if((((this.hd.y>=foods[i].y)&&(this.hd.y<foods[i].y+5)))&&(((this.hd.x > foods[i].x)&&((this.hd.x) < foods[i].x+8))||((this.hd.x + 10 > foods[i].x)&&((this.hd.x + 10 < foods[i].x+8)))))
        {
            foods.splice(i,1);
            this.addBody(5);
        }
    }
};

snake.prototype.collisionTest = function() {
    for(var i=3; i<this.bd.length;i++){
        if(((this.hd.x>this.bd[i].x)&&(this.hd.x<this.bd[i].x+6))&&(((this.hd.y > this.bd[i].y)&&((this.hd.y) < this.bd[i].y+10))||((this.hd.y + 10 > this.bd[i].y)&&((this.hd.y + 10 < this.bd[i].y+10)))))
        {
            alert("Game over");
            document.location.reload();
        }
        else if((((this.hd.y>this.bd[i].y)&&(this.hd.y<this.bd[i].y+6)))&&(((this.hd.x > this.bd[i].x)&&((this.hd.x) < this.bd[i].x+8))||((this.hd.x + 10 > this.bd[i].x)&&((this.hd.x + 10 < this.bd[i].x+10)))))
        {
            alert("Game over");
            document.location.reload();
        }
       }
}

function loop() {
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0,0,width,height);
    
    testSnake.draw();
    testSnake.update();
    
    testSnake.collisionTest();
    
    generateFood(500);
    drawFood();
    
    
    testSnake.eatFood();
    //window.setInterval(loop,1000);
    requestAnimationFrame(loop);
}

window.onload=loop();

