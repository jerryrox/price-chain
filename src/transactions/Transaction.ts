import Crypto from "../utils/Crypto";
import Utils from "../utils/Utils";

export interface ITransactionParam {
    ruleset: string;
    stateId: string;
    fromAddress: string;
    data: any[];
}

export default abstract class Transaction {

    readonly ruleset: string;
    readonly fromAddress: string;
    readonly data: any[];


    constructor(param: ITransactionParam) {
        this.ruleset = param.ruleset;
        this.fromAddress = param.fromAddress;
        this.data = param.data;

        if (!this.isValidStructure()) {
            throw new Error(`The transaction was created with invalid parameters!`);
        }
    }

    /**
     * Returns whether this transaction has a valid structure.
     * May throw an error during validation.
     */
    isValidStructure(): boolean {
        if (this.ruleset.length === 0) {
            return false;
        }
        if (this.fromAddress.length === 0) {
            return false;
        }
        if (Utils.isNullOrUndefined(this.data)) {
            return false;
        }
        return true;
    }

    /**
     * Calculates and returns the hash of the transaction.
     */
    getHash(): string {
        const dataString = `${this.ruleset},${this.stateId},${this.fromAddress},${this.data.join(",")}`;
        return Crypto.getHash(dataString);
    }
}

