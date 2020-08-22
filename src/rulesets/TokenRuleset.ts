import Ruleset from './Ruleset';
import Transaction from '../transactions/Transaction';
import TokenState from '../states/TokenState';
import TokenTransaction from '../transactions/TokenTransaction';
import Utils from "../utils/Utils";
import RulesetState from '../states/RulesetState';

export default class TokenRuleset extends Ruleset {

    // TODO: Need validation of new state's structure.
    // TODO: Need validation of ruleset id.

    evaluateState(oldState: RulesetState, transaction: Transaction): RulesetState | null {
        const oldTokenState = oldState as TokenState;
        const tokenTransaction = transaction as TokenTransaction;
        if (Utils.isNullOrUndefined(oldTokenState)) {
            return null;
        }
        if (Utils.isNullOrUndefined(tokenTransaction)) {
            return null;
        }

        return new TokenState({
            balance: oldTokenState.balance + tokenTransaction.amount,
            rulesetId: oldTokenState.rulesetId,
        });
    }
}