/* eslint-disable no-use-before-define */
import Grid from './Grid.js';
import Tile from './Tile.js';

const gameBoard = document.getElementById('game-board');

const grid = new Grid(gameBoard);

grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);

const setupInput = () => {
  window.addEventListener('keydown', handleInput, { once: true });
};

const slideTiles = (cells) => Promise.all(
  cells.flatMap((group) => {
    const promises = [];
    for (let i = 1; i < group.length; i += 1) {
      const cell = group[i];
      if (cell.tile !== null) {
        let lastValidCell;
        for (let j = i - 1; j >= 0; j -= 1) {
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
    }
    return promises;
  }),
);

const moveUp = () => {
  slideTiles(grid.cellsByColumn);
};

const moveLeft = () => {
  slideTiles(grid.cellsByRow);
};

const moveDown = () => {
  slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
};
const moveRight = () => {
  slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
};

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
  return cells.some((group) => group.some((cell, index) => {
    if (index === 0) return false;
    if (cell.tile == null) return false;
    const moveToCell = group[index - 1];
    return moveToCell.canAccept(cell.tile);
  }));
}

const handleInput = async (e) => {
  switch (e.key) {
    case 'ArrowUp':
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case 'ArrowDown':
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case 'ArrowLeft':
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case 'ArrowRight':
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    default:
      setupInput();
      return;
  }
  grid.cells.forEach((cell) => cell.mergeTiles());
  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      alert('You Lose! Refresh to play again');
    });
    return;
  }
  setupInput();
};

setupInput();
