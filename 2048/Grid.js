const GRID_SIZE = 4;
const CELL_SIZE = 20;
const CELL_GAP = 2;

export default class Grid {
  static #createCellElements(gridElement) {
    const cells = Array(GRID_SIZE * GRID_SIZE);
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      gridElement.append(cell);
      cells[i] = cell;
    }
    return cells;
  }
  #cells;
  constructor(gridElement) {
    gridElement.style.setProperty("--grid-size", GRID_SIZE);
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
    this.gridElement = gridElement;
    this.#cells = Grid.#createCellElements(gridElement).map((cell, i) => {
      const y = (i / GRID_SIZE) | 0;
      const x = i % GRID_SIZE;
      return new Cell(cell, y, x);
    });
    // console.log(this.#cells);
  }
  get cells() {
    return this.#cells;
  }
  get cellsByRow() {
    return this.#cells.reduce((grid, cell) => {
      grid[cell.y] = grid[cell.y] || [];
      grid[cell.y][cell.x] = cell;
      return grid;
    }, []);
  }
  get cellsByColumn() {
    return this.#cells.reduce((grid, cell) => {
      grid[cell.x] = grid[cell.x] || [];
      grid[cell.x][cell.y] = cell;
      return grid;
    }, []);
  }
  get #emptyCells() {
    return this.#cells.filter((cell) => cell.tile == null);
  }
  randomEmptyCell() {
    const emptyCells = this.#emptyCells;
    return emptyCells[(Math.random() * emptyCells.length) | 0];
  }
}
class Cell {
  // #cellElement;
  #y;
  #x;
  #tile;
  #mergeTile;
  constructor(cellElement, y, x) {
    // this.#cellElement = cellElement;
    this.#y = y;
    this.#x = x;
  }
  get y() {
    return this.#y;
  }
  get x() {
    return this.#x;
  }
  get tile() {
    return this.#tile;
  }
  set tile(value) {
    this.#tile = value;
    if (value == null) return;
    this.#tile.y = this.#y;
    this.#tile.x = this.#x;
  }
  get mergeTile() {
    return this.#mergeTile;
  }
  set mergeTile(value) {
    this.#mergeTile = value;
    if (value === null) return;
    this.#mergeTile.y = this.#y;
    this.#mergeTile.x = this.#x;
  }
  canAccept(tile) {
    return (
      this.tile == null ||
      (this.#mergeTile == null && this.tile.value === tile.value)
    );
  }
  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return;
    // console.log(this.#tile, this.#mergeTile);
    this.tile.value = this.tile.value + this.mergeTile.value;
    this.mergeTile.remove();
    this.mergeTile = null;
  }
}
