

// Create connection to Node.JS Server
const socket = io();

let canvas;
let roll = 0;
let pitch = 0;
let yaw = 0;
let ball
// let vx = 0, vy = 0, vz = 0
let distance = 0
let enemyList = []
let jumpPause = -1
let font
let fail = false
let spd = 1
function preload() {
  font = loadFont("KOMIKAX_.ttf")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);

  // createEasyCam();
  ball = new Ball()
  enemyList.push(new Enemy())
  fail = false
  spd = 1
  jumpPause = -1
  roll = 0;
  pitch = 0;
  yaw = 0;
  distance = 0
  //  vx = 0, vy = 0, vz = 0
}

function draw() {
  if (mouseIsPressed) {
    ball = []
    enemyList = []
    setup()
  }

  spd += 0.005
  rotateX(-PI / 3);
  if (fail) {
    background(255)
    textSize(50)
    textFont(font)
    textAlign(CENTER)
    text("Fail", 0, 130, 0)
    text("Distance:" + distance, 0, 0, 0)
  } else {
    let t = int(map(spd, 1, 2, 20, 10))
    if (t < 1) {
      t = 1
    }


    if (frameCount % 20 == 0) {
      enemyList.push(new Enemy())
    }
    background(200);

    noStroke();
    lights();
    ambientMaterial(100, 0, 100);

    // push()
    // rotateZ(pitch);
    // rotateX(roll);
    // rotateY(yaw);
    // box(100);
    // pop()
    for (let i = 0; i < enemyList.length; i++) {
      enemyList[i].update()
      enemyList[i].show()
      enemyList[i].detect(ball)
      if (enemyList[i].pos.z > 500) {
        enemyList.splice(i, 1)
      }
    }
    // for(Enemy enemy in enemyList){

    // }
    ball.update()
    ball.show()

    distance += 1
    push()
    textFont(font)
    textSize(30)
    fill(0)
    textAlign(CENTER, CENTER)
    text("Distance \n" + distance, ball.pos.x - 90, ball.pos.y - 20, ball.pos.z)
    pop()
    jumpPause -= 1
    console.log(roll)
    if (jumpPause < 0 && roll > 0.5) {
      console.log("jump")
      ball.vy = -5
      jumpPause = 120
    }


    // if (jump) {

    // }
  }


}
class Ball {
  constructor(x, y) {
    this.pos = createVector(0, 0, 180)
    this.vy = 0
  }
  update() {
    if (this.pos.y == 0) {
      this.pos.x += pitch * 5
    }
    if (this.pos.x > width / 2) {
      this.pos.x = width / 2
    }
    if (this.pos.x < -width / 2) {
      this.pos.x = -width / 2
    }

    this.pos.y += this.vy
    if (this.pos.y < 0) {
      this.vy += 0.1
    }

    if (this.pos.y > 0) {
      this.vy = 0
      this.pos.y = 0
    }
  }
  show() {
    push()
    fill(255, 0, 0)
    translate(this.pos.x, this.pos.y, this.pos.z)
    sphere(10)
    pop()
  }
}
class Enemy {
  constructor() {
    // 
    this.pos = createVector(random(-width / 2, width / 2), 0, -500);
    // this.vz = 1
  }
  update() {
    this.pos.z += spd
  }
  show() {
    push()
    translate(this.pos)
    fill(100)
    box(30)
    pop()
  }
  detect(ball) {
    if (dist(ball.pos.x, ball.pos.y, ball.pos.z,
      this.pos.x, this.pos.y, this.pos.z) < 20) {
      console.log("touch..........")
      fail = true
    }
  }
}
//process the incoming OSC message and use them for our sketch
function unpackOSC(message) {

  /*-------------

  This sketch is set up to work with the gryosc app on the apple store.
  Use either the gyro OR the rrate to see the two different behaviors
  TASK: 
  Change the gyro address to whatever OSC app you are using to send data via OSC
  ---------------*/

  //maps phone rotation directly 
  // if(message.address == "/gyrosc/gyro"){
  //   roll = message.args[0]; 
  //   pitch = message.args[1];
  //   yaw = message.args[2];
  // }

  //uses the rotation rate to keep rotating in a certain direction
  if (message.address == "/gyrosc/rrate") {
    roll += map(message.args[0], -3, 3, -0.1, 0.1);
    pitch += map(message.args[1], -3, 3, -0.1, 0.1);
    yaw += map(message.args[2], -3, 3, -0.1, 0.1);
    // console.log(message.args[0],"------------")
  }
  // if (message.address == "/gyrosc/grav") {
  //   vx += map(message.args[0], -3, 3, -0.1, 0.1);
  //   vy += map(message.args[1], -3, 3, -0.1, 0.1);
  //   vz += map(message.args[2], -3, 3, -0.1, 0.1);
  //   // console.log(message.args[0],"------------")
  // }
}

//Events we are listening for
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Connect to Node.JS Server
socket.on("connect", () => {
  // console.log(socket.id);
});

// Callback function on the event we disconnect
socket.on("disconnect", () => {
  // console.log(socket.id);
});

// Callback function to recieve message from Node.JS
socket.on("message", (_message) => {

  // console.log(_message);

  unpackOSC(_message);

});