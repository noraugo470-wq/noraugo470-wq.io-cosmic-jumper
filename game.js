const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

let gameRunning = false;
let score = 0;

const scoreElement = document.getElementById("score");
const finalScore = document.getElementById("finalScore");
const bestScore = document.getElementById("bestScore");

let best = localStorage.getItem("starBest") || 0;

const player = {
    x: 200,
    y: 300,
    radius: 20,
    velocityY: 0
};

let platforms = [];

function createPlatforms() {

    platforms = [];

    let y = canvas.height - 100;

    for(let i = 0; i < 10; i++){

        platforms.push({
            x: Math.random() * (canvas.width - 150),
            y: y,
            width: 150,
            height: 20
        });

        y -= 120;
    }
}

createPlatforms();

function drawBackground(){

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for(let i=0;i<80;i++){

        ctx.fillStyle="white";

        ctx.beginPath();

        ctx.arc(
            (i*73)%canvas.width,
            (i*97)%canvas.height,
            2,
            0,
            Math.PI*2
        );

        ctx.fill();
    }
}

function drawPlatforms(){

    ctx.fillStyle = "#38bdf8";

    platforms.forEach(p => {

        ctx.fillRect(
            p.x,
            p.y,
            p.width,
            p.height
        );

    });
}

function drawPlayer(){

    ctx.beginPath();

    ctx.fillStyle="#fde047";

    ctx.arc(
        player.x,
        player.y,
        player.radius,
        0,
        Math.PI*2
    );

    ctx.fill();
}

function update(){

    player.velocityY += 0.4;
    player.y += player.velocityY;

    platforms.forEach(platform => {

        const onTop =
            player.x > platform.x &&
            player.x < platform.x + platform.width &&
            player.y + player.radius > platform.y &&
            player.y + player.radius < platform.y + platform.height &&
            player.velocityY > 0;

        if(onTop){

            player.velocityY = -11;

            score++;

            scoreElement.textContent = score;
        }
    });

    if(player.y < canvas.height/2){

        const move = canvas.height/2 - player.y;

        player.y = canvas.height/2;

        platforms.forEach(platform => {

            platform.y += move;

            if(platform.y > canvas.height){

                platform.y = -20;

                platform.x =
                  Math.random() *
                  (canvas.width - 150);
            }

        });

        score += Math.floor(move/10);

        scoreElement.textContent = score;
    }

    if(player.y > canvas.height + 50){

        endGame();
    }
}

function render(){

    drawBackground();
    drawPlatforms();
    drawPlayer();
}

function gameLoop(){

    if(!gameRunning) return;

    update();
    render();

    requestAnimationFrame(gameLoop);
}

function endGame(){

    gameRunning = false;

    if(score > best){

        best = score;
        localStorage.setItem("starBest", best);
    }

    finalScore.textContent = score;
    bestScore.textContent = best;

    document.getElementById("gameOver").style.display = "block";
}

function jump(){

    if(gameRunning){
        player.velocityY = -10;
    }
}

document.addEventListener("keydown", (e)=>{

    if(e.code === "Space"){
        jump();
    }

});

canvas.addEventListener("click", jump);
canvas.addEventListener("touchstart", jump);

document.getElementById("startBtn").addEventListener("click", () => {

    document.getElementById("menu").style.display = "none";
    document.getElementById("hud").style.display = "block";

    gameRunning = true;

    player.x = canvas.width/2;
    player.y = canvas.height - 200;

    requestAnimationFrame(gameLoop);

});

