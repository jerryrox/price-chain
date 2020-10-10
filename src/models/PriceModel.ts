import IHashable from '../utils/IHashable';
import CryptoUtils from "../utils/CryptoUtils";
import IHasStructure from '../utils/IHasStructure';
import ISerializable from "../utils/ISerializable";
import ObjectSerializer from "../utils/ObjectSerializer";

interface IPriceModelParam {
    basePrice: number;
    discountRate: number;
    sku: string;
}

export default class PriceModel implements IHashable, ISerializable, IHasStructure {

    basePrice: number;
    discountRate: number;
    sku: string;
    timestamp: number;

    /**
     * Returns the final price calculated by basePrice * (1 - discountRate).
     */
    get finalPrice(): number {
        return this.basePrice * (1 - this.discountRate);
    }


    constructor(timestamp: number, param?: IPriceModelParam) {
        if (arguments.length === 1 && typeof (arguments[0]) !== "number") {
            param = arguments[0];
            timestamp = arguments[0].timestamp;
        }

        this.basePrice = param?.basePrice ?? 0;
        this.discountRate = param?.discountRate ?? 0;
        this.sku = param?.sku ?? "";
        this.timestamp = timestamp;
    }

    isValidStructure(): boolean {
        if (this.basePrice <= 0) {
            return false;
        }
        if (this.discountRate < 0 || this.discountRate > 1) {
            return false;
        }
        if (this.sku.length === 0) {
            return false;
        }
        if (this.timestamp <= 0) {
            return false;
        }
        return true;
    }

    getHash(): string {
        const dataString = `${this.basePrice}${this.discountRate}${this.sku}${this.timestamp}`;
        return CryptoUtils.getHash(dataString);
    }

    serialize(): Record<string, any> {
        return ObjectSerializer.serialize(this);
    }

    deserialize(data: Record<string, any>) {
        ObjectSerializer.deserialize(data, this);
    }
}