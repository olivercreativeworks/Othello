/**
 * @param {(gameboard:Gameboard, yourMove:YourMove) => Gameboard} outflank
 */
function testingOutflank(outflank, numTests = 100) {
  describe("Flip outflanked disks in same row", () => {
    runXTimes(numTests, () => {
      runTestSuiteFor(outflank, 
        handlesHorizontalOutflank,
        handlesVerticalOutflank,
        handlesLeftDiagonalOutflank,
        handlesRightDiagonalOutflank,
        sameResultsRegardlessOfStartingPoint
      )
    })
  })

  /**
   * @return {TestResult}
   */
  function boardSizeIsPreserved(outflank, testBoard, bounds){
    const description = "Resulting board should be the same size as the original"
    const resultBoard = outflank(testBoard, bounds.leftBound)
    return {
      condition: sameNumberOfRows(resultBoard, testBoard) && sameNumberOfColumns(resultBoard, testBoard),
      description,
      message: {testBoard, bounds, resultBoard}
    }

    function sameNumberOfRows (resultBoard, testBoard){
      return resultBoard.length === testBoard.length
    }
    function sameNumberOfColumns(resultBoard, testBoard){
      return resultBoard.every((row, rowIndex) => row.length === testBoard.at(rowIndex).length)
    }
  }

  function handlesHorizontalOutflank(outflank){
    const gameboard = createTestGameboard()
    const bounds = getRandomHorizontalBounds(gameboard)
    const testBoard = placeBounds(gameboard, bounds)
    const resultBoard = outflank(testBoard, bounds.leftBound)
    return {
      condition: horizonalFlip(resultBoard, bounds),
      description: disksShouldBeYourColorTestResult("horizontal"),
      message: { testBoard, bounds, resultBoard }
    }
  }

  /**
   * @param {Gameboard} gameboard
   * @param {Bounds} bounds
   */
  function horizonalFlip(gameboard, bounds) {
    const horizontalSlice = gameboard.at(bounds.leftBound.row)
      .slice(bounds.leftBound.column, bounds.rightBound.column)
    return everyElementOf(horizontalSlice, matchesColor(bounds.leftBound.diskColor))
  }

  function handlesVerticalOutflank(outflank) {
    const gameboard = createTestGameboard()
    const bounds = getRandomVerticalBounds(gameboard)
    const testBoard = placeBounds(gameboard, bounds)
    const resultBoard = outflank(testBoard, bounds.leftBound)
    return {
      condition: verticalFlip(resultBoard, bounds),
      description: disksShouldBeYourColorTestResult("vertical"),
      message: { testBoard, bounds, resultBoard }
    }
  }

  /**
   * @param {Gameboard} gameboard
   * @param {Bounds} bounds
   */
  function verticalFlip(gameboard, bounds) {
    const verticalSlice = gameboard.map(row => row.at(bounds.leftBound.column))
      .slice(bounds.leftBound.row, bounds.rightBound.row)
    return everyElementOf(verticalSlice, matchesColor(bounds.leftBound.diskColor))
  }

  function handlesLeftDiagonalOutflank(outflank) {
    const gameboard = createTestGameboard()
    const bounds = getRandomLeftDiagonalBounds(gameboard)
    const testBoard = placeBounds(gameboard, bounds)
    const resultBoard = outflank(testBoard, bounds.leftBound)
    return {
      condition: leftDiagonalFlip(resultBoard, bounds),
      description: disksShouldBeYourColorTestResult("leftDiagonal"),
      message: { testBoard, bounds, resultBoard }
    }
  }

  /**
  * @param {Gameboard} gameboard
  * @param {Bounds} bounds
  */
  function leftDiagonalFlip(gameboard, bounds) {
    const leftDiagonalSlice = gameboard.slice(bounds.leftBound.row, bounds.rightBound.row)
      .map(getDisksOnLeftDiagonal(bounds.leftBound.column))
    return everyElementOf(leftDiagonalSlice, matchesColor(bounds.leftBound.diskColor))
  
    function getDisksOnLeftDiagonal(column) {
      return (row, rowIndex) => row.at(column + rowIndex)
    }
  }


  function handlesRightDiagonalOutflank(outflank) {
    const gameboard = createTestGameboard()
    const bounds = getRandomRightDiagonalBounds(gameboard)
    const testBoard = placeBounds(gameboard, bounds)
    const resultBoard = outflank(testBoard, bounds.leftBound)
    return {
      condition: rightDiagonalFlip(resultBoard, bounds),
      description: disksShouldBeYourColorTestResult("rightDiagonal"),
      message: { testBoard, bounds, resultBoard }
    }
  }

  /**
   * @param {Gameboard} gameboard
   * @param {Bounds} bounds
   */
  function rightDiagonalFlip(gameboard, bounds) {
    const rightDiagonalSlice = gameboard.slice(bounds.rightBound.row, bounds.leftBound.row)
      .map(getDisksOnRightDiagonal(bounds.rightBound.column))
    return everyElementOf(rightDiagonalSlice, matchesColor(bounds.rightBound.diskColor))

    function getDisksOnRightDiagonal(column) {
      return (row, rowIndex) => row.at(column - rowIndex)
    }
  }

  function disksShouldBeYourColorTestResult(direction) {
    return append("Disks between your move and the bound should all be your color", direction)
  }


  /**
   * @return {TestResult}
   */
  function sameResultsRegardlessOfStartingPoint(outflank) {
    const description = "The result board should be the same regardless of which outflanking disk we start from"
    const gameboard = createTestGameboard()
    const bounds = getRandomBounds(gameboard)    
    const testBoard = placeBounds(gameboard, bounds)

    const outflankFromLeft = outflank(testBoard, bounds.leftBound)
    const outflankFromRight = outflank(testBoard, bounds.rightBound)
    return {
      condition: areEqual(outflankFromLeft, outflankFromRight),
      description,
      message: { testBoard, bounds, outflankFromLeft, outflankFromRight }
    }
  }
}

function matchesColor(diskColor) {
  return disk => diskColor === disk
}