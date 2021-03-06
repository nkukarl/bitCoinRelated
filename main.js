const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash='') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        // Encrypt
        return  SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        // Use difficulty to control how long it takes to generate a block.
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce += 1;
            this.hash = this.calculateHash()
        }

        console.log('Block mined:', this.hash)
    }
}

class BlockChain {
    constructor() {
        this.difficulty = 5;
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        // All block chains start with a manually added block, a.k.a., Genesis block
        const genesisBlock = new Block(0, '01/01/2017', 'Genesis block', '0');
        genesisBlock.mineBlock(this.difficulty);
        return genesisBlock;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        // Update the previous hash of the new block to the latest block in the chain
        newBlock.previousHash = this.getLatestBlock().hash;
        // Recalculate the hash of the new block
        newBlock.mineBlock(this.difficulty)
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

// Print out the block chain
console.log(JSON.stringify(blockChain, null, 4));

// Ensure the block chain is valid.
console.log('Is block chain valid?', blockChain.isChainValid());

// Tamper data of a block
blockChain.chain[1].data = {amount: -1};

// Try to update the hash of the tampered block to fake genuineness
blockChain.chain[1].hash = blockChain.chain[1].calculateHash();

// Block chain is invalid
console.log('Is block chain valid?', blockChain.isChainValid());
