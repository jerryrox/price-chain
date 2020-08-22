import CryptoUtils from "../utils/CryptoUtils";
import Utils from "../utils/Utils";
import IHashable from '../utils/IHashable';
import IHasStructure from '../utils/IHasStructure';

export interface ITransactionParam {
    rulsetId: string;
    stateId: string;
    fromAddress: string;
    data: any[];
}

export default abstract class Transaction implements IHashable, IHasStructure {

    readonly ruleset: string;
    readonly fromAddress: string;
    readonly data: any[];


    constructor(param: ITransactionParam) {
        this.ruleset = param.rulsetId;
        this.fromAddress = param.fromAddress;
        this.data = param.data;

        if (!this.isValidStructure()) {
            throw new Error(`The transaction was created with invalid parameters!`);
        }
    }

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

    getHash(): string {
        const dataString = `${this.ruleset},${this.fromAddress},${this.data.join(",")}`;
        return CryptoUtils.getHash(dataString);
    }
}

