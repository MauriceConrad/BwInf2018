const commandLineArgs = require('command-line-args');
const url = require('url');
const fs = require('fs');
const request = require('request');

const Casino = require('../../');

const optionDefinitions = [
  {
    name: 'lucky',
    alias: 'l',
    type: String,
    defaultOption: true
  },
  {
    name: 'count',
    alias: 'c',
    type: Number
  }
];


const options = commandLineArgs(optionDefinitions);

const luckyNumbers = new Promise(function(resolve, reject) {
  const luckyUrlResult = url.parse(options.lucky);
  // The argument seems to be a valid url
  if (luckyUrlResult.protocol) {
    request(options.lucky, function(err, response, body) {
      if (err) return console.error(err);
      resolve(body.split("\n").map(Number));
    });
  }
  else {
    resolve(options.lucky.split(",").map(Number));
  }
});


(async () => {
  const myCasino = new Casino(await luckyNumbers);

  //console.log(myCasino.luckyNumbers);

  const gameNumbers = myCasino.getGameNumbers(options.count);
  const differences = myCasino.getDifferences(gameNumbers);


  console.log("\nAl's Zahlen:\n" + gameNumbers.join(" ") + "\n\n" + "Einnahmen: " + ((await luckyNumbers).length * 25) + "\nAusgaben: " + differences.sum + "\n");
})();
