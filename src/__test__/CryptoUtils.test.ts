import CryptoUtils from "../utils/CryptoUtils";
import { text } from "body-parser";

describe("CryptoUtils", () => {
    test("getHash", () => {
        expect(CryptoUtils.getHash("hello")).toBe("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");

        console.log(`TokenRuleset: ${CryptoUtils.getHash("TokenRuleset")}`);
        console.log(`PriceRuleset: ${CryptoUtils.getHash("PriceRuleset")}`);
    });

    test("generateKeyPair", () => {
        const pair = CryptoUtils.generateKeyPair();
        console.log(`Generated keypair: ${JSON.stringify(pair)}`);
        expect(pair.publicKey.length).not.toBe(0);
        expect(pair.privateKey.length).not.toBe(0);
    });
});