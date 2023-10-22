// adminController.js
const adminModel = require('../Model/adminModel');
class AdminController {
    constructor() {
        this.adminModel = new adminModel();
    }

    registerAdmin(userData) {
        return this.adminModel.createAdmin(userData);
    }

    loginAdmin(username, password) {
        return this.adminModel.findAdminByUsernameAndPassword(username, password);
    }


}
module.exports = AdminController;