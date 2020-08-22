import State from './State';
import PriceModel from '../models/PriceModel';
import Utils from "../utils/Utils";

export default class PriceState extends State {

    isValidStructure(): boolean {
        for (let i = 0; i < this.data.length; i++) {
            const price = this.data[i] as PriceModel;
            if (Utils.isNullOrUndefined(price)) {
                return false;
            }
            if (!price.isValidStructure()) {
                return false;
            }
        }
        return super.isValidStructure();
    }
}