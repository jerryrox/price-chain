import Utils from "../utils/Utils";

describe("Utils", () => {
    test("isNullOrUndefined", () => {
        expect(Utils.isNullOrUndefined(null)).toBeTruthy();
        expect(Utils.isNullOrUndefined(undefined)).toBeTruthy();
        expect(Utils.isNullOrUndefined(1)).toBeFalsy();
        expect(Utils.isNullOrUndefined("")).toBeFalsy();
    });

    test("getTimestamp", () => {
        const date = new Date(2014, 8, 18, 0, 10, 0, 0);
        expect(Utils.getTimestamp(date)).toBe(1410955800000);
    });
});