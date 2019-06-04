var text1 = "Score: ";
var screen=0;
var start=0;
var canvas;
var context;
var fps;
var pressed_space;
var score;
var gameover;
var background;
var item;
var monster;
var character;
var life;
var imgdata = new Array();
var sound_jmp = new Audio("sounds/fx_jump.wav");
var sound_eat = new Audio("sounds/fx_eat.wav");
var sound_damaged = new Audio("sounds/fx_damaged.wav");


Image_preload(
        // imgdata[n]
        "images/penguin_walk01@2x.png",
        "images/penguin_walk02@2x.png",
        "images/penguin_walk03@2x.png",
        "images/penguin_walk04@2x.png",
        "images/penguin_jump03@2x.png",
        "images/mountains.png",
        "images/sky_lightened.png",
        "images/plus/lemon.png",                // plus 1
        "images/plus/lime.png",                 // plus 2
        "images/plus/passionfruit.png",         // plus 3
        "images/minus/landmonster1.png",        // minus 1
        "images/minus/landmonster2.png",        // minus 2
        "images/minus/flying.png",              // minus 3
        "images/life.png"
);
canvas = document.getElementById("canvas");
context = canvas.getContext("2d");
key_down_space();
Draw_firstpage();
function Image_preload(){
    //var len = images.length;
    console.log("Image loaded!");
    for (var i = 0; i < Image_preload.arguments.length; i++){ 
        imgdata[i] = new Image(); 
        imgdata[i].src = Image_preload.arguments[i];
    }
}

function Init(){
    fps=0;
    pressed_space = false;
    score=0;
    gameover=0;
    background={
        width: 800,
        height: 400,
        pos_x: 0,
        pos_y: 0,
        speed:1,
        repeat_start: 0
    };
    life={
        num:3
    };
    item = {
        width: 20,
        height: 50,
        pos_x: 730,
        pos_y: 200,
        speed: 4,
        collision: 0,
        type: 0
    };
    
    monster = {
        pos_x: 730,
        pos_y: 300,
        width: 70,
        height: 60,
        speed: 6,
        collision: 0,
        type: 0
    }
    character = {
        pos_x: 20,
        pos_y: 300,
        width: 90,
        height: 70,
        moving: 0,
        gravity: 0.5,
        gravitySpeed:0,
        jumping: false
    };
    back = new Image();
    back.src = imgdata[5].src;
    back_0 = new Image();
    back_0.src = imgdata[6].src;
    character.img = new Image();
    item.img = new Image();
    monster.img = new Image();
    life.img = new Image();
    life.img.src = imgdata[13].src;
};
function Main(){
    Init();
    Draw_firstpage();
    
    Update();
}
function Draw_firstpage(){
    context.font = "48pt Comic Sans MS";
    context.textAlign="center";
    context.fillText("Penguin Adventure", 410, 200);
    context.font = "16pt Comic Sans MS";
    context.fillText("Press SPACE to start!", 410, 300);
}
function Update(){
    var working_update=requestAnimFrame(Update);
    fps++;
    //console.log(fps);
    if(gameover != 1){
        context.clearRect(0,0,800,400);
        Draw_background();
        Draw_score();
        Draw_life();
        Draw_character();
        Draw_item();
        Draw_monster();
    }else{
        Draw_gameover();
        cancelAnimationFrame(working_update);
    
        start = 2;
    }
}
function Draw_background(){
    context.drawImage(back_0,0,0,800,400);
    context.drawImage(back,background.pos_x,background.pos_y,background.width,background.height);
    context.drawImage(back,background.pos_x+background.width,background.pos_y,background.width,background.height);
    context.fillStyle = "rgb(165, 242, 243)";
    context.fillRect(0, 350, 800, 100);
    
    background.pos_x -= 4.5;
    if(background.pos_x <= -800){
        background.pos_x = 0;
    }
}
function Draw_score(){
    context.font = "16pt Comic Sans MS";
    context.fillStyle ="blue";
    context.textAlign="center";
    context.fillText(text1+score, 410, 30);
}
function Draw_life(){
    context.font = "16pt Comic Sans MS";
    context.fillStyle ="blue";
    context.textAlign="center";
    context.fillText("Life", 710, 30);
    if(life.num == 0){
        gameover = 1;
    }else{
        for(var i=0;i<life.num;i++){
            context.drawImage(life.img,640+(i*48),40,48,48);
        }
    }
}

function Draw_character(){
    character_move();
}
function character_move(){
    //console.log(character.pos_x,character.pos_y);
    switch(character.moving){
        case 0:
            character.img.src = imgdata[0].src;
            break;
        case 1:
            character.img.src = imgdata[1].src;
            break;
        case 2:
            character.img.src = imgdata[2].src;
            break;
        case 3:
            character.img.src = imgdata[3].src;
            character.moving=0;
            break;
        case 4:
            character.img.src = imgdata[4].src;
    }
    if(fps%4==0)
        character.moving++;
    if(pressed_space == true && character.jumping == false){
        pressed_space = false;
        character.jumping = true;
        sound_jmp.play();
        character.pos_y -=180;
        character.moving = 4;
        
    }
    if(character.jumping == true){
        // character is flying~~~~~~~~~
        if(character.pos_y < 300){
            
            character.pos_y += 2.5 +character.gravity;
        }
        else{
            character.moving=0;
            character.jumping = false;
        }
    }
    
    context.drawImage(
        character.img,
        character.pos_x,
        character.pos_y,
        character.width,
        character.height
    );
}
function Draw_gameover(){
    context.fillStyle = "rgba(0, 0, 0, 0.3)";
    context.fillRect(0, 0, 800, 400);
    context.fillStyle = "rgb(0, 0, 0)";
    context.font = "48pt Comic Sans MS";
    context.textAlign="center";
    context.fillText("Gameover!", 410, 200);
    context.font = "24pt Comic Sans MS";
    context.fillText("Score : "+score,410,260);
    context.font = "16pt Comic Sans MS";
    context.fillText("Press ENTER to restart.", 410, 300);
}

function Draw_item(){
    // random generate
    if(item.pos_x == 770){
        switch(Math.floor((Math.random()*3))){
            case 0:
                item.pos_y = 180;
                break;
            case 1:
                item.pos_y = 180;
                break;
            case 2:
                item.pos_y = 180;
                break;
        };
        item.type = Math.floor(Math.random()*3);
        switch(Math.floor(Math.random()*3)){
            case 0:
                item.speed = 6;
                break;
            case 1:
                item.speed = 8;
                break;
            case 2:
                item.speed = 12;
                break;
        }
        console.log(item.pos_y,item.type,item.speed);
    }
    // check collision
    if(character.pos_x < item.pos_x+item.width &&
        character.pos_x+character.width > item.pos_x &&
        character.pos_y < item.pos_y +item.height &&
        character.pos_y+character.height > item.pos_y){
            sound_eat.play();
            item.pos_x = 770;
            item.collision = 1;
            switch(item.type){
                case 0:
                    score = score + 30;
                    break;
                case 1:
                    score = score + 50;
                    break;
                case 2:
                    score = score + 100;
                    break;
            }
    }else{  // draw
        item.img.src = imgdata[7+item.type].src;
        context.drawImage(
            item.img,
            item.pos_x,
            item.pos_y,
            item.width,
            item.height
        );
        item.pos_x -= item.speed;
        if(item.pos_x <= 0){
            item.collision = 0;
            item.pos_x = 770;
        }
    }
}
function Draw_monster(){
    // random generate
    if(monster.pos_x == 770){
        monster.type = Math.floor(Math.random()*3);
        switch(monster.type){   // 0: land1 1: land2 2: flying
            case 0:
                monster.pos_y = 300;
                break;
            case 1:
                monster.pos_y = 300;
                break;
            case 2:
                switch(Math.floor(Math.random()*2)){
                    case 0:
                        monster.pos_y = 90;
                        break;
                    case 1:
                        monster.pos_y = 160;
                        break;
                }
                break;
        };
        switch(Math.floor(Math.random()*3)){
            case 0:
                monster.speed = 4;
                break;
            case 1:
                monster.speed = 12;
                break;
            case 2:
                monster.speed = 15;
                break;
        }
        console.log(monster.pos_y,monster.type,monster.speed);
    }
    if(character.pos_x < monster.pos_x+monster.width &&
        character.pos_x+character.width > monster.pos_x &&
        character.pos_y < monster.pos_y +monster.height &&
        character.pos_y+character.height > monster.pos_y){
            sound_damaged.play();
            monster.pos_x = 770;
            monster.collision = 1;
            life.num = life.num - 1;
            
    }else{
        monster.img.src = imgdata[10+monster.type].src;
        context.drawImage(
            monster.img,
            monster.pos_x,
            monster.pos_y,
            monster.width,
            monster.height
        );
        monster.pos_x -= monster.speed;
        if(monster.pos_x <= 0){
            monster.collision = 0;
            monster.pos_x = 770;
        }
    }
}
function key_down_space(){
    console.log("key_down_space();");
    window.addEventListener('keydown', function(e){
        if(start == 0){
            if(e.keyCode == 32){
                start = 1;
                Main();
            }
        }else if(start == 1){
            if(e.keyCode == 32){
                pressed_space = true;
            }
            else if(e.keyCode == 13){
                start = 0;
            }
        }else if(start == 2){
            if(e.keyCode == 13){
                start = 1;
                Main();
            }
        }
    });
}
// Sync browser Frame
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
            };
})();