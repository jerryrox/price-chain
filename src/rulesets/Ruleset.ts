import Transaction from "../transactions/Transaction";
import StateBuilder from '../states/StateBuilder';
import State from '../states/State';
import { IParamConstructor } from "../utils/Types";

interface IRulesetParam {
    rulesetId: string;
}

export default abstract class Ruleset {

    readonly rulesetId: string;

    constructor(param: IRulesetParam) {
        this.rulesetId = param.rulesetId;
    }

    /**
     * Returns the RulesetState constructor appropriate for this Ruleset.
     */
    abstract getStateConstructor(): IParamConstructor<any>;

    /**
     * Returns the Transaction constructor appropriate for this Ruleset.
     */
    abstract getTxConstructor(): IParamConstructor<any>;

    /**
     * Generates and feeds new states for the specified state builder.
     * Returns the new states if successful.
     */
    abstract buildState(stateBuilder: StateBuilder, transaction: Transaction): State[] | null;
}
