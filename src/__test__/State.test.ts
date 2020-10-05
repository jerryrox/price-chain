import State from '../states/State';
import TokenState from '../states/TokenState';
describe("State", () => {
    test("clone", () => {
        const state = new State({
            rulesetStates: {
                "asdf": new TokenState({
                    balance: 0
                })
            },
            userAddress: "asdf"
        });
        expect(state.getHash()).toBe(state.clone().getHash());
    });
});