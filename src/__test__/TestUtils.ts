import Block from '../blockchain/Block';
import { IBlockCalculateHashParam } from '../blockchain/Block';

class TestUtils {

    /**
     * Mines the block of specified data and outputs the result to console while returning it.
     */
    mine(param: IBlockCalculateHashParam, logResult: boolean = true): Block {
        while (true) {
            const hash = Block.calculateHash(param);
            if (Block.hashMatchesDifficulty(hash, param.difficulty)) {
                if (logResult) {
                    console.log(`mine - Found nonce ${param.nonce} with hash: ${hash}`);
                }
                return new Block(param);
            }
            param.nonce++;
        }
    }
}
export default new TestUtils();