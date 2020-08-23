import IHashable from '../utils/IHashable';
import CryptoUtils from "../utils/CryptoUtils";
import IHasStructure from '../utils/IHasStructure';

interface IPriceModelParam {
    basePrice: number;
    discountRate: number;
    sku: string;
}

export default class PriceModel implements IHashable, IHasStructure {

    readonly basePrice: number;
    readonly discountRate: number;
    readonly sku: string;

    /**
     * Returns the final price calculated by basePrice * (1 - discountRate).
     */
    get finalPrice(): number {
        return this.basePrice * (1 - this.discountRate);
    }


    constructor(param: IPriceModelParam) {
        this.basePrice = param.basePrice;
        this.discountRate = param.discountRate;
        this.sku = param.sku;
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
        return true;
    }

    getHash(): string {
        const dataString = `${this.basePrice}${this.discountRate}${this.sku}`;
        return CryptoUtils.getHash(dataString);
    }
}