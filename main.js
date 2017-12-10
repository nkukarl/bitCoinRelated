const SHA256 = require('crypto-js/sha256');

class Block {
	constructor(index, timestamp, data, previousHash='') {
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = '';
	}

	calculateHash() {
		// Encrypt
		return  SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
	}
}

class BlockChain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
	}

	createGenesisBlock() {
		// All block chains start with a manually added block, a.k.a., Genesis block
		return new Block(0, '01/01/2017', 'Genesis block', '0');
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock) {
		// Update the previous hash of the new block to the latest block in the chain
		newBlock.previousHash = this.getLatestBlock().hash;
		// Recalculate the has of the new block
		newBlock.hash = newBlock.calculateHash()
		// Append it to the chain
		this.chain.push(newBlock);
	}

	isChainValid() {
		// For each block (except the Genesis block), check whether its previous hash
		// matches the hash of its previous block.
		// Also its hash matches the result of the calculated hash.
		for (let i = 1; i < this.chain.length; i++) {
			const previousBlock = this.chain[i - 1];
			const currentBlock = this.chain[i];

			if (currentBlock.previousHash != previousBlock.hash) {
				return false;
			}

			if (currentBlock.hash != currentBlock.calculateHash()) {
				return false;
			}
		}
		return true;
	}
}

const blockChain = new BlockChain();
blockChain.addBlock(new Block(1, '02/02/2017', {amount: 4}));
blockChain.addBlock(new Block(2, '03/03/2017', {amount: 5}));
blockChain.addBlock(new Block(3, '04/04/2017', {amount: 6}));

// Print out the blockChain
console.log(JSON.stringify(blockChain, null, 4));

// Ensure the block chain is valid.
console.log('Is block chain valid?', blockChain.isChainValid());

blockChain.chain[1].data = {amount: -1};
blockChain.chain[1].hash = blockChain.chain[1].calculateHash();

console.log('Is block chain valid?', blockChain.isChainValid());
