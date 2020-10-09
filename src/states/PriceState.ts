import PriceModel from "../models/PriceModel";
import RulesetState from "./RulesetState";
import RulesetIds from "../rulesets/RulesetIds";
import IHashable from '../utils/IHashable';
import CryptoUtils from "../utils/CryptoUtils";
import ObjectSerializer from "../utils/ObjectSerializer";

interface IPriceStateParam {
    prices?: Record<string, PriceModel>;
}

export default class PriceState extends RulesetState implements IHashable {

    /**
     * Price information mapped to sku.
     */
    prices: Record<string, PriceModel>;

    constructor(param: IPriceStateParam) {
        super(RulesetIds.price);
        this.prices = param.prices ?? {};
    }

    /**
     * Returns the price information of specified sku.
     */
    getPrice(sku: string): PriceModel | null {
        return this.prices[sku] ?? null;
    }

    /**
     * Returns all prices in this state.
     */
    getAllPrices(): PriceModel[] {
        return Object.values(this.prices);
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

    deserialize(data: Record<string, any>) {
        ObjectSerializer.deserialize(data, this, {
            prices: (value) => {
                if (typeof (value) === "object") {
                    const keys = Object.keys(value);
                    keys.forEach((k) => {
                        this.prices[k] = new PriceModel(value[k]);
                    });
                }
            }
        });
    }
}
