import {
    config
} from "dotenv";

config();

interface IEnvironmentInfoParam {
    env?: NodeJS.ProcessEnv
}

export class EnvironmentInfo {

    env: NodeJS.ProcessEnv;


    constructor(param: IEnvironmentInfoParam) {
        this.env = param.env || process.env;
    }

    /**
     * Returns the server's port number.
     */
    getPort(): string { return this.env.PORT || "5000"; }

    /**
     * Returns the environment variable value for the specified key.
     * Throws an error if the value is not found, unless a default value is provided.
     */
    getEnvValue(key: string, defaultValue?: string): string {
        const value = this.env[key.toUpperCase()];
        if (value === undefined && defaultValue === undefined) {
            throw new Error(`No environment value found for key: ${key}`);
        }
        return (value ?? defaultValue) as string;
    }
}

const Environment = new EnvironmentInfo({
    env: process.env
});
export default Environment;
