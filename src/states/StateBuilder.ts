import Blockchain from '../blockchain/Blockchain';
import State from './State';
import Transaction from '../transactions/Transaction';
import RulesetProvider from "../rulesets/RulesetProvider";

export default class StateBuilder {

    readonly blockchain: Blockchain;
    readonly newState: Record<string, State>;
    readonly blockIndex: number | undefined;

    constructor(blockchain: Blockchain, blockIndex?: number) {
        this.blockchain = blockchain;
        this.newState = {};
        this.blockIndex = blockIndex;
    }

    /**
     * Searches through this object's newState map and blockchain to find the latest state
     * of specified user address.
     * Returns the state of user of specified address.
     */
    findState(userAddress: string): State {
        const searchInx = this.blockIndex;
        const existingState = (
            this.newState[userAddress] ??
            this.blockchain.findState(
                userAddress,
                searchInx === undefined ? undefined : searchInx - 1
            )
        );
        return existingState?.clone() ?? new State({ userAddress });
    }

    /**
     * Evaluates a new state out of specified transaction and returns whether it was successful.
     */
    feedTransaction(transaction: Transaction): boolean {
        const ruleset = RulesetProvider.getRuleset(transaction.rulesetId);
        if (ruleset === null) {
            return false;
        }
        const states = ruleset.buildState(this, transaction);
        if (states === null) {
            return false;
        }
        if (!states.every((s) => s.isValidStructure())) {
            return false;
        }
        states.forEach((s) => {
            this.newState[s.userAddress] = s;
        });
        return true;
    }
}