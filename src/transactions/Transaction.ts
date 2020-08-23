import CryptoUtils from "../utils/CryptoUtils";
import Utils from "../utils/Utils";
import IHashable from "../utils/IHashable";
import IHasStructure from "../utils/IHasStructure";

export interface ITransactionParam {
    rulesetId: string;
    fromAddress: string;
    data: any[];
}

export default abstract class Transaction implements IHashable, IHasStructure {
    readonly rulesetId: string;
    readonly fromAddress: string;
    readonly data: any[];

    constructor(param: ITransactionParam) {
        this.rulesetId = param.rulesetId;
        this.fromAddress = param.fromAddress;
        this.data = param.data;

        if (!this.isValidStructure()) {
            throw new Error(
                `The transaction was created with invalid parameters!`
            );
        }
    }

    isValidStructure(): boolean {
        if (this.rulesetId.length === 0) {
            return false;
        }
        if (Utils.isNullOrUndefined(this.fromAddress)) {
            return false;
        }
        if (Utils.isNullOrUndefined(this.data)) {
            return false;
        }
        return true;
    }

    getHash(): string {
        const dataString = `${this.rulesetId}${this.fromAddress}${JSON.stringify(this.data)}`;
        return CryptoUtils.getHash(dataString);
    }
}
