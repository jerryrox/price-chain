import State from "../states/State";
import Transaction from "../transactions/Transaction";
import IHashable from "../utils/IHashable";
import CryptoUtils from "../utils/CryptoUtils";
import IHasStructure from '../utils/IHasStructure';

interface IBlockParam {
    index: number;
    previousHash: string;
    timestamp: number;
    nonce: number;
    difficulty: number;

    states: Record<string, State>;
    transactions: Record<string, Transaction>;
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

    readonly states: Record<string, State>;
    readonly transactions: Record<string, Transaction>;

    constructor(param: IBlockParam) {
        this.index = param.index;
        this.previousHash = param.previousHash;
        this.timestamp = param.timestamp;
        this.nonce = param.nonce;
        this.difficulty = param.difficulty;

        this.states = param.states;
        this.transactions = param.transactions;

        // Caching hash values.
        this.stateMerkleRoot = Block.calculateMerkleRoot(Object.values(this.states));
        this.txMerkleRoot = Block.calculateMerkleRoot(Object.values(this.transactions));
        this.hash = this.getHash();
    }

    /**
     * Calculates the hash of the specified parameters using the Block's hash rules.
     */
    static calculateHash(
        index: number,
        prevHash: string,
        timestamp: number,
        nonce: number,
        difficulty: number,
        state: Record<string, State> | string,
        transaction: Record<string, Transaction> | string
    ): string {
        const stateMerkleRoot = (
            typeof (state) === "string" ?
                state :
                Block.calculateMerkleRoot(Object.values(state))
        );
        const txMerkleRoot = (
            typeof (transaction) === "string" ?
                transaction :
                Block.calculateMerkleRoot(Object.values(transaction))
        );
        const dataString = `${index}${prevHash}${timestamp}${nonce}${difficulty}${stateMerkleRoot}${txMerkleRoot}`;
        return CryptoUtils.getHash(dataString);
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
        if (this.hash !== this.getHash()) {
            return false;
        }
        return true;
    }

    getHash(): string {
        return Block.calculateHash(
            this.index,
            this.previousHash,
            this.timestamp,
            this.nonce,
            this.difficulty,
            this.stateMerkleRoot,
            this.txMerkleRoot
        );
    }
}
