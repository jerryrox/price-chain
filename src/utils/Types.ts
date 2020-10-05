
/**
 * Types of supported Node runtime mode.
 */
export enum NodeEnvType {
    Development = "development",
    Production = "production",
    Test= "test"
}

export interface IKeyPair {
    privateKey: string,
    publicKey: string,
}

export interface IConstructor<T> {
    new(): T;
}

export interface IParamConstructor<T> {
    new(param?: any): T;
}