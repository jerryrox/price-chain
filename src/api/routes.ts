import express from "express";
import app from "../app";
import RulesetIds from "../rulesets/RulesetIds";
import PriceState from "../states/PriceState";
import TokenState from "../states/TokenState";
import Utils from "../utils/Utils";
import ApiHelper from "./helpers/ApiHelper";
import IApiPriceInfo from "./models/IApiPriceInfo";

const routes = express.Router();

routes.get("/get-price", (req, res) => {
    const sku = req.query.sku as string;
    const userAddress = req.query.userAddress as string;
    const from = Utils.tryParseInt(req.query.since as string, Date.now());
    
    const blocks = app.blockchain.blocks;
    for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];
        if (block.timestamp > from) {
            continue;
        }

        const state = block.getStateOfUser(userAddress);
        const priceState = state?.getRulesetState(RulesetIds.price) as PriceState;
        if (priceState === undefined || priceState === null) {
            continue;
        }
        
        const price = priceState.getPrice(sku);
        if (price !== null) {
            const returnData: IApiPriceInfo = {
                basePrice: price.basePrice,
                discountRate: price.discountRate,
                sku: price.sku,
                timestamp: block.timestamp,
                userAddress: state?.userAddress as string
            };
            ApiHelper.sendSuccessResponse(res, returnData);
            return;
        }
    }
    ApiHelper.sendErrorResponse(res, "Could not find price for this item.");
});

routes.get("/get-price-history", (req, res) => {
    const sku = req.query.sku as string;
    const userAddress = req.query.userAddress as string;
    const from = Utils.tryParseInt(req.query.from as string, 0);
    const to = Utils.tryParseInt(req.query.to as string, Date.now());
    
    const blocks = app.blockchain.blocks;
    const prices: IApiPriceInfo[] = [];
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (block.timestamp < from) {
            continue;
        }
        if (block.timestamp > to) {
            break;
        }

        const state = block.getStateOfUser(userAddress);
        const priceState = state?.getRulesetState(RulesetIds.price) as PriceState;
        if (priceState === undefined || priceState === null) {
            continue;
        }
        
        const price = priceState.getPrice(sku);
        if (price !== null) {
            prices.push({
                basePrice: price.basePrice,
                discountRate: price.discountRate,
                sku: price.sku,
                timestamp: block.timestamp,
                userAddress: state?.userAddress as string
            });
        }
    }
    ApiHelper.sendSuccessResponse(res, prices);
});

routes.get("/get-balance", (req, res) => {
    const userAddress = req.query.userAddress as string;
    
    const blocks = app.blockchain.blocks;
    for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];
        const state = block.getStateOfUser(userAddress);
        const tokenState = state?.getRulesetState(RulesetIds.token) as TokenState;
        if (tokenState === null || tokenState === undefined) {
            continue;
        }

        ApiHelper.sendSuccessResponse(res, tokenState.balance);
        return;
    }
    ApiHelper.sendSuccessResponse(res, 0);
});

export default routes;