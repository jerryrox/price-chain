import PriceModel from "../models/PriceModel";
import RulesetState from "./RulesetState";
import RulesetIds from "../rulesets/RulesetIds";
import IHashable from '../utils/IHashable';
import CryptoUtils from "../utils/CryptoUtils";

interface IPriceStateParam {
    prices?: Record<string, PriceModel>;
}

export default class PriceState extends RulesetState implements IHashable {

    /**
     * Price information mapped to sku.
     */
    readonly prices: Record<string, PriceModel>;

    constructor(param: IPriceStateParam) {
        super(RulesetIds.price);
        this.prices = param.prices ?? {};
    }

    clone(): PriceState {
        return new PriceState({
            prices: { ...this.prices }
        });
    }

    isValidStructure(): boolean {
        const values = Object.values(this.prices);
        for (let i = 0; i < values.length; i++) {
            const price = values[i];
            if (!price.isValidStructure()) {
                return false;
            }
        }
        return super.isValidStructure();
    }

    getHash(): string {
        const valueString = `${JSON.stringify(this.prices)}`;
        return CryptoUtils.getHash(valueString);
    }
}
