import knex, { type Knex } from "knex";
import knexConfig from "../knexfile.cjs";

const env = process.env.NODE_ENV ?? "development";

const config =
  (knexConfig as Record<string, Knex.Config>)[env] ??
  (knexConfig as Record<string, Knex.Config>)["development"];

const db: Knex = knex(config);

export default db;
