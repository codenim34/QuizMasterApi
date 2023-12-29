// UserModel.js

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
        const existingUser = this.users.find((u) => u.username === user.username);
        if (existingUser) {
            throw new Error('Username is already taken. Please choose another one.');
        }

        this.users.push(user);
        this.saveUsers();
        return user;
    }
    generateAccessToken(user) {
        // This is a simple example; we might want to use a more secure token generation method in a real-world scenario.
        //const accessToken = Buffer.from(`${admin.username}:${admin.password}`).toString('base64');
        const accessToken= "$$@#"+user.username+"4%%56"+user.password+"789&&";
        user.accessToken = accessToken;
        this.saveUsers();
        return accessToken;
    }

    findAdminByAccessToken(accessToken) {
        return this.users.find((admin) => admin.accessToken === accessToken);
    }

    findUserByUsernameAndPassword(username, password) {
        return this.users.find((user) => user.username === username && user.password === password);
    }
}

module.exports = UserModel;
