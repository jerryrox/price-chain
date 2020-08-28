import CryptoUtils from "../utils/CryptoUtils";
import Utils from "../utils/Utils";
import IHashable from "../utils/IHashable";
import IHasStructure from "../utils/IHasStructure";
import RulesetProvider from "../rulesets/RulesetProvider";

export interface ITransactionParam {
    timestamp: number;
    rulesetId: string;
    fromAddress: string;
    data: any[];
}

export default abstract class Transaction implements IHashable, IHasStructure {
    readonly hash: string;

    readonly timestamp: number;
    readonly rulesetId: string;
    readonly fromAddress: string;
    readonly data: any[];

    constructor(param: ITransactionParam) {
        this.timestamp = param.timestamp;
        this.rulesetId = param.rulesetId;
        this.fromAddress = param.fromAddress;
        this.data = param.data;

        this.hash = this.getHash();
    }

    isValidStructure(): boolean {
        if (this.hash !== this.getHash()) {
            return false;
        }
        if (!RulesetProvider.hasRuleset(this.rulesetId)) {
            return false;
        }
        if (this.fromAddress.length === 0) {
            return false;
        }
        if (this.timestamp - Utils.timestampLeniency > Utils.getTimestamp()) {
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
        const dataString = `${this.timestamp}${this.rulesetId}${this.fromAddress}${JSON.stringify(this.data)}`;
        return CryptoUtils.getHash(dataString);
    }
}
