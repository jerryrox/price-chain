describe("Tests for general code", () => {
    test("Overriding toString() and use in template literal", () => {
        class Dummy {
            toString(): string {
                return "Lolz";
            }
        }
        expect(`${new Dummy()}/${new Dummy()}`).toBe("Lolz/Lolz");
    });
});