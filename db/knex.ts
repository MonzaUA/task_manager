import knex, { type Knex } from "knex";
import knexConfig from "../knexfile.cjs";

const db: Knex = knex(knexConfig.development as Knex.Config);

export default db;
