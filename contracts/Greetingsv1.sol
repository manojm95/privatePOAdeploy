pragma solidity >=0.4.21 < 0.6.0;


contract Greetingsv1 {

  string greet;
  string pay;

  struct Proposal {
    string name;
    uint voteCount;
  }
  SettleContract public settleContract;

  event notifyPayment(
    string message
  );

  Proposal[] public proposals;


  function setGreeting(string memory greet2) public payable {
        greet = greet2;
  }

  function getGreeting() public view returns(string memory){
    return greet;
  }

//   function usearry(bytes32[] memory proposalNames) public payable {
//     for (uint i = 0; i < proposalNames.length; i++) {
//         bytes memory bytesArray = new bytes(32);
//         for (uint j; j < 32; j++) {
//         bytesArray[j] = proposalNames[i][j];
//         }
//         proposals.push(Proposal({
//             name: string(bytesArray),
//             voteCount: 0
//         }));
//     }
// }

  function usearry(bytes32[] memory proposalNames) public payable {
    for (uint i = 0; i < proposalNames.length; i++) {
        bytes memory bytesArray = new bytes(32);
        uint charCount = 0;
        for (uint j=0; j < 32; j++) {
        byte char = byte(bytes32(uint(proposalNames[i]) * 2 ** (8 * j)));
        if (char != 0) {
            bytesArray[charCount] = char;
            charCount++;
        }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (uint k = 0; k < charCount; k++) {
          bytesStringTrimmed[k] = bytesArray[k];
        }
        proposals.push(Proposal({
            name: string(bytesStringTrimmed),
            voteCount: 0
        }));
    }
  }

  function makePayment() public payable returns (SettleContract) {
      pay="yes";
      settleContract = new SettleContract('SERAG','REQAGEN', 1111, 'Wire');
      //emit notifyPayment('The Payment is complete');
      return settleContract;
  }

}

contract SettleContract {

  string  public reqAgencyName;
  string  public serAgencyName;
  uint    amountDue;
  string  paymentMethod;

  constructor(string memory _reqAgencyName, string memory _serAgencyName, 
  uint _amountDue, string memory _paymentMethod) public{
        reqAgencyName = _reqAgencyName;
        serAgencyName = _serAgencyName;
        amountDue = _amountDue;
        paymentMethod = _paymentMethod;
  }

  event notifyPayment(
    string message
  );

  function settlePayment() public payable{
      emit notifyPayment('The Payment is complete');
  }

}

