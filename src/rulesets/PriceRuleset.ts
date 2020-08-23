import Ruleset from "./Ruleset";
import RulesetState from "../states/RulesetState";
import Transaction from "../transactions/Transaction";
import PriceState from "../states/PriceState";
import PriceTransaction from "../transactions/PriceTransaction";
import Utils from "../utils/Utils";
import PriceModel from "../models/PriceModel";

export default class PriceRuleset extends Ruleset {
    
    evaluateState(oldState: RulesetState, transaction: Transaction): RulesetState | null {
        const oldPriceState = oldState as PriceState;
        const priceTransaction = transaction as PriceTransaction;
        if (Utils.isNullOrUndefined(oldPriceState)) {
            return null;
        }
        if (Utils.isNullOrUndefined(priceTransaction)) {
            return null;
        }

        const newPrices = { ...oldPriceState.prices };
        for (let i = 0; i < priceTransaction.data.length; i++) {
            const price = priceTransaction.data[i] as PriceModel;
            if (Utils.isNullOrUndefined(price)) {
                return null;
            }
            newPrices[price.sku] = price;
        }

        return new PriceState({
            rulesetId: oldPriceState.rulesetId,
            prices: newPrices,
        });
    }
}
