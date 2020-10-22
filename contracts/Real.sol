//SPDX-License-Identifier: Unlicensed

pragma solidity ^0.6.12;

// import "@nomiclabs/buidler/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.2.0/contracts/token/ERC20/ERC20.sol";

import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "@opengsn/gsn/contracts/interfaces/IKnowForwarderAddress.sol";
// import "https://github.com/opengsn/gsn/contracts/BaseRelayRecipient.sol";
// import "https://github.com/opengsn/gsn/contracts/interfaces/IKnowForwarderAddress.sol";


contract Real is ERC20, BaseRelayRecipient, IKnowForwarderAddress{
    string public override versionRecipient = "2.0.0";
    
    event Joined(address account);
    mapping (address => bool) public participants;
    
    constructor() ERC20("Real", "REA") public {
        // address _forwarder
        // forwardwer list https://docs.opengsn.org/gsn-provider/networks.html      
        _setupDecimals(0);
        // setRelayHub(0xD216153c06E857cD7f72665E0aF1d7D82172F494);

    }
    
    function participate() public{
        require(!participants[_msgSender()]);
        _mint(_msgSender(), 12);
        participants[_msgSender()] = true;
        emit Joined(_msgSender());
    }

    function getTrustedForwarder() public view
	    override returns(address) {
		return trustedForwarder;
	}

    function _msgSender() internal view override(Context, BaseRelayRecipient) returns (address payable) {
        return BaseRelayRecipient._msgSender();
    }

    function _msgData() internal view override(Context, BaseRelayRecipient) returns (bytes memory) {
        return BaseRelayRecipient._msgData();
    } 

}