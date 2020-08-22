import Crypto from "../utils/Crypto";
import { text } from "body-parser";

describe("Crypto", () => {
    test("getHash", () => {
        expect(Crypto.getHash("hello")).toBe("hello");
    });
    test("getMerkleRoot", () => {
        expect(Crypto.getMerkleRoot(["a", "b", "c", "d", "e", "f"])).toBe("abcdef");
        expect(Crypto.getMerkleRoot(["a", "b", "c", "d", "e", "f", "g"])).toBe("abcdefg");
        expect(Crypto.getMerkleRoot(["a"])).toBe("a");
        expect(Crypto.getMerkleRoot(["a", "b"])).toBe("ab");
    });
});