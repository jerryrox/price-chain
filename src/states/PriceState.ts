import PriceModel from "../models/PriceModel";
import RulesetState from "./RulesetState";

interface IPriceStateParam {
    prices: Record<string, PriceModel>;
    rulesetId: string;
}

export default class PriceState extends RulesetState {

    readonly prices: Record<string, PriceModel>;

    constructor(param: IPriceStateParam) {
        super(param.rulesetId);
        this.prices = param.prices;
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
}
