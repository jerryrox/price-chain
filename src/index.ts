import Environment from "./utils/Environment";

const port = Environment.getPort();
const api = require("./api/api").default; // eslint-disable-line
api.listen(port, () => {
    console.log(`Server started on port ${port}`);
});