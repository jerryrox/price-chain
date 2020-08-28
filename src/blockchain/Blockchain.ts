import Block from './Block';
import TokenState from '../states/TokenState';
import RulesetProvider from "../rulesets/RulesetProvider";
import State from "../states/State";
import PriceState from '../states/PriceState';
import PriceModel from '../models/PriceModel';
import PriceTransaction from '../transactions/PriceTransaction';
import Utils from "../utils/Utils";
import IHasStructure from '../utils/IHasStructure';

export default class Blockchain implements IHasStructure {

    static readonly genesisBlock = new Block({
        minerAddress: "",
        difficulty: 1,
        index: 0,
        nonce: 34,
        previousHash: "",
        timestamp: 1410955800000,
        transactions: {
            "5b1a5eadeee770ad4c99fed67a3324a3eb03deecd36ee8c4b380079bcc2ed3e7": new PriceTransaction({
                rulesetId: RulesetProvider.priceRuleset.rulesetId,
                fromAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
                data: [
                    new PriceModel({
                        sku: "4549767092386",
                        basePrice: 19.05,
                        discountRate: 0,
                    }),
                ]
            }),
        },
        states: {
            "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c": new State({
                userAddress: "02ec78b6f513f5a9eb3bc308ae670e1bbe35485fec151b32b602073fa0db31ef8c",
                rulesetStates: [
                    new TokenState({
                        balance: 10000,
                        rulesetId: RulesetProvider.tokenRuleset.rulesetId
                    }),
                    new PriceState({
                        rulesetId: RulesetProvider.priceRuleset.rulesetId,
                        prices: {
                            "4549767092386": new PriceModel({ // eslint-disable-line
                                sku: "4549767092386",
                                basePrice: 19.05,
                                discountRate: 0,
                            }),
                        }
                    }),
                ]
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
        if (!prevBlock.isValidStructure() || !block.isValidStructure()) {
            return false;
        }
        if (Math.abs(prevBlock.difficulty - block.difficulty) > 1) {
            return false;
        }
        if (block.index - 1 !== prevBlock.index) {
            return false;
        }
        if (block.previousHash !== prevBlock.hash) {
            return false;
        }
        // If timestamp out-of-sync by more than 60 seconds, it should be invalid.
        if ((block.timestamp < prevBlock.timestamp - 60000) ||
            (Utils.getTimestamp() < block.timestamp - 60000)) {
            return false;
        }
        // A miner address must be present if not the genesis block.
        if (prevBlock.index !== Blockchain.genesisBlock.index &&
            prevBlock.minerAddress.length === 0) {
            return false;
        }
        return true;
    }

    isValidStructure(): boolean {
        const firstBlock = this.firstBlock;
        if (!firstBlock.isValidStructure()) {
            return false;
        }

        // List of block indices for which a reward transaction can be validated against.
        // For example, if a reward transaction's reward refrence block index is a value that exists
        // in this list, the list element can be removed, indicating that the reward is valid.
        // If does not exist, however, the reward transaction must be a fake one.
        const pendingRewardBlockIndex = this.getAllBlockIndex(false);
        for (let i = 1; i < this.blocks.length; i++) {
            const curBlock = this.blocks[i];
            const prevBlock = this.blocks[i - 1];
            if (!Blockchain.isValidChain(curBlock, prevBlock)) {
                return false;
            }

            if (!this.verifyRewardBlockInx(curBlock, pendingRewardBlockIndex)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Returns whether the specified block index references a valid index of the block
     * which a reward can be claimed for.
     */
    isValidRewardBlockInx(blockIndex: number): boolean {
        const pendingRewardBlockIndex = this.getAllBlockIndex(false);
        for (let i = 1; i < this.blocks.length; i++) {
            if (!this.verifyRewardBlockInx(this.blocks[i], pendingRewardBlockIndex)) {
                return false;
            }
        }
        return pendingRewardBlockIndex.includes(blockIndex);
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
     * Returns the list of all blocks' indices.
     */
    getAllBlockIndex(includeGenesis: boolean): number[] {
        const blockIndexes = this.blocks.map((b) => b.index);
        if (!includeGenesis) {
            const genBlockIndexPos = blockIndexes.indexOf(Blockchain.genesisBlock.index);
            if (genBlockIndexPos >= 0) {
                blockIndexes.splice(genBlockIndexPos, 1);
            }
        }
        return blockIndexes;
    }

    /**
     * Tries verifying that the given block index is a valid block index which a reward
     * can be claimed for.
     * Returns whether the verification is successful.
     */
    private verifyRewardBlockInx(block: Block, pendingIndexes: number[]): boolean {
        const rewardTx = block.getRewardTransaction();
        if (rewardTx !== null) {
            const listIndex = pendingIndexes.indexOf(rewardTx.rewardRefBlock);
            if (listIndex < 0 || listIndex >= pendingIndexes.length) {
                return false;
            }
            pendingIndexes.splice(listIndex, 1);
        }
        return true;
    }
}