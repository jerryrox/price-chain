import Blockchain from '../blockchain/Blockchain';
import TransactionPool from '../transactions/TransactionPool';
import Utils from "../utils/Utils";

export default class MiningAgent {

    readonly blockchain: Blockchain;
    readonly pool: TransactionPool;

    private isAutoMine = false;

    get autoMine(): boolean {
        return this.isAutoMine;
    }
    set autoMine(value: boolean) {
        this.isAutoMine = value;
    }

    constructor(blockchain: Blockchain, pool: TransactionPool) {
        this.blockchain = blockchain;
        this.pool = pool;
    }

    mine() {
        // let didMine = false;
        // while (!didMine) {
        //     // Forcibly break out if there's nothing to mine.
        //     const transactions = this.pool.pickTransactions(Utils.maxTransactionPerBlock);
        //     if (transactions.length === 0) {
        //         break;
        //     }

        //     const difficulty = this.blockchain.getCurrentDifficulty();
        //     const timestamp = Utils.getTimestamp();

        // }
    }
}