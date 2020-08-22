import CryptoUtils from "../utils/CryptoUtils";
import { text } from "body-parser";

describe("CryptoUtils", () => {
    test("getHash", () => {
        expect(CryptoUtils.getHash("hello")).toBe("hello");
    });
    test("getMerkleRoot", () => {
        expect(CryptoUtils.getMerkleRoot(["a", "b", "c", "d", "e", "f"])).toBe("abcdef");
        expect(CryptoUtils.getMerkleRoot(["a", "b", "c", "d", "e", "f", "g"])).toBe("abcdefg");
        expect(CryptoUtils.getMerkleRoot(["a"])).toBe("a");
        expect(CryptoUtils.getMerkleRoot(["a", "b"])).toBe("ab");
    });
});