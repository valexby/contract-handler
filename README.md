# contract-handler

The test assignment for blockchain smart contract handling. Repo contains two main entities:
* `hot-dog-contract/` contains a smart contract that runs basic logic for hot dogs number counting. 
It is deployed in Kovan testnet by address [0xd2ce3b3da81095cbcb0761ebd5029c8499221c0f](https://kovan.etherscan.io/address/0xd2ce3b3da81095cbcb0761ebd5029c8499221c0f) 
* The web app composed from `server.js` - a small `express` server implementation, and static `index.html` with
smart contract interraction logic put in `index.js`. The web app also is
integrated with [DLC-link](https://github.com/DLC-link/dlc-solidity-smart-contract) smart contract, which is deployed in Kovan testnet by address
[0x6143a931d4bCB38347936fAacFbea432b4F0DF17](https://kovan.etherscan.io/address/0x6143a931d4bCB38347936fAacFbea432b4F0DF17)

## Installation

Run following

```
npm install
npm start
```

You should see logs saying

```
> contract-handler@1.0.0 start
> node server.js

Running at
http://localhost:3300
```

Install [MetaMask](https://metamask.io/) crypto gateway in order to connect the Dapp to blockchain. Connect it to Kovan testnet.
