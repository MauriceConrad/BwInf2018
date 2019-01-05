const request = require('request');
const fs = require('fs');
const commandLineArgs = require('command-line-args');
const url = require('url');

const TeenieGramGroup = require('../../');


const options = commandLineArgs([
  {
    name: 'group',
    alias: 'g',
    type: String,
    defaultOption: true
  }
]);
// If a URL parsing process returns a invalid protocol, interprete the template string as a file path
if (!url.parse(options.group).protocol) {
  fs.readFile(options.group, "utf8", function(err, contents) {
    if (err) return console.error(err);
    handleBwInfTXTFile(contents);
  });
}
// URL with valid protocol: Interprete the template string as a URL
else {
  request(options.group, function(err, response, body) {
    if (err) return console.error(err);
    handleBwInfTXTFile(body);
  });
}


function handleBwInfTXTFile(contents) {
  const groupTemplate = convertBwInfTxtToJS(contents);

  const group = new TeenieGramGroup(groupTemplate);

  const superstarResult = group.getSuperstar();

  if (superstarResult) {
    console.log("\nDer Superstar ist " + superstarResult.superstar.name + "!");
    console.log("Dafür wurden " + superstarResult.requests + " Anfragen an die TeenieGram API benötigt.\n");
  }
  else {
    console.log("\nLeider gibt es in dieser Gruppe keinen Superstar.\n");
  }
}
// Method that convert te special syntax of the BwInf examples to a valid JS array
function convertBwInfTxtToJS(contents) {
  // Extract all lines from text context
  const lines = contents.split("\n");
  // Get the line that describes all members
  const membersLine = lines[0];
  // Get lines (from line 2) that describe a following relationship
  const followingLines = lines.slice(1);

  // Create an object for each member with an empty list of followers
  const members = membersLine.split(" ").map(memberName => {
    return {
      name: memberName,
      following: []
    }
  });

  // Loop trough all lines that describe a following relationship
  for (let followingLine of followingLines) {
    // Extract the follower and the target member ('member')
    const [ follower, member ] = followingLine.split(" ");

    // Get index of related member object in 'members' with the same name as the 'follower'
    const followerIndex = indexOfByProperty(members, "name", follower);
    // Get index of related member object in 'members' with the same name as the (target) 'member'
    const memberIndex = indexOfByProperty(members, "name", member);

    // Push the index of the (target) member, the follower is following to to the 'followers' array of this follower
    members[followerIndex].following.push(memberIndex);
  }
  // Return members array
  return members;
}


function indexOfByProperty(array, propertyName, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][propertyName] === value) {
      return i;
    }
  }
  return -1;
}
