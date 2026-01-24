
exports.up = function(knex) {
  return knex.schema.alterTable('tasks_knex', (table) => {
    table.string('test')
  })
};

exports.down = function(knex) {
    return knex.schema.alterTable('task_knex', (table) => {
    table.dropColumn('test')
  })
};
