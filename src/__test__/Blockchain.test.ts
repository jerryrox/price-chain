import Blockchain from '../blockchain/Blockchain';
import Block from '../blockchain/Block';
import RulesetProvider from "../rulesets/RulesetProvider";
import PriceTransaction from '../transactions/PriceTransaction';
import PriceModel from '../models/PriceModel';
import TestUtils from "./TestUtils";
import TokenTransaction from '../transactions/TokenTransaction';

describe("Blockchain", () => {
    test("Hashes for genesis block", () => {
        console.log("Genesis Price Transaction", Blockchain.genesisTransaction.getHash());
        console.log("Genesis block hash", Blockchain.genesisBlock.getHash());
        expect(Blockchain.genesisBlock.getHash()).toBe("0ef3e3973b6ac373acba6fffb55921e6737a2df04ec82c064000b64c4098fed3");
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
    });

    test("isValidChain", () => {
        expect(Blockchain.isValidChain(new Block({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 17,
            previousHash: "0ef3e3973b6ac373acba6fffb55921e6737a2df04ec82c064000b64c4098fed3",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeTruthy();

        expect(Blockchain.isValidChain(new Block({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 17,
            previousHash: "0ef3e3973b6ac373acba6fffb55921e6737a2df04ec82c064000b64c4098fed3",
            states: {},
            timestamp: 1598156180113,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeFalsy();
        expect(Blockchain.isValidChain(new Block({
            difficulty: 2,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 17,
            previousHash: "0ef3e3973b6ac373acba6fffb55921e6737a2df04ec82c064000b64c4098fed3",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeFalsy();
        expect(Blockchain.isValidChain(new Block({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 17,
            previousHash: "0ef3e3973b6ac373acba6fffb55921e6737a2df04ec82c064000b64c4098fed2",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeFalsy();
        expect(Blockchain.isValidChain(new Block({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 18,
            previousHash: "0ef3e3973b6ac373acba6fffb55921e6737a2df04ec82c064000b64c4098fed3",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeFalsy();
        expect(Blockchain.isValidChain(new Block({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8d",
            nonce: 17,
            previousHash: "0ef3e3973b6ac373acba6fffb55921e6737a2df04ec82c064000b64c4098fed3",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeFalsy();
        expect(Blockchain.isValidChain(new Block({
            difficulty: 1,
            index: 2,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 17,
            previousHash: "0ef3e3973b6ac373acba6fffb55921e6737a2df04ec82c064000b64c4098fed3",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeFalsy();
    });

    test("isValidChain with two additional blocks", () => {
        const newBlock = new Block({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 33,
            previousHash: "0ef3e3973b6ac373acba6fffb55921e6737a2df04ec82c064000b64c4098fed3",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        });
        expect(Blockchain.isValidChain(newBlock, Blockchain.genesisBlock)).toBeTruthy();

        const fakeRewardTx = new TokenTransaction({
            timestamp: 0,
            rulesetId: RulesetProvider.tokenRuleset.rulesetId,
            fromAddress: "",
            data: [
                "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
                newBlock.rewardAmount
            ]
        });
        let newBlock2 = new Block({
            difficulty: 1,
            index: 2,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 51,
            previousHash: "019756d703f32d78291995f97cc9b504e9f2eacfe230aa31c66799ebe71b859f",
            states: {},
            timestamp: 1598156580112,
            transactions: {
                [fakeRewardTx.hash]: fakeRewardTx
            },
        });
        // Fails due to invalid reward transaction
        expect(Blockchain.isValidChain(newBlock2, newBlock)).toBeFalsy();

        const fakeRewardTx2 = new TokenTransaction({
            timestamp: 0,
            rulesetId: RulesetProvider.tokenRuleset.rulesetId,
            fromAddress: "2",
            data: [
                "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
                newBlock.rewardAmount
            ]
        });
        newBlock2 = new Block({
            difficulty: 1,
            index: 2,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 51,
            previousHash: "019756d703f32d78291995f97cc9b504e9f2eacfe230aa31c66799ebe71b859f",
            states: {},
            timestamp: 1598156580112,
            transactions: {
                [fakeRewardTx2.hash]: fakeRewardTx2
            },
        });
        // Fails due to invalid reward transaction
        expect(Blockchain.isValidChain(newBlock2, newBlock)).toBeFalsy();

        const rewardTx = new TokenTransaction({
            timestamp: 0,
            rulesetId: RulesetProvider.tokenRuleset.rulesetId,
            fromAddress: "1",
            data: [
                "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
                newBlock.rewardAmount
            ]
        });
        newBlock2 = new Block({
            difficulty: 1,
            index: 2,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 51,
            previousHash: "019756d703f32d78291995f97cc9b504e9f2eacfe230aa31c66799ebe71b859f",
            states: {},
            timestamp: 1598156580112,
            transactions: {
                [`${rewardTx.hash}a`]: rewardTx
            },
        });
        // Slightly changed key in transactions.
        expect(Blockchain.isValidChain(newBlock2, newBlock)).toBeFalsy();

        newBlock2 = new Block({
            difficulty: 1,
            index: 2,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 51,
            previousHash: "019756d703f32d78291995f97cc9b504e9f2eacfe230aa31c66799ebe71b859f",
            states: {},
            timestamp: 1598156580112,
            transactions: {
                [rewardTx.hash]: rewardTx
            },
        });
        expect(Blockchain.isValidChain(newBlock2, newBlock)).toBeTruthy();
    });

    test("addNewBlock", () => {
        const blockchain = new Blockchain();
        const newBlock = new Block({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 33,
            previousHash: "0ef3e3973b6ac373acba6fffb55921e6737a2df04ec82c064000b64c4098fed3",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        });
        expect(blockchain.addNewBlock(newBlock)).toBeTruthy();
        expect(blockchain.blocks.length).toBe(2);
        expect(blockchain.blocks[1]).toBe(newBlock);
    });

    test("Difficulty calculation", () => {
        const blockchain = new Blockchain();

        const createBlock = (timestamp: number) => {
            const blockData = {
                difficulty: blockchain.getCurrentDifficulty(),
                index: 1,
                minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
                nonce: 0,
                previousHash: blockchain.lastBlock.hash,
                states: {},
                timestamp,
                transactions: {},
            }
            const newBlock = new Block(blockData);
        };
    });
});