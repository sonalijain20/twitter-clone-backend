'use strict';
const DbQuery = require('../db-query/db-query')
const DbQueryInstance = new DbQuery();

module.exports = class ParentController {
    constructor(model, tableName) {
        this.model = model
        this.tableName = tableName
    }

    /**
     * @description Function to create a record
     * @param {*} dbObject 
     * @returns 
     */
    async create(dbObject) {
        return await DbQueryInstance.create(this.tableName, dbObject)
    }

    /**
     * @fdescription Function to fetch data from database based on single condition
     * @param {*} dbObject 
     * @param {*} columns 
     * @param {*} table 
     * @returns 
     */
    async getData(dbObject, columns, table) {
        const tableName = table || this.tableName
        return await DbQueryInstance.getData(tableName, dbObject, columns)
    }

    /**
     * @description Function to fetch data from database based on different conditions
     * @param {*} condition 
     * @param {*} data 
     * @param {*} columns 
     * @param {*} table 
     * @returns 
     */
    async getMultiple(condition, data, columns, table) {
        const tableName = table || this.tableName
        return await DbQueryInstance.getMultipleData(tableName, condition,data,columns)
    }

    /**
     * @description Function to add a follower
     * @param {*} dbObject 
     * @param {*} col 
     * @param {*} table 
     * @returns 
     */
    async follow(dbObject,col, table) {
        const tableName = table || this.tableName
        return await DbQueryInstance.addFollower(tableName, col, dbObject);
    }

    /**
     * @description Function to unfollow a user
     * @param {*} dbObject 
     * @param {*} col 
     * @param {*} table 
     * @returns 
     */
    async unFollow(dbObject, col, table) {
        const tableName = table || this.tableName
        return await DbQueryInstance.removeFollower(tableName,col, dbObject);
    }

    /**
     * @description Function to fetch tweets
     * @param {*} joinTable 
     * @param {*} column 
     * @param {*} ids 
     * @param {*} table 
     * @returns 
     */
    async getTweets(joinTable, column, ids, table) {
        const tableName = table || this.tableName;
        return await DbQueryInstance.getTweets(tableName, joinTable, column, ids);
    }

}