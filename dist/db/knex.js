import knex from "knex";
import knexConfig from "../knexfile.cjs";
const env = process.env.NODE_ENV ?? "development";
const config = knexConfig[env] ??
    knexConfig["development"];
const db = knex(config);
export default db;
//# sourceMappingURL=knex.js.map