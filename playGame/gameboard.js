/**
 * @typedef {string[][]} Gameboard
 */

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
