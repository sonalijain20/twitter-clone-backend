'use-strict';

const AuthenticateController = require("./authenticate-controller");
const userModel = require("../schema/models/users-model");

module.exports = class UserController extends AuthenticateController{
    constructor() {
        super(userModel, 'users')
    }
    
    /**
     * @descriptio Fucntion to get logged in user's information
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async getUserInfo(req, res) {
        try {
            const user = await this.getData({ id: req.params.id })
            delete user[0].password;
            return res.status(200).json(user[0]);
        } catch (err) {
            console.log("Error while fetching user: ", err);
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal Server error'
            });
        }
    }

    /**
     * @description Function to search users by email
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async searchUser(req, res) {
        try {
            const clause = ['email', 'LIKE', `%${req.body.searchPhrase}%`];
            const users = await this.getData(clause);
            if (!users.length) {
                return res.status(200).json({ message: 'No user found' });
            }
            users.forEach(element => {
                delete element.password;
            });

            return res.status(200).json({
                usersCount: users.length,
                users
            })
        } catch (err) {
            console.log("Error while fetching user: ", err);
            return res.status(500).json({
                statusCode: 500,
                message: 'Internal Server error'
            });
        }
    }
}