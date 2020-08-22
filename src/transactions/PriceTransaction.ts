import Transaction from './Transaction';

export default class PriceTransaction extends Transaction {

    get businessNumber(): string {
        return this.data[0];
    }
    get sku(): string {
        return this.data[1];
    }
    get price(): number {
        return this.data[2];
    }
    get discountRate(): number {
        return this.data[3];
    }

    isValidStructure(): boolean {
        if (this.data.length !== 4) {
            return false;
        }
        if (this.businessNumber.length !== 13) {
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