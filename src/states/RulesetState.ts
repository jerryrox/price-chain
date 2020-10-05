import IHasStructure from "../utils/IHasStructure";
import RulesetIds from "../rulesets/RulesetIds";
import ISerializable from "../utils/ISerializable";
import ObjectSerializer from "../utils/ObjectSerializer";

export default abstract class RulesetState implements IHasStructure, ISerializable {
    
    rulesetId: string;

    constructor(rulesetId: string) {
        this.rulesetId = rulesetId;
    }

    isValidStructure(): boolean {
        if (!RulesetIds.list.includes(this.rulesetId)) {
            return false;
        }
        return true;
    }

    serialize(): Record<string, any> {
        return ObjectSerializer.serialize(this);
    }

    deserialize(data: Record<string, any>) {
        ObjectSerializer.deserialize(data, this);
    }
}
