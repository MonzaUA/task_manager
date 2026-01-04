/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('tasks_knex').del()

  
  await knex('tasks_knex').insert([
    { title: 'Learn English', completed: true},
    { title: 'run 5k', completed: false},
    { title: 'test223'}
  ]);
};