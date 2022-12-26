'use-strict';

const knex = require('../schema/utils/knex');

module.exports = class DbQuery{

    async create(tableName, data) {
        return await knex(tableName).insert(data).returning('*');
    }
/**
 * @description function to fetch data from Database
 * @param {*} tableName 
 * @param {*} data condition
 * @param {*} columns columns to be fetched
 * @returns 
 */
    async getData(tableName, data, columns) {
        if (!columns)
            columns = '*';
    return await knex(tableName).select(columns).where(data);
    }

    /**
     * @description Fucntion to fetch data based to IN clause
     * @param {*} tableName 
     * @param {*} condition conditioned column
     * @param {*} data ids
     * @param {*} columns columns to be fetched
     * @returns 
     */
    async getMultipleData(tableName, condition, data, columns) {
        if (!columns)
            columns = `*`;
        return await knex(tableName).select(columns).whereIn(condition, data );
    }

    /**
     * @description Fucntion to increment follower/following count
     * @param {*} tableName 
     * @param {*} col 
     * @param {*} data 
     * @returns 
     */
    async addFollower(tableName,col, data) {
        return await knex(tableName).increment(col, 1).where(data).returning('*');
    }

    /**
     * @description Fucntion to decrement follower count
     * @param {*} tableName 
     * @param {*} col 
     * @param {*} data 
     * @returns 
     */
    async removeFollower(tableName,col, data) {
        return await knex(tableName).decrement(col, 1).where(data);
    }

    /**
     * @description Fucntion to fetch tweets
     * @param {*} tableName 
     * @param {*} joinTable 
     * @param {*} column 
     * @param {*} ids 
     * @returns 
     */
    async getTweets(tableName, joinTable, column, ids) {
        const col = ['tweets.id', 'tweets.content', 'tweets.contentType','tweets.createdAt' ,'tweets.userId','users.email' ,'users.firstName', 'users.lastName'];
        return await knex.select(col).from(tableName).join(`${joinTable}`, `${joinTable}.id`, `${tableName}.userId`).whereIn(column, ids);
    }
}