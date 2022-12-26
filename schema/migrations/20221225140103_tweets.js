'user-strict';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('tweets', function (table) {
        table.increments('id').primary();
        table.text('content').notNullable();
        table.integer('userId').unsigned().notNullable().references('users.id');
        table.string('contentType', 255);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('tweets')
};
