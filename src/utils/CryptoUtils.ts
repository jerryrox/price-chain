import CryptoJS from "crypto-js";
import * as EC from "elliptic";
import { IKeyPair } from './Types';

class CryptoUtils {

    private ec = new EC.ec("secp256k1"); // eslint-disable-line
    
    /**
     * Returns the hash of the specified value in hex string.
     */
    getHash(value: string): string {
        return CryptoJS.SHA256(value).toString();
    }

    /**
     * Returns the merkle root of the specified array of strings.
     */
    getMerkleRoot(values: string[]): string {
        if (values.length === 0) {
            return "";
        }
        if (values.length === 1) {
            return values[0];
        }
        if (values.length === 2) {
            return this.getHash(values[0] + values[1]);
        }
        // If odd length, duplicate the last entry.
        if (values.length % 2 === 1) {
            values.push(values[values.length - 1]);
        }
        const branchedValues: string[] = [];
        const loops = Math.floor(values.length / 2);
        for (let i = 0; i < loops; i++) {
            const firstInx = i * 2;
            branchedValues.push(this.getHash(values[firstInx] + values[firstInx + 1]));
        }
        return this.getMerkleRoot(branchedValues);
    }

    /**
     * Generates a new random public/private key pair.
     */
    generateKeyPair(): IKeyPair {
        const pair = this.ec.genKeyPair();
        return {
            publicKey: pair.getPublic().encode("hex", true),
            privateKey: pair.getPrivate().toString("hex"),
        };
    }
}
export default new CryptoUtils();