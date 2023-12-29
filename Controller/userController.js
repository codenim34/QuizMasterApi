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
                throw new Error('Invalid data: Username and password are required.');
            }

            const user = this.userModel.findUserByUsernameAndPassword(username, password);
            
            return user;
        } catch (error) {
            console.error(error);
            throw new Error(`Invalid data: ${error.message}`);
        }
    }
}

module.exports = UserController;
