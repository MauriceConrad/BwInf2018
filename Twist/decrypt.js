const mapWords = require('./mapWords');

module.exports = function decrypt(text, baseWords) {

  const wordRegex = /[a-zäüö]/i;
  const notWordRegex = /[^a-zäüö]/i;
  
  const decryptedText = mapWords(text, wordRegex, notWordRegex, function(word) {
    if (word.length <= 3) {
      return word;
    }

    /*
      NOTE
      IMPORTANT!!!
      This code includes a lot of different methods to filter the potential words and check wether they can be excluded
      A lot of them are currently commented out because they are not necessary in combination of other methods

      Basically it would work, to just check wether each char of a potental word is contained often as in the original (source) word and each char of the original word is contained often as in a potential word
      -> This algorithm is very slow because it has to compare each word's chars with the original word's chars and so on
      -> Therefore we filter the words firstly by their length and secondly by their framing chars. This makes the algorithm a lot faster
    */

    const wordInner = getWordInner(word);

    // 1. Filter all words by the specific length of the searched word
    const wordsWithSpecificLength = baseWords.filter(currWord => currWord.length == word.length);

    // 2. Filter this new list of words by checking the framing chars
    const wordsWithSpecificFrame = filterWordsByFramingChars(wordsWithSpecificLength, word[0], word[word.length - 1]);

    // 3. Filter this new list of words by checking the chars that are contained within it
    // This is the list that contains all words that could be used because they have the same characters as the original word
    const fittingCharsWordInners = wordsWithSpecificFrame.map(getWordInner).filter(function(word) {
      // Loop trough all chars of the current word
      for (var i = 0; i < word.length; i++) {
        if (charCount(word, word[i]) != charCount(wordInner, word[i])) {
          return false;
        }
      }
      // No char found that is not included in one of the words
      return true;
    }).map(charArray => charArray.join(""));

    // Push original word inner to end of array of fitting word inners to ensure that there exist at least the original version
    /*
      NOTE
      This is important for the case if no fitting word was found (fittingWordInners.length == 0)
      In this case, there will exist at least the original word inner to return this
    */
    fittingCharsWordInners.push(wordInner.join(""));

    return word[0] + fittingCharsWordInners[0] + word[word.length - 1];
  });

  return decryptedText;

};
// Just return the inner of a word as an array
function getWordInner(word) {
  return word.slice(1, word.length - 1).split("");
}

function filterWordsByFramingChars(wordsList, startChar, endChar) {
  return wordsList.filter(word => ((word[0] === startChar || word[0] === startChar.toLowerCase()) && word[word.length - 1] === endChar));
}


function charCount(str, char) {
  var start = 0;
  var count = 0;
  while (str.indexOf(char, start) > -1) {
    start = str.indexOf(char, start) + 1;
    count++;
  }
  return count;
}
