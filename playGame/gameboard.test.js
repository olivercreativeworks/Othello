function testDisplayGameboard(){
  // pass in Spreadsheet App . getActiveSpreadsheet().getSheetByName("Othello") as the display.
  // pass in createGameboard() as the gameboard
  const displayedGameboard = displayOthelloGameboard()

  describe("Gameboard is 8x8", () =>{
    test("Has 8 columns", () => {
      expect(displayedGameboard.getMaxColumns()).toEqual(8)
    })
    test("Has 8 rows", () => {
      expect(displayedGameboard.getMaxRows()).toEqual(8)
    })
  })

  describe("Starting position is correct", () => {
    const disks = displayedGameboard.getRange(1,1,8,8).getValues()

    test("The center four squares are alternating black and white", () => {
      expect(isSomething(disks[3][3])).toBeTrue()
      expect(disks[3][3] === disks[4][4]).toBeTrue()

      expect(isSomething(disks[3][4])).toBeTrue()
      expect(disks[3][4] === disks[4][3]).toBeTrue()
    })

    test("Only four squares have values", () => {
      expect(disks.flat().filter(isSomething).length).toEqual(4)
    })
  })

}

