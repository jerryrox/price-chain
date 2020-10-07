import express from "express";
import App from "../App";
import PriceModel from "../models/PriceModel";
import RulesetIds from "../rulesets/RulesetIds";
import PriceState from "../states/PriceState";
import TokenState from "../states/TokenState";
import PriceTransaction from "../transactions/PriceTransaction";
import TokenTransaction from "../transactions/TokenTransaction";
import Utils from "../utils/Utils";
import ApiHelper from "./helpers/ApiHelper";
import IApiAddPriceParam from "./models/IApiAddPriceParam";
import IApiPriceInfo from "./models/IApiPriceInfo";

const routes = express.Router();

/**
 * Returns the raw data of blockchain.
 */
routes.get("/get-chain", (req, res) => {
    ApiHelper.sendSuccessResponse(
        res,
        App.blockchain.blocks.map((b) => b.serialize())
    );
});

/**
 * Returns the raw data of a block.
 */
routes.get("/get-block", (req, res) => {
    try {
        const index = parseInt(req.query.index as string, 10);
        ApiHelper.sendSuccessResponse(res, App.blockchain.blocks[index].serialize());
    }
    catch (e) {
        ApiHelper.sendErrorResponse(res, e.message);
    }
});

/**
 * Returns prices of an item across all stores.
 */
routes.get("/get-item-prices", (req, res) => {
    const sku = req.query.sku as string;
    const from = Utils.tryParseInt(req.query.from as string, Date.now());
    
    const prices: Record<string, IApiPriceInfo> = {};
    const blocks = App.blockchain.blocks;
    for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];
        if (block.timestamp > from) {
            continue;
        }

        for (const userAddr of Object.keys(block.states)) {
            // If the price has been retrieved for this user, just continue.
            if (prices[userAddr] !== undefined) {
                continue;
            }
            const priceState = block.states[userAddr].getRulesetState(RulesetIds.price) as PriceState; // eslint-disable-line
            if (priceState === undefined || priceState === null) {
                continue;
            }
            const price = priceState.getPrice(sku);
            if (price !== null) {
                prices[userAddr] = {
                    basePrice: price.basePrice,
                    discountRate: price.discountRate,
                    sku: price.sku,
                    timestamp: block.timestamp,
                    userAddress: userAddr
                };
            }
        }
    }
    ApiHelper.sendSuccessResponse(res, prices);
});

/**
 * Returns the latest prices of all items for a store.
 */
routes.get("/get-items", (req, res) => {
    const userAddress = req.query.userAddress as string;
    const from = Utils.tryParseInt(req.query.from as string, Date.now());
    
    const blocks = App.blockchain.blocks;
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
        
        const prices = Object.values(priceState.prices).map((p): IApiPriceInfo => ({
            basePrice: p.basePrice,
            discountRate: p.discountRate,
            sku: p.sku,
            timestamp: block.timestamp,
            userAddress: state?.userAddress as string
        }));
        ApiHelper.sendSuccessResponse(res, prices);
        return;
    }
    ApiHelper.sendErrorResponse(res, "There are no prices registered by this user.");
});

/**
 * Returns the history of prices for a specific item in a store.
 */
routes.get("/get-price-history", (req, res) => {
    const sku = req.query.sku as string;
    const userAddress = req.query.userAddress as string;
    const from = Utils.tryParseInt(req.query.from as string, 0);
    const to = Utils.tryParseInt(req.query.to as string, Date.now());
    
    const blocks = App.blockchain.blocks;
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

/**
 * Returns the token balance of an address.
 */
routes.get("/get-balance", (req, res) => {
    const userAddress = req.query.userAddress as string;
    
    const blocks = App.blockchain.blocks;
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

/**
 * Registers new prices for specified items.
 */
routes.post("/add-prices", (req, res) => {
    try {
        const param: IApiAddPriceParam = req.body;
        const priceTransaction = new PriceTransaction({
            timestamp: Date.now(),
            fromAddress: param.userAddress,
            rulesetId: RulesetIds.price,
            data: param.prices.map((p) => new PriceModel({
                basePrice: p.basePrice,
                discountRate: p.discountRate,
                sku: p.sku
            }))
        });
        App.transactionPool.add(priceTransaction);
        ApiHelper.sendSuccessResponse(res);
    }
    catch (e) {
        ApiHelper.sendErrorResponse(res, e.message);
    }
});

/**
 * Sends token to another address.
 */
routes.post("/send-token", (req, res) => {
    try {
        const fromAddress = req.body.fromAddress as string;
        const toAddress = req.body.toAddress as string;
        const amount = Utils.tryParseInt(req.body.amount, 0);

        if (amount <= 0) {
            throw new Error("Amount must be greater than 0.");
        }

        const tx = new TokenTransaction({
            fromAddress,
            timestamp: Date.now(),
            rulesetId: RulesetIds.token,
            data: TokenTransaction.newData(toAddress, amount),
        });
        App.transactionPool.add(tx);
        ApiHelper.sendSuccessResponse(res);
    }
    catch (e) {
        ApiHelper.sendErrorResponse(res, e.message);
    }
});

export default routes;