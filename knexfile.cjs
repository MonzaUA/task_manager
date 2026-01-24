// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.PGHOST || 'localhost',
      user: process.env.PGUSER || 'admin',
      password: process.env.PGPASSWORD || 'admin123',
      database: process.env.PGDATABASE || 'task_manager',
      port: Number(process.env.PGPORT) || 5433
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};

