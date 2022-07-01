import Grid from "./Grid.js";
import Tile from "./Tile.js";

const board = document.getElementById("board");
const debug = document.getElementById("debug");

const grid = new Grid(board);
grid.randomEmptyCell().tile = new Tile(board);
grid.randomEmptyCell().tile = new Tile(board);

let touchStart = { x: 0, y: 0 };
let touchEnd = { x: 0, y: 0 };
setupTouch();
function setupTouch() {
  document.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.changedTouches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
    } //, { once: true }
  );
  document.addEventListener(
    "touchend",
    (event) => {
      const touch = event.changedTouches[0];
      touchEnd = { x: touch.clientX, y: touch.clientY };
      handleGesture();
    } //, { once: true }
  );
}

setupKeyboard();
function setupKeyboard() {
  window.addEventListener("keydown", handleKeyboard, { once: true });
}
async function handleGesture() {
  const diff = { x: touchEnd.x - touchStart.x, y: touchEnd.y - touchStart.y };
  const debugLog = (touch = "tap") => {
    // debug.innerText = `${touch}, x: ${parseFloat(
    //   diff.x.toFixed(2)
    // )}, y: ${parseFloat(diff.y.toFixed(2))}`;
  };
  if (Math.abs(diff.x) > Math.abs(diff.y)) {
    if (touchEnd.x < touchStart.x) {
      debugLog("Left");
      if (canMoveLeft()) {
        await moveLeft();
        postMove();
        return;
      }
    }
    if (touchEnd.x > touchStart.x) {
      debugLog("Right");
      if (canMoveRight()) {
        await moveRight();
        postMove();
        return;
      }
    }
  } else {
    if (touchEnd.y < touchStart.y) {
      debugLog("Up");
      if (canMoveUp()) {
        await moveUp();
        postMove();
        return;
      }
    }
    if (touchEnd.y > touchStart.y) {
      debugLog("Down");
      if (canMoveDown()) {
        await moveDown();
        postMove();
        return;
      }
    }
  }
  // if (touchendY === touchstartY) {
  //   console.log("Tap");
  // }
  // setupTouch();
}
async function handleKeyboard(e) {
  switch (e.key) {
    case "ArrowUp": {
      if (!canMoveUp()) {
        setupKeyboard();
        return;
      }
      await moveUp();
      break;
    }
    case "ArrowDown": {
      if (!canMoveDown()) {
        setupKeyboard();
        return;
      }
      await moveDown();
      break;
    }
    case "ArrowLeft": {
      if (!canMoveLeft()) {
        setupKeyboard();
        return;
      }
      await moveLeft();
      break;
    }
    case "ArrowRight": {
      if (!canMoveRight()) {
        setupKeyboard();
        return;
      }
      await moveRight();
      break;
    }
    default: {
      setupKeyboard();
      return;
    }
  }
  postMove();
  setupKeyboard();
}
function postMove() {
  grid.cells.forEach((cell) => cell.mergeTiles());
  const newTile = new Tile(board);
  grid.randomEmptyCell().tile = newTile;
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      alert("You lose");
    });
    return;
  }
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
