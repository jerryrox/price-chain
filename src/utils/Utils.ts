class Utils {

  /**
   * Number of milliseconds expected to mine a block.
   */
  readonly expectedBlocktime = 60 * 60 * 1000;

  /**
   * Number of blocks to be mined before triggering difficulty change.
   */
  readonly difficultyInterval = 10;
  
  /**
   * Minimum mining difficulty.
   */
  readonly minDifficulty = 1;

  /**
   * Max number transactions that can be included in a block.
   */
  readonly maxTransactionPerBlock = 60;

  /**
   * Max number of milliseconds offset the timestamp validation should be forgiving
   */
  readonly timestampLeniency = 60 * 1000;

  /**
   * Returns whether the specified value is null or undefined.
   */
  isNullOrUndefined(value: any) {
    return value === null || value === undefined;
  }

  /**
   * Returns the timestamp in milliseconds since epoch.
   */
  getTimestamp(date?: Date): number {
    const newDate = date ?? new Date();
    return Date.UTC(
      newDate.getUTCFullYear(),
      newDate.getUTCMonth(),
      newDate.getUTCDate(),
      newDate.getUTCHours(),
      newDate.getUTCMinutes(),
      newDate.getUTCSeconds(),
      newDate.getUTCMilliseconds()
    );
  }
}
export default new Utils();
