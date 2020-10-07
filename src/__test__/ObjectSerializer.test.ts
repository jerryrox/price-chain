import ISerializable from "../utils/ISerializable";
import ObjectSerializer from "../utils/ObjectSerializer";

class DummyClass {

  a = 5;
  b = "asdf";
  c = true;
  d = {
    aa: 0,
    bb: "fdsa",
  };

  myFunc() { }
}

class DummyClass2 extends DummyClass {

    e = new DummySerializable();
}

class DummySerializable implements ISerializable {
    aa = 1;
    bb = "2";
    cc = true;

    serialize(): Record<string, any> {
        return {
            newAA: this.aa,
            newBB: this.bb,
            newCC: this.cc,
        };
    }

    deserialize(data: Record<string, any>) {
        this.aa = data.newAA ?? 0;
        this.bb = data.newBB ?? "0";
        this.cc = data.newCC ?? false;
    }
}

describe("ObjectSerializer", () => {
    test("serializeExplicit", () => {
        const dummy = new DummyClass();
        expect(() => {
        ObjectSerializer.serializeExplicit(dummy, ["e"]);
        }).toThrow();
        const map = ObjectSerializer.serializeExplicit(dummy, ["a", "c", "d"]);
        expect(map.a).toBe(5);
        expect(map.b).toBeUndefined();
        expect(map.c).toBeTruthy();
        expect(map.d).toMatchObject({
            aa: 0,
            bb: "fdsa",
        });
        expect(map.myFunc).toBeUndefined();
    });
    test("serialize", () => {
        const map = ObjectSerializer.serialize(new DummyClass(), ["c"]);
        expect(map.a).toBe(5);
        expect(map.b).toBe("asdf");
        expect(map.c).toBeUndefined();
        expect(map.d).toMatchObject({
            aa: 0,
            bb: "fdsa",
        });
        expect(map.myFunc).toBeUndefined();

        const objectWithArray = ObjectSerializer.serialize({
            arr: ["asdf", "fdsa"]
        });
        expect(objectWithArray).toMatchObject({
            arr: ["asdf", "fdsa"]
        });
    });
    test("deserialize", () => {
        const dummy = new DummyClass();
        ObjectSerializer.deserialize({
            a: 10,
            b: "fdsa",
            c: false,
            d: {
                aa: 5,
                bb: "fdsa",
            }
        }, dummy);
        expect(dummy.a).toBe(10);
        expect(dummy.b).toBe("fdsa");
        expect(dummy.c).toBeFalsy();
        expect(dummy.d.aa).toBe(5);
        expect(dummy.d.bb).toBe("fdsa");
    });
    test("ISerializable integration", () => {
        const dummy = new DummyClass2();
        const map = ObjectSerializer.serialize(dummy);
        expect(map.a).toBe(5);
        expect(map.b).toBe("asdf");
        expect(map.c).toBeTruthy();
        expect(map.d).toMatchObject({
            aa: 0,
            bb: "fdsa",
        });
        expect(map.myFunc).toBeUndefined();
        expect(map.e).toMatchObject({
            newAA: 1,
            newBB: "2",
            newCC: true,
        });

        const newDummy = new DummyClass2();
        newDummy.e.aa = 0;
        newDummy.e.bb = "1";
        newDummy.e.cc = false;
        ObjectSerializer.deserialize(map, newDummy);
        expect(newDummy).toMatchObject(dummy);

        ObjectSerializer.deserialize(map, newDummy, {
            e: (value, key, target) => {
                target.e.aa = 100;
                target.e.bb = "b";
                target.e.cc = false;
            }
        });
        expect(newDummy.e).toMatchObject({
            aa: 100,
            bb: "b",
            cc: false,
        });
    });
});