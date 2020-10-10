import State from "../states/State";
import Transaction from "../transactions/Transaction";
import IHashable from "../utils/IHashable";
import CryptoUtils from "../utils/CryptoUtils";
import IHasStructure from '../utils/IHasStructure';
import TokenTransaction from '../transactions/TokenTransaction';
import ISerializable from "../utils/ISerializable";
import ObjectSerializer from "../utils/ObjectSerializer";
import RulesetProvider from "../rulesets/RulesetProvider";
import Utils from "../utils/Utils";

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

export default class Block implements IHashable, ISerializable, IHasStructure {

    hash: string;
    stateMerkleRoot: string;
    txMerkleRoot: string;

    index: number;
    previousHash: string;
    timestamp: number;
    nonce: number;
    difficulty: number;
    minerAddress: string;

    /**
     * Dictionary of states mapped to userAddress value.
     */
    states: Record<string, State>;
    /**
     * Dictionary of transactions mapped to their hashes.
     */
    transactions: Record<string, Transaction>;

    constructor(param?: IBlockParam) {
        this.index = param?.index ?? 0;
        this.previousHash = param?.previousHash ?? "";
        this.timestamp = param?.timestamp ?? 0;
        this.nonce = param?.nonce ?? 0;
        this.difficulty = param?.difficulty ?? 0;
        this.minerAddress = param?.minerAddress ?? "";

        this.states = param?.states ?? {};
        this.transactions = param?.transactions ?? {};

        // Caching hash values.
        this.stateMerkleRoot = CryptoUtils.getMerkleRootForHashable(Object.values(this.states));
        this.txMerkleRoot = CryptoUtils.getMerkleRootForHashable(Object.values(this.transactions));
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
            CryptoUtils.getMerkleRootForHashable(Object.values(states as any))
        );
        const tmr = (
            txMerkleRoot ??
            CryptoUtils.getMerkleRootForHashable(Object.values(transactions as any))
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
     * Returns the list of reward transactions in the block.
     */
    getRewardTransactions(): TokenTransaction[] {
        const txs = Object.values(this.transactions);
        const rewards: TokenTransaction[] = [];
        for (let i = 0; i < txs.length; i++) {
            const tokenTx = txs[i] as TokenTransaction;
            if (tokenTx !== null && tokenTx.isReward) {
                rewards.push(tokenTx);
            }
        }
        return rewards;
    }

    /**
     * Returns all states in this block.
     */
    getAllStates(): State[] {
        return Object.values(this.states);
    }

    /**
     * Finds and return the state of specified user address.
     */
    getStateOfUser(userAddress: string): State | null{
        return this.states[userAddress] ?? null;
    }

    isValidStructure() {
        // Just making sure here that all the cached hash values can be reproduced correctly.
        const stateMR = CryptoUtils.getMerkleRootForHashable(Object.values(this.states));
        if (this.stateMerkleRoot !== stateMR) {
            // console.log("Block A");
            return false;
        }
        const txMR = CryptoUtils.getMerkleRootForHashable(Object.values(this.transactions));
        if (this.txMerkleRoot !== txMR) {
            // console.log("Block B");
            return false;
        }
        // States & Transactions key/value mapping and values shouldn't be tampered.
        const stateKeys = Object.keys(this.states);
        for (let i = 0; i < stateKeys.length; i++) {
            const key = stateKeys[i];
            if (key !== this.states[key].userAddress) {
                // console.log("Block C");
                return false;
            }
            if (!this.states[key].isValidStructure()) {
                // console.log("Block D");
                return false;
            }
        }
        const txKeys = Object.keys(this.transactions);
        for (let i = 0; i < txKeys.length; i++) {
            const key = txKeys[i];
            if (key !== this.transactions[key].hash) {
                // console.log("Block E");
                return false;
            }
            if (!this.transactions[key].isValidStructure()) {
                // console.log("Block F");
                return false;
            }
        }
        if (this.hash !== this.getHash()) {
            // console.log("Block G");
            return false;
        }
        if (!Block.hashMatchesDifficulty(this.hash, this.difficulty)) {
            // console.log("Block H");
            return false;
        }
        return true;
    }

    /**
     * Verifies that the reward transaction has been included correctly.
     * This should only be called for non-genesis block.
     * Returns whether the verification is successful.
     */
    hasValidReward() {
        const rewards = this.getRewardTransactions();
        // There must only be one reward transaction,
        // and it mustn't be the only transaction in the block.
        if (rewards.length !== 1 || Object.keys(this.transactions).length <= 1) {
            return false;
        }
        const tx = rewards[0];
        if (tx.rewardRefBlock !== this.index ||
            tx.amount !== Utils.miningReward) {
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

    serialize(): Record<string, any> {
        return ObjectSerializer.serialize(this);
    }

    deserialize(data: Record<string, any>) {
        ObjectSerializer.deserialize(data, this, {
            states: ObjectSerializer.getMapDeserializer(State),
            transactions: ObjectSerializer.getCheckedMapDeserializer(
                (value) => RulesetProvider.getTxConstructor(value.rulesetId)
            ),
        });
    }
}
