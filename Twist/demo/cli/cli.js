const request = require('request');
const fs = require('fs');
const commandLineArgs = require('command-line-args');
const url = require('url');

const Twist = require('../../');

const options = commandLineArgs([
  {
    name: "mode",
    alias: "m",
    type: String
  },
  {
    name: "text",
    alias: "t",
    type: String,
    defaultOption: true
  },
  {
    name: "words",
    alias: "w",
    type: String
  }
]);

const text = new Promise(function(resolve, reject) {
  const textOptionUrl = url.parse(options.text);
  // If a URL parsing process returns a valid protocol, interprete the words argument as an URL
  if (textOptionUrl.protocol) {
    if (textOptionUrl.protocol == "file:") {
      fs.readFile(options.text.substring(7), "utf8", function(err, contents) {
        if (err) return console.error(err);
        resolve(contents);
      });
    }
    else {
      request(options.text, function(err, response, body) {
        if (err) return console.error(err);
        resolve(body);
      });
    }
  }
  else {
    resolve(options.text);
  }
});

const modeHandlers = {
  async encrypt() {


    const encryptedText = Twist.encrypt(await text);
    output(encryptedText);
  },
  decrypt() {
    // Default source for words if no custom source is set
    const defaultWordListSource = __dirname + "/woerterliste.txt";

    options.words = options.words || defaultWordListSource;

    // If a URL parsing process returns a invalid protocol, interprete the words argument as a file path
    if (!url.parse(options.words).protocol) {
      fs.readFile(options.words, "utf8", function(err, contents) {
        if (err) return console.error(err);
        handleWordsList(contents);
      });
    }
    // URL with valid protocol: Interprete the words argument as a URL
    else {
      request(options.words, function(err, response, body) {
        if (err) return console.error(err);
        handleWordsList(body);
      });
    }

    async function handleWordsList(wordsListStr) {
      const words = wordsListStr.split("\n");

      const decryptedText = Twist.decrypt(await text, words);

      output(decryptedText);
    }
  }
};
if (options.mode in modeHandlers) {
  modeHandlers[options.mode]();
}
else {
  console.error("Invalid mode!");
}



function output(answer) {
  console.log("\n");
  console.log(answer);
  console.log("\n");
}
