const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];

var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;

window.onload = function() {
    id("start").addEventListener("click", startGame);
    id("solve").addEventListener("click", solve);
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].addEventListener("click", function() {
            if (!disableSelect) {
                if(this.classList.contains("selected")) {
                    this.classList.remove("selected");
                    selectedNum = null;
                }
                else {
                    for (let i = 0; i < 9; i++) {
                        id("number-container").children[i].classList.remove("selected");
                    }
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }
        })
    }
}

function getBoard() {
    let tiles = qsa(".tile");
    let board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
    for (i = 0; i < 81; i++) {
        if (tiles[i].textContent != "") {
            board[Math.floor(i/9)][i%9] = tiles[i].textContent;
        }
    }
    return board;
}

function setBoard(board){
    let tiles = qsa(".tile");
    for (i = 0; i < 81; i++) {
        if (board[Math.floor(i/9)][i%9] == 0) {
            tiles[i].textContent = "";
        }
        else {
            tiles[i].textContent = board[Math.floor(i/9)][i%9];
        }
    }
}

function isSafe(grid, row, col, num) {
    // Check if we find the same num
    // in the similar row , we
    // return false
    for(let x = 0; x <= 8; x++)
        if (grid[row][x] == num)
            return false;
 
    // Check if we find the same num
    // in the similar column ,
    // we return false
    for(let x = 0; x <= 8; x++)
        if (grid[x][col] == num)
            return false;
 
    // Check if we find the same num
    // in the particular 3*3
    // matrix, we return false
    let startRow = row - row % 3, 
        startCol = col - col % 3;
         
    for(let i = 0; i < 3; i++)
        for(let j = 0; j < 3; j++)
            if (grid[i + startRow][j + startCol] == num)
                return false;
 
    return true;
}

function solve(){
    solveSudoku(getBoard(), 0, 0);
    if (checkDone()) {
        endGame();
    }
}

function solveSudoku(grid, row, col)
{
    N = 9;
     
    /* If we have reached the 8th
       row and 9th column (0
       indexed matrix) ,
       we are returning true to avoid further
       backtracking       */
    if (row == N - 1 && col == N)
        return true;
 
    // Check if column value  becomes 9 ,
    // we move to next row
    // and column start from 0
    if (col == N)
    {
        row++;
        col = 0;
    }
 
    // Check if the current position
    // of the grid already
    // contains value >0, we iterate
    // for next column
    if (grid[row][col] != 0)
        return solveSudoku(grid, row, col + 1);
 
    for(let num = 1; num < 10; num++)
    {
        // Check if it is safe to place
        // the num (1-9)  in the given 
        // row ,col ->we move to next column
        if (isSafe(grid, row, col, num))
        {
            /*  assigning the num in the current
            (row,col)  position of the grid and
            assuming our assigned num in the position
            is correct */
            grid[row][col] = num;
            setBoard(grid);
            // Checking for next
            // possibility with next column
            if (solveSudoku(grid, row, col + 1))
                return true;
        }
        /* removing the assigned num , since our
           assumption was wrong , and we go for next
           assumption with diff num value   */
        grid[row][col] = 0;
    }
    return false;
}

function startGame() {
    if (id("diff-easy").checked) board = easy[0];
    else if (id("diff-medium").checked) board = medium[0];
    else board = hard[0];
    lives = 3;
    disableSelect = false;
    id("lives").textContent = "Lives Remaining: " + lives;
    generateBoard(board);
    if (id("time-five").checked || id("time-ten").checked) {
        id("timer").classList.remove("hidden");
        startTimer();
    }
    else id("timer").classList.add("hidden");
    if (id("theme-light").checked) {
        qs("body").classList.remove("dark");
    }
    else {
        qs("body").classList.add("dark");
    }
    id("number-container").classList.remove("hidden");
}

function startTimer() {
    if (id("time-five").checked) timeRemaining = 300;
    else if (id("time-ten").checked) timeRemaining = 600;
    else timeRemaining = -1;
    id("timer").textContent = timeConversion(timeRemaining);
    timer = setInterval(function() {
        timeRemaining --;
        if (timeRemaining == 0) endGame();
        id("timer").textContent = timeConversion(timeRemaining);
    }, 1000)
}

function timeConversion(time) {
    let minutes = Math.floor(time / 60);
    if (minutes < 10) minutes = "0" + minutes;
    let seconds = time % 60;
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

function updateMove() {
    if (selectedTile && selectedNum) {
        selectedTile.textContent = selectedNum.textContent;
        if(checkCorrect(selectedTile)) {
            selectedNum.classList.remove("selected");
            selectedTile.classList.remove("selected");
            selectedNum = null;
            selectedTile = null;
            if (checkDone()) {
                endGame();
            }
        }
        else {
            disableSelect = true;
            selectedTile.classList.add("incorrect");
            setTimeout(function() {
                lives --;
                if (lives === 0) {
                    endGame();
                }
                else {
                    id("lives").textContent = "Lives Remaining: " + lives; 
                    disableSelect = false;
                }
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");
                selectedTile.textContent = "";
                selectedNum = null;
                selectedTile = null;
            }, 1000);
        }
    }
}

function checkDone(){
    let tiles = qsa(".tile");
    for (let i = 0; i < 81; i++) {
        if (tiles[i].textContent === "") return false;
    }
    return true;
}

function endGame() {
    disableSelect = true;
    clearTimeout(timer);
    if (lives == 0 || timeRemaining == 0) {
        id("lives").textContent = "You Lost!";
    }
    else {
        id("lives").textContent = "You Won!";
    }
}

function checkCorrect(tile) {
    let solution;
    if (id("diff-easy").checked) solution = easy[1];
    else if (id("diff-medium").checked) solution = medium[1];
    else hard[1];
    if (solution.charAt(tile.id) === tile.textContent) return true;
    else return false;
}

function generateBoard(board){
    clearPrevious();
    let idCount = 0;
    for (let i = 0; i < 81; i++) {
        let tile = document.createElement("p");
        if (board.charAt(i) != "-") {
            tile.textContent = board.charAt(i);
        }
        else {
            tile.addEventListener("click", function() {
                if(!disableSelect) {
                    if(tile.classList.contains("selected")) {
                        tile.classList.remove("selected");
                        selectedTile = null;
                    }
                    else {
                        for (let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            })
        }
        tile.id = idCount;
        idCount ++;
        tile.classList.add("tile");
        if((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }
        if((tile.id + 1)%9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }
        id("board").appendChild(tile);
    }
}

function clearPrevious(){
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }
    if (timer) clearTimeout(timer);
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }
    selectedTile = null;
    selectedNum = null;
}

function id(id) {
    return document.getElementById(id);
}

function qs(selector){
    return document.querySelector(selector);
}

function qsa(selector){
    return document.querySelectorAll(selector);
}