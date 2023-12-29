// UserController.js

const UserModel = require('../Model/userModel');
const UserView = require('../View/userView');

class UserController {
    constructor() {
        this.userModel = new UserModel();
        this.userView = new UserView();
    }

    registerUser(data) {
        try {
            const userData = JSON.parse(data);

            if (!userData.username || !userData.password) {
                throw new Error('Invalid data: Username and password are required.');
            }

            const registeredUser = this.userModel.createUser(userData);
            delete registeredUser.password;

            return registeredUser;
        } catch (error) {
            console.error(error);
            throw new Error(`Invalid data: ${error.message}`);
        }
    }

    loginUser(data) {
        try {
            const { username, password } = JSON.parse(data);

            if (!username || !password) {
                throw new Error('Username and password are required.');
            }

            let user = this.userModel.findUserByUsernameAndPassword(username, password);
            
            if (user) {
                const accessToken = this.userModel.generateAccessToken(user);
                return { user, accessToken };
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Invalid data: ${error.message}`);
        }
    }
   
    authenticateUser(req, res, next) {
        const token = req.headers.authorization;

        if (!token) {
            this.userView.sendErrorResponse(res, 401, 'Unauthorized: Access token missing.');
            return;
        }

        const user = this.userModel.findAdminByAccessToken(token);

        if (!user) {
            this.userView.sendErrorResponse(res, 401, 'Unauthorized: Invalid access token.');
            return;
        }
        // Attach the admin object to the request for use in subsequent route handlers
        req.user = user;
        next();
    }
}

module.exports = UserController;
