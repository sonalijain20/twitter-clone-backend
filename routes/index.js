'use strict';

const express = require('express');
const routes = express.Router();
const authenticateRoutes = require('./authenticate-route');
const userRoutes = require('./user-route');
const tweetRoutes = require('./tweet-route');

/**
 * @description defines routes for authentication i.e. login and register
 */
routes.use('/authenticate', authenticateRoutes);

/**
 * @description defines routes for user
 */
routes.use('/users', userRoutes);

/**
 * @description defines routes for tweets
 */
routes.use('/tweets', tweetRoutes);

module.exports = routes;