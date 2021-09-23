const Token = artifacts.require('Token');
const EthSwap = artifacts.require('EthSwap');
const { assert, expect } = require('chai');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised).should();

// converts tokens to wei
// by tokens I mean OG tokens
function tokensToWei(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('EthSwap', ([deployer, investor]) => {
    let token;
    let ethSwap;
    let tokenSupply;

    before(async () => {
        token = await Token.new();
        ethSwap = await EthSwap.new(token.address);
        // tranfer all tokens to EthSwap
        tokenSupply = await token.totalSupply();

        // transfer all tokens to ethSwap
        await token.transfer(ethSwap.address, tokenSupply);
    });

    describe('Token deployment', () => {
        it('contract has a name', async () => {
            const name = await token.name();
            assert.equal(name, 'OG Token');
        });
    });

    describe('EthSwap deployment', () => {
        it('contract has a name', async () => {
            const name = await ethSwap.name();
            assert.equal(name, 'EthSwap Instant Exchange');
        });

        it('contract has tokens', async () => {
            const ethSwapBalance = await token.balanceOf(ethSwap.address);

            expect(ethSwapBalance.toString()).to.equal(tokenSupply.toString());
        });

        // Note: the buyTokens and sellTokens is from the investor's POV
        describe('buyTokens', async () => {
            let result;

            before(async () => {
                // purchase tokens before each example
                result = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether')})
            });
        
            it ('allows user to instantly purchase tokens from ethSwap for a fixed price', async () => {
                // check investor's token balance after purchase
                const investorBalance = await token.balanceOf(investor);
                expect(investorBalance.toString()).to.equal(tokensToWei('100'));

                // check ethSwap balance after purchase
                const ethSwapBalance = await token.balanceOf(ethSwap.address);
                expect(ethSwapBalance.toString()).to.equal(tokensToWei('999900'));

                // check ethSwap's ether balance after purchase
                const etherBalance = await web3.eth.getBalance(ethSwap.address);
                expect(etherBalance.toString()).to.equal(web3.utils.toWei('1', 'ether'));

                // check TokensPurchased event args
                const event = result.logs[0].args;
                expect(event.accout).to.equal(investor);
                expect(event.token).to.equal(token.address);
                expect(event.amount.toString()).to.equal(tokensToWei('100'));
                expect(event.rate.toString()).to.equal('100');
            });
        });

        describe('sellTokens', async () => {
            let result;

            before(async () => {
                // investor must approve sale
                await token.approve(ethSwap.address, tokensToWei('100'), { from: investor });

                // sell tokens before each test case
                result = await ethSwap.sellTokens(tokensToWei('100'), { from: investor });
            });
        
            it ('allows user to instantly sell tokens to ethSwap for a fixed price', async () => {
                // check investor token balance after purchase
                const investorBalance = await token.balanceOf(investor);
                expect(investorBalance.toString()).to.equal(tokensToWei('0'));

                // check ethSwap balance after sale
                const ethSwapBalance = await token.balanceOf(ethSwap.address);
                expect(ethSwapBalance.toString()).to.equal(tokensToWei('1000000'));

                // check ethSwap's ether balance after sale
                const etherBalance = await web3.eth.getBalance(ethSwap.address);
                expect(etherBalance.toString()).to.equal(web3.utils.toWei('0', 'Ether'));

                // check TokensSold event args
                const event = result.logs[0].args;
                expect(event.accout).to.equal(investor);
                expect(event.token).to.equal(token.address);
                expect(event.amount.toString()).to.equal(tokensToWei('100'));
                expect(event.rate.toString()).to.equal('100');

                // FAILURE: investor can't sell more tokens than they have
                await ethSwap.sellTokens(tokensToWei('500'), { 'from': investor}).should.be.rejected;
            });
        });
    });
});
