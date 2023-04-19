let cells = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

let rowNum = 3;
let columnNum = 3;
let scoreNum = 0;
let bestScoreNum = 0;
let score = $("#score-value");
let bestScore = $("#best-value");
let container = $(".container");
let btnNewGame = $("#new-game");

btnNewGame.on("click", newGame);

$(window).on("load", () => {
  newGame();
});

function newGame() {
  $(".gameover")[0].classList.remove("gameoverVisible");
  cells = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  generateNewCell();
  generateNewCell();
  score.empty();
  score.append(document.createTextNode("0"));
  scoreNum = 0;
  mapToDocument();
}

function generateNewCell() {
  if (isThereEmptyCell() === true) {
    let x = Math.floor(Math.random() * rowNum);
    let y = Math.floor(Math.random() * columnNum);
    while (cells[x][y] != 0) {
      x = Math.floor(Math.random() * rowNum);
      y = Math.floor(Math.random() * columnNum);
    }
    cells[x][y] = 2;
  }
  if (checkGameOver() == true) {
    $(".gameover")[0].classList.add("gameoverVisible");
  }
}

function isThereEmptyCell() {
  for (let x = 0; x < rowNum; x++) {
    for (let y = 0; y < columnNum; y++) {
      if (cells[x][y] === 0) {
        return true;
      }
    }
  }
  return false;
}

// This will create cells based on the array and map to the html document
function mapToDocument() {
  container.empty(); // Removes all child elements from parent element
  for (let x = 0; x < rowNum; x++) {
    for (let y = 0; y < columnNum; y++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.innerHTML = cells[x][y] === 0 ? "" : cells[x][y].toString();
      if (cells[x][y] <= 4096) {
        cell.classList.add(`for${cells[x][y]}`);
      } else {
        cell.classList.add("for8192");
      }
      container.append(cell);
    }
  }
}

//Handles arrow key press
$(document).on("keyup", (e) => {
  if (e.code == "ArrowLeft") {
    shiftLeft();
    generateNewCell();
    mapToDocument();
  } else if (e.code == "ArrowRight") {
    shiftRight();
    generateNewCell();
    mapToDocument();
  } else if (e.code == "ArrowUp") {
    shiftUp();
    generateNewCell();
    mapToDocument();
  } else if (e.code == "ArrowDown") {
    shiftDown();
    generateNewCell();
    mapToDocument();
  }
});

//Gesture detection for mobile version
let cont = document.getElementById("container");
let touchStartx = 0;
let touchStarty = 0;
let touchEndx = 0;
let touchEndy = 0;

cont.addEventListener(
  "touchstart",
  function (event) {
    let firstTouch = event.changedTouches[0];
    touchStartx = firstTouch.screenX;
    touchStarty = firstTouch.screenY;
  },
  false
);

cont.addEventListener(
  "touchend",
  function (event) {
    let firstTouch = event.changedTouches[0];
    touchEndx = firstTouch.screenX;
    touchEndy = firstTouch.screenY;
    handleTouch();
  },
  false
);

function handleTouch() {
  let xLength = Math.abs(touchStartx - touchEndx);
  let yLength = Math.abs(touchStarty - touchEndy);
  if (touchStartx < touchEndx && xLength > yLength) {
    //right
    shiftRight();
    generateNewCell();
    mapToDocument();
  } else if (touchStartx > touchEndx && xLength > yLength) {
    //left
    shiftLeft();
    generateNewCell();
    mapToDocument();
  } else if (touchStarty < touchEndy && xLength < yLength) {
    //down
    shiftDown();
    generateNewCell();
    mapToDocument();
  } else if (touchStarty > touchEndy && xLength < yLength) {
    //up
    shiftUp();
    generateNewCell();
    mapToDocument();
  }
}

function shiftLeft() {
  //lets assume the first row contain [0,4,4,8]
  for (let x = 0; x < rowNum; x++) {
    //1st step filter the zeros
    let row = cells[x].filter((num) => num != 0); //now it will be [4,4,8]

    //2nd step shift to the left by adding similar numbers
    for (let y = 0; y < row.length - 1; y++) {
      if (row[y] === row[y + 1]) {
        row[y] = row[y] * 2;
        setScore(row[y]);
        row[y + 1] = 0;
      }
    } //after this row will be [8,0,8]

    //3rd step filter the zeros again
    row = row.filter((num) => num != 0); //now it will be [8,8]

    //4th step fill the remaining 0's value to the array
    while (row.length < columnNum) {
      row.push(0);
    } //[8,8,0,0]

    //finally update the cells[x] value
    cells[x] = row;
  }
}

function shiftRight() {
  for (let x = 0; x < rowNum; x++) {
    let row = cells[x].filter((num) => num != 0);
    row = row.reverse(); // By just reversing we can use same function as shift left

    for (let y = 0; y < row.length - 1; y++) {
      if (row[y] === row[y + 1]) {
        row[y] = row[y] * 2;
        setScore(row[y]);
        row[y + 1] = 0;
      }
    }

    row = row.filter((num) => num != 0);

    while (row.length < columnNum) {
      row.push(0);
    }

    cells[x] = row.reverse(); // When we reverse it back we get shift right
  }
}

function shiftUp() {
  for (let x = 0; x < columnNum; x++) {
    let column = [cells[0][x], cells[1][x], cells[2][x]];
    column = column.filter((num) => num != 0);
    for (let y = 0; y < column.length - 1; y++) {
      if (column[y] === column[y + 1]) {
        column[y] = column[y] * 2;
        setScore(column[y]);
        column[y + 1] = 0;
      }
    }

    column = column.filter((num) => num != 0);

    while (column.length < columnNum) {
      column.push(0);
    }

    cells[0][x] = column[0];
    cells[1][x] = column[1];
    cells[2][x] = column[2];
  }
}

function shiftDown() {
  for (let x = 0; x < columnNum; x++) {
    let column = [cells[0][x], cells[1][x], cells[2][x]].reverse();
    column = column.filter((num) => num != 0);
    for (let y = 0; y < column.length - 1; y++) {
      if (column[y] === column[y + 1]) {
        column[y] = column[y] * 2;
        setScore(column[y]);
        column[y + 1] = 0;
      }
    }

    column = column.filter((num) => num != 0);

    while (column.length < columnNum) {
      column.push(0);
    }
    column.reverse();
    cells[0][x] = column[0];
    cells[1][x] = column[1];
    cells[2][x] = column[2];
  }
}

function setScore(value) {
  scoreNum += value;
  let num = document.createTextNode(scoreNum.toString());
  score.empty();
  score.append(num);
  if (bestScoreNum < scoreNum) {
    bestScoreNum = scoreNum;
    let node = document.createTextNode(bestScoreNum.toString());
    bestScore.empty();
    bestScore.append(node);
  }
}

//handle difficulty

let selectDif = document.querySelector("#difficulty");
selectDif.addEventListener("change", (e) => {
  if (selectDif.children[selectDif.selectedIndex].innerHTML == "3x3") {
    window.location.href = "./index3x3.html";
  } else if (selectDif.children[selectDif.selectedIndex].innerHTML == "4x4") {
    window.location.href = "./index.html";
  } else {
    window.location.href = "./index5x5.html";
  }
  //let cont=confirm(`Are you sure you want to start new game with ${selectDif.children[selectDif.selectedIndex].innerHTML} bored.`);
});

function checkGameOver() {
  for (let x = 0; x < rowNum; x++) {
    for (let y = 0; y < columnNum; y++) {
      if (cells[x][y] == 0) {
        return false;
      }
      if (y + 1 < columnNum) {
        if (cells[x][y] == cells[x][y + 1]) {
          return false;
        }
      }
      if (x + 1 < rowNum) {
        if (cells[x][y] == cells[x + 1][y]) {
          return false;
        }
      }
    }
  }
  return true;
}

$("#close-img").on("click", () => {
  $(".gameover")[0].classList.remove("gameoverVisible");
});
