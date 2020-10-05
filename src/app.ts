import Blockchain from "./blockchain/Blockchain";
import MiningAgent from "./mining/MiningAgent";
import TransactionPool from "./transactions/TransactionPool";
import Environment from "./utils/Environment";

class App {

    readonly blockchain: Blockchain;
    readonly transactionPool: TransactionPool;
    readonly miningAgent: MiningAgent;


    get minerPublicKey(): string {
        return Environment.getEnvValue("MINER_PUBLIC");
    }
    get minerPrivateKey(): string {
        return Environment.getEnvValue("MINER_PRIVATE");
    }


    constructor() {
        this.blockchain = new Blockchain();
        this.transactionPool = new TransactionPool();
        this.miningAgent = new MiningAgent(
            this.blockchain, this.transactionPool, this.minerPublicKey
        );
    }
}
export default new App();