// userModel.js
const fs = require('fs');

class UserModel {
    constructor() {
        this.users = this.loadUsers();
    }

    loadUsers() {
        try {
            const usersData = fs.readFileSync('users.json', 'utf8');
            return JSON.parse(usersData);
        } catch (error) {
            return [];
        }
    }

    saveUsers() {
        fs.writeFileSync('users.json', JSON.stringify(this.users, null, 2));
    }

    createUser(user) {

        this.users.push(user);
        this.saveUsers();
        return user;
    }

    findUserByUsernameAndPassword(username, password) {
        return this.users.find((user) => user.username === username && user.password === password);
    }
}

module.exports = UserModel;

