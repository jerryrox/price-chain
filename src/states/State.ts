import IHashable from "../utils/IHashable";
import IHasStructure from "../utils/IHasStructure";
import CryptoUtils from "../utils/CryptoUtils";
import RulesetState from "./RulesetState";
import ISerializable from "../utils/ISerializable";
import ObjectSerializer from "../utils/ObjectSerializer";
import RulesetProvider from "../rulesets/RulesetProvider";

export interface IStateParam {
    userAddress: string;
    rulesetStates?: Record<string, RulesetState>;
}

export default class State implements IHashable, ISerializable, IHasStructure {

    userAddress: string;

    /**
     * Ruleset states mapped to their ruleset ids.
     */
    rulesetStates: Record<string, RulesetState>;

    constructor(param?: IStateParam) {
        this.userAddress = param?.userAddress ?? "";
        this.rulesetStates = param?.rulesetStates ?? {};
    }

    clone(): State {
        return new State({
            rulesetStates: { ...this.rulesetStates },
            userAddress: this.userAddress
        });
    }

    isValidStructure(): boolean {
        if (this.userAddress.length === 0) {
            return false;
        }
        const ids = Object.keys(this.rulesetStates);
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const state = this.rulesetStates[id];
            if (id !== state.rulesetId) {
                return false;
            }
            if (!state.isValidStructure()) {
                return false;
            }
        }
        return true;
    }

    getHash(): string {
        const dataString = `${this.userAddress}${JSON.stringify(this.rulesetStates)}`;
        return CryptoUtils.getHash(dataString);
    }

    /**
     * Returns the ruleset state of specified id, or null if doesn't exist.
     */
    getRulesetState(rulesetId: string): RulesetState | null {
        return this.rulesetStates[rulesetId] ?? null;
    }

    serialize(): Record<string, any> {
        return ObjectSerializer.serialize(this);
    }

    deserialize(data: Record<string, any>) {
        ObjectSerializer.deserialize(data, this, {
            rulesetStates: ObjectSerializer.getCheckedMapDeserializer(
                (value) => RulesetProvider.getStateConstructor(value.rulesetId)
            )
        });
    }
}
