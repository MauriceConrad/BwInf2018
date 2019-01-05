const mapWords = require('./mapWords');


module.exports = function encrypt(text) {
  const wordRegex = /[a-zäüö]/i;
  const notWordRegex = /[^a-zäüö]/i;

  text = mapWords(text, wordRegex, notWordRegex, function(word) {
    const wordInner = word.slice(1, word.length - 1).split("");

    const randomWordInner = randomizeArray(wordInner);

    return word[0] + randomWordInner.join("") + word[word.length - 1];
  });

  return text;

};



function randomizeArray(array) {
  const randomArray = new Array(array.length);

  // Array that contains all possible positions ( 0...[length of array] )
  const possiblePositions = new Array(randomArray.length).fill(0).map((item, index) => index); // This just contains a list of numbers from 0 ... [length of array]

  for (var i = 0; i < array.length; i++) {
    // Easy but inefficent way
    /*var pos;
    // Set position to a random value between 0 and the length of the array
    do {
      pos = Math.randomFromRange(0, array.length);
    } while (pos in randomArray); // Repeat this

    randomArray[pos] = array[i];*/

    // Filter all avaible positions from generally possible ones by exlcuding the ones that are already in use
    const avaiblePositions = possiblePositions.filter((char, pos) => !(pos in randomArray));
    // Get random position from the avaible ones
    pos = randomItem(avaiblePositions);
    // Use this position to set the array's item to
    randomArray[pos] = array[i];
  }
  // Return randomized array
  return randomArray;
}

function randomItem(array) {
  return array[Math.randomFromRange(0, array.length)];
}

Math.randomFromRange = function(start, end, natural = false) {
  return Math.trunc(start + Math.random() * (end - start));
}
