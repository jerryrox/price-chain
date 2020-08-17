import { EnvironmentInfo } from '../utils/Environment';
import { NodeEnvType } from '../utils/Types';

describe("EnvironmentInfo", () => {
    test("Whether the correct default PORT is returned.", () => {
        const environment = new EnvironmentInfo({
            envType: NodeEnvType.Test
        });
        expect(environment.getPort()).toBe("5000");
    });
    test("Whether the correct overridden PORT is returned.", () => {
        const environment = new EnvironmentInfo({
            envType: NodeEnvType.Test,
            env: {
                PORT: "1234"
            }
        });
        expect(environment.getPort()).toBe("1234");
    });

    test("Whether the base key is correctly returned.", () => {
        const environment = new EnvironmentInfo({
            envType: NodeEnvType.Test
        });
        expect(environment.getBaseKey()).toBe(`${NodeEnvType.Test}`.toUpperCase());
    });
});