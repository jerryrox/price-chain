import RulesetIds from "../rulesets/RulesetIds";
import Utils from "../utils/Utils";
import Transaction from "./Transaction";

export default class TokenTransaction extends Transaction {
    
    get toAddress(): string {
        return this.data[0];
    }
    get amount(): number {
        return this.data[1];
    }

    /**
     * Returns whether this transaction is a reward for mining a block.
     */
    get isReward(): boolean {
        try {
            const rewardBlockInx = this.rewardRefBlock;
            return rewardBlockInx > 0;
        }
        catch (e) {
            return false;
        }
    }
    /**
     * Returns the block number from which the reward transaction is occurring from.
     */
    get rewardRefBlock(): number {
        const blockIndex = parseInt(this.fromAddress, 10);
        if (Number.isNaN(blockIndex) ||
            Utils.isNullOrUndefined(blockIndex) ||
            String(blockIndex).length !== this.fromAddress.length) {
            throw new Error("This transaction is not for rewarding!");
        }
        return blockIndex;
    }

    /**
     * Creates a new token transaction instance representing a reward for mining blocks.
     */
    static newRewardTx(
        timestamp: number, blockIndex: number,
        address: string, reward: number
    ): TokenTransaction {
        return new TokenTransaction({
            timestamp,
            rulesetId: RulesetIds.token,
            fromAddress: blockIndex.toString(),
            data: TokenTransaction.newData(address, reward),
        });
    }

    /**
     * Creates a new instance of data parameter for the token transaction.
     */
    static newData(toAddress: string, amount: number): any[] {
        return [toAddress, amount];
    }

    isValidStructure(): boolean {
        if (this.data.length !== 2) {
            return false;
        }
        if (this.toAddress.length === 0) {
            return false;
        }
        if (this.amount <= 0) {
            return false;
        }
        return super.isValidStructure();
    }
}
