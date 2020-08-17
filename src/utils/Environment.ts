import {
    config
} from "dotenv";
import { NodeEnvType } from "./Types";

config();

interface IEnvironmentInfoParam {
    envType: NodeEnvType | string,
    env?: NodeJS.ProcessEnv
}

export class EnvironmentInfo {

    envType: NodeEnvType | string;
    env: NodeJS.ProcessEnv;


    constructor(param: IEnvironmentInfoParam) {
        this.envType = param.envType;
        this.env = param.env || process.env;
    }

    /**
     * Returns the server's port number.
     */
    getPort(): string { return this.env.PORT || "5000"; }

    /**
     * Returns the base string of key which has the environment type variant.
     */
    getBaseKey(): string {
        return `${this.envType}`.toUpperCase();
    }

    /**
     * Returns the environment variable value for the specified key.
     * Throws an error if the value is not found.
     */
    getEnvValue(key: string): string {
        const value = this.env[key.toUpperCase()];
        if (value === undefined) {
            throw new Error(`No environment value found for key: ${key}`);
        }
        return value;
    }
}

const Environment = new EnvironmentInfo({
    envType: (process.env.NODE_ENV || "development") as NodeEnvType,
    env: process.env
});
export default Environment;
