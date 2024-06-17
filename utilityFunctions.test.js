/**
 * @param {(startInclusive:number, stopExclusive:number) => number} randomNumberBetween
 */
function testRandomNumberBetween(randomNumberBetween){
  for(let i =0; i<1000; i++){
    const start = Math.floor(Math.random() * 10)
    const stop = Math.floor(Math.random() * 10)
    const randomNumber = randomNumberBetween(start, stop)
    test("Should return a number between the two inputs", () => {
      expect( randomNumber >= Math.min(start, stop) && randomNumber <= Math.max(start, stop) ).toBeTrue({randomNumber, start, stop})
    })
  }
}