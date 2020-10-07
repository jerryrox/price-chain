import ISerializable from "./ISerializable";
import { IParamConstructor } from "./Types";
import Utils from "./Utils";

type CustomDeserializer = (value: any, key: string, target: any) => void;

class ObjectSerializer {

    /**
     * Serializes the specified object only including the given fields.
     * The method will throw an error if one of the fields does not exist in the host object.
     */
    serializeExplicit(obj: any, fields: string[]): any {
        const names = Object.getOwnPropertyNames(obj);
        const map: any = {};
        fields.forEach((f) => {
            if (!names.includes(f)) {
                throw new Error(`Field (${f}) does not exist on the specified object!`);
            }
            map[f] = obj[f];
        });
        return map;
    }

    /**
     * Serializes the specified object into a map.
     */
    serialize(obj: any, exclusion?: string[]): Record<string, any> {
        const names = Object.getOwnPropertyNames(obj);
        const map: Record<string, any> = {};
        names.forEach((name) => {
            if (exclusion === undefined || !exclusion.includes(name)) {
                map[name] = this.serializeValue(obj[name]);
            }
        });
        return map;
    }

    /**
     * Serializes the specified value to any type appropriate.
     */
    serializeValue(value: any): any {
        // Handling special serialization
        const serializableValue = value as ISerializable;
        if (!Utils.isNullOrUndefined(serializableValue) &&
            serializableValue.serialize !== undefined) {
            return serializableValue.serialize();
        }
        if (typeof (value) !== "string") {
            if (Array.isArray(value)) {
                return value.map((v) => this.serializeValue(v));
            }
            if (typeof (value) === "object") {
                return this.serialize(value);
            }
        }
        return value;
    }

    /**
     * Deserializes the specified map into properties of given instance.
     */
    deserialize(
        data: Record<string, any>,
        target: any,
        customDeserializer?: Record<string, CustomDeserializer>
    ): void {
        const mapper = customDeserializer ?? {};
        Object.keys(data).forEach((key) => {
            if (typeof mapper[key] === "function") {
                mapper[key](data[key], key, target);
                return;
            }
            const serializableTarget = target[key] as ISerializable;
            if (!Utils.isNullOrUndefined(serializableTarget) &&
                serializableTarget.deserialize !== undefined) {
                serializableTarget.deserialize(data[key]);
                return;
            }
            target[key] = data[key];
        });
    }

    /**
     * Returns a CustomDeserializer which parses incoming value as a map with a specific type.
     */
    getMapDeserializer<T>(
        ValueConstructor: IParamConstructor<T>
    ): CustomDeserializer {
        return this.getCheckedMapDeserializer(() => ValueConstructor);

        // return (value, key, target) => {
        //     // Ensure the value to deserialize is an object.
        //     if (typeof (value) === "object") {
        //         const keys = Object.keys(value);
        //         // Ensure the variable of the target is an object.
        //         const targetField = target[key];
        //         if (typeof (targetField) === "object") {
        //             keys.forEach((k) => {
        //                 targetField[k] = new ValueConstructor(value[k]);
        //             });
        //         }
        //     }
        // };
    }

    /**
     * Returns a CustomDeserializer which parses incoming value as a map with a specific type.
     */
    getCheckedMapDeserializer(
        checker: (value: any, key: string) => IParamConstructor<any> | null | undefined
    ): CustomDeserializer {
        return (value, key, target) => {
            // Ensure the value to deserialize is an object.
            if (typeof (value) === "object") {
                const keys = Object.keys(value);
                // Ensure the variable of the target is an object.
                const targetField = target[key];
                if (typeof (targetField) === "object") {
                    keys.forEach((k) => {
                        const Constructor = checker(value[k], key);
                        if (Constructor !== undefined && Constructor !== null) {
                            targetField[k] = new Constructor(value[k]);
                        }
                    });
                }
            }
        };
    }
}

export default new ObjectSerializer();