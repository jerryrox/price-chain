import Transaction from "./Transaction";
import PriceModel from "../models/PriceModel";
import Utils from "../utils/Utils";
import ObjectSerializer from "../utils/ObjectSerializer";

export default class PriceTransaction extends Transaction {
    
    isValidStructure(): boolean {
        for (let i = 0; i < this.data.length; i++) {
            const price = this.data[i] as PriceModel;
            if (Utils.isNullOrUndefined(price)) {
                return false;
            }
            if (!price.isValidStructure()) {
                return false;
            }
        }
        return super.isValidStructure();
    }

    deserialize(data: Record<string, any>) {
        ObjectSerializer.deserialize(data, this, {
            data: (value) => {
                if (Array.isArray(value)) {
                    this.data = value.map((v) => new PriceModel(v));
                }
            }
        });
    }
}
