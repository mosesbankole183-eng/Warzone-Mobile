const canvas =
document.getElementById(
"gameCanvas"
);

const ctx =
canvas.getContext("2d");

canvas.width =
window.innerWidth;

canvas.height =
window.innerHeight;





/* ====================
   UI
==================== */

const attackBtn =
document.getElementById(
"attackBtn"
);

const joystick =
document.getElementById(
"joystick"
);

const stick =
document.getElementById(
"stick"
);

const healthUI =
document.getElementById(
"health"
);

const killsUI =
document.getElementById(
"kills"
);





/* ====================
   IMAGES
==================== */

const idleImage =
new Image();

idleImage.src =
"assets/Idle.png";

const runImage =
new Image();

runImage.src =
"assets/Run.png";

const attackImage =
new Image();

attackImage.src =
"assets/Attack.png";

const hurtImage =
new Image();

hurtImage.src =
"assets/Hurt.png";

const enemyImage =
new Image();

enemyImage.src =
"assets/enemy.png";





/* ====================
   PLAYER
==================== */

const player = {

  x:200,

  y:
  canvas.height - 250,

  width:140,

  height:140,

  speed:5,

  health:100,

  attacking:false,

  moving:false,

  direction:1

};





/* ====================
   ENEMIES
==================== */

const enemies = [];

let kills = 0;

function spawnEnemy(){

  enemies.push({

    x:
    canvas.width + 100,

    y:
    canvas.height - 240,

    width:120,

    height:120,

    speed:
    2 + Math.random()*2,

    health:100

  });

}

setInterval(
spawnEnemy,
2000
);





/* ====================
   JOYSTICK
==================== */

let moveX = 0;

let joystickActive =
false;

let startX = 0;

joystick.addEventListener(
"touchstart",

e=>{

  joystickActive = true;

  startX =
  e.touches[0].clientX;

}
);

window.addEventListener(
"touchmove",

e=>{

  if(!joystickActive)
  return;

  const touch =
  e.touches[0];

  moveX =
  (touch.clientX - startX)
  / 30;

  stick.style.left =
  50 + moveX * 10 + "%";

}
);

window.addEventListener(
"touchend",

()=>{

  joystickActive =
  false;

  moveX = 0;

  stick.style.left =
  "50%";

}
);





/* ====================
   PLAYER MOVEMENT
==================== */

function movePlayer(){

  player.x += moveX;

  player.moving =
  moveX !== 0;

  if(moveX > 0)
  player.direction = 1;

  if(moveX < 0)
  player.direction = -1;

  if(player.x < 0)
  player.x = 0;

  if(
  player.x >
  canvas.width
  - player.width
  ){

    player.x =
    canvas.width
    - player.width;

  }

}





/* ====================
   DRAW PLAYER
==================== */

function drawPlayer(){

  ctx.save();

  ctx.scale(
    player.direction,
    1
  );

  let image =
  idleImage;

  if(player.moving)
  image = runImage;

  if(player.attacking)
  image = attackImage;

  ctx.drawImage(

    image,

    player.direction === 1
    ? player.x
    : -player.x
    - player.width,

    player.y,

    player.width,

    player.height

  );

  ctx.restore();

}





/* ====================
   ATTACK
==================== */

attackBtn.addEventListener(
"touchstart",

()=>{

  player.attacking =
  true;

  setTimeout(()=>{

    player.attacking =
    false;

  },300);





  enemies.forEach(
  (enemy,index)=>{

    const distance =
    Math.abs(
    player.x - enemy.x
    );

    if(distance < 150){

      enemy.health -= 50;

      if(enemy.health <= 0){

        enemies.splice(
        index,
        1
        );

        kills++;

      }

    }

  });

}
);





/* ====================
   DRAW ENEMIES
==================== */

function drawEnemies(){

  enemies.forEach(
  enemy=>{

    enemy.x -=
    enemy.speed;





    ctx.drawImage(

      enemyImage,

      enemy.x,

      enemy.y,

      enemy.width,

      enemy.height

    );





    if(

    Math.abs(
    player.x - enemy.x
    ) < 80

    ){

      player.health -= .1;

      if(player.health <= 0){

        alert(
        "GAME OVER"
        );

        location.reload();

      }

    }

  });

}





/* ====================
   UI
==================== */

function updateUI(){

  healthUI.innerText =
  Math.floor(
  player.health
  );

  killsUI.innerText =
  kills;

}





/* ====================
   LIGHTING
==================== */

function drawLighting(){

  const gradient =

  ctx.createRadialGradient(

    player.x,

    player.y,

    50,

    player.x,

    player.y,

    500

  );

  gradient.addColorStop(
    0,
    "rgba(255,255,255,.08)"
  );

  gradient.addColorStop(
    1,
    "rgba(0,0,0,.8)"
  );

  ctx.fillStyle =
  gradient;

  ctx.fillRect(

    0,

    0,

    canvas.width,

    canvas.height

  );

}





/* ====================
   GAME LOOP
==================== */

function gameLoop(){

  ctx.clearRect(

    0,

    0,

    canvas.width,

    canvas.height

  );

  movePlayer();

  drawPlayer();

  drawEnemies();

  drawLighting();

  updateUI();

  requestAnimationFrame(
  gameLoop
  );

}

gameLoop();





/* ====================
   LANDSCAPE
==================== */

async function
forceLandscape(){

  if(
  document.documentElement
  .requestFullscreen
  ){

    await document
    .documentElement
    .requestFullscreen();

  }

  if(

    screen.orientation &&

    screen.orientation.lock

  ){

    try{

      await screen
      .orientation
      .lock("landscape");

    }catch(err){

      console.log(err);

    }

  }

}

window.addEventListener(
"load",
forceLandscape
);

document.body.addEventListener(
"click",
forceLandscape
);
