import { EnvironmentInfo } from '../utils/Environment';

describe("EnvironmentInfo", () => {
    test("Whether the correct default PORT is returned.", () => {
        const environment = new EnvironmentInfo({});
        expect(environment.getPort()).toBe("5000");
    });
    test("Whether the correct overridden PORT is returned.", () => {
        const environment = new EnvironmentInfo({
            env: {
                PORT: "1234"
            }
        });
        expect(environment.getPort()).toBe("1234");
    });
    test("Whether default value works", () => {
        const environment = new EnvironmentInfo({});
        expect(() => {
            environment.getEnvValue("asdf");
        }).toThrow();
        expect(environment.getEnvValue("asdf", "fdsa")).toBe("fdsa");
    });
});