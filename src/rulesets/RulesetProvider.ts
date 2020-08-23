import TokenRuleset from './TokenRuleset';
import PriceRuleset from './PriceRuleset';
import Utils from "../utils/Utils";
import Ruleset from './Ruleset';

class RulesetProvider {

    readonly tokenRuleset = new TokenRuleset({
        rulesetId: "0cdcf8870d70f8c34662c35378ed4c31d9da4edffd555ef68f25b3c315424f0a"
    });
    readonly priceRuleset = new PriceRuleset({
        rulesetId: "29e20ae7792f177f4c72bc6d5f5df0689a31b4a29f0a7727cd438b4d4d035bb3"
    });

    readonly rulesets = {
        [this.tokenRuleset.rulesetId]: this.tokenRuleset,
        [this.priceRuleset.rulesetId]: this.priceRuleset,
    };


    /**
     * Returns the ruleset instance of specified id.
     */
    getRuleset(rulesetId: string): Ruleset | null {
        return this.rulesets[rulesetId] ?? null;
    }

    /**
     * Returns whether there is a ruleset of specified id.
     */
    hasRuleset(rulesetId: string): boolean {
        return !Utils.isNullOrUndefined(this.rulesets[rulesetId]);
    }
}
export default new RulesetProvider();