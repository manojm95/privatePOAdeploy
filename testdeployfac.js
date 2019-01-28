let fs = require("fs");
let Web3 = require('web3'); 
const solc = require('solc');
const source = fs.readFileSync('./contracts/Form.sol', 'utf8');
const output = solc.compile(source, 1);
//Mandate Console log to check if no compilation errors
console.log('Contracts output--->', output);

let web3 = new Web3();
//web3.setProvider(new web3.providers.HttpProvider('http://localhost:7545'));
web3.setProvider(new web3.providers.HttpProvider('http://3.85.29.162:8545'));
let contracts = output.contracts;


// ABI description as JSON structure
let abi = JSON.parse(contracts[':FactoryFormA'].interface);
//console.log('Factory abi---->',abi);

// Smart contract EVM bytecode as hex - 0x needed to avoid invalid argument 0: 
//error contd... json: cannot unmarshal hex string without 0x prefix
let code = '0x'+contracts[':FactoryFormA'].bytecode;
//console.log('Factory code---->',code);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// We need to wait until any miner has included the transaction
// in a block to get the address of the contract
async function waitBlock() {
    const accounts = await web3.eth.getAccounts();
    let contract = await new web3.eth.Contract(abi)
    .deploy({ data: code })
    .send({ gas: 4700000, from: accounts[0] });
    console.log('deployed111...', contract.options.address);
    const instance = new web3.eth.Contract(
    abi,
    contract.options.address
    );
    console.log('deployed...', accounts[0]);
    let h = await instance.methods
        .createAgreement('Req Agency 1', 'Req Agency Address', 'Ser Agency 1', 'Service Agency Address')
        .send({
          from: accounts[0],
          gas: 4700000,

    });
    let y = await instance.methods.recentContract().call();
    console.log(y);
}

waitBlock();

//   while (true) {
//     receipt = web3.eth.getTransactionReceipt(contract.transactionHash);
//     if (receipt && receipt.contractAddress) {
//       console.log("Your contract has been deployed at http://testnet.etherscan.io/address/" + receipt.contractAddress);
//       console.log("Note that it might take 30 - 90 sceonds for the block to propagate befor it's visible in etherscan.io");
//       break;
//     }
//     console.log("Waiting a mined block to include your contract... currently in block " + web3.eth.blockNumber);
//     await sleep(4000);
//   }