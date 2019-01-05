module.exports = class Casino {
  constructor(luckyNumbers) {
    this.luckyNumbers = luckyNumbers;
  }
  getGameNumbers(gameNumbersCount = 10) {

    // Basically, each of Al's numbers is related a specific amount of numbers of the lucky numbers
    // Related means: Has to be closest as possible
    // But if there are 20 numbers in the list, each aof Al's number has to be "related" to 2 of them

    // Basic amount of lucky numbers one of Al's numbers has to be related to (25 = 2, 29 = 2, 31 = 3)
    const decimalCount = Math.trunc(this.luckyNumbers.length / gameNumbersCount);
    const relatedNumbersAmounts = new Array(gameNumbersCount).fill(decimalCount);

    // Amount of Al's numbers that have to be related to one lucky number more than the others
    const plusNumbersAmount = this.luckyNumbers.length % gameNumbersCount;


    //console.log(this.luckyNumbers.length, decimalCount, plusNumbersAmount);

    // But there exist some numbers that are within the next 10 (decimal), give this numbers one related number extra
    for (var i = relatedNumbersAmounts.length - 1; i > (relatedNumbersAmounts.length - plusNumbersAmount - 1); i--) {
      relatedNumbersAmounts[i]++;
    }

    const luckyNumbersSorted = this.luckyNumbers.sort((a, b) => a > b ? 1 : -1);

    var excludedIndexes = [];

    const gameNumberIndexes = [];

    // Loop trough relatedNumbersAmounts from back to begin
    for (var i = relatedNumbersAmounts.length - 1; i >= 0; i--) {
      const currAmount = relatedNumbersAmounts[i];
      const closestResult = Casino.getClosestNumbers(luckyNumbersSorted, currAmount, excludedIndexes);
      // Exclude all numbers from current "closest result" in the next step (Because they are now finished. No one has to worry about them anymore)
      excludedIndexes = excludedIndexes.concat(closestResult.surroundingIndexes);
      // Push the current index to
      gameNumberIndexes.push(closestResult.index);
    }


    return gameNumberIndexes.map(index => luckyNumbersSorted[index]);

  }
  getDifferences(gameNumbers) {

    const differences = this.luckyNumbers.map(lucky => {
      // Get closest game number
      const closestGameNumber = Math.closestNumber(lucky, gameNumbers);
      // Return difference from lucky number to closest game number
      return Math.abs(lucky - closestGameNumber);
    });

    return {
      differences: differences,
      sum: differences.reduce((accumulator, currentValue) => accumulator + currentValue)
    }



  }
  static getClosestNumbers(numbers, count, excludedIndexes = []) {
    // 'numbers' list has to be sorted (Otherwise this method doesn't works)

    const surroundingCount = count - 1;

    const surroundingCountBefore = Math.trunc(surroundingCount / 2);
    const surroundingCountAfter = Math.ceil(surroundingCount / 2);

    //console.log(count, surroundingCount, surroundingCountBefore, surroundingCountAfter);

    // Object that decribes the currently best candidate for a number whose surrounding numbers have the smallest difference to if summed up
    var closestCenterNumber = {
      index: -1, // Index of this number
      sum: Infinity // Sum the surrounding numbers difference to
    };

    for (var i = surroundingCountBefore; i < (numbers.length - surroundingCountAfter); i++) {

      if (!excludedIndexes.includes(i)) {

        const surroundingNumberIndexes = [i];
        for (let n = i - 1; n >= (i - surroundingCountBefore); n--) {
          surroundingNumberIndexes.push(n);
        }
        for (let n = i + 1; n <= (i + surroundingCountAfter); n++) {
          surroundingNumberIndexes.push(n);
        }

        const surroundingNumbers = surroundingNumberIndexes.map(numberIndex => numbers[numberIndex]);

        /*

        // Concat the surrounding numbers before the current one and the ones after the current one to one array
        const surroundingNumbers = new Array().concat(
          numbers.slice(i - surroundingCountBefore, i),
          numbers.slice(i, i + surroundingCountAfter + 1)
        ); */// This returns the current number (numbers[i]) in the center of an array with its surrounding numbers


        // Use the mathematical median as potential close number because the differences to this median summed up are the lowest as possible
        const potentialCloseNumber = Math.median(surroundingNumbers);
        // Calculate sum of all the numbers to this potential close number (median)
        const sum = Casino.getDifferenceSum(surroundingNumbers, potentialCloseNumber);


        if (sum <= closestCenterNumber.sum) {
          closestCenterNumber = {
            index: i,
            surroundingIndexes: surroundingNumberIndexes,
            sum: sum
          };
        }

      }

    }

    return closestCenterNumber;
  }
  static getDifferenceSum(numbers, relatedNumber) {
    var sum = 0;
    for (let number of numbers) {
      sum += Math.abs(relatedNumber - number);
    }
    return sum;
  }
}

Math.median = function(numbers) {
  const sorted = numbers.sort((a, b) => a > b ? 1 : -1);

  return sorted[Math.trunc(sorted.length / 2)];
}
Math.closestNumber = function(number, list) {
  var closestNumber = Infinity;

  for (let currNumber of list) {
    if (Math.abs(number - currNumber) < Math.abs(number - closestNumber)) {
      closestNumber = currNumber;
    }
  }
  return closestNumber;
}
