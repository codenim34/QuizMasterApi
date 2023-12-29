// AdminModel.js

const fs = require('fs');

class AdminModel {
    constructor() {
        this.admins = this.loadAdmins();
    }

    loadAdmins() {
        try {
            const adminsData = fs.readFileSync('admins.json', 'utf8');
            return JSON.parse(adminsData);
        } catch (error) {
            return [];
        }
    }

    saveAdmins() {
        fs.writeFileSync('admins.json', JSON.stringify(this.admins, null, 2));
    }

    createAdmin(admin) {
        const existingAdmin = this.admins.find((a) => a.username === admin.username);
        if (existingAdmin) {
            throw new Error('Username is already taken. Please choose another one.');
        }

        this.admins.push(admin);
        this.saveAdmins();
        return admin;
    }

    generateAccessToken(admin) {
        // This is a simple example; we might want to use a more secure token generation method in a real-world scenario.
        //const accessToken = Buffer.from(`${admin.username}:${admin.password}`).toString('base64');
        const accessToken= "$$@#"+admin.username+"4%%56"+admin.password+"789&&";
        admin.accessToken = accessToken;
        this.saveAdmins();
        return accessToken;
    }

    findAdminByAccessToken(accessToken) {
        return this.admins.find((admin) => admin.accessToken === accessToken);
    }

    findAdminByUsernameAndPassword(username, password) {
        return this.admins.find((admin) => admin.username === username && admin.password === password);
    }
}

module.exports = AdminModel;
