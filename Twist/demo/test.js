const Twist = require('../');


const text = "Hey du wunderschönes Mädchen";

const twistedText = Twist.encrypt(text);

const normalText = Twist.decrypt(twistedText);

console.log(normalText);
