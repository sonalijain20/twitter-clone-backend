'use strict';

const express = require('express');
const router = express.Router();
const AuthTokenMiddleware = require('../middleware/auth-token-middleware')
const UserController = require('../controllers/user-controller');
const FollowController = require('../controllers/follower-controller');
const UserControllerInstance = new UserController();
const FollowControllerInstance = new FollowController();


router.get('/:id', AuthTokenMiddleware.verifyUser, async function (req, res) {
    return await UserControllerInstance.getUserInfo(req, res);
});


router.get('/:id/followers', AuthTokenMiddleware.verifyUser, async (req, res) => {
    return await FollowControllerInstance.getFollowers(req, res);
});


router.get('/:id/following', AuthTokenMiddleware.verifyUser, async (req, res) => {
    return await FollowControllerInstance.getFollowing(req, res);
});

router.post('/:id/follow', AuthTokenMiddleware.verifyUser, async (req, res) => {
    return await FollowControllerInstance.follow(req, res);
});

module.exports = router;