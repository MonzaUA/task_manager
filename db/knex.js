import knex from "knex";
import knexConfig from '../knexfile.cjs'

// const knex = require('knex');
// const knexConfig = require('../knexfile');

const db = knex(knexConfig.development);

export default db;
