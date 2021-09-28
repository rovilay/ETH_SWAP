### How to start
1. open terminal
2. cd to project directory
3. make sure ganache is running
4. run `truffle migrate --reset` to migrate smart contract to ganache

### How to connect frontend app to Blockchain
1. connect browser to blockchain
 - make sure metamask browser extension is installed
 - start up metamask
 - import ganache blockchain to metamask
  - open ganache
  - click on the `key` icon of the blockchain address you want to import
  - copy the private key
  - open metamask
  - click on the user icon
  - click `import account`
  - paste the copied private key
  - click import

2. Connect app to blockchain
 - ensure web3.js is installed in package.json
 - run npm start

