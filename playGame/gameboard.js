/**
 * @typedef {string[][]} Gameboard
 */



/**
 * @return {Gameboard}
 */
function createGameboard(){
  const startingBoard = Array.from({length:8}, (_, row) => 
    Array.from({length: 8}, (_, column) => 
      (row === 3 && column === 3) || (row === 4 && column === 4) ? WHITE :
      (row === 3 && column === 4) || (row === 4 && column === 3) ? BLACK :
      undefined
    ))
  return startingBoard
}
