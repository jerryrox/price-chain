import Blockchain from '../blockchain/Blockchain';
import TransactionPool from '../transactions/TransactionPool';
import Utils from "../utils/Utils";
import StateBuilder from '../states/StateBuilder';
import Block, { IBlockCalculateHashParam } from '../blockchain/Block';
import Transaction from '../transactions/Transaction';
import TokenTransaction from "../transactions/TokenTransaction";

export default class MiningAgent {

    readonly blockchain: Blockchain;
    readonly pool: TransactionPool;
    readonly miner: string;

    get hasMiner(): boolean {
        return this.miner.length > 0;
    }

    constructor(blockchain: Blockchain, pool: TransactionPool, miner: string) {
        this.blockchain = blockchain;
        this.pool = pool;
        this.miner = miner;
    }

    mine(): Block | null {
        if (!this.hasMiner) {
            return null;
        }

        const difficulty = this.blockchain.getCurrentDifficulty();
        const timestamp = Utils.getTimestamp();
        const lastBlock = this.blockchain.lastBlock;

        // Pick transactions from the pool and validate them.
        const transactions = this.pool.pickTransactions(Utils.maxTransactionPerBlock);
        for (let i = transactions.length - 1; i >= 0; i--) {
            if (!transactions[i].isValidStructure()) {
                transactions.splice(i, 1);
                this.pool.remove(i);
            }
        }
        
        // Generate new state
        const stateBuilder = new StateBuilder(this.blockchain);
        // For state generation, we use forward loop even if transactions array may change.
        // This is just to be consistent with the state regeneration check.
        for (let i = 0; i < transactions.length; i++) {
            // The transaction may be valid, but state generation could fail.
            // In this case, simply skip this transaction for the next block.
            if (!stateBuilder.feedTransaction(transactions[i])) {
                transactions.splice(i, 1);
                i--;
            }
        }
        if (transactions.length === 0) {
            return null;
        }

        // Feed the reward transaction.
        const rewardTx = TokenTransaction.newRewardTx(
            Date.now(), lastBlock.index + 1, this.miner, Utils.miningReward
        );
        if (!stateBuilder.feedTransaction(rewardTx)) {
            console.log("Failed to feed reward transaction to the state.");
            return null;
        }
        transactions.push(rewardTx);

        // Include all transactions to put into the block.
        const txMap: Record<string, Transaction> = {};
        transactions.forEach((tx) => {
            txMap[tx.hash] = tx;
        });

        // Start mining
        const tempBlock: IBlockCalculateHashParam = {
            difficulty,
            index: lastBlock.index + 1,
            minerAddress: this.miner,
            nonce: 0,
            previousHash: lastBlock.hash,
            timestamp,
            states: stateBuilder.newState,
            transactions: txMap
        };
        while (true) { // eslint-disable-line
            const hash = Block.calculateHash(tempBlock);
            if (!Block.hashMatchesDifficulty(hash, difficulty)) {
                tempBlock.nonce++;
                continue;
            }

            transactions.forEach((tx) => {
                this.pool.remove(tx);
            });
            return new Block(tempBlock);
        }
    }
}