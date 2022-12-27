'use strict';

const express = require('express');
const router = express.Router();
const AuthTokenMiddleware = require('../middleware/auth-token-middleware')
const UserController = require('../controllers/user-controller');
const FollowController = require('../controllers/follower-controller');
const UserControllerInstance = new UserController();
const FollowControllerInstance = new FollowController();

/**
 * @description route to get information of logged in user
 * @param {*} id id of logged in user
 */
router.get('/:id', AuthTokenMiddleware.verifyUser, async function (req, res) {
    return await UserControllerInstance.getUserInfo(req, res);
});

/**
 * @description route to get followers information of logged in user
 * @param {*} id id of logged in user
 */
router.get('/:id/followers', AuthTokenMiddleware.verifyUser, async function (req, res) {
    return await FollowControllerInstance.getFollowers(req, res);
});

/**
 * @description route to get information of users followed by logged in user
 * @param {*} id id of logged in user
 */
router.get('/:id/following', AuthTokenMiddleware.verifyUser, async function (req, res) {
    return await FollowControllerInstance.getFollowing(req, res);
});

/**
 * @description route to follow a user
 * @param {*} id id of logged in user
 */
router.post('/:id/follow', AuthTokenMiddleware.verifyUser, async function (req, res) {
    return await FollowControllerInstance.follow(req, res);
});

/**
 * @description route to search a user by email address
 * @param {*} id id of logged in user

 */
router.get('/:id/search', AuthTokenMiddleware.verifyUser, async function (req, res) {
    return await UserControllerInstance.searchUser(req, res);
})

module.exports = router;