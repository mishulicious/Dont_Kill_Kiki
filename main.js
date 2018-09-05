//Canvas config
var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');

//testing
//ctx.fillRect (100,100,50,50);


//Variables globales
var score = 0;
var goods = []
var bads = []
var interval;
var frames = 3600;
var images = {
    bg:"./images/fondo-01.png",
    kikiPix: "./images/KIKIright-01.png",
    kikiPixLeft: "./images/KIKIleft.png",

    chopiPix: "./images/CHOPIright.png",
    chopiPixLeft: "./images/CHOPIleft.png",
    

    chocoPix:"./images/chocolate.png",
    chelaPix:"./images/CHELA.png",
    notesPix: "./images/MUSIC.png",

    hamPix: "./images/JAMON.png",
    bonePix: "./images/HUESO.png",
    beansPix: "./images/FRIJOLES.png",

    heartPixF: "./images/heartFill.png",
    heartPixE: "./images/heartEmpty.png"
    
}

var player1 = document.getElementById('uno')




//Clases

class Board{
    constructor(){
        this.x = 0
        this.y = 0
        this.width = canvas.width
        this.height = canvas.height
        this.image = new Image ()
        this.image.src = images.bg
        this.image.onload = function(){
            this.draw()
        }.bind(this)
        this.music = new Audio()
        this.music.src = "./music/Bike_Rides.mp3"
        // this.heartFill = new Image ()
        // this.heartFill.src = images.heartPixF
        // this.heartEmpty = new Image ()
        // this.heartEmpty.src = images.heartPixE
    }

    draw(){
        ctx.drawImage(this.image,this.x, this.y, this.width, this.height) 
        //TIMER
        ctx.font = "30px Jua"
        ctx.fillStyle = "white"
        ctx.fillText ('Time: ' + Math.floor(frames/60), canvas.width - 460, 40);
        //HEARTS
        // ctx.drawImage(this.heartEmpty, canvas.width - 130, 15, 30, 25)
        // ctx.drawImage(this.heartEmpty, canvas.width - 90, 15, 30, 25)
        // ctx.drawImage(this.heartEmpty, canvas.width - 50, 15, 30, 25)
        //SCORE
        ctx.font = '30px Jua'
        ctx.fillStyle = 'black'
        ctx.fillText ('Kiki: ' + score, 15, 40)
    }


}


class Kiki {
    constructor(dog){
        this.x=360
        this.y=300
        this.width = 60
        this.height = 60
        this.image = new Image()
        this.image.src = dog
        this.crash = new Audio()
        this.crash.src = "./music/kikigru.mov"
    }

    draw (){
        if (this.y < canvas.height -  35) this.y += 0
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    }

    goRight(){
        this.x += 20;
        this.image.src = images.kikiPix;
    }
    
    goLeft(){
        this.x -= 20;
        this.image.src = images.kikiPixLeft;
    }

    goUp(){
        this.y -= 20;
    }
    
    goDown(){
        this.y += 20;
    }

    crashWith(item){
        var choque =  (this.x < item.x + item.width) &&
                (this.x + this.width > item.x) &&
                (this.y < item.y + item.height) &&
                (this.y + this.height > item.y);
        
        if(choque)this.crash.play()
        return choque
    }

}



class Bad{
    constructor(x){
        this.x = x
        this.y = 0
        this.width = 40
        this.height = 50
        this.image = new Image()
        this.image.src = images.chocoPix
        this.image2 = new Image()
        this.image2.src = images.chelaPix
        this.selctedImage;
    }
    draw(){
        this.y++
        ctx.drawImage(this.selctedImage,this.x,this.y,this.width,this.height)    
    }
}


class Good{
    constructor(x){
        this.x = x
        this.y = 0
        this.width = 50
        this.height = 30
        this.image = new Image()
        this.image.src = images.bonePix
        this.image.onload = () => {
            this.draw()
        }
    }
    draw(){
        this.y++
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)    
    }
}



//Instancias
var board = new Board()
var kiki = new Kiki(images.kikiPix)
var chopi = new Kiki(images.chopiPixLeft)


//Funciones principales
function update(){

    frames--
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    board.draw()
    kiki.draw()

    generateBads()
    drawBads()
    checkCollitions()

    generateGoods()
    drawGoods()

    scoree()
    timeUp()



}

function start(){
    if(interval) return
    bads = []
    goods = []
    frames = 3600
    interval = setInterval(update,1000/60)
}

function timeUp(){
    if (frames <= 0) {
        gameOver();
    }
}

function gameOver(){
    clearInterval(interval)
    ctx.font = "80px Jua"
    ctx.fillStyle="red"
    ctx.fillText("Time's Up", 220, 200)
    ctx.font = "30px Jua"
    ctx.fillStyle="yellow"
    ctx.fillText("Your score is " + score, 260, 250)
    ctx.fillStyle="black"
    ctx.fillText("Press esc to restart", 260, 300)
    interval = null
    board.music.pause()
    score = 0

}


function scoree(){
    if (checkCollitionsG()){
        ctx.fillText('Score: ' + score,300, 300)
    }
}

function twoPlayers() {

}


//Funciones Auxiliares


function generateBads(){
    if (frames % 80 === 0){
        const x = Math.floor(Math.random() * 40)
        let malo = new Bad(x * 50);
        malo.selctedImage = malo.image; 
        bads.push(malo);
    }
    if (frames % 100 === 0){
        const x = Math.floor(Math.random() * 40)
        let malo = new Bad(x * 50);
        malo.selctedImage = malo.image2; 
        bads.push(malo)

    }
   
}

function drawBads() {
    bads.forEach(function(Bad){
        Bad.draw()
    })
}

function checkCollitions(){
    bads.forEach(function(bad){
        if(kiki.crashWith(bad) ){
            var pos = bads.indexOf(bad)
            bads.splice(pos,1)
            score-= 8;
            return true;
    

        }

    })
}


function generateGoods(){
    if (frames % 100 === 0){
        const x = Math.floor(Math.random() * 40)
        goods.push(new Good(x * 50))

    }
}

function drawGoods() {
    goods.forEach(function(Good){
        Good.draw()
    })
}


function checkCollitionsG(){
    goods.forEach(function(good){
        if(kiki.crashWith(good) ){
            var pos = goods.indexOf(good)
            goods.splice(pos,1)
            score+= 10;
            return true;
        }
    })
}





//Los observadores (escuchadores)

player1.addEventListener('click',start)

addEventListener("keydown", (e) => {
    switch (e.keyCode) {
        case 39:
          if (kiki.x > canvas.width -80) return
          kiki.goRight()
          break;
        case 37:
          if (kiki.x < 20) return
          kiki.goLeft()
          break;
        case 38:
          if (kiki.y < 250) return
          kiki.goUp()
          break;
        case 40:
          if (kiki.y > canvas.height -80) return
          kiki.goDown()
          break;
        case 27: //enter
          start()
          break;
        case 13: //escape
          start()
          board.music.play()
    }
})