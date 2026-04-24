const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const grid = 20;
let snake, food, dx, dy, score, gameInterval;

// 顯示畫面
function showScreen(id){
    document.querySelectorAll(".screen").forEach(s=>s.style.display="none");
    document.getElementById(id).style.display="block";
}

// 排行榜
function getLeaderboard(){
    return JSON.parse(localStorage.getItem("snake_scores")) || [];
}

function saveScore(score){
    let s = getLeaderboard();
    s.push(score);
    s.sort((a,b)=>b-a);
    s = s.slice(0,5);
    localStorage.setItem("snake_scores", JSON.stringify(s));
}

function showLeaderboard(){
    const data = getLeaderboard();
    document.getElementById("leaderboard").innerHTML =
        data.length ? data.map((v,i)=>`${i+1}. ${v}`).join("<br>") : "沒有紀錄";
    showScreen("leaderboardScreen");
}

// 開始遊戲
function startGame(){
    showScreen("gameScreen");

    snake = [{x:200,y:200}];
    food = randomFood();
    dx = grid;
    dy = 0;
    score = 0;

    updateScore();

    clearInterval(gameInterval);
    gameInterval = setInterval(loop, 90);
}

function randomFood(){
    return {
        x: Math.floor(Math.random()*30)*grid,
        y: Math.floor(Math.random()*30)*grid
    };
}

function loop(){
    update();
    draw();
}

function update(){
    let head = {x:snake[0].x+dx, y:snake[0].y+dy};

    if(head.x<0) head.x=canvas.width-grid;
    if(head.x>=canvas.width) head.x=0;
    if(head.y<0) head.y=canvas.height-grid;
    if(head.y>=canvas.height) head.y=0;

    if(snake.some(s=>s.x===head.x&&s.y===head.y)){
        gameOver();
        return;
    }

    snake.unshift(head);

    if(head.x===food.x&&head.y===food.y){
        score++;
        updateScore();
        food=randomFood();
    } else {
        snake.pop();
    }
}

function draw(){
    ctx.fillStyle="#020617";
    ctx.fillRect(0,0,600,600);

    ctx.fillStyle="red";
    ctx.fillRect(food.x,food.y,grid,grid);

    ctx.fillStyle="#22c55e";
    snake.forEach(s=>ctx.fillRect(s.x,s.y,grid,grid));
}

function updateScore(){
    document.getElementById("score").innerText="分數: "+score;
}

function gameOver(){
    clearInterval(gameInterval);
    saveScore(score);
    document.getElementById("finalScore").innerText="分數: "+score;
    showScreen("gameOverScreen");
}

function goHome(){
    clearInterval(gameInterval);
    showScreen("startScreen");
}

// 控制
document.addEventListener("keydown",e=>{
    if(e.key==="ArrowUp"&&dy===0){dx=0;dy=-grid;}
    else if(e.key==="ArrowDown"&&dy===0){dx=0;dy=grid;}
    else if(e.key==="ArrowLeft"&&dx===0){dx=-grid;dy=0;}
    else if(e.key==="ArrowRight"&&dx===0){dx=grid;dy=0;}
});

// 初始畫面
showScreen("startScreen");