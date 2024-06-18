const CONSTANTS = {
  boardHistory: 'history',
  gameOptions: 'options',
  newGame: 'new game',
  undo: 'undo',
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
      if(playerWantsToUndoMove(yourMove.diskColor)){ return undoMove(game, yourMove) }
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
   * @param {string} playerInput
   */
  function playerWantsToUndoMove(playerInput){
    return playerInput?.toLowerCase() === CONSTANTS.undo
  }

  /**
   * @param {SpreadsheetApp.Sheet} game
   * @param {string[][]} board
   * @param {YourMove} [yourMove]
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

  /**
   * @param {SpreadsheetApp.Sheet} game
   */
  function undoMove(game, yourMove) {
    const gameHistory = getBoardHistory()
    
    const previousMove = gameHistory.getPreviousBoardState()
    console.log(gameHistory.getFullHistory())
    if(!previousMove || gameHistory.getFullHistory().length <= 1){ 
      game.getRange(CONSTANTS.gameOptions).clearContent()
      SpreadsheetApp.getActiveSpreadsheet().toast("There is nothing to undo.", "Cannot undo", 3)
      return 
    }

    /** @type {Gameboard[]} */
    const fullHistory = gameHistory.getFullHistory()
    gameHistory.clear()
    fullHistory.slice(1).toReversed().forEach(board => gameHistory.update(board))
    updateGameDisplay(game, gameHistory.getPreviousBoardState(), yourMove)
    game.getRange(CONSTANTS.gameOptions).clearContent()
  }

  /**
   * @param {SpreadsheetApp.Sheet} _display
   * @param {Gameboard} gameboard
   */
  function displayOthelloGameboard(_display, gameboard = createGameboard()){
    const display = make8x8(_display)
      
    const displayRange = display.getRange(1, 1, 8, 8)
      .clear()
      .setVerticalAlignments(Array.from({length:8}, _ => Array(8).fill("middle")))
      .setHorizontalAlignments(Array.from({length:8}, _ => Array(8).fill("center")))
      .setValues(gameboard)
      .setBackground("#fce5cd")
    
    const emptySpaceRule = SpreadsheetApp.newConditionalFormatRule()
      .whenCellEmpty().setBackground("#fce5cd")
      .setRanges([displayRange])
      .build()

    const blackRule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(BLACK).setBackground("#434343").setFontColor("black")
      .setRanges([displayRange])
      .build()
    const whiteRule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(WHITE).setBackground("#f3f3f3").setFontColor("white")
      .setRanges([displayRange])
      .build()
    display.setConditionalFormatRules(display.getConditionalFormatRules().concat(emptySpaceRule, blackRule, whiteRule))
    return display

    /**
     * @param {SpreadsheetApp.Sheet} display
     */
    function make8x8(display){
      if(display.getMaxColumns() >= 8 && display.getMaxRows() >= 8) return display
      display.deleteColumns(1, display.getMaxColumns() - 1)
      display.deleteRows(1, display.getMaxRows() - 1)

      display.insertColumns(1, 7)
      display.insertRows(1, 7)
      
      display.setRowHeights(1, 8, 50)
      display.setColumnWidths(1, 8, 50)
      return display
    }
  }
}

function getBoardHistory(){
  const storage = PropertiesService.getDocumentProperties()
  return {
    getFullHistory: () => {
      const history = Maybe.of(storage.getProperty(CONSTANTS.boardHistory)).orElseGet(initializeBoardHistory)
      return JSON.parse(history)
    },
    getPreviousBoardState: /** @return {Gameboard} */ () => getBoardHistory().getFullHistory()[0],
    clear: () => { storage.deleteProperty(CONSTANTS.boardHistory) },
    update: /** @param {Gameboard} gameboard */ (gameboard) => {
      if(areEqual(gameboard, getBoardHistory().getPreviousBoardState())) { return }
      storage.setProperty(CONSTANTS.boardHistory, JSON.stringify([gameboard, ...getBoardHistory().getFullHistory()]))
    }
  }

  function initializeBoardHistory(){
    return storage
      .setProperty(CONSTANTS.boardHistory, JSON.stringify([createGameboard()]))
      .getProperty(CONSTANTS.boardHistory)
  }
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

  orElseGet(fn){
    return this.isNothing() ? fn() : this.x
  }
}