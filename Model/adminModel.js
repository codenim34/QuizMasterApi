const fs = require('fs');


class adminModel {
    constructor() {
        this.admins = this.loadAdmin();
    }




    loadAdmin() {
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


    function

    createAdmin(admin) {

        this.admins.push(admin);
        this.saveAdmins();
        return admin;

    }

    findAdminByUsernameAndPassword(username, password) {
        return this.admins.find((admin) => admin.username === username && admin.password === password);
    }

    generateToken(username){

    }


}

module.exports = adminModel;