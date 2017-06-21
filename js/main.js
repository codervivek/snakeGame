var color = ["#2196F3","#e91e63","#ce93d8","#e8eaf6","#00bcd4","#2E7D32","#ffee58","#fb8c00"];
var speed = 5;
var foodNo = 50;
var snakebdw = 10;
var snakebdh = 10;
var foodsize = 8;
var lastman = true;
var multipleplayers;

console.log(localStorage.getItem("nop"));

document.getElementsByTagName('body').color = color[0];

var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

var play=true;
var highscore=0;

if(localStorage.getItem("hs"))
    highscore=parseInt(localStorage.getItem("hs"));

document.getElementById('highscore').innerHTML = highscore;

var score = 0;

var playButton = document.getElementById('play');
playButton.onclick = ((e)=>{
    play=play?false:true;
    if(play){
        playButton.innerHTML="PAUSE";
    }
    else{
        playButton.innerHTML="RESUME";
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0,0,width,height);
        ctx.fillStyle = color[0];
        ctx.fillRect(width*0.25,height*0.25,width*0.5,height*0.5);
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.font = '300px serif';   
        ctx.fillText("PAUSED",width*0.3,height*0.6,width*0.4);
    }
});

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight-36;

document.addEventListener("keydown", keyDownHandler, false);
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

var body = function(par,s) {
    this.x=par.x+s;
    this.y=par.y;
    this.par = par; // body just above the current body i.e parent
};

var snake = function(x, y, velX, velY, len, color, keyr, keyl, keyu, keyd, name) {
    //var l=new coor(x,y);
    this.hd = new head( x, y, velX, velY);
    this.color=color;
    var front = this.hd;
    var bd = [];
    for(var i = 0; i < len-1 ; i++) {
        var x = new body(front, this.velX);
        front = x;
        bd.push(x);
    }
    this.bd =bd;
    this.keyr = keyr;
    this.keyl = keyl;
    this.keyu = keyu;
    this.keyd = keyd;
    this.score = 0;
    this.name =name;
    this.mul=1;
    this.s=1;
    this.bomb=0;
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
    ctx.fillStyle = this.color;
    ctx.rect(this.hd.x, this.hd.y, snakebdw*this.mul, snakebdh*this.mul);
    for(var i=0 ; i < this.bd.length; i++){
        ctx.rect(this.bd[i].x, this.bd[i].y, snakebdw*this.mul, snakebdh*this.mul);
    }
    
    ctx.fill();
    ctx.closePath();
};

snake.prototype.update = function() {
    
    for(var i=this.bd.length-1-this.bomb; i>=0 ; i--){
        this.bd[i].x= this.bd[i].par.x;
        this.bd[i].y= this.bd[i].par.y;
    }
    
    this.hd.x = (this.hd.x+this.hd.velX + width) % width;
    this.hd.y = (this.hd.y+this.hd.velY + height) % height;
};



function keyDownHandler(e) {
    for(var i=0; i < testSnake.length; i++){
        
        if(e.keyCode == testSnake[i].keyr) {
            var temp=testSnake[i].hd.velY;
            testSnake[i].hd.velY = testSnake[i].hd.velX;
            testSnake[i].hd.velX = -temp;
        }
        else if(e.keyCode == testSnake[i].keyl) {
            var temp = testSnake[i].hd.velY;
            testSnake[i].hd.velY = -testSnake[i].hd.velX;
            testSnake[i].hd.velX = temp;
        }
        if((e.keyCode == testSnake[i].keyu)&&(testSnake[i].s!=0)) {
            testSnake[i].hd.velX=2*testSnake[i].hd.velX;
            testSnake[i].hd.velY=2*testSnake[i].hd.velY;
            testSnake[i].s--;
        }
        if((e.keyCode==testSnake[i].keyd)&&(testSnake[i].bomb==0)){
            testSnake[i].bomb++;
        }
    }
};

function keyUpHandler(e) {
    for(var i=0; i < testSnake.length; i++){
        
        if((e.keyCode == testSnake[i].keyu)&&(testSnake[i].s!=1)) {
            testSnake[i].hd.velX=0.5*testSnake[i].hd.velX;
            testSnake[i].hd.velY=0.5*testSnake[i].hd.velY;
            testSnake[i].s++;
        }
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
        ctx.fillStyle = color[random(1,7)];
        if(foods[i].t == 'a')
        ctx.fillRect(foods[i].x, foods[i].y, foodsize, foodsize);
        else if(foods[i].t == 'b')
        ctx.fillRect(foods[i].x, foods[i].y, 6, 6);
        else if(foods[i].t == 'c')
        ctx.fillRect(foods[i].x, foods[i].y, 7, 7);
        ctx.fill();
        ctx.closePath();
    }
}

function updatescore() {
    var s='';
    for(var i=0; i < testSnake.length; i++){
        s+="Player "+testSnake[i].name+" : "+testSnake[i].score+" ";
        if(testSnake[i].score>highscore){
            document.getElementById('highscore').innerHTML=testSnake[i].score;
        }
    }
    document.getElementById('score').innerHTML=s;
}

snake.prototype.eatFood = function() {
    for(var i=0; i < foods.length; i++){
        if(((this.hd.x>=foods[i].x)&&(this.hd.x<foods[i].x+foodsize))&&(((this.hd.y > foods[i].y)&&((this.hd.y) < foods[i].y+foodsize))||((this.hd.y + snakebdh*this.mul > foods[i].y)&&((this.hd.y + snakebdh*this.mul < foods[i].y+foodsize)))))
        {
            foods.splice(i,1);
            this.addBody(3);
            this.score++;
            this.hd.velX*=1.01;
            this.hd.velY*=1.01;
            this.mul*=1.01;
            updatescore();
            
        }
        else if((((this.hd.y>=foods[i].y)&&(this.hd.y<foods[i].y+foodsize)))&&(((this.hd.x > foods[i].x)&&((this.hd.x) < foods[i].x+foodsize))||((this.hd.x + snakebdw*this.mul > foods[i].x)&&((this.hd.x + snakebdw*this.mul < foods[i].x+foodsize)))))
        {
            foods.splice(i,1);
            this.addBody(3);
            this.score++;
            this.hd.velX*=1.01;
            this.hd.velY*=1.01;
            this.mul*=1.01;
            updatescore();
        }
    }
};

function gameover() {
    newgame();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0,0,width,height);
    ctx.fillStyle = color[0];
    ctx.fillRect(width*0.25,height*0.25,width*0.5,height*0.5);
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.font = '300px serif';
    ctx.fillText("GAME OVER",width*0.3,height*0.6,width*0.4);
    play=false;
    playButton.innerHTML="Play Again";
    for(var i=0; i<testSnake.lenght; i++){
        if(testSnake[i].score>highscore){
            document.cookie="highScore="+testSnake[i].score;
            document.getElementById('highscore').innerHTML = testSnake[i].score;
            Materialize.toast("New Highscore:" + testSnake[i].score +" by "+testSnake[i].name,2000);
        }
        testSnake[i].score=0;
    }
}

snake.prototype.collisionTest = function() {
    
    
    
    for(var j=0; j < testSnake.length; j++){
         for(var i=3; i<testSnake[j].bd.length;i++){
            if(((this.hd.x>testSnake[j].bd[i].x)&&(this.hd.x<testSnake[j].bd[i].x+6))&&(((this.hd.y > testSnake[j].bd[i].y)&&((this.hd.y) < testSnake[j].bd[i].y+snakebdh*testSnake[j].mul))||((this.hd.y + snakebdh*this.mul > testSnake[j].bd[i].y)&&((this.hd.y + snakebdh*this.mul < testSnake[j].bd[i].y+snakebdh*testSnake[j].mul)))))
            {
                if(!(lastman&&(testSnake.length==0))){
                    Materialize.toast("Player "+this.name+" has lost.",2000);
                    
                }
                return true;
            }
            else if(((this.hd.y>testSnake[j].bd[i].y)&&(this.hd.y<testSnake[j].bd[i].y+6))&&(((this.hd.x > testSnake[j].bd[i].x)&&((this.hd.x) < testSnake[j].bd[i].x+snakebdw*testSnake[j].mul))||((this.hd.x + snakebdw*this.mul > testSnake[j].bd[i].x)&&((this.hd.x + snakebdw*this.mul < testSnake[j].bd[i].x+snakebdw*testSnake[j].mul)))))
            {
            if(!(lastman&&(testSnake.length==0))){

                Materialize.toast("Player "+this.name+" has lost.",2000);

                }
                return true;
            }
            
        }
    }
        for(var j=0; j < testSnake.length; j++){
         if(((this.hd.x>testSnake[j].hd.x)&&(this.hd.x<testSnake[j].hd.x+6))&&(((this.hd.y > testSnake[j].hd.y)&&((this.hd.y) < testSnake[j].hd.y+snakebdh*testSnake[j].mul))||((this.hd.y + snakebdh*this.mul > testSnake[j].hd.y)&&((this.hd.y + snakebdh*this.mul < testSnake[j].hd.y+snakebdh*testSnake[j].mul)))))
        {
            if(!(lastman&&(testSnake.length==0))){
                Materialize.toast("Player "+this.name+" has lost.",2000);

            }
            testSnake.splice(j,1);
            Materialize.toast("Player "+this.name+" has lost.",2000);
            return true;
        }
        else if(((this.hd.y>testSnake[j].hd.y)&&(this.hd.y<testSnake[j].hd.y+6))&&(((this.hd.x > testSnake[j].hd.x)&&((this.hd.x) < testSnake[j].hd.x+snakebdw*testSnake[j].mul))||((this.hd.x + snakebdw*this.mul > testSnake[j].hd.x)&&((this.hd.x + snakebdw*this.mul < testSnake[j].hd.x+snakebdw*testSnake[j].mul)))))
        {
        if(!(lastman&&(testSnake.length==0))){

            Materialize.toast("Player "+this.name+" has lost.",2000);

            }
            testSnake.splice(j,1);
            Materialize.toast("Player "+this.name+" has lost.",2000);
            return true;
        }


    }
    
    return false;
}

var testSnake;
function newgame(){
    foods = [];
    testSnake = [new snake(width*0.9, height*0.1, -speed, 0 ,10, color[random(1,7)], 39, 37, 38, 40, "1"),new snake(width*0.1, height*0.8, speed, 0 ,10, color[random(1,7)], 68, 65, 87, 83, "2"),new snake(width*0.9, height*0.9, -speed, 0 ,10, color[random(1,7)], 76, 74, 73, 75, "3"),new snake(width*0.1, height*0.2, speed, 0 ,10, color[random(1,7)], 102, 100, 104, 98, "4")];
    for(var i=4-parseInt(localStorage.getItem("nop"))-1;i>=0;i--){
        testSnake.splice(i,1);
    }
    if(testSnake.length>1){
        multipleplayers=true;
    }
    if(localStorage.getItem("hs"))
    highscore=parseInt(localStorage.getItem("hs"));
        
}

function loop() {
    if(play){
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(0,0,width,height);
        generateFood(foodNo);
        drawFood();
        
        for(var i=0; i < testSnake.length; i++){

            testSnake[i].draw();
            testSnake[i].update();
            testSnake[i].eatFood();
        
            if(testSnake[i].collisionTest()){
                updatescore();
                if(testSnake[i].score>highscore){
                    localStorage.setItem("hs",testSnake[i].score);
                }
                testSnake.splice(i,1);
                
                if((testSnake.length==1)&&(!lastman)){
                    Materialize.toast("Player "+testSnake[0].name+" has won.",2000);
                    gameover();
                }
                else if((lastman)&&(testSnake.length==0)){
                    gameover();
                    if(!lastman){
                        Materialize.toast("Player "+testSnake[i].name+" has won.",2000);
                    }
                }
            }
            
        }

    }
    //window.setInterval(loop,1000);
    requestAnimationFrame(loop);
}

newgame();
updatescore();
window.onload=loop();

