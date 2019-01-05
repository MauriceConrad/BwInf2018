const fs = require('fs');

const TeeniGramGroup = require('../');

const groupFilePath = __dirname + "/group1.json";
const group1 = JSON.parse(fs.readFileSync(groupFilePath, "utf8"));

const myTeeniGrammGroup = new TeeniGramGroup(group1);

const superstar = myTeeniGrammGroup.getSuperstar();

console.log(superstar);
