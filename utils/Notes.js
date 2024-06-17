// RULES: https://service.mattel.com/instruction_sheets/T8130-Eng.pdf
// A move inovlves placing your piece in a space that will outflank your opponent's pieces
// outlfank = place a disk on the board so opponent's row or orws of disks is bordered at each end by a disk of your color
// black moves first
// pass turn to opponent if you cannot make a move
// outflanking can be horizontal, diagonal, or vertical
// disks can only be outflanked as a direct result of a moveand must fall in direct line of the disk that was placed down
// you cannot move disks that have been placed
// game ends when players cannot make a move
// winner is the one with the most disks

// gameboard (8x8)
// outflanking (check for vertical, diagonal, or horizontal)
// victory condition check


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