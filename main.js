var paddle2 =10,paddle1=10;

var paddle1X = 10,paddle1Height = 110;
var paddle2Y = 685,paddle2Height = 70;

var score1 = 0, score2 =0;
var paddle1Y;

var  playerscore =0;

var pcscore =0;

var ball = {
    x:350/2,
    y:480/2,
    r:20,
    dx:3,
    dy:3
}

rightWristY = 0;
rightWristX = 0;
scoreRightWrist = 0;

game_status = "";

function preload(){
    ball_touch_paddel = loadSound("ball_touch_paddel.wav");
    missed = loadSound("missed.wav");
}

function setup(){
    var canvas = createCanvas(700, 600);
    canvas.parent("canvas");

    video = createCapture(VIDEO);
    video.size(700, 600);
    video.hide();

    poseNet = ml5 = ml5.poseNet(video, modelLoaded);
    poseNet.on("pose", gotPoses);
}

function modelLoaded(){
    console.log("Model AMAZING!!!");
}

function gotPoses(results){
    if(results.length > 0){
        rightWristY = results[0].pose.rightWrist.y;
        scoreRightWrist = results[0].pose.keypoints[10].score;
    }
}

function startGame(){
    game_status = "start";
    document.getElementById("status").innerHTML = "The game is about to begin!";
}

function draw(){
    if(game_status == "start"){
        background("purple");
        image(video, 0, 0, 700, 600);

        fill("blue");
        stroke("black");
        rect(680, 0, 20, 700);

        fill("yellow");
        stroke("black");
        rect(680, 0, 20, 700);

        if(scoreRightWrist > 0.2){
            fill("red");
            stroke("white");
            circle(rightWristX, rightWristY, 30);
        }
        paddleInCanvas();

    //Left paddle
    fill(250,0,0);
    stroke(0,0,250);
    strokeWeight(0.5);
    paddle1Y = rightWristY; 
    rect(paddle1X,paddle1Y,paddle1,paddle1Height,100);


    //Computers Paddle
    fill("#FFA500");
    stroke("#FFA500");
    var paddle2y =ball.y-paddle2Height/2;  rect(paddle2Y,paddle2y,paddle2,paddle2Height,100);
    
    //To set the midline on the playground:
    midline();
    
    drawScore();

    move();

    }

  }


function reset(){
    //SET THE CONDITIONS FOR THE RESET STAGE:
    //All paddles must return to its original position
   ball.x = width/2+100,
   ball.y = height/2+100;
   ball.dx=3;
   ball.dy =3;   
}

function midline(){
    //Set the midline on the court by setting a rectangle in the middle of the canvas:
    //fill
    fill("white");
    //stroke
    //rect(x, y, width, height);
    rect(width/2, 0, 5, 700);
    //width/2
}


function drawScore(){
  //complete the function   drawScore
  textAlign(CENTER);
  textSize(18);
  fill("purple");
  text("Player:" + playerscore, 100, 50);
  text("PC:" + pcscore, 500, 50);
}


function move(){
   fill(50,350,0);
   stroke(255,0,0);
   strokeWeight(0.5);
   ellipse(ball.x,ball.y,ball.r,20)
   ball.x = ball.x + ball.dx;
   ball.y = ball.y + ball.dy;

   if(ball.x+ball.r > width-ball.r/2){
       ball.dx = -ball.dx-0.5;       
   }

  if (ball.x-2.5*ball.r/2 < 0){

        if (ball.y >= paddle1Y&& ball.y <= paddle1Y + paddle1Height) {
            ball.dx = -ball.dx+0.5; 
            ball_touch_paddel.play();
            playerscore++;
        } else {
            pcscore++;
            missed.play();
            reset();
            navigator.vibrate(100);
        }
    }

    //SET THE IF STATEMENT TO RESTART THE GAME IF THE PCSCORE IS 4:
    if(pcscore == 4){
      fill("blue");
      rect(0, 0, width, height);
      fill("white");
      textSize(25);
      text("GAME OVER!!!", width/2, height/2);
      text("Press restart to play again", width/2, height/2 +40);
      noLoop();
      pcscore = 0;
    }


    if(ball.y+ball.r > height || ball.y-ball.r <0){
        ball.dy =- ball.dy;
    }   
}



function paddleInCanvas(){

    //MAKE THE PADDLE GO BACK TO THE CANVAS IF THE USER MISSES IT:
    if(mouseY + paddle1Height > height){
        mouseY = height-paddle1Height;
    }
  
    if(mouseY < 0){
        mouseY = 0;
    }
    
  
}


function restart(){
  loop();
  pcscore = 0;
  playerscore = 0;
}