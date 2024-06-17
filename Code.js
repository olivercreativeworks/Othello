/**
 * @param {{value:string, range:SpreadsheetApp.Range}} e
 */
function onEdit(e){
  const {range, value} = e
  const yourMove = mapToYourMove(range, value)
  const display = setupDisplay(range.getSheet())
  playOthello(display, yourMove)
}

/**
 * @param {SpreadsheetApp.Range} cell
 * @param {string} [value]
 * @return {YourMove}
 */
function mapToYourMove(cell, value){
  return {
    diskColor: typeof value === "string" ? value.toUpperCase() : cell.getValue().toString().toUpperCase(),
    row: cell.getRow() - 1,
    column: cell.getColumn() - 1
  }
}

function getSpreadsheet(){
  console.log(SpreadsheetApp.getActiveSpreadsheet().getUrl())
}






