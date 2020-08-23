import Utils from "../utils/Utils";

describe("Utils", () => {
    test("isNullOrUndefined", () => {
        expect(Utils.isNullOrUndefined(null)).toBeTruthy();
        expect(Utils.isNullOrUndefined(undefined)).toBeTruthy();
        expect(Utils.isNullOrUndefined(1)).toBeFalsy();
        expect(Utils.isNullOrUndefined("")).toBeFalsy();
    });

    test("getTimestamp", () => {
        const date = new Date(2020, 7, 10, 17, 10, 0, 0);
        expect(Utils.getTimestamp(date)).toBe(1597036200000);
    });
});