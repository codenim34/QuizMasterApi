const http = require('http');
const UserController = require('./Controller/userController');
const UserView = require('./View/userView');

const server = http.createServer((req, res) => {
    const userController = new UserController();
    const userView = new UserView();

    if (req.method === 'POST' && req.url === '/register') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            try {
                const userData = JSON.parse(data);
                const registeredUser = userController.registerUser(userData);
                userView.sendSuccessResponse(res, 'User registered successfully', registeredUser);
            } catch (error) {
                userView.sendErrorResponse(res, 400, 'Invalid data');
            }
        });
    } else if (req.method === 'POST' && req.url === '/login') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            try {
                const { username, password } = JSON.parse(data);
                const user = userController.loginUser(username, password);
                if (user) {
                    userView.sendSuccessResponse(res, 'Login successful', user);
                } else {
                    userView.sendErrorResponse(res, 401, 'Authentication failed');
                }
            } catch (error) {
                userView.sendErrorResponse(res, 400, 'Invalid data');
            }
        });
    } else {
        userView.sendErrorResponse(res, 404, 'Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
