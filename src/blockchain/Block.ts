import State from "../states/State";
import Transaction from "../transactions/Transaction";
import IHashable from "../utils/IHashable";
import CryptoUtils from "../utils/CryptoUtils";
import IHasStructure from '../utils/IHasStructure';
import TokenTransaction from '../transactions/TokenTransaction';

interface IBlockParam {
    index: number;
    previousHash: string;
    timestamp: number;
    nonce: number;
    difficulty: number;
    minerAddress: string;

    states?: Record<string, State>;
    transactions?: Record<string, Transaction>;
}

export interface IBlockCalculateHashParam extends IBlockParam {
    stateMerkleRoot?: string | null,
    txMerkleRoot?: string | null
}

export default class Block implements IHashable, IHasStructure {

    readonly hash: string;
    readonly stateMerkleRoot: string;
    readonly txMerkleRoot: string;

    readonly index: number;
    readonly previousHash: string;
    readonly timestamp: number;
    readonly nonce: number;
    readonly difficulty: number;
    readonly minerAddress: string;

    /**
     * Dictionary of states mapped to userAddress value.
     */
    readonly states: Record<string, State>;
    /**
     * Dictionary of transactions mapped to their hashes.
     */
    readonly transactions: Record<string, Transaction>;

    /**
     * Returns the amount of rewards that should be given for mining this block.
     */
    get rewardAmount(): number {
        return 20;
    }

    constructor(param: IBlockParam) {
        this.index = param.index;
        this.previousHash = param.previousHash;
        this.timestamp = param.timestamp;
        this.nonce = param.nonce;
        this.difficulty = param.difficulty;
        this.minerAddress = param.minerAddress;

        this.states = param.states ?? {};
        this.transactions = param.transactions ?? {};

        // Caching hash values.
        this.stateMerkleRoot = Block.calculateMerkleRoot(Object.values(this.states));
        this.txMerkleRoot = Block.calculateMerkleRoot(Object.values(this.transactions));
        this.hash = this.getHash();
    }

    /**
     * Calculates the hash of the specified parameters using the Block's hash rules.
     */
    static calculateHash({
        difficulty,
        index,
        minerAddress,
        nonce,
        previousHash,
        timestamp,
        stateMerkleRoot,
        states,
        transactions,
        txMerkleRoot
    }: IBlockCalculateHashParam): string {
        const smr = (
            stateMerkleRoot ??
            Block.calculateMerkleRoot(Object.values(states as any))
        );
        const tmr = (
            txMerkleRoot ??
            Block.calculateMerkleRoot(Object.values(transactions as any))
        );
        const dataString = `${index}${previousHash}${timestamp}${nonce}${difficulty}${minerAddress}${smr}${tmr}`;
        return CryptoUtils.getHash(dataString);
    }

    /**
     * Returns whether the specified hash matches the difficulty.
     */
    static hashMatchesDifficulty(hash: string, difficulty: number): boolean {
        return hash.startsWith("0".repeat(difficulty));
    }

    /**
     * Returns the merkle root of the specified hashable values.
     */
    private static calculateMerkleRoot(values: IHashable[]): string {
        return CryptoUtils.getMerkleRoot(values.map((v) => v.getHash()));
    }

    isValidStructure() {
        // Just making sure here that all the cached hash values can be reproduced correctly.
        if (this.stateMerkleRoot !== Block.calculateMerkleRoot(Object.values(this.states))) {
            return false;
        }
        if (this.txMerkleRoot !== Block.calculateMerkleRoot(Object.values(this.transactions))) {
            return false;
        }
        // States & Transactions key/value mapping and values shouldn't be tampered.
        const stateKeys = Object.keys(this.states);
        for (let i = 0; i < stateKeys.length; i++) {
            const key = stateKeys[i];
            if (key !== this.states[key].userAddress) {
                return false;
            }
            if (!this.states[key].isValidStructure()) {
                return false;
            }
        }
        const txKeys = Object.keys(this.transactions);
        for (let i = 0; i < txKeys.length; i++) {
            const key = txKeys[i];
            if (key !== this.transactions[key].hash) {
                return false;
            }
            if (!this.transactions[key].isValidStructure()) {
                return false;
            }
        }

        if (this.hash !== this.getHash()) {
            return false;
        }
        if (!Block.hashMatchesDifficulty(this.hash, this.difficulty)) {
            return false;
        }
        return true;
    }

    getHash(): string {
        return Block.calculateHash({
            index: this.index,
            difficulty: this.difficulty,
            minerAddress: this.minerAddress,
            nonce: this.nonce,
            previousHash: this.previousHash,
            timestamp: this.timestamp,
            stateMerkleRoot: this.stateMerkleRoot,
            txMerkleRoot: this.txMerkleRoot,
        });
    }

    /**
     * Returns the transaction which represents the reward for mining the previous block
     * May return null if doesn't exist.
     */
    getRewardTransaction(): TokenTransaction | null {
        const txs = Object.values(this.transactions);
        for (let i = 0; i < txs.length; i++) {
            const tokenTx = txs[i] as TokenTransaction;
            if (tokenTx !== null && tokenTx.isReward) {
                return tokenTx;
            }
        }
        return null;
    }
}
