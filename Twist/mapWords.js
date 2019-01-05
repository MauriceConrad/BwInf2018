module.exports = function mapWords(text, startingRegex, endingRegex, handler) {

  var start = 0;

  while (text.indexOfRegex(startingRegex, start) > -1) {
    // Get index of starting char of word by using the argument 'startingRegex'
    const wordStart = text.indexOfRegex(startingRegex, start);
    // Get the index of the char that declares the end of the current word (e.g. a space or whatever given by the argument 'endingRegex')
    const wordEndingChar = text.indexOfRegex(endingRegex, wordStart);
    // Extract current word
    const currWord = text.substring(wordStart, wordEndingChar);
    // Replace at this position the word with the result of the given handler
    text = replaceAtPos(text, handler(currWord), wordStart, wordEndingChar - 1);
    // Redefine the end of the word because the replacement may is not long as the old one
    const newWordEndingChar = text.indexOfRegex(endingRegex, wordStart);
    // Set start index to the new ending char + 1
    start = newWordEndingChar + 1;
  }

  return text;
}

function replaceAtPos(str, replaceStr, start, end) {
  end = end || (start + replaceStr.length - 1);
  return str.substring(0, start) + replaceStr + str.substring(end + 1);
}


String.prototype.indexOfRegex = function(regex, start = 0) {
  const searchResult = this.substring(start).search(regex);
  return searchResult > -1 ? (start + searchResult) : -1;
};
