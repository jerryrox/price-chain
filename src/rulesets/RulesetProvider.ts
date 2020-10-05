import TokenRuleset from './TokenRuleset';
import PriceRuleset from './PriceRuleset';
import Ruleset from './Ruleset';
import RulesetIds from "./RulesetIds";
import { IParamConstructor } from "../utils/Types";

class RulesetProvider {

    readonly rulesets = {
        token: new TokenRuleset({
            rulesetId: RulesetIds.token
        }),
        price: new PriceRuleset({
            rulesetId: RulesetIds.price
        }),
    };

    /**
     * Returns the ruleset instance of specified id.
     */
    getRuleset(rulesetId: string): Ruleset | null {
        return Object.values(this.rulesets).find((r) => r.rulesetId === rulesetId) ?? null;
    }

    /**
     * Returns the RulesetState constructor corresponding to the specified ruleset id.
     */
    getStateConstructor(rulesetId: string): IParamConstructor<any> | null {
        return this.getRuleset(rulesetId)?.getStateConstructor() ?? null;
    }

    /**
     * Returns the Transaction constructor corresponding to the specified ruleset id.
     */
    getTxConstructor(rulesetId: string): IParamConstructor<any> | null {
        return this.getRuleset(rulesetId)?.getTxConstructor() ?? null;
    }
}
export default new RulesetProvider();