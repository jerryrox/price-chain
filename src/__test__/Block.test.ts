import Block from '../blockchain/Block';
import Blockchain from "../blockchain/Blockchain";

describe("Block", () => {
    test("Instantiation", () => {
        const block = new Block({
            minerAddress: "",
            difficulty: 1,
            index: 0,
            nonce: 123,
            previousHash: "asdfzxcv",
            states: {},
            timestamp: 1500,
            transactions: {}
        });
        expect(block.difficulty).toBe(1);
        expect(block.index).toBe(0);
        expect(block.nonce).toBe(123);
        expect(block.previousHash).toBe("asdfzxcv");
        expect(block.states).toMatchObject({});
        expect(block.timestamp).toBe(1500);
        expect(block.transactions).toMatchObject({});

        expect(block.stateMerkleRoot).toBe("");
        expect(block.txMerkleRoot).toBe("");
        expect(block.hash).toBe(Block.calculateHash({
            minerAddress: "",
            difficulty: 1,
            index: 0,
            nonce: 123,
            previousHash: "asdfzxcv",
            states: {},
            timestamp: 1500,
            transactions: {}
        }));
        expect(block.hash).toBe(Block.calculateHash({
            minerAddress: "",
            difficulty: 1,
            index: 0,
            nonce: 123,
            previousHash: "asdfzxcv",
            stateMerkleRoot: "",
            timestamp: 1500,
            txMerkleRoot: "",
        }));
    });

    test("isValidStructure", () => {
        const block = new Block({
            minerAddress: "",
            difficulty: 1,
            index: 0,
            nonce: 123,
            previousHash: "asdfzxcv",
            states: {},
            timestamp: 1500,
            transactions: {}
        });
        const hash = block.hash;

        expect(Block.calculateHash({
            minerAddress: "",
            difficulty: 1,
            index: 0,
            nonce: 123,
            previousHash: "asdfzxcv",
            states: {},
            timestamp: 1500,
            transactions: {}
        })).toBe(hash);
        expect(Block.calculateHash({
            minerAddress: "",
            difficulty: 1,
            index: 1,
            nonce: 123,
            previousHash: "asdfzxcv",
            states: {},
            timestamp: 1500,
            transactions: {}
        })).not.toBe(hash);
        expect(Block.calculateHash({
            minerAddress: "a",
            difficulty: 1,
            index: 0,
            nonce: 123,
            previousHash: "asdfzxcv",
            states: {},
            timestamp: 1500,
            transactions: {}
        })).not.toBe(hash);
        expect(Block.calculateHash({
            minerAddress: "",
            difficulty: 2,
            index: 0,
            nonce: 123,
            previousHash: "asdfzxcv",
            states: {},
            timestamp: 1500,
            transactions: {}
        })).not.toBe(hash);
        expect(Block.calculateHash({
            minerAddress: "",
            difficulty: 1,
            index: 0,
            nonce: 124,
            previousHash: "asdfzxcv",
            states: {},
            timestamp: 1500,
            transactions: {}
        })).not.toBe(hash);
        expect(Block.calculateHash({
            minerAddress: "",
            difficulty: 1,
            index: 0,
            nonce: 123,
            previousHash: "asdfzxcvb",
            states: {},
            timestamp: 1500,
            transactions: {}
        })).not.toBe(hash);
        expect(Block.calculateHash({
            minerAddress: "",
            difficulty: 1,
            index: 0,
            nonce: 123,
            previousHash: "asdfzxcv",
            states: {},
            timestamp: 1501,
            transactions: {}
        })).not.toBe(hash);
        expect(Block.calculateHash({
            minerAddress: "",
            difficulty: 1,
            index: 0,
            nonce: 123,
            previousHash: "asdfzxcv",
            stateMerkleRoot: "a",
            timestamp: 1500,
            transactions: {}
        })).not.toBe(hash);
        expect(Block.calculateHash({
            minerAddress: "",
            difficulty: 1,
            index: 0,
            nonce: 123,
            previousHash: "asdfzxcv",
            states: {},
            timestamp: 1500,
            txMerkleRoot: "b"
        })).not.toBe(hash);
    });

    test("serialize/deserialize", () => {
        const block = new Block({
            minerAddress: "",
            difficulty: 1,
            index: 0,
            nonce: 123,
            previousHash: "asdfzxcv",
            states: {},
            timestamp: 1500,
            transactions: {}
        });
        let serialized = block.serialize();
        expect(block).toMatchObject(serialized);
        let newBlock = new Block();
        newBlock.deserialize(serialized);
        expect(newBlock).toMatchObject(block);

        serialized = Blockchain.genesisBlock.serialize();
        expect(Blockchain.genesisBlock).toMatchObject(serialized);
        newBlock = new Block();
        newBlock.deserialize(serialized);
        expect(Blockchain.genesisBlock).toMatchObject(newBlock.serialize());
    });
});