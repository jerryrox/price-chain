import Transaction from './Transaction';
import TokenTransaction from './TokenTransaction';

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