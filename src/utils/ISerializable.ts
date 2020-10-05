interface ISerializable {

    /**
     * Serializes this object to a plain JS object.
     */
    serialize(): Record<string, any>;

    /**
     * Deserializes the specified JS object data and applies parsed values to this object.
     */
    deserialize(data: Record<string, any>): void;
}

export default ISerializable;