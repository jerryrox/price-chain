import IHasStructure from "../utils/IHasStructure";
import RulesetIds from "../rulesets/RulesetIds";

export default abstract class RulesetState implements IHasStructure {
    
    readonly rulesetId: string;

    constructor(rulesetId: string) {
        this.rulesetId = rulesetId;
    }

    isValidStructure(): boolean {
        if (!RulesetIds.list.includes(this.rulesetId)) {
            return false;
        }
        return true;
    }
}
