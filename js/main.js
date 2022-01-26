'use script'

var gBoard;
var gLevel = {
    size: 4,
    mines: 2
};
const MINE = '💣';
const HAPPY = '😀';
const SAD = '🤯'

function init() {
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
                isMarked: false
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
        var row = getRandomInt(0, board.length);
        var col = getRandomInt(0, board[0].length);
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
                cell = (gBoard[i][j].isMine) ? MINE : gBoard[i][j].minesAroundCount;

            } else {
                cell = 'X'; // TODO: insert icon
            }

            strHTML += `<td onclick="cellClicked(this, ${i}, ${j})" class="cell">${cell}</td>`
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
};


function cellClicked(elCell, row, col) {
    if (!gBoard[row][col].isShown) {
        if (gBoard[row][col].isMine) {
            gameOver();
        } else {
            gBoard[row][col].isShown = true;
            if (gBoard[row][col].minesAroundCount === 0) { // cell without negs
                revealNegs(row, col);
            }
            renderBoard();
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


function gameOver() {
    revealAllMine();
    renderBoard();
    var elrstBtn = document.querySelector('.restart');
    elrstBtn.innerText = SAD;

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
    gBoard = buildBoard();
    renderBoard();
    elrstBtn.innerText = HAPPY;
}





































// function init() {
//     gBoard = buildBoard();
//     renderBoard();
// }


// function renderBoard() {
//     var strHTML = '';
//     for (var i = 0; i < gLevel.size; i++) {
//         strHTML += '<tr>\n';
//         for (var j = 0; j < gLevel.size; j++) {
//             var cell = gBoard[i][j];
//             console.log(cell);
//             if (cell.isMine) {
//                 cell === MINE;
//             } else {
//                 cell = ' ';
//             }
//             strHTML += `<td onclick="cellClicked(this, ${i}, ${j})" class="cell cell-${i}-${j} hide" >${cell}</td>`
//             console.log(strHTML);
//         }
//         strHTML += '</tr>';
//         console.log(strHTML);
//     }
//     var elBoard = document.querySelector('board');
//     elBoard.innerHTML = strHTML;


// }



// // function setMinesNegsCount(board) {

// // }

// function cellClicked(elCell, i, j) {

// }