var PLAY = 1;
var END = 0;
var gameState = PLAY;

var spaceship, spaceshipImage;
var ground, invisibleGround, groundImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;



function preload(){
  spaceshipImage = loadImage("spaceship.png");
  
  spaceImage = loadImage("space.jpg");
  groundImage = loadImage("ground2.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  
}

function setup() {
  createCanvas(600, 200);

  spaceship = createSprite(50,160,20,50);
  spaceship.addImage("spaceship.png",spaceshipImage);
  spaceship.scale = 0.25;
  spaceship.setCollider("rectangle",0,0,spaceship.width,spaceship.height);
  spaceship.debug = false;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle new Group();
  obstaclesGroup = createGroup();

  score = 0;  
}

function draw() {
  
  background(180);

  push();
  imageMode(CENTER);
  image(spaceImage,300,100,600,200);
  pop();

  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& spaceship.y >= 100) {
      spaceship.velocityY = -12;
      jumpSound.play();
    }
    
    //add gravity
    spaceship.velocityY = spaceship.velocityY + 0.8
  
    //spawn obstacles on the space
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(spaceship)){
        //spaceship.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      spaceship.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
     obstaclesGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
   }
  
 
  //stop spaceship from falling down
  spaceship.collide(invisibleGround);
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
  gameState = PLAY;
  score = 0;
//  gameOver.visible = false;
  spaceship.changeAnimation("running", spaceship_running);
  obstaclesGroup.destroyEach();
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.15;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);

    restart.depth = gameOver.depth;
    gameOver.depth = background.depth;
    gameOver.depth = gameOver.depth + 1;
    restart.depth = restart.depth + 1;
 }
}
