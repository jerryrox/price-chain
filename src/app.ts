import Blockchain from "./blockchain/Blockchain";
import MiningAgent from "./mining/MiningAgent";
import TransactionPool from "./transactions/TransactionPool";
import Environment from "./utils/Environment";

class App {
    
    /**
     * The base interval between mining attempts.
     */
    readonly miningInterval = 1000 * 5;

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

        this.doMining();
    }

    /**
     * Performs mining every set interval.
     */
    private doMining() {
        if (!this.miningAgent.hasMiner) {
            return;
        }

        console.log("Attempting to mine block ...");
        const result = this.miningAgent.mine();
        if (result !== null) {
            if (this.blockchain.addNewBlock(result)) {
                console.log(`Mined block index: ${result.index}`);// , result);
            }
        }
        setTimeout(() => this.doMining(), this.miningInterval);
    }
}
export default new App();