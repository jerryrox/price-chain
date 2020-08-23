import RulesetState from "./RulesetState";

interface ITokenStateParam {
    rulesetId: string;
    balance: number;
}

export default class TokenState extends RulesetState {
    
    readonly balance: number;

    constructor(param: ITokenStateParam) {
        super(param.rulesetId);
        this.balance = param.balance;
    }

    isValidStructure(): boolean {
        if (this.balance < 0) {
            return false;
        }
        return super.isValidStructure();
    }
}
