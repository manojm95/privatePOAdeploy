const solc = require('solc');
const fs = require('fs');


const source = fs.readFileSync('./contracts/Greetingsv1.sol', 'utf8');
const output = solc.compile(source, 1);

console.log(output);