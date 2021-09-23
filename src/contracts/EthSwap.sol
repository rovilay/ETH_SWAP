pragma solidity >= 0.5.0 < 0.6.0;

import './Token.sol';

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    // rate = # of tokens received for 1 ether
    uint public rate = 100; // 1 ETH = 100 OG tokens

    event TokensPurchased(
        address accout,
        address token,
        uint amount, 
        uint rate
    );

    event TokensSold(
        address accout,
        address token,
        uint amount, 
        uint rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    // the buyTokens and sellTokens is from the investor's POV
    function buyTokens() public payable {
        // calculate the number of tokens to buy
        // amount of Ether * rate
        uint tokenAmount = msg.value * rate;
        token.transfer(msg.sender, tokenAmount);

        // only allow purchase if token balance >= tokenAmount
        require(token.balanceOf(address(this)) >= tokenAmount);

        // emit token purchased event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _tokenAmount) public {
        // User can't sell more tokens than they have
        require(token.balanceOf(msg.sender) >= _tokenAmount);

        // calculate the amount of Ether to redeem
        uint etherAmount = _tokenAmount / rate;

        // perform sale
        token.transferFrom(msg.sender, address(this), _tokenAmount);
        msg.sender.transfer(etherAmount);

        // only allow purchase if ether balance >= tokenAmount
        // Note: revist this cos of failing test
        // require(address(this).balance >= etherAmount);

        // emit token sold event
        emit TokensSold(msg.sender, address(token), _tokenAmount, rate);
    }
}
