import RulesetState from "./RulesetState";
import RulesetIds from "../rulesets/RulesetIds";

interface ITokenStateParam {
    balance: number;
}

export default class TokenState extends RulesetState {
    
    readonly balance: number;

    constructor(param: ITokenStateParam) {
        super(RulesetIds.token);
        this.balance = param.balance;
    }

    isValidStructure(): boolean {
        if (this.balance < 0) {
            return false;
        }
        return super.isValidStructure();
    }
}
