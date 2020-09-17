import TransactionPool from '../transactions/TransactionPool';
import TokenTransaction from '../transactions/TokenTransaction';
import RulesetIds from "../rulesets/RulesetIds";

describe("TransactionPool", () => {
    test("add", () => {
        const pool = new TransactionPool();
        pool.add(new TokenTransaction({
            timestamp: 0,
            fromAddress: "asdf",
            rulesetId: RulesetIds.token,
            data: ["fdsa", 0]
        }));
        expect(pool.transactions.length).toBe(1);

        pool.add(new TokenTransaction({
            timestamp: 0,
            fromAddress: "asdf",
            rulesetId: RulesetIds.token,
            data: ["fdsa", 0]
        }));
        // Duplicate entry
        expect(pool.transactions.length).toBe(1);

        pool.add(new TokenTransaction({
            timestamp: 1,
            fromAddress: "asdf",
            rulesetId: RulesetIds.token,
            data: ["fdsa", 0]
        }));
        expect(pool.transactions.length).toBe(2);
    });

    test("addRange", () => {
        const pool = new TransactionPool();
        pool.addRange([
            new TokenTransaction({
                timestamp: 0,
                fromAddress: "asdf",
                rulesetId: RulesetIds.token,
                data: ["fdsa", 0]
            }),
            new TokenTransaction({
                timestamp: 1,
                fromAddress: "asdf",
                rulesetId: RulesetIds.token,
                data: ["fdsa", 0]
            }),
            new TokenTransaction({
                timestamp: 2,
                fromAddress: "asdf",
                rulesetId: RulesetIds.token,
                data: ["fdsa", 0]
            }),
            // Duplicate
            new TokenTransaction({
                timestamp: 0,
                fromAddress: "asdf",
                rulesetId: RulesetIds.token,
                data: ["fdsa", 0]
            }),
        ]);
        expect(pool.transactions.length).toBe(3);
    });
});