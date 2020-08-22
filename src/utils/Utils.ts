class Utils {

    /**
     * Returns whether the specified value is null or undefined.
     */
    isNullOrUndefined(value: any) {
        return value === null || value === undefined;
    }
}
export default new Utils();