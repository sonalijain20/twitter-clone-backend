'use-strict';

const res = require("express/lib/response");
const tweetsModel = require("../schema/models/tweets-model");
const FollowController = require("./follower-controller");
const ParentController = require("./parent-controller");
const FollowControllerInstance = new FollowController();

module.exports = class TweetController extends ParentController {
    constructor() {
        super(tweetsModel, 'tweets');
    }

    /**
     * @description Function to validate payload
     * @param {*} payload 
     * @returns 
     */
    async validatePayload(payload) {
        let validationErrors = {
            errors: []
        };

        if (!payload.content) {
            validationErrors.errors.push({
                field: 'content',
                error: 'Tweet content is missing'
            })
        } else if (typeof payload.content !== 'string') {
            validationErrors.errors.push({
                field: 'content',
                error: 'Tweet content must be string'
            })
        } else if (!payload.content.length) {
            validationErrors.errors.push({
                field: 'content',
                error: 'Tweet content must not be empty'
            })
        }
        return validationErrors;
    }

    /**
     * @description Function to post a tweet
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async postTweet(req, res) {
        try {
            const validationErrors = await this.validatePayload(req.body);
            //validation errors
            if (validationErrors.errors.length) {
                return res.status(400).json(validationErrors)                           //validation errors, return 400
            } else {
                const dbObject = this.model(req.body.content, req.params.id)
                const tweet = await this.create(dbObject);
                return res.status(200).json({
                    tweet
                })
            }

        } catch (error) {
            console.log("Error while posting tweet: ", error)
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal Server error'
            });
        }
    }

    /**
     * @description Function to get tweets of all followed users
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async tweetsFeed(req, res) {
        try {
            const userIds = await FollowControllerInstance.getRelationData(req, 'following', true);
            const tweets = await this.getTweets('users', 'userId', userIds);
            return res.status(200).json({
                tweetsCount: tweets.length,
                tweets
            })
        } catch (error) {
            console.log("Error while fetching feed: ", error)
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal Server error'
            });
        }
    }

    /**
     * @description Fucntion to get tweets of particular user
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async tweetsOfUser(req, res) {
        try {
            const tweets = await this.getTweets('users', 'userId', [req.params.userId]);
            return res.status(200).json({
                tweetsCount: tweets.length,
                tweets
            })
        } catch (error) {
            console.log("Error while fetching feed: ", error)
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal Server error'
            });
        }
    }

    /**
     * @description Function to fetch a single tweet based on id
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async singleTweet(req, res) {
        try {
            const tweets = await this.getTweets('users', 'tweets.id', [req.params.tweetIds]);
            return res.status(200).json({
                tweetsCount: tweets.length,
                tweets
            })
        } catch (error) {
            console.log("Error while fetching feed: ", error)
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal Server error'
            });
        }
    }
}