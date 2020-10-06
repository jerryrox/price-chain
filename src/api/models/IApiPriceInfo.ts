interface IApiPriceInfo {
    
    userAddress: string;

    timestamp: number;
    
    basePrice: number;
    discountRate: number;
    sku: string;
}
export default IApiPriceInfo;