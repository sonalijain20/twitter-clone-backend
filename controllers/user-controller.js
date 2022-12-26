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
}