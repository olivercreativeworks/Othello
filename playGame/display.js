const CONSTANTS = {
  boardHistory: 'history',
  gameOptions: 'options',
  newGame: 'new game',
  mostRecentMove: 'mostRecentMove',
  board: 'board',
}

function viewHistory(){
  const history = getBoardHistory()
  Logger.log(history.getFullHistory())
}

/**
 * @typedef GameDisplay
 * @prop {string} name
 * @prop {() => void} prepForTurn
 * @prop {(yourMove:YourMove, rules:(board:Gameboard, yourMove:YourMove) => Gameboard) => Gameboard} playTurn
 * @prop {() => void} endTurn
 */

/**
 * @param {SpreadsheetApp.Sheet} game
 * @return {GameDisplay}
 */
function setupDisplay(game){
  const name = game.getName()
  const history = getBoardHistory()
  return {
    name,
    prepForTurn,
    endTurn,
    playTurn: playTurn(history)
  }

  function playTurn(history){
    return (yourMove, makeYourMove) => {
      if(playerWantsToStartNewGame(yourMove.diskColor)) { return startNewGame(game) }
      const board = history.getPreviousBoardState()
      const updatedBoard = makeYourMove(board, yourMove)
      history.update(updatedBoard)
      updateGameDisplay(game, updatedBoard, yourMove)
    }
  }

  function prepForTurn(){}
  function endTurn(){ SpreadsheetApp.flush() }

  /**
   * @param {string} playerInput
   */
  function playerWantsToStartNewGame(playerInput){
    return playerInput?.toLowerCase() === CONSTANTS.newGame
  }

  /**
   * @param {SpreadsheetApp.Sheet} game
   * @param {string[][]} board
   * @param {YourMove} yourMove
   */
  function updateGameDisplay(game, board, yourMove){
    const [boardRange, mostRecentMoveRange] = game.getRangeList([CONSTANTS.board, CONSTANTS.mostRecentMove])
      .getRanges()
    boardRange.setValues(board)

    const move = yourMove?.diskColor === BLACK ? 'Black' : yourMove?.diskColor === WHITE ? 'White' : undefined
    const position = game.getRange(yourMove.row + 1, yourMove.column + 1).getA1Notation()
    if(!move || !position) return
    const recentMove = `${move} @ ${position}`
    mostRecentMoveRange.setValue(recentMove)  
  }

  /**
   * @param {SpreadsheetApp.Sheet} game
   */
  function startNewGame(game){
    const gameHistory = getBoardHistory()
    gameHistory.clear()

    game.getRangeList([CONSTANTS.gameOptions, CONSTANTS.mostRecentMove])
    .clearContent()

    const gameboard = createGameboard()
    displayOthelloGameboard(game, gameboard)

    gameHistory.update(gameboard)
  }
}

function getBoardHistory(){
  const storage = PropertiesService.getDocumentProperties()
  return {
    getFullHistory: () => Maybe.of(storage.getProperty(CONSTANTS.boardHistory)).map(x => JSON.parse(x)).orElse([]),
    getPreviousBoardState: () => getBoardHistory().getFullHistory()[0],
    clear: () => { storage.deleteProperty(CONSTANTS.boardHistory) },
    update: /** @param {Gameboard} gameboard */ (gameboard) => {
      if(areEqual(gameboard, getBoardHistory().getPreviousBoardState())) { return }
      storage.setProperty(CONSTANTS.boardHistory, JSON.stringify([gameboard, ...getBoardHistory().getFullHistory()]))
    }
  }
}