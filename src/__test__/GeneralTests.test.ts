import PriceTransaction from '../transactions/PriceTransaction';
import RulesetProvider from "../rulesets/RulesetProvider";
import PriceModel from '../models/PriceModel';
import Blockchain from '../blockchain/Blockchain';
describe("Tests for general code", () => {
    test("Overriding toString() and use in template literal", () => {
        class Dummy {
            toString(): string {
                return "Lolz";
            }
        }
        expect(`${new Dummy()}/${new Dummy()}`).toBe("Lolz/Lolz");
    });

    test("Spread operator on a Record instance", () => {
        const rec: Record<string, number> = {};
        rec["asdf"] = 5;
        rec["fdsa"] = 6;
        expect(rec["asdf"]).toBe(5);
        expect(rec["fdsa"]).toBe(6);

        const newRec = { ...rec };
        expect(newRec["asdf"]).toBe(5);
        expect(newRec["fdsa"]).toBe(6);
    });

    test("Splicing array in a different function", () => {
        const spliceArray = (arr: number[]) => {
            arr.splice(1, 2);
        };

        const array = [0, 1, 2, 3, 4];
        spliceArray(array);
        expect(array.length).toBe(3);
        expect(array).toMatchObject([0, 3, 4]);
    });
});