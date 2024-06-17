function runTestingOutflank(){
  testingOutflank(outflank)
}

function outflank(inputGameboard, yourMove){
  return placeDisks(inputGameboard, ...findOutflankedDisks(inputGameboard, yourMove))

  function findOutflankedDisks(gameboard, yourMove){
    const findFunctions = [
      getRowDirectLine,
      getColumnDirectLine,
      getLeftDiagonalDirectLine,
      getRightDiagonalDirectLine
    ]
    return findFunctions.flatMap(finder => finder(gameboard, yourMove)).map(coordinate => createYourMove(yourMove.diskColor, coordinate) )
  }

  /**
   * @param {Disk} diskColor
   * @param {Coordinate} coordinate
   * @return {YourMove}
   */
  function createYourMove(diskColor, coordinate){
    return {diskColor, ...coordinate}
  }

  /**
   * @param {Gameboard} gameboard
   * @param {YourMove} yourMove
   */
  function getColumnDirectLine(gameboard, yourMove){
    const column = getColumn(gameboard, yourMove.column) 
    const coordinates = getColumnCoordinates(gameboard, yourMove.column)
    const directLineIndexes = getDirectLineIndexes(column, {
      diskColor: yourMove.diskColor, 
      column:yourMove.row
      })
    return coordinates.filter((_, index) => directLineIndexes.includes(index))
  }

  /**
   * @param {Gameboard} gameboard
   * @param {YourMove} yourMove
   */
  function getLeftDiagonalDirectLine(gameboard, yourMove){
    const leftDiagonal = getLeftDiagonal(gameboard, yourMove.row, yourMove.column) 
    const coordinates = getLeftDiagonalCoordinates(gameboard, yourMove.row,  yourMove.column)
    const directLineIndexes = getDirectLineIndexes(leftDiagonal, {
      diskColor:yourMove.diskColor, 
      column: coordinates.findIndex(coordinate => coordinate.column === yourMove.column)
      })
    return coordinates.filter((_, index) => directLineIndexes.includes(index)) 
  }

  /**
   * @param {Gameboard} gameboard
   * @param {YourMove} yourMove
   */
  function getRightDiagonalDirectLine(gameboard, yourMove){
    const rightDiagonal = getRightDiagonal(gameboard, yourMove.row ,yourMove.column) 
    const coordinates = getRightDiagonalCoordinates(gameboard, yourMove.row, yourMove.column)
    const directLineIndexes = getDirectLineIndexes(rightDiagonal, {
      diskColor:yourMove.diskColor, 
      column: coordinates.findIndex(coordinate => coordinate.column === yourMove.column)
      })
    return coordinates.filter((_, index) => directLineIndexes.includes(index)) 
  }

  /**
   * @param {Gameboard} gameboard
   * @param {YourMove} yourMove
   */
  function getRowDirectLine(gameboard, yourMove){
    const row = getRow(gameboard, yourMove.row) 
    const coordinates = getRowCoordinates(gameboard, yourMove.row)
    const directLineIndexes = getDirectLineIndexes(row, {
      diskColor:yourMove.diskColor,
      column: yourMove.column
    })
    return coordinates.filter((_, index) => directLineIndexes.includes(index)) 
  }

  function updateGameboard(grid, moves, value){
    return moves.reduce((board, move) => board.with(move.row, board.at(move.row).with(move.column, value)), grid)
  }

  /**
   * @template A
   * @param {A[][]} grid
   * @param {number} rowIndex
   * @return {A[]}
   */
  function getRow(grid, rowIndex){
    return grid.flat().filter((_, i) => getRowIndex(grid.at(rowIndex), i) === rowIndex)
  }

  function getRowIndex(grid, flatIndex){
    return Math.floor(flatIndex/grid.length)
  }

  /**
   * @template A
   * @param {A[][]} grid
   * @param {number} rowIndex
   */
  function getRowCoordinates(grid, rowIndex){
    return getRow( gridToCoordinates(grid), rowIndex )
  }

  /**
   * @return {Coordinate}
   */
  function toCoordinate(row, column){
    return {row, column}
  }

  /**
   * @template A
   * @param {A[][]} grid
   * @return {Coordinate[][]}
   */
  function gridToCoordinates(grid){
    return grid.map((row, rowIndex) => row.map((_, columnIndex) => toCoordinate(rowIndex, columnIndex)))
  }


  /**
   * @param {Gameboard} grid
   * @param {number} colIndex
   */
  function getColumn(grid, colIndex){
    return grid.flat().filter((_, i) => getColumnIndex(grid, i) === colIndex)
  }

  function getColumnIndex(originalGrid, flatIndex){
    return flatIndex % originalGrid.length
  }

  function getColumnCoordinates(grid, colIndex){
    return getColumn(gridToCoordinates(grid), colIndex )
  }

  /**
   * @param {Gameboard} grid
   * @param {number} rowIndex
   * @param {number} colIndex
   */
  function getRightDiagonal(grid, rowIndex, colIndex){
    const diagonalNumber = getRightDiagonalNumber(rowIndex, colIndex)
    return grid.flat().filter((_, i) => getRightDiagonalNumberFromFlatIndex(grid, i) === diagonalNumber)
  }

  function getRightDiagonalNumberFromFlatIndex(grid, flatIndex){
    return getRightDiagonalNumber(getRowIndex(grid, flatIndex), getColumnIndex(grid, flatIndex))
  }

  function getRightDiagonalNumber(rowIndex, colIndex){
    return rowIndex + colIndex
  }

  function getRightDiagonalCoordinates(grid, rowIndex, colIndex){
    return getRightDiagonal(gridToCoordinates(grid), rowIndex, colIndex)
  }

  /**
   * @param {Gameboard} grid
   * @param {number} rowIndex
   * @param {number} colIndex
   */
  function getLeftDiagonal(grid, rowIndex, colIndex){
    const diagonalNumber = getLeftDiagonalNumber(rowIndex, colIndex)
    return grid.flat().filter((_, i) => getLeftDiagonalNumberFromFlatIndex(grid, i) === diagonalNumber)
  }

  function getLeftDiagonalNumberFromFlatIndex(grid, flatIndex){
    return getLeftDiagonalNumber(getRowIndex(grid, flatIndex), getColumnIndex(grid, flatIndex))
  }

  function getLeftDiagonalNumber(rowIndex, colIndex){
    return rowIndex - colIndex
  }

  function getLeftDiagonalCoordinates(grid, rowIndex, colIndex){
    return getLeftDiagonal(gridToCoordinates(grid), rowIndex, colIndex)
  } 

  /**
   * @param {string[]} row
   * @param {{diskColor:Disk, column:number}} yourMove
   */
  function getDirectLineIndexes(row, yourMove){
    const bounds = findDirectLineBounds(row, yourMove)
    return [...range(bounds.leftBound, bounds.rightBound)]

    /**
     * @param {string[]} row
     * @param {{diskColor:Disk, column:number}} yourMove
     */
    function findDirectLineBounds(row, yourMove){
      return makeBounds(getLeftBound(row, yourMove) , getRightBound(row, yourMove))
    }

    /**
     * @param {number} leftBound
     * @param {number} rightBound
     */
    function makeBounds(leftBound, rightBound){
      return {leftBound, rightBound}
    }


    /**
     * @param {Disk[]} row
     * @param {YourMove} yourMove
     */
    function getLeftBound(row, yourMove){
      const potentialLeftBound = row.findLastIndex(findLeftBound(yourMove))
      return isValidBound(potentialLeftBound, yourMove.column, row) ? potentialLeftBound : yourMove.column
    }

    /**
     * @param {YourMove} yourMove
     * @return {(disk:Disk, columnIndex:number) => boolean}
     */
    function findLeftBound(yourMove){
      return (disk, columnIndex) => disk === yourMove.diskColor && columnIndex < yourMove.column
    }

    /**
     * @param {number} bound
     * @param {number} bound
     * @param {Disk[]} row
     */
    function isValidBound(bound, yourMoveColumn, row){
      return fallsWithinRow(bound, row) && thereAreNoBlankSpacesBetween(bound, yourMoveColumn, row) 
    }

    /**
     * @param {number} bound
     * @param {number} bound
     */
    function fallsWithinRow(bound, row){
      return bound >= 0 && bound <= row.length - 1
    }

    /**
     * @param {Disk[]} row
     * @param {YourMove} yourMove
     */
    function getRightBound(row, yourMove){
      const potentialUpperBound = row.findIndex(findRightBound(yourMove))
      return isValidBound(potentialUpperBound, yourMove.column, row) ? potentialUpperBound : yourMove.column
    }

    /**
     * @param {YourMove} yourMove
     * @return {(disk:Disk, columnIndex:number) => boolean}
     */
    function findRightBound(yourMove){
      return (disk, columnIndex) => disk === yourMove.diskColor && columnIndex > yourMove.column
    }
    
    /**
     * @param {number} firstSpace
     * @param {number} secondSpace
     * @param {Disk[]} row
     */
    function thereAreNoBlankSpacesBetween(firstSpace, secondSpace, row){
      const start = min(firstSpace, secondSpace)
      const end = max(firstSpace, secondSpace)
      return row.slice(start, end).every(disk => disk === BLACK || disk === WHITE)
    }
  }
}