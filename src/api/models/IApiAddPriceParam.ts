interface IApiAddPriceParam {
    userAddress: string;
    prices: [{
        basePrice: number;
        discountRate: number;
        sku: string;
    }];
}
export default IApiAddPriceParam;