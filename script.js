let gameSeq = [];
let userSeq = [];

let btns = ["red", "yellow", "green", "purple"];

let started = false;
let level = 0;

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwYKF3B4eLcel3cB7v8i4B0fTNkbP_fdVaRWKEBc0L9QyCeS9UFJsSINQo0TGTkWFSX/exec";

let startInput = document.querySelector(".user_ input");
let userName = document.querySelector(".user_ h3");
let userBox = document.querySelector(".user_");
let levelText = document.querySelector(".main_body p");
let scoreBox = document.querySelector(".score");
let allBtns = document.querySelectorAll(".btn");


startInput.addEventListener("change", function () {
    if (!started && startInput.value.trim() !== "") {
        started = true;
        userBox.classList.add("user_hide");
        userName.innerHTML = `<h2>Welcome ${startInput.value} your game will be started</h2>`;
        startInput.value = "";
        levelUp();
    }
});


function gameFlash(btn) {
    btn.classList.add("flash");
    setTimeout(() => btn.classList.remove("flash"), 300);
}

function userFlash(btn) {
    btn.classList.add("userflash");
    setTimeout(() => btn.classList.remove("userflash"), 300);
}


function levelUp() {
    userSeq = [];
    level++;
    levelText.innerText = `Level "${level}"`;

    let randIdx = Math.floor(Math.random() * btns.length);
    let randColor = btns[randIdx];
    let randBtn = document.querySelector(`.${randColor}`);

    gameSeq.push(randColor);
    gameFlash(randBtn);
}


function checkAnswer(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length === gameSeq.length) {
            setTimeout(levelUp, 800);
        }
    } else {
        gameOver();
    }
}


function gameOver() {
    started = false;

    
    let finalScore = level - 1;
    let playerName = userName.innerText.replace("Welcome ", "").replace(" your game will be started", "");

    userName.innerHTML = `<h2>Oops!! Your Game Over</h2>`;
    levelText.classList.add("level_hid");

    scoreBox.innerHTML = `
        <p>Your score is <b>"${finalScore}"</b></p>
        <p id="status">Saving score...</p>
        <button class="restart">Restart</button>
    `;

    document.body.style.backgroundColor = "red";
    setTimeout(() => {
        document.body.style.backgroundColor = "";
    },200);


    fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        cache: "no-cache",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: playerName,
            score: finalScore
        })
    })
    .then(() => {
        document.getElementById("status").innerText = "Score saved to Leaderboard!";
    })
    .catch(err => console.error("Error saving score:", err));

    document.querySelector(".restart").addEventListener("click", restartGame);
}
 

function btnPress() {
    if (!started) return;

    let btn = this;
    userFlash(btn);

    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    checkAnswer(userSeq.length - 1);
}


function restartGame() {
    level = 0;
    gameSeq = [];
    userSeq = [];
    started = false;

    scoreBox.innerHTML = "";
    userBox.classList.remove("user_hide");
    userName.innerHTML = "";

    levelText.classList.remove("level_hid");
    levelText.innerText = `Level "0"`;
}


allBtns.forEach(btn => {
    btn.addEventListener("click", btnPress);
});


let footer=document.querySelector(".footer")
footer.addEventListener("click",function(){
    window.open("https://shivam-webpage.netlify.app/","_blank")
})
