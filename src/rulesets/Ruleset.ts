import Transaction from "../transactions/Transaction";
import StateBuilder from '../states/StateBuilder';
import State from '../states/State';

interface IRulesetParam {
    rulesetId: string;
}

export default abstract class Ruleset {

    readonly rulesetId: string;

    constructor(param: IRulesetParam) {
        this.rulesetId = param.rulesetId;
    }

    /**
     * Generates and feeds new states for the specified state builder.
     * Returns the new states if successful.
     */
    abstract buildState(stateBuilder: StateBuilder, transaction: Transaction): State[] | null;
}
