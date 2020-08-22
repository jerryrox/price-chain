import State from './State';

export default class TokenState extends State {

    get balance(): number {
        return this.data[0];
    }
    set balance(value: number) {
        this.data[0] = value;
    }

    isValidStructure(): boolean {
        if (this.data.length !== 1) {
            return false;
        }
        if (this.balance < 0) {
            return false;
        }
        return super.isValidStructure();
    }
}