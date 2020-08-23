import Blockchain from '../blockchain/Blockchain';
import Block from '../blockchain/Block';
import RulesetProvider from "../rulesets/RulesetProvider";
import PriceTransaction from '../transactions/PriceTransaction';
import PriceModel from '../models/PriceModel';
import TestUtils from "./TestUtils";
import TokenTransaction from '../transactions/TokenTransaction';

describe("Blockchain", () => {
    test("Hashes for genesis block", () => {
        console.log("Genesis Price Transaction", new PriceTransaction({
            rulesetId: RulesetProvider.priceRuleset.rulesetId,
            fromAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            data: [
                new PriceModel({
                    sku: "4549767092386",
                    basePrice: 19.05,
                    discountRate: 0,
                }),
            ]
        }).getHash());

        console.log("Genesis block hash", Blockchain.genesisBlock.getHash());
        expect(Blockchain.genesisBlock.getHash()).toBe("0854fc1ffe713e1230aa640e3a2fa22378e68b23215f2f46f1df0f5971be5181");
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
            nonce: 22,
            previousHash: "0854fc1ffe713e1230aa640e3a2fa22378e68b23215f2f46f1df0f5971be5181",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeTruthy();

        expect(Blockchain.isValidChain(new Block({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 22,
            previousHash: "0854fc1ffe713e1230aa640e3a2fa22378e68b23215f2f46f1df0f5971be5181",
            states: {},
            timestamp: 1598156180113,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeFalsy();
        expect(Blockchain.isValidChain(new Block({
            difficulty: 2,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 22,
            previousHash: "0854fc1ffe713e1230aa640e3a2fa22378e68b23215f2f46f1df0f5971be5181",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeFalsy();
        expect(Blockchain.isValidChain(new Block({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 22,
            previousHash: "0854fc1ffe713e1230aa640e3a2fa22378e68b23215f2f46f1df0f5971be5182",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeFalsy();
        expect(Blockchain.isValidChain(new Block({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 23,
            previousHash: "0854fc1ffe713e1230aa640e3a2fa22378e68b23215f2f46f1df0f5971be5181",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeFalsy();
        expect(Blockchain.isValidChain(new Block({
            difficulty: 1,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8d",
            nonce: 22,
            previousHash: "0854fc1ffe713e1230aa640e3a2fa22378e68b23215f2f46f1df0f5971be5181",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeFalsy();
        expect(Blockchain.isValidChain(new Block({
            difficulty: 1,
            index: 2,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 22,
            previousHash: "0854fc1ffe713e1230aa640e3a2fa22378e68b23215f2f46f1df0f5971be5181",
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
            nonce: 22,
            previousHash: "0854fc1ffe713e1230aa640e3a2fa22378e68b23215f2f46f1df0f5971be5181",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        });
        expect(Blockchain.isValidChain(newBlock, Blockchain.genesisBlock)).toBeTruthy();

        let newBlock2 = new Block({
            difficulty: 1,
            index: 2,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 6,
            previousHash: "0bfe09bb3ec4d8dc4782f0d7de48f184e849d1a60610ba46330709ce89ce6706",
            states: {},
            timestamp: 1598156580112,
            transactions: {},
        });
        // Fails due to missing reward transaction
        expect(Blockchain.isValidChain(newBlock2, newBlock)).toBeFalsy();

        const rewardTx = new TokenTransaction({
            rulesetId: RulesetProvider.tokenRuleset.rulesetId,
            fromAddress: "",
            data: [
                "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
                newBlock.rewardAmount
            ]
        });

        newBlock2 = new Block({
            difficulty: 1,
            index: 2,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 24,
            previousHash: "0bfe09bb3ec4d8dc4782f0d7de48f184e849d1a60610ba46330709ce89ce6706",
            states: {},
            timestamp: 1598156580112,
            transactions: {
                "4c421ec8a893f8a63f45f57babd3c75330f93cef4d7b097443c24d3d9ee332b5": rewardTx
            },
        });
        // Slightly changed key in transactions.
        expect(Blockchain.isValidChain(newBlock2, newBlock)).toBeFalsy();

        newBlock2 = new Block({
            difficulty: 1,
            index: 2,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 24,
            previousHash: "0bfe09bb3ec4d8dc4782f0d7de48f184e849d1a60610ba46330709ce89ce6706",
            states: {},
            timestamp: 1598156580112,
            transactions: {
                "4c421ec8a893f8a63f45f57babd3c75330f93cef4d7b097443c24d3d9ee332b4": rewardTx
            },
        });
        expect(Blockchain.isValidChain(newBlock2, newBlock)).toBeTruthy();
    });

    test("addNewBlock", () => {
    });
});