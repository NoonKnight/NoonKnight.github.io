import Grid from "./Grid.js";
import Tile from "./Tile.js";

const board = document.getElementById("board");

const grid = new Grid(board);
grid.randomEmptyCell().tile = new Tile(board);
grid.randomEmptyCell().tile = new Tile(board);
let touchstartX;
let touchstartY;
setupInput();

function setupInput() {
  window.addEventListener("keydown", handleKeyboard, { once: true });
  board.addEventListener(
    "touchstart",
    (event) => {
      touchstartX = event.changedTouches[0].screenX;
      touchstartY = event.changedTouches[0].screenY;
    },
    false
  );
  board.addEventListener(
    "touchend",
    (event) => {
      touchendX = event.changedTouches[0].screenX;
      touchendY = event.changedTouches[0].screenY;
      handleGesture();
    },
    false
  );
}
//async
function handleGesture() {
  if (touchendX < touchstartX) {
    console.log("Swiped Left");
    if (canMoveLeft()) {
      //await
      moveLeft();
    }
  }
  if (touchendX > touchstartX) {
    console.log("Swiped Right");
    if (canMoveRight()) {
      //await
      moveRight();
    }
  }
  if (touchendY < touchstartY) {
    console.log("Swiped Up");
    if (canMoveUp()) {
      //await
      moveUp();
    }
  }
  if (touchendY > touchstartY) {
    console.log("Swiped Down");
    if (canMoveDown()) {
      //await
      moveDown();
    }
  }
  // if (touchendY === touchstartY) {
  //   console.log("Tap");
  // }
}
async function handleKeyboard(e) {
  switch (e.key) {
    case "ArrowUp": {
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    }
    case "ArrowDown": {
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    }
    case "ArrowLeft": {
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    }
    case "ArrowRight": {
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    }
    default: {
      setupInput();
      return;
    }
  }
  grid.cells.forEach((cell) => cell.mergeTiles());
  const newTile = new Tile(board);
  grid.randomEmptyCell().tile = newTile;
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      alert("You lose");
    });
    return;
  }
  setupInput();
}
function moveUp() {
  return slideTiles(grid.cellsByColumn);
}
function moveDown() {
  return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}
function moveLeft() {
  return slideTiles(grid.cellsByRow);
}
function moveRight() {
  return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}
function slideTiles(cells) {
  return Promise.all(
    cells.flatMap((group) => {
      const promises = [];
      for (let i = 1; i < group.length; i++) {
        const cell = group[i];
        if (cell.tile == null) continue;
        let lastValidCell;
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];
          if (!moveToCell.canAccept(cell.tile)) break;
          lastValidCell = moveToCell;
        }
        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition());
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null;
        }
      }
      return promises;
    })
  );
}
function canMoveUp() {
  return canMove(grid.cellsByColumn);
}
function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}
function canMoveLeft() {
  return canMove(grid.cellsByRow);
}
function canMoveRight() {
  return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}
function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}
