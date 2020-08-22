import IHashable from '../utils/IHashable';
import IHasStructure from '../utils/IHasStructure';
import CryptoUtils from "../utils/CryptoUtils";
import Utils from "../utils/Utils";

export interface IStateParam {
    userAddress: string;
    rulesetId: string;
    data: any[];
}

export default abstract class State implements IHashable, IHasStructure {

    readonly userAddress: string;
    readonly rulesetId: string;
    readonly data: any[];


    constructor(param: IStateParam) {
        this.userAddress = param.userAddress;
        this.rulesetId = param.rulesetId;
        this.data = param.data;
    }

    isValidStructure(): boolean {
        if (this.userAddress.length === 0) {
            return false;
        }
        if (this.rulesetId.length === 0) {
            return false;
        }
        if (Utils.isNullOrUndefined(this.data)) {
            return false;
        }
        return true;
    }

    getHash(): string {
        const dataString = `${this.userAddress},${this.rulesetId},${this.data.join(",")}`;
        return CryptoUtils.getHash(dataString);
    }
}