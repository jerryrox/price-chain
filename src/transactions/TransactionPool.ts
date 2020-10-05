import Transaction from './Transaction';
import TokenTransaction from './TokenTransaction';
import Utils from "../utils/Utils";

export default class TransactionPool {

    transactions: Transaction[] = [];

    /**
     * Picks the list of transactions to process.
     */
    pickTransactions(maxCount: number): Transaction[] {
        if (this.transactions.length === 0) {
            return [];
        }
        this.sort();
        return this.transactions.slice(0, Math.min(maxCount, this.transactions.length));
    }

    /**
     * Adds the specified transaction to the pool.
     */
    add(transaction: Transaction) {
        const existingTx = this.transactions.find((tx) => tx.hash === transaction.hash);
        if (Utils.isNullOrUndefined(existingTx)) {
            this.transactions.push(transaction);
        }
    }
    
    /**
     * Adds the specified range of transactions to the pool.
     */
    addRange(transactions: Transaction[]) {
        transactions.forEach((tx) => {
            this.add(tx);
        });
    }

    /**
     * Removes the specified transaction from the pool.
     */
    remove(transaction: Transaction | number) {
        let index = -1;
        if (transaction instanceof Transaction) {
            index = this.transactions.indexOf(transaction);
        }
        else {
            index = transaction;
        }
        if (index >= 0 && index < this.transactions.length) {
            this.transactions.splice(index, 1);
        }
    }

    /**
     * Sorts the list of transactions from oldest to newest.
     * Reward transactions will be prioritized to the beginning of the list.
     */
    private sort() {
        this.transactions.sort((x, y) => {
            const isRewardX = (x as TokenTransaction)?.isReward ?? false;
            const isRewardY = (y as TokenTransaction)?.isReward ?? false;
            if ((isRewardX && isRewardY) || (!isRewardX && !isRewardY)) {
                return x.timestamp - y.timestamp;
            }
            return isRewardY ? -1 : 1;
        });
    }
}