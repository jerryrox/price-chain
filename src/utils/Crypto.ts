class Crypto {

    /**
     * Returns the hash of the specified value in hex string.
     */
    getHash(value: string): string {
        // TODO: Hashing
        return value;
    }

    /**
     * Returns the merkle root of the specified array of strings.
     */
    getMerkleRoot(values: string[]): string {
        if (values.length === 1) {
            return values[0];
        }
        if (values.length === 2) {
            return this.getHash(values[0] + values[1]);
        }
        const branchedValues: string[] = [];
        const loops = Math.floor(values.length / 2);
        const isOddLength = (values.length % 2) === 1;
        for (let i = 0; i < loops; i++) {
            const firstInx = i * 2;
            branchedValues.push(this.getHash(values[firstInx] + values[firstInx + 1]));
        }
        if (isOddLength) {
            branchedValues.push(values[values.length - 1]);
        }
        return this.getMerkleRoot(branchedValues);
    }
}
export default new Crypto();