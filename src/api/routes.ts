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

routes.get("/get-chain", (req, res) => {
    ApiHelper.sendSuccessResponse(
        res,
        App.blockchain.blocks.map((b) => b.serialize())
    );
});

routes.get("/get-price", (req, res) => {
    const sku = req.query.sku as string;
    const userAddress = req.query.userAddress as string;
    const from = Utils.tryParseInt(req.query.from as string, Date.now());
    
    const blocks = App.blockchain.blocks;
    for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];
        console.log(`Block timestamp ${block.timestamp} is greater than from ${from}? `, block.timestamp > from);
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