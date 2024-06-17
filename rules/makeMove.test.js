function testingMakeMove(makeMove, numTests = 100){

  describe("Only update board if move is valid", () => {
    runXTimes(numTests, () => {
      runTestSuiteFor(makeMove,
        updateGameboard_IfYouOutflank,
        doNotUpdateGameboard_IfMoveIsOntoOccupiedSpace,
        doNotUpdateGameboard_IfMoveDoesNotCreateDirectLine,
        doNotUpdateGameboard_IfThereAreNoDisksBetweenOutflankingDisks  
      )
    })
  })

  /**
   * @param {Gameboard} gameboard
   * @param {Bounds} bounds
   * @return {TestResult}
   */
  function updateGameboard_IfYouOutflank(makeMove){
    const description = "Should return updated gameboard if you outflank your opponent's disk"
    const gameboard = createTestGameboard()
    const bounds = getRandomBounds(gameboard)
    const yourMove = bounds.leftBound
    
    const testBoard = placeDisks(gameboard, createBlankSpace(yourMove), bounds.rightBound)
    const resultBoard = makeMove(testBoard, yourMove)

    return {
      condition: notEqual(resultBoard, testBoard),
      description,
      message:{testBoard, yourMove, resultBoard}
    }
  }

  /**
   * @param {Gameboard} gameboard
   * @param {Bounds} bounds
   * @return {TestResult}
   */
  function doNotUpdateGameboard_IfMoveIsOntoOccupiedSpace(makeMove){
    const description = "Should not update gameboard with your move if the space you want to play a disk is occupied"
    const gameboard = createTestGameboard()
    const bounds = getRandomBounds(gameboard)
    const yourMove = bounds.leftBound
    
    const testBoard = placeDisks(gameboard, bounds.rightBound)
    const resultBoard = makeMove(testBoard, yourMove)
    
    return {
      condition: areEqual(testBoard, resultBoard),
      description,
      message:{testBoard, yourMove, resultBoard}
    }
  }

  /**
   * @param {Gameboard} gameboard
   * @param {Bounds} bounds
   * @return {TestResult}
   */
  function doNotUpdateGameboard_IfMoveDoesNotCreateDirectLine(makeMove){
    const description = "Should not update gameboard with your move if the space you want to play a disk on will not create direct line with another one of your disks"
    const gameboard = createTestGameboard()
    const bounds = getRandomBounds(gameboard)
    const yourMove = bounds.leftBound
    
    const testBoard = placeDisks(gameboard, createBlankSpace(yourMove))    
    const resultBoard = makeMove(testBoard, yourMove)
    
    return {
      condition:areEqual(testBoard, resultBoard),
      description,
      message:{testBoard, resultBoard, yourMove}
    }
  }

  /**
   * @param {Gameboard} gameboard
   * @param {Bounds} bounds
   * @return {TestResult}
   */
  function doNotUpdateGameboard_IfThereAreNoDisksBetweenOutflankingDisks(makeMove){
    const description = "Should not update gameboard with your move if outflanking disks do not have at least one disk between them"

    const gameboard = createTestGameboard()
    const bounds = getRandomBounds(gameboard)
    const yourMove = bounds.leftBound
    
    const adjacentDisk = _createYourMove(yourMove.row, yourMove.column + 1)
    
    const testBoard = placeDisks(gameboard, createBlankSpace(yourMove), adjacentDisk)
    const resultBoard = makeMove(testBoard, yourMove)

    return {
      condition: areEqual(testBoard, resultBoard),
      description,
      message: {testBoard, resultBoard, yourMove, adjacentDisk}
    }
  }
}






