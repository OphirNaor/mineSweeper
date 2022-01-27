'use script'

var gBoard;
var gLevel = {
    size: 4,
    mines: 2
};
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gWatchInterval;
var isFirstClick = true;
var gStartTime;

const MINE = '../img/black-bomb.png';
const REDMINE = '../img/bomb.png'
const HAPPY = './img/smile.png';
const SAD = './img/sad.png'
const WINNER = './img/sunglasses.png'
const FLAG = '../img/flag.png';
const EMPTY = '../img/empty.png ';
const NUM1 = '../img/num1.png ';
const NUM2 = '../img/num2.png ';
const NUM3 = '../img/num3.png ';
const NUM4 = '../img/num4.png ';
const NUM5 = '../img/num5.png ';
const NUM6 = '../img/num6.png ';
const NUM7 = '../img/num7.png ';
const NUM8 = '../img/num8.png ';
const COVER = '../img/cover.png';




function init() {
    gGame.isOn = true;
    gBoard = buildBoard();
    renderBoard();

}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isRedMine: false
            }
        }
    }

    placeMines(board, gLevel.mines);
    setMinesNegsCount(board);
    console.table(board);
    return board;
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var mineCounter = 0;
            if (board[i - 1] && board[i - 1][j - 1] && board[i - 1][j - 1].isMine) {
                mineCounter++;
            }
            if (board[i - 1] && board[i - 1][j] && board[i - 1][j].isMine) {
                mineCounter++;
            }
            if (board[i - 1] && board[i - 1][j + 1] && board[i - 1][j + 1].isMine) {
                mineCounter++;
            }
            if (board[i] && board[i][j + 1] && board[i][j + 1].isMine) {
                mineCounter++;
            }
            if (board[i + 1] && board[i + 1][j + 1] && board[i + 1][j + 1].isMine) {
                mineCounter++;
            }
            if (board[i + 1] && board[i + 1][j] && board[i + 1][j].isMine) {
                mineCounter++;
            }
            if (board[i + 1] && board[i + 1][j - 1] && board[i + 1][j - 1].isMine) {
                mineCounter++;
            }
            if (board[i] && board[i][j - 1] && board[i][j - 1].isMine) {
                mineCounter++;
            }
            board[i][j].minesAroundCount = mineCounter;
        }
    }

}


function placeMines(board, mineCount) {
    var placedMinesCount = 0;
    while (placedMinesCount < mineCount) {
        var row = getRandomInt(1, board.length);
        var col = getRandomInt(1, board[0].length);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            placedMinesCount++;
        }
    }
}

function renderBoard() {
    var strHTML = '';
    for (var i = 0; i < gLevel.size; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < gLevel.size; j++) {
            var cell;
            if (gBoard[i][j].isShown) {
                if (gBoard[i][j].isMine) {
                    cell = gBoard[i][j].isRedMine ? REDMINE : MINE;
                } else {
                    cell = getNumImg(gBoard[i][j].minesAroundCount)
                }
            } else {
                if (gBoard[i][j].isMarked) {
                    cell = FLAG
                } else {
                    cell = COVER;
                }
            }
            strHTML += `<td id = cell${i}${j} onclick="cellClicked(this, ${i}, ${j})" class="cell" style="background-image: url(${cell});"></td>`
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
    addClickListners();
};

function addClickListners() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var elCell = document.getElementById(`cell${i}${j}`);
            elCell.addEventListener('contextmenu', e => {
                if (!gBoard[e.currentTarget.row][e.currentTarget.col].isShown) {
                    gBoard[e.currentTarget.row][e.currentTarget.col].isMarked = !gBoard[e.currentTarget.row][e.currentTarget.col].isMarked;
                    renderBoard();
                }
                e.preventDefault();
            });
            elCell.row = i;
            elCell.col = j;
        }
    }
}



function getNumImg(num) {
    switch (num) {
        case 0:
            return EMPTY;
        case 1:
            return NUM1;
        case 2:
            return NUM2;
        case 3:
            return NUM3;
        case 4:
            return NUM4;
        case 5:
            return NUM5;
        case 6:
            return NUM6;
        case 7:
            return NUM7;
        case 8:
            return NUM8;

        default:
            return COVER;
    }
}


function cellClicked(event, row, col) {
    if (!gGame.isOn) return;
    if (isFirstClick) {
        startStopWatch()
        isFirstClick = false;
    }
    if (!gBoard[row][col].isShown) {
        if (gBoard[row][col].isMine) {
            playAudio('sound/bomb.wav');
            gameOver(false, row, col);
        } else {
            gBoard[row][col].isShown = true;
            if (gBoard[row][col].minesAroundCount === 0) { // cell without negs
                revealNegs(row, col);
            }
            renderBoard();
            if (checkWin()) {
                gameOver(true);
            }
        }
    }
}


function revealNegs(row, col) { // reveal all the negs of cell at position [row], [col]
    if (gBoard[row - 1] && gBoard[row - 1][col - 1]) {
        gBoard[row - 1][col - 1].isShown = true
    }
    if (gBoard[row - 1] && gBoard[row - 1][col]) {
        gBoard[row - 1][col].isShown = true
    }
    if (gBoard[row - 1] && gBoard[row - 1][col + 1]) {
        gBoard[row - 1][col + 1].isShown = true
    }
    if (gBoard[row] && gBoard[row][col + 1]) {
        gBoard[row][col + 1].isShown = true
    }
    if (gBoard[row + 1] && gBoard[row + 1][col + 1]) {
        gBoard[row + 1][col + 1].isShown = true
    }
    if (gBoard[row + 1] && gBoard[row + 1][col]) {
        gBoard[row + 1][col].isShown = true
    }
    if (gBoard[row + 1] && gBoard[row + 1][col - 1]) {
        gBoard[row + 1][col - 1].isShown = true
    }
    if (gBoard[row] && gBoard[row][col - 1]) {
        gBoard[row][col - 1].isShown = true
    }
    return;

}

function gameOver(isWin, row, col) { // the function get the location of the click bomb
    var elrstBtn = document.querySelector('.restart');
    if (isWin) {
        elrstBtn.src = WINNER;
    } else {
        elrstBtn.src = SAD;
        gBoard[row][col].isRedMine = true;
        gGame.isOn = false;
        revealAllMine();
        renderBoard();
    }

    endStopWatch();
}

function revealAllMine() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true;
            }
        }
    }
}


function restartGame(elrstBtn) {
    gGame.isOn = true;
    isFirstClick = true;
    gBoard = buildBoard();
    renderBoard();
    var elTime = document.querySelector('.timer')
    elTime.innerText = '0.000';
    endStopWatch();

    elrstBtn.src = HAPPY;
}

function setDifficulty(elDifficulty) {
    switch (elDifficulty.innerText) {
        case 'Beginner':
            gLevel = {
                size: 4,
                mines: 2
            }
            break;
        case 'Standard':
            gLevel = {
                size: 8,
                mines: 12
            }
            break;
        case 'Expert':
            gLevel = {
                size: 12,
                mines: 30
            }
            break;
    }
    init();
}


function checkWin() {
    var markedCount = 0; // count the flags
    var count = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMarked && gBoard[i][j].isMine) {
                count++
            }
            if (gBoard[i][j].isMarked) {
                markedCount++
            }
        }
    }
    if (count === gLevel.mines && markedCount === gLevel.mines) return true;
    else return false;
}

