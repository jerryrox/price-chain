import Blockchain from '../blockchain/Blockchain';
import Block from '../blockchain/Block';
import RulesetProvider from "../rulesets/RulesetProvider";
import PriceTransaction from '../transactions/PriceTransaction';
import PriceModel from '../models/PriceModel';

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
            difficulty: 0,
            index: 1,
            minerAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
            nonce: 0,
            previousHash: "0854fc1ffe713e1230aa640e3a2fa22378e68b23215f2f46f1df0f5971be5181",
            states: {},
            timestamp: 1598156180112,
            transactions: {},
        }), Blockchain.genesisBlock)).toBeTruthy();
    });

    test("addNewBlock", () => {
    });
});