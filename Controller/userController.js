// userController.

const UserModel = require('../Model/userModel');

class UserController {
    constructor() {
        this.userModel = new UserModel();
    }

    registerUser(userData) {
        return this.userModel.createUser(userData);
    } 

    loginUser(username, password) {
        return this.userModel.findUserByUsernameAndPassword(username, password);
    }
}

module.exports = UserController;
