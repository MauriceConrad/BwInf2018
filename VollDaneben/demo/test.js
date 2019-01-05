const Casino = require('../');


/*const myCasino = new Casino([
  100,
  2,
  255,
  13,
  453,
  789,
  999,
  301,
  666,
  104,
  700,
  881,
  167,
  610,
  70,
  902,
  798,
  333,
  145,
  200,
  956,
  955,
  287
]);*/

const myCasino = new Casino([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13]);

//console.log(myCasino.luckyNumbers);

const gameNumbers = myCasino.getGameNumbers(10);
const differences = myCasino.getDifferences(gameNumbers);

console.log(gameNumbers, differences);


//console.log(myCasino.gameNumbers);
