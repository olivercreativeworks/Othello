/**
 * @typedef {Object} YourMove
 * @property {number} row
 * @property {number} column
 * @property {Disk} diskColor 
 */

/**
 * @typedef {Object} Coordinate
 * @prop {number} row
 * @prop {number} column
 */

/**
 * @typedef {"B" | "W"} Disk
 */

const BLACK = "B"
const WHITE = "W"

function isBlank(space){
  return isNothing(space)
}

/**
 * @param {Gameboard} grid
 * @param {...YourMove} moves
 */
function placeDisks(grid, ...moves){
  return moves.reduce((board, move) => board.with(move.row, board.at(move.row).with(move.column, move.diskColor)), grid)
}

class Maybe{
  constructor(x){
    this.x = x
  }

  static of(x){
    return new Maybe(x)
  }

  map(fn){
    return this.isNothing() ? Maybe.of(this.x) : Maybe.of(fn(this.x))
  }

  isNothing(){
    return this.x === undefined || this.x === null
  }

  orElse(value){
    return this.isNothing() ? value : this.x
  }
}