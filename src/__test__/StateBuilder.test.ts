import StateBuilder from '../states/StateBuilder';
import Blockchain from "../blockchain/Blockchain";
import PriceTransaction from '../transactions/PriceTransaction';
import RulesetIds from "../rulesets/RulesetIds";
import PriceModel from '../models/PriceModel';
import PriceState from '../states/PriceState';
import TokenTransaction from '../transactions/TokenTransaction';
import TokenState from '../states/TokenState';
import TestUtils from "./TestUtils";
import CryptoUtils from "../utils/CryptoUtils";

describe("StateBuilder", () => {
    test("feedTransaction", () => {
        const stateBuilder = new StateBuilder(new Blockchain());
        const userAddr = "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c";
        expect(stateBuilder.feedTransaction(new PriceTransaction({
            timestamp: Blockchain.genesisBlock.timestamp,
            fromAddress: userAddr,
            rulesetId: RulesetIds.price,
            data: [
                new PriceModel({
                    basePrice: 1.99,
                    discountRate: 0,
                    sku: "1234"
                })
            ]
        }))).toBeTruthy();
        expect(Object.values(stateBuilder.newState).length).toBe(1);

        expect(stateBuilder.feedTransaction(new TokenTransaction({
            timestamp: Blockchain.genesisBlock.timestamp,
            fromAddress: userAddr,
            rulesetId: RulesetIds.token,
            data: ["0x0", 1]
        }))).toBeTruthy();

        const state = stateBuilder.newState[userAddr];
        expect(state).not.toBeNull();

        const priceState = state.getRulesetState(RulesetIds.price) as PriceState;
        expect(priceState).not.toBeNull();
        expect(priceState.prices["1234"].basePrice).toBe(1.99);
        expect(priceState.prices["1234"].discountRate).toBe(0);
        expect(priceState.prices["1234"].sku).toBe("1234");
        expect(priceState.prices["1234"].finalPrice).toBe(1.99);
        expect(priceState.rulesetId).toBe(RulesetIds.price);

        const tokenState = state.getRulesetState(RulesetIds.token) as TokenState;
        expect(tokenState).not.toBeNull();
        expect(tokenState.balance).toBe(9999);
        expect(tokenState.rulesetId).toBe(RulesetIds.token);

        const tokenReceiverState = stateBuilder.newState["0x0"];
        expect(tokenReceiverState).not.toBeNull();

        const receiverTokenState = tokenReceiverState.getRulesetState(RulesetIds.token) as TokenState;
        expect(receiverTokenState).not.toBeNull();
        expect(receiverTokenState.balance).toBe(1);
        expect(receiverTokenState.rulesetId).toBe(RulesetIds.token);
    });

    test("State regeneration check", () => {
        const blockchain = new Blockchain();
        const userAddr = "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c";

        const transactions = [
            new PriceTransaction({
                timestamp: Blockchain.genesisBlock.timestamp,
                fromAddress: userAddr,
                rulesetId: RulesetIds.price,
                data: [
                    new PriceModel({
                        basePrice: 1.99,
                        discountRate: 0,
                        sku: "1234"
                    })
                ]
            }),
            new TokenTransaction({
                timestamp: Blockchain.genesisBlock.timestamp,
                fromAddress: userAddr,
                rulesetId: RulesetIds.token,
                data: ["0x0", 1]
            })
        ];

        let stateBuilder = new StateBuilder(blockchain);
        expect(stateBuilder.feedTransaction(transactions[0])).toBeTruthy();
        expect(stateBuilder.feedTransaction(transactions[1])).toBeTruthy();

        const block = TestUtils.mine({
            difficulty: blockchain.getCurrentDifficulty(),
            index: blockchain.lastBlock.index + 1,
            minerAddress: userAddr,
            nonce: 0,
            previousHash: blockchain.lastBlock.hash,
            timestamp: blockchain.lastBlock.timestamp,
            transactions: {
                [transactions[0].hash]: transactions[0],
                [transactions[1].hash]: transactions[1],
            },
            states: stateBuilder.newState
        });
        console.log(block);
        expect(blockchain.addNewBlock(block)).toBeTruthy();

        stateBuilder = new StateBuilder(blockchain, block.index);
        Object.values(block.transactions).forEach((tx) => {
            expect(stateBuilder.feedTransaction(tx)).toBeTruthy();
        });
        const mr = CryptoUtils.getMerkleRootForHashable(Object.values(stateBuilder.newState));
        expect(mr).toBe(block.stateMerkleRoot);
    });
});