import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('tasks_knex').del();

  await knex('tasks_knex').insert([
    { title: 'Learn English', completed: true },
    { title: 'run 5k', completed: false },
    { title: 'test223', completed: false }
  ]);
}
