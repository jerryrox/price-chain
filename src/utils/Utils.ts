class Utils {

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
