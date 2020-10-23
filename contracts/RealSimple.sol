// Simplified and unsafe version for dev purposes. Check Real.sol
pragma solidity 0.5.16;

import "tabookey-gasless/contracts/GsnUtils.sol";
import "tabookey-gasless/contracts/IRelayHub.sol";
import "tabookey-gasless/contracts/RelayRecipient.sol";
import "usingtellor/contracts/UsingTellor.sol";

import "./IERC20.sol";

contract RealSimple is RelayRecipient, UsingTellor {

    string public constant name = "Real";
    string public constant symbol = "REAL";
    uint8 public constant decimals = 0;  

    IERC20 private USDC = IERC20(0x07865c6E87B9F70255377e024ace6630C1Eaa37F);
    
    mapping (address => bool) public participants;
    mapping (address => bool) public hasCoffee;
    mapping (address => uint) public balanceOf;

  constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) public {
   setRelayHub(IRelayHub("0xD216153c06E857cD7f72665E0aF1d7D82172F494"));
  }

    
    function transfer(address receiver, uint amount) public {
        require(amount <= balanceOf[getSender()]);
        balanceOf[getSender()] = balanceOf[getSender()] - amount;
        balanceOf[receiver] = balanceOf[receiver] + amount;
    }
        
    function participate() public{
        require(!participants[getSender()]);
        balanceOf[getSender()] += 12;
        participants[getSender()] = true;
    }
    
    function buyUSDC() public {
        bool _didGet;
        uint _timestamp;
        uint _value;
        uint rate = 350;
       (_didGet, _value, _timestamp) = getCurrentValue(1);
       if (_didGet){
            rate = _value/ 100;
            if (balanceOf[getSender()]>0){
                balanceOf[getSender()]-=1;
               USDC.transfer(getSender());
            }
        }
    }

    function buyCoffee() public {
        if (balanceOf[getSender()]>0){
            balanceOf[getSender()]-=1;
            hasCoffee[getSender()]= true;
        }
    }


    // GSN functions
    function acceptRelayedCall(address relay, address from, bytes calldata encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes calldata approvalData, uint256 maxPossibleCharge) external view returns (uint256, bytes memory) {
        return (0, "");
    }

    function preRelayedCall(bytes calldata context) /*relayHubOnly*/ external returns (bytes32) {
        return bytes32(uint(123456));
    }

    function postRelayedCall(bytes calldata context, bool success, uint actualCharge, bytes32 preRetVal) /*relayHubOnly*/ external {
    }
}