'use strict';

const express = require('express');
const routes = express.Router();
const authenticateRoutes = require('./authenticate-route');
const userRoutes = require('./user-route');
const tweetRoutes = require('./tweet-route');


routes.use('/authenticate', authenticateRoutes);
routes.use('/users', userRoutes);
routes.use('/tweets', tweetRoutes);

module.exports = routes;