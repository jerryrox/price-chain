import IHashable from "../utils/IHashable";
import IHasStructure from "../utils/IHasStructure";
import CryptoUtils from "../utils/CryptoUtils";

export default abstract class RulesetState implements IHashable, IHasStructure {
    
    readonly rulesetId: string;

    constructor(rulesetId: string) {
        this.rulesetId = rulesetId;
    }

    isValidStructure(): boolean {
        if (this.rulesetId.length === 0) {
            return false;
        }
        return true;
    }

    getHash(): string {
        const dataString = `${this.rulesetId}${this.getDataString()}`;
        return CryptoUtils.getHash(dataString);
    }

    /**
     * Returns a string containing the derived type's data to be hashed.
     */
    protected abstract getDataString(): string;
}
