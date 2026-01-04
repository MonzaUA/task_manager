const db = require('./knex')

db.raw('select 1')
  .then(() => {
    console.log('PostgreSQL connected');
  })
  .catch(err => {
    console.error('Connection error:', err);
  });