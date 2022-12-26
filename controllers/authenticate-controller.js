'use-strict';
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const ParentController = require('./parent-controller');
const userModel = require('../schema/models/users-model')
const saltRounds = process.env.SALT_ROUNDS || 10;

module.exports = class AuthenticateController extends ParentController {
    constructor() {
        super(userModel, 'users');
    }
/**
 * @description Fucntion to register user
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
    async register(req, res) {
        try {
            const validationErrors = await this.validatePayload(req.body);

            //validation errors
            if (validationErrors.errors.length) {
                //validation errors, return 400
                return res.status(400).json(validationErrors)                           
            } else {

                 //check if user already exists
                const results = await this.getData({                                
                    email: req.body.email
                })
                if (results.length) {
                    return res.status(400).json({
                        statusCode: 400,
                        message: 'User already exists with provided email'
                    })
                } else {
                    const { email, firstName, lastName } = req.body

                    //encrypt the password 
                    const hash = await bcrypt.hash(req.body.password, saltRounds);     
                    
                    //create a object according to the model's schema
                    const modelObj = this.model(email, hash, firstName, lastName); 
                    
                    // insert into database
                    await this.create(modelObj);                                                            
                    return res.status(200).json({
                        statusCode: 200,
                        message: 'Registered successfully!'
                    })
                }
            }

        } catch (err) {
            console.log("Error while registering: ", err);
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal server error'
            })
        }
    }
/**
 * @description Function to login
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
    async login(req, res) {
        try {
            const validationErrors = await this.validatePayload(req.body);
            //validation errors
            if (validationErrors.errors.length) {
                return res.status(400).json(validationErrors)                           //validation errors, return 400
            } else {
                const results = await this.getData({
                    email: req.body.email
                })
                if (!results.length) {
                    return res.status(400).json({
                        statusCode: 400,
                        message: 'User does not already exists with provided email'
                    })
                } else {
                    const passwordMatch = await bcrypt.compare(req.body.password, results[0].password);             //compare password
                    if (passwordMatch) {
                        const accessToken = await this.generateJWToken(results[0])                                       // generate JWT token
                        if (accessToken) {
                            const user = {
                                username: results[0].email,
                                id: results[0].id,
                                accessToken,
                                issuedAt: new Date()
                            }
                            return res.status(200).json({
                                message: 'Login Successful!',
                                statusCode: 200,
                                user
                            })
                        }
                    } else {
                        return res.json({
                            statusCode: 401,
                            message: 'Incorrect password'
                        })
                    }
                }
            }
        } catch (err) {
            console.log("Error while login: ", err);
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal server error'
            })
        }
    }

    /**
     * @description Function to validate the payload
     * @param {*} payload 
     * @returns 
     */
    async validatePayload(payload) {
        let validationErrors = {
            errors: []
        };

        //validate email address
        if (!payload.email) {
            validationErrors.errors.push({
                field: 'email',
                error: 'Email address is mising'
            })
        } else if (!emailValidator.validate(payload.email)) {
            validationErrors.errors.push({
                field: 'email',
                error: 'Email address is mising'
            })
        }

        //validate password
        if (!payload.password) {
            validationErrors.errors.push({
                field: 'password',
                error: 'password is mising'
            })
        } else if (payload.password.length < 8) {
            validationErrors.errors.push({
                field: 'password',
                error: 'password length should be atleast 8 characters'
            })
        }

        //validate last name
        if (payload.lastName && typeof payload.lastName !== 'string') {
            validationErrors.errors.push({
                field: 'Last name',
                error: 'Invalid last name'
            })
        }
        //validate first name
        if (payload.firstName && typeof payload.firstName !== 'string') {
            validationErrors.errors.push({
                field: 'First name',
                error: 'Invalid first name'
            })
        }
        return validationErrors;
    }

    /**
     * @description Function to generate access token
     * @param {*} userInfo 
     * @returns 
     */
    async generateJWToken(userInfo) {
        try {
            return await jwt.sign({ userInfo }, process.env.JWT_SECRET_KEY, { expiresIn: '8h' });
        } catch (err) {
            console.log("Error while generating token: ", err);
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal Server error'
            });
        }
    }
}
// 
