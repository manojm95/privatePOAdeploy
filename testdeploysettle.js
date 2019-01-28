let fs = require("fs");
let Web3 = require('web3'); 
const solc = require('solc');
const source = fs.readFileSync('./contracts/Greetingsv1.sol', 'utf8');
const output = solc.compile(source, 1);

let web3 = new Web3();
// web3.setProvider(new web3.providers.HttpProvider('http://localhost:7545'));
//web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
web3.setProvider(new Web3.providers.WebsocketProvider('ws://3.87.209.241:8546'));
let contracts = output.contracts;


// ABI description as JSON structure
let abi = JSON.parse(contracts[':Greetingsv1'].interface);

// Smart contract EVM bytecode as hex
let code = '0x'+contracts[':Greetingsv1'].bytecode;

// ABI description as JSON structure
let abiSettle = JSON.parse(contracts[':SettleContract'].interface);

// Smart contract EVM bytecode as hex
let codeSettle = '0x'+contracts[':SettleContract'].bytecode;

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

    const instance = new web3.eth.Contract(
    abi,
    contract.options.address
    );

    //console.log('instance--->', instance);

    // instance.events.notifyPayment({}, function(error,event){
    //   if(!error){
    //     console.log("The message is ",event);
    //   }else{
    //     console.log(error);
    //   }
    // });

    await instance.methods
        .setGreeting('Im Happy')
        .send({
          from: accounts[0],
          gas: 4700000
    });
    let y = await instance.methods.getGreeting().call();
    console.log(y);

    let z = await instance.methods.makePayment().send({
      from: accounts[0],
      gas: 4700000
    });;
    let a = await instance.methods.settleContract().call();
    console.log('address is --->', a);

    const instanceSetle = new web3.eth.Contract(
      abiSettle,
      a
      );

      instanceSetle.events.notifyPayment({}, function(error,event){
      if(!error){
        console.log("The message is ",event);
      }else{
        console.log(error);
      }
      });

      let v = await instanceSetle.methods.settlePayment().send({
        from: accounts[0],
        gas: 4700000
      });
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