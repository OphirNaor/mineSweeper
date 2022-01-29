'use strict'


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}

function startStopWatch() {
    gWatchInterval = setInterval(updateWatch, 1)
    gStartTime = Date.now()
}

function updateWatch() {
    var now = Date.now()
    var time = ((now - gStartTime) / 1000).toFixed(2)
    var elTime = document.querySelector('.timer')
    elTime.innerText = `TIMER: ${time}`;
}

function endStopWatch() {
    clearInterval(gWatchInterval)
    gWatchInterval = null
}

function playAudio(path) {
    var audio = new Audio(path);
    audio.play();
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

function revealNegs(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = gBoard[i][j]
            if (!currCell.isMine && !currCell.isShown) {
                currCell.isShown = true;
                if (currCell.minesAroundCount === 0) {
                    revealNegs(i, j);
                }
            }
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
function placeMines(board, mineCount, firstClickRow, firstClickCol) {
    var placedMinesCount = 0;
    while (placedMinesCount < mineCount) {
        var row = getRandomInt(1, board.length);
        var col = getRandomInt(1, board[0].length);
        if (!board[row][col].isMine && (row !== firstClickRow || col !== firstClickCol)) {
            board[row][col].isMine = true;
        }

        placedMinesCount++;
    }


}






