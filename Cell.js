export default class Cell {
  #cellElement;

  #x;

  #y;

  #tile;

  #mergeTile;

  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
    this.#tile = null;
    this.#mergeTile = null;
  }

  get tile() {
    return this.#tile;
  }

  set tile(value) {
    this.#tile = value;
    if (value == null) return;
    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  canAccept(tile) {
    return this.tile == null || (this.mergeTile === null && this.tile.value === tile.value);
  }

  set mergeTile(value) {
    this.#mergeTile = value;
    if (value === null) return;
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return;
    this.tile.value += this.mergeTile.value;
    this.mergeTile.remove();
    this.mergeTile = null;
  }
}
