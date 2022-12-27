'use strict';

const express = require('express');
const router = express.Router();
const TweetController = require('../controllers/tweet-controller');
const AuthTokenMiddleware = require('../middleware/auth-token-middleware');
const TweetControllerInstance = new TweetController();

/**
 * @description route to get tweet feed of logged in user
 * @param {*} id id of logged in user
 */
router.get('/:id/feed', AuthTokenMiddleware.verifyUser, async function (req, res) {
    return await TweetControllerInstance.tweetsFeed(req, res);
})

/**
 * @description route to get tweet for a particular user
 * @param {*} id id of logged in user
 * @param {*} userId id of user whose tweets needs to be viewed
 */
router.get('/:id/feed/:userId', AuthTokenMiddleware.verifyUser, async function (req, res) {
    return await TweetControllerInstance.tweetsOfUser(req, res);
})

/**
 * @description route to post a tweet
 * @param {*} id id of logged in user
 */
router.post('/:id/post', AuthTokenMiddleware.verifyUser, async function (req, res) {
    return await TweetControllerInstance.postTweet(req, res);
})

module.exports = router;