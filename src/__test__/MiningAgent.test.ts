import Blockchain from '../blockchain/Blockchain';
import TransactionPool from '../transactions/TransactionPool';
import MiningAgent from '../mining/MiningAgent';
import PriceTransaction from '../transactions/PriceTransaction';
import RulesetIds from "../rulesets/RulesetIds";
import PriceModel from '../models/PriceModel';
import TokenTransaction from '../transactions/TokenTransaction';
import Block from '../blockchain/Block';

describe("MiningAgent", () => {
    test("mine", () => {
        const blockchain = new Blockchain();
        const pool = new TransactionPool();
        const user = "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c";
        const agent = new MiningAgent(blockchain, pool, user);
        expect(agent.mine()).toBeNull();

        pool.addRange([
            new PriceTransaction({
                timestamp: Blockchain.genesisBlock.timestamp,
                fromAddress: user,
                rulesetId: RulesetIds.price,
                data: [
                    new PriceModel(Date.now(), {
                        basePrice: 1.99,
                        discountRate: 0,
                        sku: "1234",
                    })
                ]
            }),
            new TokenTransaction({
                timestamp: Blockchain.genesisBlock.timestamp,
                fromAddress: user,
                rulesetId: RulesetIds.token,
                data: ["0x0", 1]
            })
        ]);

        const block = agent.mine() as Block;
        expect(block).not.toBeNull();
        expect(block).not.toBeUndefined();
        expect(block.isValidStructure()).toBeTruthy();

        expect(blockchain.addNewBlock(block)).toBeTruthy();

        console.log(JSON.stringify(blockchain));
    });

    test("Mine without miner", () => {
        const agent = new MiningAgent(new Blockchain, new TransactionPool(), "");
        expect(agent.mine()).toBeNull();
    });
});