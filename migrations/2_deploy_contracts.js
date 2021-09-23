const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

module.exports = async function(deployer) {
    // deploy Token
    await deployer.deploy(Token);

    // get deployed token
    const token = await Token.deployed();
    const totalSupply = await token.totalSupply()

    // deploy EthSwap
    await deployer.deploy(EthSwap, token.address);
    
    // get deployed EthSwap
    const ethSwap = await EthSwap.deployed();

    // Transfer all tokens to EthSwap 
    await token.transfer(ethSwap.address, totalSupply.toString())
};
