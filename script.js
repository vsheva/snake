const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");


let gameOver = false;
let foodX;
let foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let coordinatX = 0;
let coordinatY = 0;
let setIntervalId;
let score = 0;


let highScore = localStorage.getItem("high-score") || 0; //получаем highScore из local storage
highScoreElement.innerText = `High Score: ${highScore}`

let protocol = [{event: "start game", step: 0}];



const changeFoodPosition = () => {
    //передаем случайное значение 0-30 (вернее 1-30) как позицию еды
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}


const handleGameOver = () => {
    //очищение таймера и перезагрузка страницы на game over
    clearInterval(setIntervalId)
    alert("Game Over! Press OK to play again...");
    location.reload() // !!!!!!!!!!!!
}


const changeDirection = (e) => {
    const{event} = protocol[protocol.length - 1];

    if (e.key === "ArrowUp" && event !=="Move Y") {
        protocol.push({event: "Move Y", step: -1});
    }else if (e.key === "ArrowDown" && event !=="Move Y") {
        protocol.push({event: "Move Y", step: 1});
    } else if (e.key === "ArrowLeft" && event !=="Move X") {
        protocol.push({event: "Move X", step: -1});
    } else if (e.key === "ArrowRight" && event !=="Move X") {
        protocol.push({event: "Move X", step: 1});
    }

    //изменяем значение coordinat на основе нажатия нужной нам клавиши   !!! coordinatY !=1 ____нет обратному ходу)
   /** if (e.key === "ArrowUp" && coordinatY != 1) {
        coordinatX = 0;
        coordinatY = -1;
    } else if (e.key === "ArrowDown" && coordinatY != -1) {
        coordinatX = 0;
        coordinatY = 1;
    } else if (e.key === "ArrowLeft" && coordinatX != 1) {
        coordinatX = -1;
        coordinatY = 0;
    } else if (e.key === "ArrowRight" && coordinatX != -1) {
        coordinatX = 1;
        coordinatY = 0;
    }*/
}

controls.forEach(key => {
    //вызываем changeDirection по клику по каждой клавише стрелок и передаем key.dataset значение как обьект
    key.addEventListener("click", () => changeDirection({key: key.dataset.key})); //!!!!!!!!
})

const initGame = () => {
    if (gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY}/${foodX}"> </div>`;


    //если змея ударила еду
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); //добавляем в массив тела змеи _ позицию еды

        score++;//увеличиваем score на единицу
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        highScoreElement.innerText = `High Score: ${highScore}`
        scoreElement.innerText = `Score: ${score}`
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        //сдвигаем назад значение элементов в змеиное тело на 1
        //console.log("i: ", i) // 1  ..  1    ..  1
        snakeBody[i] = snakeBody[i - 1]
        //console.log("snakeBody[i]: ", snakeBody[i]) //[10,28]  [11,28] [12, 28] ...
    }
    snakeBody[0] = [snakeX, snakeY]; //устанавливаем в 1-й элемент змеиного тела   позицию головы змеи

    //обновляем позицию головы змем на основе настоящего coordinat  //ДВИЖЕНИЕ ПОШЛО
    /**snakeX += coordinatX;
    snakeY += coordinatY;*/


    if(protocol[protocol.length - 1].event === "Move X") {
        snakeX+=protocol[protocol.length - 1].step;
    } else if(protocol[protocol.length - 1].event === "Move Y") {
        snakeY += protocol[protocol.length - 1].step;
    }


    //проверка, если голова змеи за стеной. Если так, to gameOver=true
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }


    for (let i = 0; i < snakeBody.length; i++) {

        //добавляем div для каждой части тела змеи
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]}"> </div>`;
        //проверка, когда голова змеи ударяется в свое тело, устанавливаем gameOver в true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 200)

document.addEventListener('keydown', changeDirection);


//htmlMarkup += `<div class="head" style="grid-area: ${snakeY}/${snakeX}"> </div>`;
