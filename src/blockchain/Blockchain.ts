import Block from './Block';
import TokenState from '../states/TokenState';
import State from "../states/State";
import PriceState from '../states/PriceState';
import PriceModel from '../models/PriceModel';
import PriceTransaction from '../transactions/PriceTransaction';
import Utils from "../utils/Utils";
import IHasStructure from '../utils/IHasStructure';
import RulesetIds from "../rulesets/RulesetIds";

export default class Blockchain implements IHasStructure {

    static readonly genesisTransaction = new PriceTransaction({
        timestamp: 1410955800000,
        rulesetId: RulesetIds.price,
        fromAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
        data: [
            new PriceModel(1410955800000, {
                sku: "4549767092386",
                basePrice: 19.05,
                discountRate: 0,
            }),
        ]
    });

    static readonly genesisBlock = new Block({
        minerAddress: "",
        difficulty: 1,
        index: 0,
        nonce: 26,
        previousHash: "",
        timestamp: 1410955800000,
        transactions: {
            [Blockchain.genesisTransaction.hash]: Blockchain.genesisTransaction,
        },
        states: {
            "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c": new State({
                userAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
                rulesetStates: {
                    [RulesetIds.token]: new TokenState({
                        balance: 10000,
                    }),
                    [RulesetIds.price]: new PriceState({
                        prices: {
                            "4549767092386": new PriceModel(1410955800000, { // eslint-disable-line
                                sku: "4549767092386",
                                basePrice: 19.05,
                                discountRate: 0,
                            }),
                        }
                    }),
                }
            })
        },
    });

    blocks: Block[];

    /**
     * Returns the first block in the chain.
     * Equivalent to the genesis block.
     */
    get firstBlock(): Block {
        return this.blocks[0];
    }
    /**
     * Returns the last (newest) block in the chain.
     */
    get lastBlock(): Block {
        return this.blocks[this.blocks.length - 1];
    }

    constructor() {
        this.blocks = [Blockchain.genesisBlock];
    }

    /**
     * Returns whether the chaining of two specified blocks is valid.
     */
    static isValidChain(block: Block, prevBlock: Block): boolean {
        if (!block.isValidStructure()) {
            // console.log("A");
            return false;
        }
        if (!prevBlock.isValidStructure()) {
            // console.log("B");
            return false;
        }
        if (Math.abs(prevBlock.difficulty - block.difficulty) > 1) {
            // console.log("C");
            return false;
        }
        if (block.index - 1 !== prevBlock.index) {
            // console.log("D");
            return false;
        }
        if (block.previousHash !== prevBlock.hash) {
            // console.log("E");
            return false;
        }
        // If timestamp out-of-sync by more than the leniency, it should be invalid.
        if ((block.timestamp < prevBlock.timestamp - Utils.timestampLeniency) ||
            (Utils.getTimestamp() < block.timestamp - Utils.timestampLeniency)) {
                // console.log("F");
            return false;
        }
        // A miner address must be present if not the genesis block.
        if (prevBlock.index !== Blockchain.genesisBlock.index &&
            prevBlock.minerAddress.length === 0) {
            // console.log("G");
            return false;
        }
        if (!block.hasValidReward()) {
            return false;
        }
        return true;
    }

    isValidStructure(): boolean {
        const firstBlock = this.firstBlock;
        if (!firstBlock.isValidStructure()) {
            return false;
        }

        for (let i = 1; i < this.blocks.length; i++) {
            const curBlock = this.blocks[i];
            const prevBlock = this.blocks[i - 1];
            if (!Blockchain.isValidChain(curBlock, prevBlock)) {
                return false;
            }
            if (curBlock.difficulty !== this.calculateDifficulty(curBlock.index)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Adds the specified block to the chain and returns whether it was successful.
     */
    addNewBlock(block: Block): boolean {
        if (!Blockchain.isValidChain(block, this.lastBlock)) {
            return false;
        }
        this.blocks.push(block);
        return true;
    }

    /**
     * Returns the current difficulty of mining.
     */
    getCurrentDifficulty(): number {
        return this.calculateDifficulty(this.blocks.length);
    }

    /**
     * Calculates the appropriate difficulty level at specified block index.
     */
    calculateDifficulty(blockIndex: number): number {
        const intervalIndex = Math.floor(blockIndex / Utils.difficultyInterval);
        if (intervalIndex === 0) {
            return Utils.minDifficulty;
        }
        const highEndBlock = this.blocks[intervalIndex * Utils.difficultyInterval - 1];
        const lowEndBlock = this.blocks[(intervalIndex - 1) * Utils.difficultyInterval];
        const timeDiff = highEndBlock.timestamp - lowEndBlock.timestamp;
        const expectedTime = Utils.expectedBlocktime * (Utils.difficultyInterval - 1);
        if (timeDiff > expectedTime * 2) {
            return Math.max(1, highEndBlock.difficulty - 1);
        }
        if (timeDiff < expectedTime / 2) {
            return highEndBlock.difficulty + 1;
        }
        return highEndBlock.difficulty;
    }

    /**
     * Finds the latest state for the specified user address.
     * May return null if doesn't exist.
     */
    findState(userAddress: string, sinceIndex?: number): State | null {
        const fromIndex = Math.min(sinceIndex ?? (this.blocks.length - 1), this.blocks.length - 1);
        for (let i = fromIndex; i >= 0; i--) {
            const block = this.blocks[i];
            const state = block.states[userAddress];
            if (!Utils.isNullOrUndefined(state)) {
                return state;
            }
        }
        return null;
    }
}