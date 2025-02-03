// ----------------------------------------------------- Базовые скрипты --------------------------------------------------------
import { BaseHelpers } from './helpers/base-helpers';
BaseHelpers.addLoadedClass();
BaseHelpers.checkWebpSupport();
BaseHelpers.calcScrollbarWidth();
BaseHelpers.addTouchClass();
BaseHelpers.headerFixed();

// ------------------------------------------------- Текстовы модальное окно --------------------------------------------------
import textPopup from './modules/text-popup.js';
textPopup()

// import popupOpen from './modules/popup-open.js'
//--------------------------------------------------------------------------------------------------------------------------------



// Получаем ссылку на игровое поле
var gameField = document.getElementById("game-field");
var homePauseBtn = document.querySelector('#TopPauseBtn')
var eat = document.querySelector('#eat')
var bricks = document.querySelector('#bricks')
var win = document.querySelector('#win')
var levelSound = document.querySelector('#level-sound')

let gameBg = document.querySelector('.game-bg-inner')


// массив с классами для фруктов
let fruitsArray = ['apple', 'banana', 'cabbage', 'cheesecake', 'cucumber', 'melon', 'kiwi', 'lemon', 'mango', 'orange', 'peach', 'pineapple', 'tomato', 'watermelon'];

// Размеры квадрата

var cellSize = 20
let head = {}

fieldWidth = (parseInt(gameField.offsetWidth / cellSize) * cellSize);
fieldHeight = (parseInt(gameField.offsetHeight / cellSize) * cellSize);


let colNum = parseInt(gameField.offsetWidth / cellSize)
let rowNum = parseInt(gameField.offsetHeight / cellSize)
createFieldCells(colNum, rowNum)
// console.log(colNum, rowNum);
function even(n) {
    return n % 2 == 0;
}

function createFieldCells(colNum, rowNum) {
    let edgeH = (gameField.offsetHeight - fieldHeight) / 2
    let edgeW = (gameField.offsetWidth - fieldWidth) / 2
    for (let row = 0; row < rowNum; row++) {
        for (let col = 0; col < colNum; col++) {
            let newCell = document.createElement('div');
            if (even(col + row)) {
                newCell.classList.add('cell');
                newCell.classList.add('light');
                newCell.style.width = cellSize + 'px';
                newCell.style.height = cellSize + 'px';
                newCell.style.top = cellSize * row + edgeH + 'px';
                newCell.style.left = cellSize * col + edgeW + 'px';
            } else {
                newCell.classList.add('cell');
                newCell.classList.add('dark');
                newCell.style.width = cellSize + 'px';
                newCell.style.height = cellSize + 'px';
                newCell.style.top = cellSize * row + edgeH + 'px';
                newCell.style.left = cellSize * col + edgeW + 'px';
            }
            gameBg.append(newCell);
        }
    }
}

// Инициализация змейки
var snake = [
    { x: 2, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
];

function ramdomOnField(element, elementKlass) {
    element.x = Math.floor(Math.random() * (fieldWidth / cellSize));
    element.y = Math.floor(Math.random() * (fieldHeight / cellSize));
    element.klas = elementKlass;
    if (element == wall) {
        if (element.x == head.x && element.y == head.y) { ramdomOnField(element, elementKlass) }
    }
    return { x: element.x, y: element.y, klas: element.klas }
}
// Инициализация позиции кролика
var fruit = {}
ramdomOnField(fruit, shuffle(fruitsArray))
// Инициализация позиции кирпечей
var wallArray = []
var wall = {}
// ramdomOnField(wall, 'brick')
wallArray.push(ramdomOnField(wall, 'brick'))

// Скорость змейки в мс
// Количество очков
var speed;
var score = 0;
var level = 1;
var levelTurn = level;
var game;
var direction;
var antiDirection;
var fieldWidth;
var fieldHeight;
var gameOn = true;
var levelBool = true; // -нужно для вылетания цифры с уровнем сложности


let fruitLevel = 2;
// Переменные для реализации адекватного управления змейкой клавишами
var canTurn = true;
var turnStack = null;

// запускаем игру
popupOpen('start');
popClose();


// Рисуем змейку
function drawSnake() {
    for (var i = 0; i < snake.length; i++) {
        var snakePart = document.createElement("div");
        snakePart.className = "snake";

        if (i == 0 && direction == 'right') {
            snakePart.classList.add('snake-head-right')
        } else if (i == 0 && direction == 'left') {
            snakePart.classList.add('snake-head-left')
        } else if (i == 0 && direction == 'up') {
            snakePart.classList.add('snake-head-top')
        } else if (i == 0 && direction == 'down') {
            snakePart.classList.add('snake-head-bottom')
        }

        if (i != 0 && i != snake.length - 1) { snakePart.classList.add('snake-body') }
        if (i == snake.length - 1) { snakePart.classList.add('snake-tile') }

        snakePart.style.left = snake[i].x * cellSize + "px";
        snakePart.style.top = snake[i].y * cellSize + "px";
        gameField.appendChild(snakePart);
        canTurn = true;
    }
}


// -------------------- перемешивание массива -----------------------
function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array[0];
}
// Рисуем фруктик
function drawFruit() {
    let i = 0
    function draw() {
        var fruitElement = document.createElement("div");
        fruitElement.className = "fruit";
        fruitElement.classList.add(fruit.klas)
        fruitElement.style.transform = `scale(${fruitLevel * 1.2})`
        fruitElement.style.left = fruit.x * cellSize + "px";
        fruitElement.style.top = fruit.y * cellSize + "px";
        gameField.appendChild(fruitElement);
    }
    wallArray.forEach(brik => {
        if (i == 0 && fruit.x == brik.x && fruit.y == brik.y) {
            ramdomOnField(fruit, shuffle(fruitsArray))
            i = 1;
            console.log('Covpalo');
        }
    })
    draw();
}

// Рисуем стенку
function drawWall() {
    wallArray.forEach(brik => {
        var wallElement = document.createElement("div");
        wallElement.className = "brick";
        wallElement.classList.add(brik.klas)
        wallElement.style.left = brik.x * cellSize + "px";
        wallElement.style.top = brik.y * cellSize + "px";
        gameField.appendChild(wallElement);
    })

}
// Удаляем предыдущие отрисованные элементы
function clearField() {
    while (gameField.firstChild) {
        gameField.removeChild(gameField.firstChild);
    }
}

// Выводим количество очков
function updateScore() {
    var scoreElement = document.getElementById("score");
    scoreElement.innerHTML = '<span class="fruits-top"></span><span>' + score + '</span>';
    var levelElement = document.getElementById("level");
    levelElement.innerHTML = '<span class="cup-top"></span><span>' + level + '</span>';
}

// отслеживаем размер окна, устанавливаем гранцы поля
function adaptiveField() {
    fieldWidth = (parseInt(gameField.offsetWidth / cellSize) * cellSize);
    fieldHeight = (parseInt(gameField.offsetHeight / cellSize) * cellSize);
    gameField.style = `
    border-color: green; 
    border-top-width: ${(gameField.offsetHeight - fieldHeight) / 2}px;
    border-bottom-width: ${(gameField.offsetHeight - fieldHeight) / 2}px;
    border-left-width: ${(gameField.offsetWidth - fieldWidth) / 2}px;
    border-right-width: ${(gameField.offsetWidth - fieldWidth) / 2}px;    
    `;
}


// Игровой цикл
function gameLoop() {

    // if(direction == 'right') antiDirection = 'left'
    // if(direction == 'left') antiDirection = 'right'
    // if(direction == 'up') antiDirection = 'down'
    // if(direction == 'down') antiDirection = 'up'

    if (level == 1 && score == 0) { levelUp(levelBool); levelBool = false }
    if (level == 2 && score == 0) { levelUp(levelBool); levelBool = false }
    if (level == 3 && score == 0) { levelUp(levelBool); levelBool = false }
    adaptiveField()
    clearField();
    drawSnake();
    moveSnake();
    drawWall();
    drawFruit();
    updateScore();

    canTurn = true;
    // Проверка есть ли в стоке следующее направление для движения и применяем если есть
    // нужно для быстро нажатых последовательно 2-х кнопок    
    if (turnStack) {
        direction = turnStack
        turnStack = null
    }
}
// -------------------------- для подгонки стилей при горизонтальном телефлне --------------------
mobileHorizontal()
function mobileHorizontal(){
    if (document.querySelector('body').offsetHeight <= 500 && document.querySelector('body').offsetWidth >= 1400) {
        document.querySelector('.popup').style.top = 35 + '%';
        document.querySelector('.popup').style.height = 12 + "rem";
        document.querySelector('.popup').style.width = 25 + "%";        
    } else {
        document.querySelector('.popup').style.removeProperty('height');
        document.querySelector('.popup').style.removeProperty('width');       
        document.querySelector('.popup').style.removeProperty('top');       

    }
}

window.addEventListener('resize', (e) => {
    setTimeout(() => {
        mobileHorizontal()
        fieldWidth = (parseInt(gameField.offsetWidth / cellSize) * cellSize);
        fieldHeight = (parseInt(gameField.offsetHeight / cellSize) * cellSize);
        colNum = parseInt(gameField.offsetWidth / cellSize)
        rowNum = parseInt(gameField.offsetHeight / cellSize)
        createFieldCells(colNum, rowNum)
    }, 200)
})


// Обработка нажатий клавиш
document.addEventListener("keydown", function (event) {
    changeDirection(event.keyCode);
    if (event.keyCode === 32) { stopOrContinue(); }
});

homePauseBtn.addEventListener("click", stopOrContinue)
function stopOrContinue() {
    if (gameOn) {
        stopGame()
        gameOn = false
        homePauseBtn.classList.add('active')
    } else {
        gameOn = true
        continueGame(gameOn, level)
        homePauseBtn.classList.remove('active')
    }
};

// Изменение направления движения змейки
function changeDirection(keyCode) {

    // 37: влево, 38: вверх, 39: вправо, 40: вниз
    if (keyCode === 37 && direction !== "right") {
        turnStack = 'left';
        // turnStackAnti = 'right';
        if (canTurn) { direction = "left"; canTurn = false; }

    } else if (keyCode === 38 && direction !== "down") {
        turnStack = 'up';
        // turnStackAnti = 'down';
        if (canTurn) { direction = "up"; canTurn = false; }

    } else if (keyCode === 39 && direction !== "left") {
        turnStack = 'right';
        // turnStackAnti = 'left';
        if (canTurn) { direction = "right"; canTurn = false; }


    } else if (keyCode === 40 && direction !== "up") {
        turnStack = 'down';
        // turnStackAnti = 'up';
        if (canTurn) { direction = "down"; canTurn = false; }
    }
}

// Перемещение змейки
function moveSnake() {
    head = { x: snake[0].x, y: snake[0].y };

    // Изменяем координаты головы в зависимости от направления
    if (direction === "right") {
        head.x++;
    } else if (direction === "left") {
        head.x--;
    } else if (direction === "up") {
        head.y--;
    } else if (direction === "down") {
        head.y++;
    }

    // Добавляем новую голову в начало змейки
    snake.unshift(head);

    // Проверяем, если змейка врезалась в кирпичи    
    wallArray.forEach(brik => {
        if (head.x === brik.x && head.y === brik.y) {
            strikeHead()
            popupOpen('again', score);
            popClose();
            stopGame();
        }
    })


    // Проверяем, если змейка съела яблоко при маленьком фрукте
    if (fruitLevel == 2) {
        if (head.x === fruit.x && head.y === fruit.y) {
            eatingHead()
            ramdomOnField(fruit, shuffle(fruitsArray))
            score += 1;

            if (level == 1 && score == 10) { level = 2; levelBool = true; levelUp(levelBool); levelBool = false; }
            if (level == 2 && score == 20) { level = 3; levelBool = true; levelUp(levelBool); levelBool = false; }
            if (level == 2 && score == 0) { levelSound.play(); }
            if (level == 2 && score == 10) { levelSound.play(); }
            if (level == 3 && score == 0) { levelSound.play(); }
            if (level == 3 && score == 10) { levelSound.play(); }
            if (level == 3 && score == 20) { levelSound.play(); }
            if (level == 3 && score == 30) { youWin() }


            if (score % 3 === 0) { wallArray.push(ramdomOnField(wall, 'brick')) }
        } else {
            snake.pop();
        }
    }
    // Проверяем, если змейка съела яблоко при большом фрукте
    if (fruitLevel == 3) {
        if ((head.x === fruit.x && head.y === fruit.y) ||
            (head.x === fruit.x - 1 && head.y === fruit.y - 1) ||
            (head.x === fruit.x && head.y === fruit.y - 1) ||
            (head.x === fruit.x + 1 && head.y === fruit.y - 1) ||
            (head.x === fruit.x - 1 && head.y === fruit.y) ||
            (head.x === fruit.x + 1 && head.y === fruit.y) ||
            (head.x === fruit.x - 1 && head.y === fruit.y + 1) ||
            (head.x === fruit.x && head.y === fruit.y + 1) ||
            (head.x === fruit.x + 1 && head.y === fruit.y + 1)) {
            eatingHead()
            ramdomOnField(fruit, shuffle(fruitsArray))
            score += 1;
            if (level == 1 && score == 10) { level = 2; levelBool = true; levelUp(levelBool); levelBool = false; }
            if (level == 2 && score == 20) { level = 3; levelBool = true; levelUp(levelBool); levelBool = false; }
            if (level == 2 && score == 0) { levelSound.play(); }
            if (level == 2 && score == 10) { levelSound.play(); }
            if (level == 3 && score == 0) { levelSound.play(); }
            if (level == 3 && score == 10) { levelSound.play(); }
            if (level == 3 && score == 20) { levelSound.play(); }
            if (level == 3 && score == 30) { youWin() }

            if (score % 3 === 0) { wallArray.push(ramdomOnField(wall, 'brick')) }
        } else {
            snake.pop();
        }
    }


    // Проверяем, если змейка столкнулась с собой или со стеной
    if (isValidMove()) {
        popupOpen('again', score);
        popClose();
        stopGame();
    }
}
function strikeHead() {
    let headT = document.querySelector('.snake-head-top')
    let headB = document.querySelector('.snake-head-bottom')
    let headR = document.querySelector('.snake-head-right')
    let headL = document.querySelector('.snake-head-left')
    if (headT) {
        scaleAndMinus(headT, 'vlip')
    } else if (headB) {
        scaleAndMinus(headB, 'vlip')
    } else if (headR) {
        scaleAndMinus(headR, 'vlip')
    } else if (headL) {
        scaleAndMinus(headL, 'vlip')
    }
}
function eatingHead() {
    let headT = document.querySelector('.snake-head-top')
    let headB = document.querySelector('.snake-head-bottom')
    let headR = document.querySelector('.snake-head-right')
    let headL = document.querySelector('.snake-head-left')
    if (headT) {
        scaleAndMinus(headT, 'big')
    } else if (headB) {
        scaleAndMinus(headB, 'big')
    } else if (headR) {
        scaleAndMinus(headR, 'big')
    } else if (headL) {
        scaleAndMinus(headL, 'big')
    }
}
function scaleAndMinus(head, clas) {
    head.classList.add(clas)
    if (!head.classList.contains('vlip')) {
        eat.play()
        stopGame()
        let pause = setTimeout(() => {
            head.classList.remove(clas)
            continueGame(gameOn, level)
        }, 500)
    } else {
        bricks.play()
        stopGame()
    }

}

// Проверка столкновения змейки
function isValidMove() {
    var head = snake[0];

    // Проверяем, если змейка столкнулась со стеной
    if (
        head.x < 0 ||
        head.x >= fieldWidth / cellSize ||
        head.y < 0 ||
        head.y >= fieldHeight / cellSize
    ) {
        strikeHead()
        return true;
    }

    // Проверяем, если змейка столкнулась с собой
    for (var i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// СТОП ИГРА
function stopGame() {
    clearTimeout(game)
}

// Сброс настроек игры
function resetGame() {
    snake = [
        { x: 2, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 0 },
    ];
    direction = "right";
    ramdomOnField(fruit, shuffle(fruitsArray))
    wallArray = []
    ramdomOnField(wall, 'brick')
    wallArray.push(ramdomOnField(wall, 'brick'))
    // Обнуляем количество очков
    score = 0;
    level = levelTurn;
    if (level === 1) { speed = 175; fruitLevel = 3 }
    if (level === 2) { speed = 135; fruitLevel = 2 }
    if (level === 3) { speed = 105; fruitLevel = 2 }
    levelBool = true;

}

// Запуск игры
function gameStart() {
    if (gameOn) {
        if (level === 1) { speed = 175; fruitLevel = 3 }
        if (level === 2) { speed = 135; fruitLevel = 2 }
        if (level === 3) { speed = 105; fruitLevel = 2 }
        let g = document.querySelector('.game-box')
        if (g.classList.contains('opacity-hidden')) g.classList.remove('opacity-hidden')
        direction = "right";
        game = setInterval(gameLoop, speed);
    }
}
// Запуск игры
function continueGame(gameOn, level) {
    if (gameOn) {
        if (level === 1) { speed = 175; fruitLevel = 3 }
        if (level === 2) { speed = 135; fruitLevel = 2 }
        if (level === 3) { speed = 105; fruitLevel = 2 }
        game = setInterval(gameLoop, speed);
    }
}

function youWin() {
    resetGame();
    stopGame();
    popupOpen('win', score);
    popClose();
}

function levelUp(levelBool) {
    if (levelBool) {
        levelSound.play();
        let levelElement = document.createElement('div')
        let body = document.querySelector('body')
        body.append(levelElement)
        levelElement.innerText = level;
        levelElement.className = "level-number";
        levelElement.classList.add('active')

        setTimeout(() => {
            levelElement.classList.remove('active')
        }, 1000)
        setTimeout(() => {
            levelElement.remove()
        }, 2000)
    }
}

/// -------------------------------------- POPUP OPEN -----------------------------------------------------------------------
function popupOpen(status, score) {
    // #popup #popupClose - для кликов, 
    // .popup--show - для отображения
    // .popup-title .popup-content - для вставки HTML

    let overlay = document.querySelector('.service-overlay')
    let popWindow = document.querySelector('#popup')
    let popContent = popWindow.querySelector('.popup-picture')
    let buttonsContent = popWindow.querySelector('.popup-buttons')
    let messageContent = popWindow.querySelector('.popup-message')

    popupFunc(status)
    function popupFunc(status) {
        var contentHtml
        var buttonsHtml
        var messageHtml
        if (popWindow) {
            if (status === 'start') {
                buttonsHtml = `<button class="popupBtn" id="levelup">Сложность</button>
                         <button class="popupBtn" id="start">Начать</button>
          `;
            }
            if (status === 'win') {
                contentHtml = ``;
                buttonsHtml = `<button class="popupBtn" id="back">Меню</button>
                         <button class="popupBtn" id="again">Заново</button>
          `;
                messageHtml = `<h3>УРА ! ПОБЕДА !</h3>`;
            }

            if (status === 'again') {
                contentHtml = ` 
                      <div class="container">                    
                         <div class="row">
                            <div class="col-6">
                             <div class="popup-center ml3">
                               <div class="score-icon"></div>
                               <div class="score-count">${score}</div>
                             </div>
                            </div>
                            <div class="col-6">
                              <div class="popup-center">
                               <div class="level-icon"></div>
                               <div class="level-count">${level}</div>
                              </div>
                            </div>
                          </div>     
                      </div>                                    
                        `;
                buttonsHtml = `<button class="popupBtn" id="back">Меню</button>
                         <button class="popupBtn" id="again">Заново</button>
          `;
                messageHtml = `<h3>Вы проиграли !</h3>`;
            }

            if (status === 'level') {
                contentHtml = `     <ul class="level-menu">                                                            
                               <li id="easy">Легко</li>
                                <li id="middle">Средне</li>                              
                                 <li id="hard">Сложно</li>
                              </ul>   `;
                buttonsHtml = `<button class="popupBtn" id="back">Меню</button>
                           <button class="popupBtn" id="level-set">Применить</button>
            `;
                messageHtml = `<h3>Выберите сложность игры!</h3>`;
            }
            openPopup(status, contentHtml, buttonsHtml, messageHtml)

            function openPopup(status, content, buttons, message) {
                // -------------------- Если проиграл -----------------------
                if (status == 'win') {
                    // messageContent.style.display = 'block'
                    popContent.classList.remove('start-picture')
                    popContent.classList.add('win-picture')
                    if (popContent) popContent.innerHTML = content;
                    if (buttonsContent) buttonsContent.innerHTML = buttons;
                    if (messageContent) messageContent.innerHTML = message;
                    let game = document.querySelector('.game-box')
                    game.classList.add('opacity-hidden')
                    popWindow.classList.add('popup--show')
                    overlay.style.left = 0;
                    overlay.style.background = 'rgb(0,0,0,0.3)';
                    win.play();

                    // -------------------- Если проиграл -----------------------
                } else if (status == 'again') {
                    // messageContent.style.display = 'block'
                    popContent.classList.remove('start-picture')
                    popContent.classList.remove('win-picture')
                    popContent.classList.add('lost-picture')
                    if (popContent) popContent.innerHTML = content;
                    if (buttonsContent) buttonsContent.innerHTML = buttons;
                    if (messageContent) messageContent.innerHTML = message;
                    let game = document.querySelector('.game-box')
                    game.classList.add('opacity-hidden')
                    popWindow.classList.add('popup--show')
                    overlay.style.left = 0;
                    overlay.style.background = 'rgb(0,0,0,0.3)';

                    // -------------------- Если начало игры -----------------------
                } else if (status == 'start') {
                    if (popContent) popContent.innerHTML = '';
                    popContent.classList.remove('level-picture')
                    popContent.classList.remove('lost-picture')
                    popContent.classList.add('start-picture')
                    messageContent.style.display = 'none'
                    if (buttonsContent) buttonsContent.innerHTML = buttons;
                    let game = document.querySelector('.game-box')
                    game.classList.add('opacity-hidden')
                    popWindow.classList.add('popup--show')
                    overlay.style.left = 0;
                    overlay.style.background = 'rgb(0,0,0,0.3)';


                    // -------------------- Если выбор сложности -----------------------
                } else if (status == 'level') {
                    popContent.classList.remove('win-picture')
                    popContent.classList.remove('start-picture')
                    popContent.classList.add('level-picture')
                    if (popContent) popContent.innerHTML = content;
                    if (buttonsContent) buttonsContent.innerHTML = buttons;
                    let game = document.querySelector('.game-box')
                    game.classList.add('opacity-hidden')
                    popWindow.classList.add('popup--show')
                    overlay.style.left = 0;
                    overlay.style.background = 'rgb(0,0,0,0.3)';

                    //----- select process ----
                    let btns = popContent.querySelectorAll('li')
                    removeSelected()
                    if (level === 1) btns[0].classList.add('selected')
                    if (level === 2) btns[1].classList.add('selected')
                    if (level === 3) btns[2].classList.add('selected')
                    btns.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            let curBtn = e.target
                            removeSelected()
                            curBtn.classList.add('selected')
                            if (curBtn.getAttribute('id') === 'easy' && curBtn.classList.contains('selected')) { levelTurn = 1 }
                            if (curBtn.getAttribute('id') === 'middle' && curBtn.classList.contains('selected')) { levelTurn = 2 }
                            if (curBtn.getAttribute('id') === 'hard' && curBtn.classList.contains('selected')) { levelTurn = 3 }

                        })
                    })
                    function removeSelected() {
                        btns.forEach(btn => {
                            btn.className = ''
                        })
                    }
                }
            }

        } else {
            console.log('Ошибка, модального окна не существует ! ');
            return;
        }

    }
}


// закрываем модальное окно
function popClose() {
    let overlay = document.querySelector('.service-overlay')
    let popWindow = document.querySelector('#popup')
    let btnAgain = popWindow.querySelector('#again')
    let btnBack = popWindow.querySelector('#back')
    let btnLevel = popWindow.querySelector('#levelup')
    let btnLevelSet = popWindow.querySelector('#level-set')
    let btnStart = popWindow.querySelector('#start')
    btnLevel && btnLevel.addEventListener('click', closePopup.bind(null, 'level'))
    btnLevelSet && btnLevelSet.addEventListener('click', closePopup.bind(null, 'level-set'))
    btnAgain && btnAgain.addEventListener('click', closePopup.bind(null, 'again'))
    btnBack && btnBack.addEventListener('click', closePopup.bind(null, 'back'))
    btnStart && btnStart.addEventListener('click', closePopup.bind(null, 'start'))

    function closePopup(status) {
        if (status === 'again') {
            let popScore = popWindow.querySelector('.score-count')
            let popLevel = popWindow.querySelector('.level-count')
            popWindow.classList.remove('popup--show')
            if (popScore) popScore.innerHTML = '';
            if (popLevel) popLevel.innerHTML = '';
            overlay.style.left = -100 + '%';
            overlay.style.background = 'rgb(0,0,0,0)';
            resetGame()
            gameStart()
        }
        if (status === 'back') {
            popWindow.classList.remove('popup--show')
            overlay.style.left = -100 + '%';
            overlay.style.background = 'rgb(0,0,0,0)';
            setTimeout(() => {
                resetGame()
                popupOpen('start');
                popClose()
            }, 500)
        }

        if (status === 'level') {
            popWindow.classList.remove('popup--show')
            overlay.style.left = -100 + '%';
            overlay.style.background = 'rgb(0,0,0,0)';
            setTimeout(() => {
                popupOpen('level', null);
                popClose()
            }, 500)

        }

        if (status === 'level-set') {
            popWindow.classList.remove('popup--show')
            overlay.style.left = -100 + '%';
            overlay.style.background = 'rgb(0,0,0,0)';
            level = levelTurn
            setTimeout(() => {
                popupOpen('start', null);
                popClose()
            }, 500)

        }

        if (status === 'start') {
            popWindow.classList.remove('popup--show')
            overlay.style.left = -100 + '%';
            overlay.style.background = 'rgb(0,0,0,0)';
            gameStart()
        }
    }
}


// --------------------------- SWIPE MOBILE --------------------------------------------------
import { Swipe } from './myJsClasses/swipe.js'

var swiper = new Swipe('#game-field', {
    edge: 3,
    many: true
}
);
swiper.onLeft(function () {
    if (direction !== "right") { if (canTurn) { turnStack = 'left'; direction = "left"; canTurn = false; } }
});
swiper.onRight(function () {
    if (direction !== "left") { if (canTurn) { turnStack = 'right'; direction = "right"; canTurn = false; } }
});
swiper.onUp(function () {
    if (direction !== "down") { if (canTurn) { turnStack = 'up'; direction = "up"; canTurn = false; } }
});
swiper.onDown(function () {
    if (direction !== "up") { if (canTurn) { turnStack = 'down'; direction = "down"; canTurn = false; } }
});
swiper.run();

