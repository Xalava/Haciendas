# Haciendas
A fun, social and visual way to interact with digital assets and DeFi protocols.
More information and a presentation video are available at https://haciendas.xyz/infos/

## Participate
This project aims to be primarily an educational. The best way to participate is to join our [Discord server](https://discord.gg/n5xTJXNbwF), to add issues or pull requests to this repository.

We are looking for 
- ideas on how to onboard user, scenarios, design suggestions
- Art direction and audio and graphical assets
- Pure frontend development, this is a fun project to grow skills
- Dapps development, to link the interface with the blockchain
- Solidity development, currently secondary but necessary to register users...

## Development
This is a good [video](https://www.youtube.com/watch?v=JKnzsC2t1AM) to get a sense of how it works and its technical architecture. Check the develop branch where the current online alpha version is being built.

### Launch
```bash
npm -g i liveserver
npm run dev  # alias for liveserver --watch="js"
```

### Technology
This is mostly a frontend application, using vanilla Javascript, a light CSS library (picnic.css), and Phaser 3, a 2D web game engine. To connect to Ethereum it uses the library ethers, and a light server using socket.io for messaging. 

### Networks
Haciendas can be used on testnets and mainnet. Currently the game expect a browser wallet such as Metamask connected to **Kovan**. ENS names are retrieved on Ropsten if available. 

The game uses Polygon for its Smart Contract on mainnet. To connect metamask to matic https://docs.matic.network/docs/develop/metamask/config-matic/