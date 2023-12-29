// AdminController.js

const AdminModel = require('../Model/adminModel');

class AdminController {
    constructor() {
        this.adminModel = new AdminModel();
    }

    registerAdmin(data) {
        try {
            const adminData = JSON.parse(data);

            if (!adminData.username || !adminData.password) {
                throw new Error('Invalid data: Username and password are required.');
            }

            const registeredAdmin = this.adminModel.createAdmin(adminData);
            delete registeredAdmin.password;

            return registeredAdmin;
        } catch (error) {
            console.error(error);
            throw new Error(`Invalid data: ${error.message}`);
        }
    }

    loginAdmin(data) {
        try {
            const { username, password } = JSON.parse(data);

            if (!username || !password) {
                throw new Error('Invalid data: Username and password are required.');
            }

            const admin = this.adminModel.findAdminByUsernameAndPassword(username, password);

            return admin;
        } catch (error) {
            console.error(error);
            throw new Error(`Invalid data: ${error.message}`);
        }
    }
}

module.exports = AdminController;
