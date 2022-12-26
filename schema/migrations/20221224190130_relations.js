'use-strict';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('relations', function (table) {
        table.increments('id').primary();
        table.integer('followerId').unsigned().notNullable().references('users.id').comment('id of the user who is following').onDelete('CASCADE')
        table.integer('followeeId').unsigned().notNullable().references('users.id').comment('id of the user who is being followed').onDelete('CASCADE');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
    })

    await knex.schema.createViewOrReplace('followersView', function (view) {
        view.columns(['userId', 'followers']);
        view.as(knex.raw(`select "followeeId", array_agg("followerId") "followers" from "relations" group by "followeeId";`));
    })

    await knex.schema.createViewOrReplace('followingView', function (view) {
        view.columns(['userId', 'following']);
        view.as(knex.raw(`select "followerId", array_agg("followeeId") "following" from "relations" group by "followerId";`));
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('relations')
    await knex.schema.dropViewIfExists('followersView');
    await knex.schema.dropViewIfExists('followingView');

};
