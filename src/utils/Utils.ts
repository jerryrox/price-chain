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
   * Amount of rewarded tokens for mining a new block.
   */
  readonly miningReward = 20;

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

  /**
   * Tries parsing the specified string as an int.
   */
  tryParseInt(value: string, defaultValue: number): number {
    try {
      const num = parseInt(value, 10);
      return Number.isNaN(num) ? defaultValue : num;
    }
    catch {
      return defaultValue;
    }
  }
}
export default new Utils();
