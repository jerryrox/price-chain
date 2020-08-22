import Transaction from './Transaction';

export default class TokenTransaction extends Transaction {

    get toAddress(): string {
        return this.data[0];
    }
    get amount(): number {
        return this.data[1];
    }

    get isReward(): boolean {
        // TODO: Determine whether this is a reward for mining.
        return false;
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