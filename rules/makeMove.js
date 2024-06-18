function runTestingMakeMove(){
  testingMakeMove(makeMove)
}
/**
 * @param {Gameboard} gameboard
 * @param {YourMove} yourMove
 */
function makeMove(gameboard, yourMove){
  if(theSpaceAlreadyHasADisk(gameboard, yourMove)) return gameboard
  return evaluateGameboard(gameboard, yourMove)

  function theSpaceAlreadyHasADisk(gameboard, yourMove){
    const space = gameboard.at(yourMove.row).at(yourMove.column)
    return space === BLACK || space === WHITE
  }

  function evaluateGameboard(gameboard, yourMove){
    const boardToEvaluate = placeDisks(gameboard, yourMove)
    const evaluatedBoard = outflank(boardToEvaluate, yourMove)
    return areEqual(boardToEvaluate, evaluatedBoard) ? gameboard : evaluatedBoard
  }
}

/**
 * @param {Gameboard} grid
 * @param {...YourMove} moves
 */
function placeDisks(grid, ...moves){
  return moves.reduce((board, move) => board.with(move.row, board.at(move.row).with(move.column, move.diskColor)), grid)
}

/**
 * @typedef {Object} YourMove
 * @property {number} row
 * @property {number} column
 * @property {Disk} diskColor 
 */

