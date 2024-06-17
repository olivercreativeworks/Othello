/**
 * @typedef Bounds
 * @property {YourMove} leftBound
 * @property {YourMove} rightBound
 */

/**
 * @typedef TestResult
 * @property {boolean} condition
 * @property {string} description
 * @property {Object<string, string>} message
 */

/**
 * @return {Bounds}
 */
function getRandomBounds(gameboard){
	return randomChoice([getRandomHorizontalBounds, getRandomVerticalBounds, getRandomLeftDiagonalBounds, getRandomLeftDiagonalBounds])(gameboard)
}
/**
 * @param {Gameboard} gameboard
 * @return {Bounds}
 */
function getRandomHorizontalBounds(gameboard){
	const rowIndex = 0
	const leftBound = _createYourMove(rowIndex, randomNumberBetween(0, gameboard.at(rowIndex).length - 2))
	const rightBound = _createYourMove(rowIndex, randomNumberBetween(leftBound.column + 2, gameboard.at(rowIndex).length - 1))
	return {leftBound, rightBound}
}

/**
 * Wparam {Gameboard} gameboard
 * @return {Bounds}
 */
function getRandomVerticalBounds(gameboard){
	const colIndex = 0
	const leftBound = _createYourMove(randomNumberBetween(0, gameboard.length - 2), colIndex)
	const rightBound = _createYourMove(randomNumberBetween(leftBound.row + 2, gameboard.length - 1), colIndex)
	return {leftBound, rightBound}
}

/**
 * @param {Gameboard} gameboard
 * @return {Bounds}
 */
function getRandomRightDiagonalBounds(gameboard){
	const numRows = gameboard.length
	const rowIndex = randomNumberBetween(0, numRows - 2)

	const numCols = gameboard.at(rowIndex).length
	const colIndex = randomNumberBetween(3,  numCols)
	const rightBound = _createYourMove(rowIndex, colIndex)

	const distanceFromRightBound = randomNumberBetween(2, min(numRows - rightBound.row, rightBound.column))

	const leftBound = _createYourMove(rightBound.row + distanceFromRightBound, rightBound.column - distanceFromRightBound)
	return {leftBound, rightBound}
}

/**
 * @param {Gameboard} gameboard
 * @return {Bounds}
 */
function getRandomLeftDiagonalBounds(gameboard){
	const numRows = gameboard.length
	const rowIndex = randomNumberBetween(0, numRows - 2)

	const numCols = gameboard.at(rowIndex).length
	const colIndex = randomNumberBetween(0,  numCols - 2)

	const leftBound = _createYourMove(rowIndex, colIndex)

	const distanceFromLeftBound = randomNumberBetween(2, min(numRows - leftBound.row, numCols - leftBound.column))

	const rightBound = _createYourMove(leftBound.row + distanceFromLeftBound, leftBound.column + distanceFromLeftBound)
	return {leftBound, rightBound}
}

/**
 * @return {YourMove}
 */
function _createYourMove(row, column, diskColor = BLACK){
	return {diskColor, row, column}
}

/**
 * @param {Coordinate} space
 */
function createBlankSpace(space){
	return {...space, diskColor:undefined}
}

/**
 * Creates a gameboard where all spaces are filled with white disks
 */
function createTestGameboard(){
	return Array.from({length:8}, _ => Array(8).fill(WHITE))
}

function placeBounds(gameboard, bounds){
	return placeDisks(gameboard, bounds.leftBound, bounds.rightBound)
}

function append(originalDescription, additionalDescription){
	return originalDescription.concat(`\n\t${additionalDescription}`)
}


