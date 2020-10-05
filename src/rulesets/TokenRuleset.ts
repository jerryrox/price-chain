import Utils from "../utils/Utils";
import Ruleset from "./Ruleset";
import Transaction from "../transactions/Transaction";
import TokenState from "../states/TokenState";
import TokenTransaction from "../transactions/TokenTransaction";
import StateBuilder from '../states/StateBuilder';
import State from '../states/State';

export default class TokenRuleset extends Ruleset {

    getStateConstructor() {
        return TokenState;
    }

    getTxConstructor() {
        return TokenTransaction;
    }

    buildState(stateBuilder: StateBuilder, transaction: Transaction): State[] | null {
        const tokenTransaction = transaction as TokenTransaction;
        if (Utils.isNullOrUndefined(tokenTransaction)) {
            return null;
        }

        // If not a reward transaction, we must also handle decrementation of sender's balance.
        if (!tokenTransaction.isReward) {
            const senderState = this.createSenderState(stateBuilder, tokenTransaction);
            if (senderState === null) {
                return null;
            }
            return [
                this.createReceiverState(stateBuilder, tokenTransaction),
                senderState
            ];
        }
        return [this.createReceiverState(stateBuilder, tokenTransaction)];
    }

    private createReceiverState(
        stateBuilder: StateBuilder, tokenTransaction: TokenTransaction
    ): State {
        const receiverState = stateBuilder.findState(tokenTransaction.toAddress);
        const receiverTokenState = receiverState.getRulesetState(this.rulesetId) as TokenState;
        receiverState.rulesetStates[this.rulesetId] = new TokenState({
            balance: (receiverTokenState?.balance ?? 0) + tokenTransaction.amount,
        });
        return receiverState;
    }

    private createSenderState(
        stateBuilder: StateBuilder, tokenTransaction: TokenTransaction
    ): State | null {
        const senderState = stateBuilder.findState(tokenTransaction.fromAddress);
        const senderTokenState = senderState.getRulesetState(this.rulesetId) as TokenState;
        if (senderTokenState === null) {
            return null;
        }
        senderState.rulesetStates[this.rulesetId] = new TokenState({
            balance: senderTokenState.balance - tokenTransaction.amount,
        });
        return senderState;
    }
}
