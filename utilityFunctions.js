/**
 * @param {number} start
 * @param {number} stopExclusive
 * @param {number} step
 */
function* range(start, stopExclusive, step = 1){
    const numberOfIterations = (stopExclusive - start) / step
    if(numberOfIterations <= 0 || step === 0 || isInfinite(start) || isInfinite(step)){ return }

    for(let i = 0; i < numberOfIterations; i++){
        yield start + (step * i)
    }
    
    function isInfinite(x){
        return !isFinite(x)
    }
}

/**
 * @param {...number} nums
 */
function min(...nums){
  return Math.min(...nums)
}

/**
 * @param {...number} nums
 */
function max(...nums){
  return Math.max(...nums)
}

/**
 * @param {number} startInclusive
 * @param {number} stopExclusive
 */
function randomNumberBetween(startInclusive, stopExclusive){
  return Math.floor(Math.random() * Math.abs(startInclusive - stopExclusive)) + Math.min(startInclusive, stopExclusive)
}

/**
 * @template A
 * @param {A[]} arr
 * @return {A}
 */
function randomChoice(arr){
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr.at(randomIndex)
}

function areEqual(a, b){
	return JSON.stringify(a) === JSON.stringify(b)
}

function notEqual(a, b){
	return !areEqual(a, b)
}

function isSomething(x){
  return !isNothing(x)
}

function isNothing(x){
  return x === undefined || x === null || x === ""
}

/**
 * @template A
 * @param {A[]} arr
 * @param {(element:A, index:number) => boolean} matchesCondition
 */
function everyElementOf(arr, matchesCondition){
  return arr.length > 0 && arr.every(matchesCondition)
}