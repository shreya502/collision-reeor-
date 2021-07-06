const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon, boat;
var balls = [];
var boats =[];


function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
}

function setup() {
  canvas = createCanvas(windowWidth - 200, windowHeight - 150);
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1);
  tower = new Tower(width / 2 - 650, height - 290, 250, 580);
  cannon = new Cannon(width / 2 - 600, height / 2 - 220, 120, 40, angle);

  boat = new Boat(width, height - 100, 200, 200, -100);

}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);
  ground.display();

  
  cannon.display();
  tower.display();
  showboat ();

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
   for (let j =0; j < boats.length; j++) {
     if (balls[i]!== undefined && boats[j] !== undefined) {
 
        var collision = Matter.SAT.collides (balls[i].body,boats[j].body);
        if (collision.collided) {

          // removeing the boat form the world an the array 
          boats[j].remove (j);

         // removing the ball for the world and array
          Matter.Body.remove (world,balls[i].body);
          balls.splice (i,1);

          i-- ;

        }
     }

   }
  }

 
}


//creating the cannon ball on key press
function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

// function to show the ball.
function showCannonBalls(ball, index) {
  ball.display();
  if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
    Matter.World.remove(world, ball.body);
    balls.splice(index, 1);
  }
}

function showboat (){

  if(boats.length >0){
      var lastPos=boats.length-1;
      if (boats.length <4  && boats[lastPos].body.position.x < width - 300) {

        var position_array= [-130,-100,-120,-80];
        var position = random(position_array);
        boat = new Boat (width,height - 100, 200,200,position);
        boats.push(boat);

      }

        for (let i=0; i<boats.length;i++ ) {

          Matter.Body.setVelocity (boats[i].body, {x:-1.0, y:0});
          boats[i].display ();
        }

  }

  else {
    boat= new Boat (width,height - 100, 200,200,-100);
    boats.push(boat);
  }

}



//releasing the cannonball on key release
function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
  }
}
