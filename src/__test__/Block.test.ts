import Block from '../blockchain/Block';
describe("Block", () => {
    test("Instantiation", () => {
        const block = new Block({
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
        expect(block.hash).toBe(Block.calculateHash(
            0,
            "asdfzxcv",
            1500,
            123,
            1,
            {},
            {}
        ));
        expect(block.hash).toBe(Block.calculateHash(
            0,
            "asdfzxcv",
            1500,
            123,
            1,
            "",
            ""
        ));
    });

    test("isValidStructure", () => {
        const block = new Block({
            difficulty: 1,
            index: 0,
            nonce: 123,
            previousHash: "asdfzxcv",
            states: {},
            timestamp: 1500,
            transactions: {}
        });
        const hash = block.hash;

        expect(Block.calculateHash(
            0,
            "asdfzxcv",
            1500,
            123,
            1,
            {},
            {}
        )).toBe(hash);
        expect(Block.calculateHash(
            1,
            "asdfzxcv",
            1500,
            123,
            1,
            {},
            {}
        )).not.toBe(hash);
        expect(Block.calculateHash(
            0,
            "asdfzxc",
            1500,
            123,
            1,
            {},
            {}
        )).not.toBe(hash);
        expect(Block.calculateHash(
            0,
            "asdfzxcv",
            1501,
            123,
            1,
            {},
            {}
        )).not.toBe(hash);
        expect(Block.calculateHash(
            0,
            "asdfzxcv",
            1500,
            124,
            1,
            {},
            {}
        )).not.toBe(hash);
        expect(Block.calculateHash(
            0,
            "asdfzxcv",
            1500,
            123,
            2,
            {},
            {}
        )).not.toBe(hash);
        expect(Block.calculateHash(
            0,
            "asdfzxcv",
            1500,
            123,
            1,
            "a",
            {}
        )).not.toBe(hash);
        expect(Block.calculateHash(
            0,
            "asdfzxcv",
            1500,
            123,
            1,
            {},
            "b"
        )).not.toBe(hash);
    });
});