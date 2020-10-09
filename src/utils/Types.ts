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