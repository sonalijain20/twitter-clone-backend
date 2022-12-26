'use-strict';

const ParentController = require("./parent-controller");
const relationModel = require('../schema/models/relations-model');
const DbQuery = require("../db-query/db-query");
const DbQueryInstance = new DbQuery();

module.exports = class FollowController extends ParentController {
    constructor() {
        super(relationModel, 'relations');
    }

    /**
     * @description Function to validate payload
     * @param {*} body 
     * @param {*} params 
     * @returns 
     */
    async validatePayload(body, params) {
        let validationErrors = {
            errors: []
        };

        //validating followee id
        if (!body.followeeId) {
            validationErrors.errors.push({
                field: 'followee',
                error: 'Followee id is mising.'
            })
        }
        else if (isNaN(body.followeeId)) {
            validationErrors.errors.push({
                field: 'followee',
                error: 'Followee id should be number.'
            })
        }

        //validating follower id
        if (!params.id) {
            validationErrors.errors.push({
                field: 'follower',
                error: 'Follower id is mising from params.'
            })
        } else if (isNaN(params.id)) {
            validationErrors.errors.push({
                field: 'follower',
                error: 'Follower id should be number.'
            })
        }

        //follower and followee id must be unique
        if (body.followeeId === params.id) {
            validationErrors.errors.push({
                field: 'followee',
                error:'Follower and followee id must be different.'
            })
        }

        return validationErrors;
    }

    /**
     * @description Function to get followers/following information
     * @param {*} req 
     * @param {*} relation 
     * @param {*} fetchIds 
     * @returns 
     */
    async getRelationData(req, relation, fetchIds) {
        const view = relation === 'follower' ? 'followersView' : 'followingView';
        const relate = relation === 'follower' ? 'followers' : 'following';

        //get users ids
        let dbData = await DbQueryInstance.getData(view, { userId: Number(req.params.id) });
        dbData = dbData.flatMap(follower => follower[relate]);

        if (fetchIds) 
            return dbData;

        //if no user found
        if (!dbData.length) {
            return {
                followersCount: 0,
                followersData:[]
            }
        }

        //get users info
        const followersData = await this.getMultiple('id', dbData, ["id", "email", "followers", "following"], 'users');
        return {
            followersCount: dbData.length,
            followersData
        }
    }


    /**
     * @description Function to get the list of followers
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async getFollowers(req, res) {
        try {
            const users = await this.getRelationData(req, 'follower');
            return res.status(200).json(users);
        } catch (err) {
            console.log("Error while fetching followers: ", err)
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal Server error'
            });
        }
    }

    /**
     * @description Function to get the list of following users
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async getFollowing(req, res) {
        try {
            const users = await this.getRelationData(req, 'following');
            return res.status(200).json(users);
        } catch (err) {
            console.log("Error while fetching followers: ", err);
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal Server error'
            });
        }
    }

    /**
     * @fdescription Fucntion to follow a user
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async follow(req, res) {
        try {
            //validating payload
            const validationErrors = await this.validatePayload(req.body, req.params);
            if (validationErrors.errors.length) {
                return res.status(400).json({
                    statusCode: 400,
                    validationErrors
                })
            }
            const modelObj = this.model(req.body.followeeId, req.params.id); 

            //check if already following
            const alreadyFollow = await this.getData(modelObj)
            if (alreadyFollow.length) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Already following'
                })
            } else {
                //insert relation in database
                const relation = await this.create(modelObj);

                //increment following count for the logged in user
                const user = await super.follow({ id: req.params.id }, 'following', 'users');
                delete user[0].password;
                //increment followers of user being followed
                const followee = await super.follow({ id: req.body.followeeId }, 'followers', 'users');
                delete user.password;
                return res.status(200).json({
                    statusCode: 200,
                    message: 'Follow successful',
                    user
                })
            }
        } catch (error) {
            console.log("Error while following: ", error);
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal Server error'
            });
        }
    }
}