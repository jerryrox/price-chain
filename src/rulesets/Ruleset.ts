import Transaction from '../transactions/Transaction';
import RulesetState from '../states/RulesetState';

interface IRulesetParam {
    rulesetId: string;
}

export default abstract class Ruleset {

    readonly rulesetId: string;


    constructor(param: IRulesetParam) {
        this.rulesetId = param.rulesetId;
    }

    /**
     * Tries evaluating the transaction with old state to return a new RulesetState.
     * May return null if evaluation failed safely.
     * May throw an error if evaluation failed hard.
     */
    abstract evaluateState(oldState: RulesetState, transaction: Transaction): RulesetState | null;
}