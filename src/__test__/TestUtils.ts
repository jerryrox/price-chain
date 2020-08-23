import Block from '../blockchain/Block';
import { IBlockCalculateHashParam } from '../blockchain/Block';

class TestUtils {

    /**
     * Mines the block of specified data and outputs the result to console while returning it.
     */
    mineForLog(param: IBlockCalculateHashParam): string {
        while (true) {
            const hash = Block.calculateHash(param);
            if (Block.hashMatchesDifficulty(hash, param.difficulty)) {
                console.log(`mineForLog - Found nonce ${param.nonce} with hash: ${hash}`);
                return hash;
            }
            param.nonce++;
        }
    }
}
export default new TestUtils();