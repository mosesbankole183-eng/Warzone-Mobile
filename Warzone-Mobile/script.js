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

const fireBtn =
document.getElementById(
"fireBtn"
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

const ammoUI =
document.getElementById(
"ammo"
);

const scoreUI =
document.getElementById(
"score"
);

let score = 0;





/* =====================
   IMAGES
===================== */

const playerImage =
new Image();

playerImage.src =
"assets/player.png";

const enemyImage =
new Image();

enemyImage.src =
"assets/enemy.png";





/* =====================
   PLAYER
===================== */

const player = {

  x:canvas.width/2,

  y:canvas.height/2,

  size:80,

  speed:5,

  angle:0,

  health:100,

  ammo:30

};





/* =====================
   ARRAYS
===================== */

const bullets = [];
const enemies = [];
const particles = [];





/* =====================
   JOYSTICK
===================== */

let moveX = 0;
let moveY = 0;

let joystickActive =
false;

let startX = 0;
let startY = 0;

joystick.addEventListener(
"touchstart",

e=>{

  joystickActive = true;

  startX =
  e.touches[0].clientX;

  startY =
  e.touches[0].clientY;

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
  / 35;

  moveY =
  (touch.clientY - startY)
  / 35;

  stick.style.left =
  50 + moveX * 8 + "%";

  stick.style.top =
  50 + moveY * 8 + "%";

}
);

window.addEventListener(
"touchend",

()=>{

  joystickActive =
  false;

  moveX = 0;
  moveY = 0;

  stick.style.left =
  "50%";

  stick.style.top =
  "50%";

}
);





/* =====================
   AIM
===================== */

window.addEventListener(
"touchmove",

e=>{

  const touch =
  e.touches[0];

  const dx =
  touch.clientX
  - player.x;

  const dy =
  touch.clientY
  - player.y;

  player.angle =
  Math.atan2(dy,dx);

}
);





/* =====================
   MOVE PLAYER
===================== */

function movePlayer(){

  player.x += moveX;

  player.y += moveY;

  if(player.x < 0)
  player.x = 0;

  if(player.y < 0)
  player.y = 0;

  if(
  player.x >
  canvas.width
  - player.size
  ){

    player.x =
    canvas.width
    - player.size;

  }

  if(
  player.y >
  canvas.height
  - player.size
  ){

    player.y =
    canvas.height
    - player.size;

  }

}





/* =====================
   DRAW PLAYER
===================== */

function drawPlayer(){

  ctx.save();

  ctx.translate(

    player.x +
    player.size/2,

    player.y +
    player.size/2

  );

  ctx.rotate(
  player.angle
  );

  ctx.shadowColor =
  "cyan";

  ctx.shadowBlur = 30;

  ctx.drawImage(

    playerImage,

    -player.size/2,

    -player.size/2,

    player.size,

    player.size

  );

  ctx.restore();

}





/* =====================
   SHOOT
===================== */

function shoot(){

  if(player.ammo <= 0)
  return;

  player.ammo--;

  const speed = 15;

  bullets.push({

    x:
    player.x +
    player.size/2,

    y:
    player.y +
    player.size/2,

    dx:
    Math.cos(
    player.angle
    ) * speed,

    dy:
    Math.sin(
    player.angle
    ) * speed,

    size:8

  });

  createMuzzleFlash();

}





/* =====================
   FIRE BUTTON
===================== */

fireBtn.addEventListener(
"touchstart",

shoot
);





/* =====================
   PARTICLES
===================== */

function createMuzzleFlash(){

  for(let i=0;i<15;i++){

    particles.push({

      x:
      player.x +
      player.size/2,

      y:
      player.y +
      player.size/2,

      dx:
      (Math.random()-.5)
      * 8,

      dy:
      (Math.random()-.5)
      * 8,

      size:
      Math.random()*6,

      life:20,

      color:"orange"

    });

  }

}





function explosion(x,y){

  for(let i=0;i<40;i++){

    particles.push({

      x,
      y,

      dx:
      (Math.random()-.5)
      * 12,

      dy:
      (Math.random()-.5)
      * 12,

      size:
      Math.random()*10,

      life:50,

      color:
      Math.random() > .5
      ? "orange"
      : "red"

    });

  }

}





function drawParticles(){

  particles.forEach(
  (p,index)=>{

    p.x += p.dx;

    p.y += p.dy;

    p.life--;

    ctx.fillStyle =
    p.color;

    ctx.fillRect(

      p.x,
      p.y,

      p.size,
      p.size

    );

    if(p.life <= 0){

      particles.splice(
      index,1
      );

    }

  });

}





/* =====================
   BULLETS
===================== */

function drawBullets(){

  bullets.forEach(
  (bullet,index)=>{

    bullet.x += bullet.dx;

    bullet.y += bullet.dy;

    ctx.save();

    ctx.fillStyle =
    "yellow";

    ctx.shadowColor =
    "orange";

    ctx.shadowBlur = 20;

    ctx.beginPath();

    ctx.arc(

      bullet.x,

      bullet.y,

      bullet.size,

      0,

      Math.PI*2

    );

    ctx.fill();

    ctx.restore();

    if(

      bullet.x < 0 ||

      bullet.x >
      canvas.width ||

      bullet.y < 0 ||

      bullet.y >
      canvas.height

    ){

      bullets.splice(
      index,1
      );

    }

  });

}





/* =====================
   ENEMIES
===================== */

function spawnEnemy(){

  enemies.push({

    x:
    canvas.width + 100,

    y:
    Math.random() *
    canvas.height,

    size:80,

    speed:
    2 + Math.random()*2,

    health:100

  });

}

setInterval(
spawnEnemy,
1500
);





function drawEnemies(){

  enemies.forEach(
  (enemy,eIndex)=>{

    const dx =
    player.x - enemy.x;

    const dy =
    player.y - enemy.y;

    const angle =
    Math.atan2(dy,dx);

    enemy.x +=
    Math.cos(angle)
    * enemy.speed;

    enemy.y +=
    Math.sin(angle)
    * enemy.speed;

    ctx.save();

    ctx.translate(

      enemy.x +
      enemy.size/2,

      enemy.y +
      enemy.size/2

    );

    ctx.rotate(angle);

    ctx.shadowColor =
    "red";

    ctx.shadowBlur = 25;

    ctx.drawImage(

      enemyImage,

      -enemy.size/2,

      -enemy.size/2,

      enemy.size,

      enemy.size

    );

    ctx.restore();





    bullets.forEach(
    (bullet,bIndex)=>{

      const bdx =
      bullet.x - enemy.x;

      const bdy =
      bullet.y - enemy.y;

      const distance =
      Math.sqrt(

      bdx*bdx +

      bdy*bdy

      );

      if(
      distance <
      enemy.size
      ){

        bullets.splice(
        bIndex,
        1
        );

        enemy.health -= 50;

        explosion(
          bullet.x,
          bullet.y
        );

        if(enemy.health <= 0){

          enemies.splice(
          eIndex,
          1
          );

          explosion(
            enemy.x,
            enemy.y
          );

          score += 10;

        }

      }

    });

  });

}





/* =====================
   UI
===================== */

function updateUI(){

  healthUI.innerText =
  Math.floor(
  player.health
  );

  ammoUI.innerText =
  player.ammo;

  scoreUI.innerText =
  score;

}





/* =====================
   LIGHTING
===================== */

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

    "rgba(0,0,0,.85)"

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





/* =====================
   GAME LOOP
===================== */

function gameLoop(){

  ctx.clearRect(

    0,

    0,

    canvas.width,

    canvas.height

  );

  movePlayer();

  drawPlayer();

  drawBullets();

  drawEnemies();

  drawParticles();

  drawLighting();

  updateUI();

  requestAnimationFrame(
  gameLoop
  );

}





/* =====================
   LANDSCAPE
===================== */

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

gameLoop();
