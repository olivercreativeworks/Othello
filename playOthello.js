const OTHELLO_RULES = {
  name:"Othello",
  rules:makeMove
}

/**
 * @typedef Rules 
 * @prop {string} name
 * @prop {(gameboard:Gameboard, yourMove:YourMove) => Gameboard} rules
 */

/**
 * @param {GameDisplay} gameDisplay
 * @param {YourMove} yourMove
 */
function playOthello(gameDisplay, yourMove){
  return playGame("Othello", OTHELLO_RULES, gameDisplay, yourMove)
}

/**
 * @param {string} name
 * @param {Rules} rules
 * @param {GameDisplay} gameDisplay
 * @param {YourMove} yourMove
 */
function playGame(name, rules, gameDisplay, yourMove){
  if(gameDisplay.name !== name || rules.name !== name) return
  gameDisplay.prepForTurn()
  try{
    if(!canStartTurn()) { return }
    return gameDisplay.playTurn(yourMove, rules.rules) 
  }finally{
    gameDisplay.endTurn()
    passPlay()
  }

  function canStartTurn(){
    const lock = LockService.getDocumentLock()
    return lock.tryLock(60000)
  }

  function passPlay(){
    const lock = LockService.getDocumentLock()
    return lock.releaseLock()
  }
}