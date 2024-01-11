// AdminController.js

const AdminModel = require('../Model/adminModel');
const AdminView = require('../View/adminView');

class AdminController {
    constructor() {
        this.adminModel = new AdminModel();
        this.adminView = new AdminView();
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

            if (admin) {
                const accessToken = this.adminModel.generateAccessToken(admin);
                return { admin, accessToken };
            }

            return null;
        } catch (error) {
            console.error(error);
            throw new Error(`Invalid data: ${error.message}`);
        }
    }
     authenticateAdmin(req, res, next) {
        const token = req.headers.authorization;

        if (!token) {
           this.adminView.sendErrorResponse(res, 401, 'Unauthorized: Access token missing.');
           return;
        }

        const admin = this.adminModel.findAdminByAccessToken(token);

        if (!admin) {
            this.adminView.sendErrorResponse(res, 401, 'Unauthorized: Invalid access token.');
            return;
        }
        // Attach the admin object to the request for use in subsequent route handlers
        req.admin = admin;
        next();
    }


}

module.exports = AdminController;
