import IHashable from '../utils/IHashable';
import IHasStructure from '../utils/IHasStructure';
import CryptoUtils from "../utils/CryptoUtils";
import RulesetState from './RulesetState';

export interface IStateParam {
    userAddress: string;
    rulesetStates: RulesetState[];
}

export default class State implements IHashable, IHasStructure {

    readonly userAddress: string;
    readonly rulesetStates: RulesetState[];


    constructor(param: IStateParam) {
        this.userAddress = param.userAddress;
        this.rulesetStates = param.rulesetStates;
    }

    isValidStructure(): boolean {
        if (this.userAddress.length === 0) {
            return false;
        }
        for (let i = 0; i < this.rulesetStates.length; i++) {
            const state = this.rulesetStates[i];
            if (!state.isValidStructure()) {
                return false;
            }
        }
        return true;
    }

    getHash(): string {
        const dataString = `${this.userAddress},${this.rulesetStates.map((s) => s.getHash()).join(",")}`;
        return CryptoUtils.getHash(dataString);
    }
}