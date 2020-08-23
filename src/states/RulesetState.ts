import IHasStructure from "../utils/IHasStructure";

export default abstract class RulesetState implements IHasStructure {
    
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
}
