'use strict'

const express = require('express');
const router = express.Router();
const AuthenticateController = require('../controllers/authenticate-controller')
const AuthControllerInstance = new AuthenticateController();

/**
 * @description route to register on TClone
 */
router.post('/register', async function (req, res) {
    return await AuthControllerInstance.register(req,res)
});

/**
 * @description route to login
 */
router.post('/login', async function (req, res) {
    return await AuthControllerInstance.login(req, res)
});

module.exports = router;