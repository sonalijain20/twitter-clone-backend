'use strict';

const express = require('express');
const router = express.Router();
const TweetController = require('../controllers/tweet-controller');
const AuthTokenMiddleware = require('../middleware/auth-token-middleware');
const TweetControllerInstance = new TweetController();

router.get('/:id/feed', AuthTokenMiddleware.verifyUser, async function (req, res) {
    return await TweetControllerInstance.tweetsFeed(req, res);
})

router.get('/:id/feed/:userId', AuthTokenMiddleware.verifyUser, async function (req, res) {
    return await TweetControllerInstance.tweetsOfUser(req, res);
})

router.post('/:id/post', AuthTokenMiddleware.verifyUser, async function (req, res) {
    return await TweetControllerInstance.postTweet(req, res);
})

module.exports = router;