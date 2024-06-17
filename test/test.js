function describe(testSuiteName, fn){
  Logger.log(testSuiteName)
  fn()
}

function test(testName, fn){
  try{
    fn()
  }catch(err){
    console.log(`FAILED: ${testName}\n\n${err}`)
  }
}

function expect(value){
  return {
    toEqual: (expectedResult, optionalMessage = "") => equals(value, expectedResult) ? undefined : throwFailedTest(value, expectedResult, optionalMessage),
    toBeTrue: (optionalMessage = "") => equals(value, true) ? undefined : throwFailedTest(value, true, optionalMessage),
    toBeFalse: (optionalMessage = "") => equals(value, false) ? undefined : throwFailedTest(value, false, optionalMessage)
  }

  function throwFailedTest(input, expected, optionalMessage = ""){
    throw new Error(`\nGot:\n${JSON.stringify(input)}\n\nExpected:\n${JSON.stringify(expected)}\n\nMessage:\n${JSON.stringify(optionalMessage)}`)
  }

  function equals(arr1, arr2){
    return JSON.stringify(arr1) === JSON.stringify(arr2)
  }
}

function runXTimes(numberOfTimes, fn){
  const validatedNumber = validateNumberOfTimes(numberOfTimes)

  for(let i = 0; i < validatedNumber; i++){
    fn()
  }

  function validateNumberOfTimes(number){
    return Number.isInteger(number) && number > 0 ? number : 1
  }
}

/**
 * @template {Function} A
 * @param {A} fnToTest
 * @param {number} numTests
 * @param {...(fnToTest:A) => TestResult} testsToRun
 */
function runTestSuiteFor(fnToTest, ...testsToRun){
  const tests = testsToRun.map(test => () => test(fnToTest))

  const result = checkWhetherAllTestsPassed(...tests)
  test(result.description, () => {
    expect(result.condition).toBeTrue(result.message)
  })
}

/**
 * @param {Array<()=> TestResult>} tests
 * @return {TestResult}
 */
function checkWhetherAllTestsPassed(...tests){
  let allTestsPassed = true
  let result = undefined
  
  for(let i = 0; allTestsPassed && i < tests.length; i++){
    result = tests.at(i)()
    allTestsPassed = result.condition 
  }

  return allTestsPassed ? createTestsPassedResult(allTestsPassed) : result

  /**
   * @param {boolean} allTestsPassed
   * @return {TestResult}
   */
  function createTestsPassedResult(allTestsPassed){
    return { condition:allTestsPassed, description:"All tests passed" }
  }
}