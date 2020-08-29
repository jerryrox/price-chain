import PriceState from '../states/PriceState';
import PriceModel from "../models/PriceModel";
describe("PriceState", () => {
    test("clone", () => {
        const priceState = new PriceState({
            prices: {
                "asdf": new PriceModel({
                    basePrice: 1,
                    discountRate: 0.5,
                    sku: "asdf"
                })
            }
        });
        expect(priceState.getHash()).toBe(priceState.clone().getHash());
    });
});