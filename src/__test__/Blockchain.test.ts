import Blockchain from '../blockchain/Blockchain';
import Block from '../blockchain/Block';
import TestUtils from "./TestUtils";
import TokenTransaction from '../transactions/TokenTransaction';
import Utils from "../utils/Utils";
import RulesetIds from "../rulesets/RulesetIds";

describe("Blockchain", () => {
    test("Hashes for genesis block", () => {
        console.log("Genesis Price Transaction", Blockchain.genesisTransaction.getHash());
        console.log("Genesis block hash", Blockchain.genesisBlock.getHash());
        console.log("Genesis block", Blockchain.genesisBlock);
        if (!Blockchain.genesisBlock.isValidStructure()) {
            TestUtils.mine(Blockchain.genesisBlock);
        }

        expect(Blockchain.genesisBlock.isValidStructure()).toBeTruthy();
        expect(Blockchain.genesisBlock.getHash()).toBe("05a429dd639d77483c5ad17dd52399520d32c41da1b0fbb25a3dd06426cb7370");
    });
    
    test("Instantiation", () => {
        const blockchain = new Blockchain();
        expect(blockchain.blocks.length).toBe(1);
        expect(blockchain.blocks[0].isValidStructure()).toBe(true);

        Object.values(blockchain.blocks[0].transactions).forEach((tx) => {
            expect(tx.isValidStructure()).toBe(true);
        });
        Object.values(blockchain.blocks[0].states).forEach((state) => {
            expect(state.isValidStructure()).toBe(true);
        });
    });

    test("isValidStructure", () => {
        const blockchain = new Blockchain();
        expect(blockchain.isValidStructure()).toBeTruthy();

        // Just an invalid block
        blockchain.blocks.push(new Block({
            difficulty: 1,
            index: 1,
            minerAddress: "",
            nonce: 0,
            previousHash: "",
            states: {},
            timestamp: 0,
            transactions: {}
        }));
        expect(blockchain.isValidStructure()).toBeFalsy();
        blockchain.blocks.splice(1, 1);

        // Block with no transaction should fail.
        let block = TestUtils.mine({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 0,
            previousHash: blockchain.firstBlock.hash,
            states: {},
            timestamp: Date.now(),
            transactions: {}
        });
        blockchain.blocks.push(block);
        expect(blockchain.isValidStructure()).toBeFalsy();
        blockchain.blocks.splice(1, 1);

        // Block with only reward transaction should fail.
        const rewardTx = TokenTransaction.newRewardTx(
            Date.now(), 1, "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c", Utils.miningReward
        );
        block = TestUtils.mine({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 0,
            previousHash: blockchain.firstBlock.hash,
            states: {},
            timestamp: Date.now(),
            transactions: {[rewardTx.hash]: rewardTx}
        });
        blockchain.blocks.push(block);
        expect(blockchain.isValidStructure()).toBeFalsy();
        blockchain.blocks.splice(1, 1);

        // Block with no reward transaction should fail.
        const transferTx = new TokenTransaction({
            data: TokenTransaction.newData("asdf", 10),
            fromAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            rulesetId: RulesetIds.token,
            timestamp: Date.now()
        });
        block = TestUtils.mine({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 0,
            previousHash: blockchain.firstBlock.hash,
            states: {},
            timestamp: Date.now(),
            transactions: {[transferTx.hash]: transferTx}
        });
        blockchain.blocks.push(block);
        expect(blockchain.isValidStructure()).toBeFalsy();
        blockchain.blocks.splice(1, 1);

        // This should succeed.
        block = TestUtils.mine({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 0,
            previousHash: blockchain.firstBlock.hash,
            states: {},
            timestamp: Date.now(),
            transactions: {
                [transferTx.hash]: transferTx,
                [rewardTx.hash]: rewardTx,
            }
        });
        blockchain.blocks.push(block);
        expect(blockchain.isValidStructure()).toBeTruthy();
        blockchain.blocks.splice(1, 1);
    });

    test("isValidChain", () => {
        const tokenTx = new TokenTransaction({
            fromAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            rulesetId: RulesetIds.token,
            timestamp: Date.now(),
            data: TokenTransaction.newData("asdf", 100)
        });
        const reward = TokenTransaction.newRewardTx(
            Date.now(),
            1,
            "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            Utils.miningReward
        );
        expect(Blockchain.isValidChain(TestUtils.mine({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 0,
            previousHash: "05a429dd639d77483c5ad17dd52399520d32c41da1b0fbb25a3dd06426cb7370",
            states: {},
            timestamp: 1598156180112,
            transactions: {
                [tokenTx.hash]: tokenTx,
                [reward.hash]: reward
            },
        }), Blockchain.genesisBlock)).toBeTruthy();

        expect(Blockchain.isValidChain(new Block({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 24,
            previousHash: "05a429dd639d77483c5ad17dd52399520d32c41da1b0fbb25a3dd06426cb7370",
            states: {},
            timestamp: 1598156180113,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeFalsy();
        expect(Blockchain.isValidChain(new Block({
            difficulty: 2,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 24,
            previousHash: "05a429dd639d77483c5ad17dd52399520d32c41da1b0fbb25a3dd06426cb7370",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeFalsy();
        expect(Blockchain.isValidChain(new Block({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 24,
            previousHash: "0ef3e3973b6ac373acba6fffb55921e6737a2df04ec82c064000b64c4098fed2",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeFalsy();
        expect(Blockchain.isValidChain(new Block({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 9999,
            previousHash: "05a429dd639d77483c5ad17dd52399520d32c41da1b0fbb25a3dd06426cb7370",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeFalsy();
        expect(Blockchain.isValidChain(new Block({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8d",
            nonce: 24,
            previousHash: "05a429dd639d77483c5ad17dd52399520d32c41da1b0fbb25a3dd06426cb7370",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeFalsy();
        expect(Blockchain.isValidChain(new Block({
            difficulty: 1,
            index: 2,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 24,
            previousHash: "05a429dd639d77483c5ad17dd52399520d32c41da1b0fbb25a3dd06426cb7370",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeFalsy();
    });

    test("isValidChain with two additional blocks", () => {
        const tokenTx = new TokenTransaction({
            fromAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            rulesetId: RulesetIds.token,
            timestamp: Date.now(),
            data: TokenTransaction.newData("asdf", 100)
        });
        const reward = TokenTransaction.newRewardTx(
            Date.now(),
            1,
            "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            Utils.miningReward
        );
        const newBlock = TestUtils.mine({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 0,
            previousHash: "05a429dd639d77483c5ad17dd52399520d32c41da1b0fbb25a3dd06426cb7370",
            states: {},
            timestamp: 1598156180112,
            transactions: {
                [tokenTx.hash]: tokenTx,
                [reward.hash]: reward
            },
        });
        expect(Blockchain.isValidChain(newBlock, Blockchain.genesisBlock)).toBeTruthy();

        const fakeRewardTx = new TokenTransaction({
            timestamp: 0,
            rulesetId: RulesetIds.token,
            fromAddress: "",
            data: [
                "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
                Utils.miningReward
            ]
        });
        let newBlock2 = TestUtils.mine({
            difficulty: 1,
            index: 2,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 0,
            previousHash: newBlock.hash,
            states: {},
            timestamp: 1598156580112,
            transactions: {
                [fakeRewardTx.hash]: fakeRewardTx,
                [tokenTx.hash]: tokenTx,
            },
        });
        // Fails due to invalid reward transaction
        expect(Blockchain.isValidChain(newBlock2, newBlock)).toBeFalsy();

        const fakeRewardTx2 = new TokenTransaction({
            timestamp: 0,
            rulesetId: RulesetIds.token,
            fromAddress: "1",
            data: [
                "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
                Utils.miningReward
            ]
        });
        newBlock2 = TestUtils.mine({
            difficulty: 1,
            index: 2,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 0,
            previousHash: newBlock.hash,
            states: {},
            timestamp: 1598156580112,
            transactions: {
                [fakeRewardTx2.hash]: fakeRewardTx2,
                [tokenTx.hash]: tokenTx,
            },
        });
        // Fails due to invalid reward transaction
        expect(Blockchain.isValidChain(newBlock2, newBlock)).toBeFalsy();

        const rewardTx = new TokenTransaction({
            timestamp: 0,
            rulesetId: RulesetIds.token,
            fromAddress: "1",
            data: [
                "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
                Utils.miningReward
            ]
        });
        newBlock2 = TestUtils.mine({
            difficulty: 1,
            index: 2,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 0,
            previousHash: newBlock.hash,
            states: {},
            timestamp: 1598156580112,
            transactions: {
                [`${rewardTx.hash}a`]: rewardTx,
                [tokenTx.hash]: tokenTx,
            },
        });
        // Slightly changed key in transactions.
        expect(Blockchain.isValidChain(newBlock2, newBlock)).toBeFalsy();

        const newReward = TokenTransaction.newRewardTx(
            Date.now(),
            2,
            "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            Utils.miningReward
        );
        newBlock2 = TestUtils.mine({
            difficulty: 1,
            index: 2,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 0,
            previousHash: newBlock.hash,
            states: {},
            timestamp: 1598156580112,
            transactions: {
                [newReward.hash]: newReward,
                [tokenTx.hash]: tokenTx,
            },
        });
        expect(Blockchain.isValidChain(newBlock2, newBlock)).toBeTruthy();
    });

    test("addNewBlock", () => {
        const blockchain = new Blockchain();
        const tokenTransaction = new TokenTransaction({
            timestamp: Date.now(),
            fromAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            rulesetId: RulesetIds.token,
            data: TokenTransaction.newData("asdf", 100),
        });
        const reward = TokenTransaction.newRewardTx(Date.now(), 1, "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c", Utils.miningReward);
        const newBlock = TestUtils.mine({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 0,
            previousHash: "05a429dd639d77483c5ad17dd52399520d32c41da1b0fbb25a3dd06426cb7370",
            states: {},
            timestamp: 1598156180112,
            transactions: {
                [tokenTransaction.hash]: tokenTransaction,
                [reward.hash]: reward
            },
        });
        expect(blockchain.addNewBlock(newBlock)).toBeTruthy();
        expect(blockchain.blocks.length).toBe(2);
        expect(blockchain.blocks[1]).toBe(newBlock);
    });

    test("Difficulty calculation", () => {
        let blockchain = new Blockchain();

        const createBlock = (timestamp: number): Block => {
            const tokenTx = new TokenTransaction({
                data: TokenTransaction.newData(
                    "asdf",
                    100
                ),
                fromAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
                rulesetId: RulesetIds.token,
                timestamp: Date.now(),
            });
            const reward = TokenTransaction.newRewardTx(
                Date.now(),
                blockchain.lastBlock.index + 1,
                "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
                Utils.miningReward
            );
            const blockData = {
                difficulty: blockchain.getCurrentDifficulty(),
                index: blockchain.lastBlock.index + 1,
                minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
                nonce: 0,
                previousHash: blockchain.lastBlock.hash,
                states: {},
                timestamp,
                transactions: {
                    [tokenTx.hash]: tokenTx,
                    [reward.hash]: reward,
                },
            }
            const block = TestUtils.mine(blockData, false);
            expect(blockchain.addNewBlock(block)).toBeTruthy();
            return block;
        };
        // Perfectly expected time
        for (let i = 0; i < Utils.difficultyInterval; i++) {
            createBlock(blockchain.lastBlock.timestamp + Utils.expectedBlocktime);
        }
        expect(blockchain.blocks.length).toBe(1 + Utils.difficultyInterval);
        expect(blockchain.getCurrentDifficulty()).toBe(Blockchain.genesisBlock.difficulty);

        // Longer than expected time * 2, but difficulty shouldn't decrease.
        for (let i = 0; i < Utils.difficultyInterval; i++) {
            createBlock(blockchain.lastBlock.timestamp + (Utils.expectedBlocktime * 2 + 1));
        }
        expect(blockchain.blocks.length).toBe(1 + Utils.difficultyInterval * 2);
        expect(blockchain.getCurrentDifficulty()).toBe(Blockchain.genesisBlock.difficulty);

        // Shorter than expected time / 2. Difficulty should increase.
        for (let i = 0; i < Utils.difficultyInterval; i++) {
            createBlock(blockchain.lastBlock.timestamp + (Utils.expectedBlocktime / 2 - 1));
        }
        expect(blockchain.blocks.length).toBe(1 + Utils.difficultyInterval * 3);
        expect(blockchain.getCurrentDifficulty()).toBe(Blockchain.genesisBlock.difficulty + 1);

        // Longer than expected time * 2, difficulty should decrease.
        for (let i = 0; i < Utils.difficultyInterval; i++) {
            createBlock(blockchain.lastBlock.timestamp + (Utils.expectedBlocktime * 2 + 1));
        }
        expect(blockchain.blocks.length).toBe(1 + Utils.difficultyInterval * 4);
        expect(blockchain.getCurrentDifficulty()).toBe(Blockchain.genesisBlock.difficulty);
    });
});