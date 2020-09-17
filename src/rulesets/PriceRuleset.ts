import Ruleset from "./Ruleset";
import Transaction from "../transactions/Transaction";
import PriceState from '../states/PriceState';
import PriceTransaction from "../transactions/PriceTransaction";
import Utils from "../utils/Utils";
import PriceModel from "../models/PriceModel";
import StateBuilder from '../states/StateBuilder';
import State from '../states/State';

export default class PriceRuleset extends Ruleset {
    
    buildState(stateBuilder: StateBuilder, transaction: Transaction): State[] | null {
        const priceTransaction = transaction as PriceTransaction;
        if (Utils.isNullOrUndefined(priceTransaction)) {
            return null;
        }
        if (priceTransaction.data.length === 0) {
            return null;
        }
        const state = this.createState(stateBuilder, priceTransaction);
        if (state === null) {
            return null;
        }
        return [state];
    }

    private createState(
        stateBuilder: StateBuilder, priceTransaction: PriceTransaction
    ): State | null {
        const state = stateBuilder.findState(priceTransaction.fromAddress);

        // Generate new price state
        let priceState = state.getRulesetState(this.rulesetId) as PriceState;
        priceState = priceState?.clone() ?? new PriceState({});
        for (let i = 0; i < priceTransaction.data.length; i++) {
            const price = priceTransaction.data[i] as PriceModel;
            if (Utils.isNullOrUndefined(price)) {
                return null;
            }
            priceState.prices[price.sku] = price;
        }
        state.rulesetStates[this.rulesetId] = priceState;
        return state;
    }
}
