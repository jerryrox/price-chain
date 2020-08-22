import Transaction from './Transaction';

export default class PriceTransaction extends Transaction {

    get sku(): string {
        return this.data[0];
    }
    get price(): number {
        return this.data[1];
    }
    get discountRate(): number {
        return this.data[2];
    }

    isValidStructure(): boolean {
        if (this.data.length !== 3) {
            return false;
        }
        if (this.sku.length === 0) {
            return false;
        }
        if (this.price <= 0) {
            return false;
        }
        if (this.discountRate < 0 || this.discountRate > 1) {
            return false;
        }
        return super.isValidStructure();
    }
}