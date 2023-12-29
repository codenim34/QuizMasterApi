//server.js

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const UserController = require('./Controller/userController');
const UserView = require('./View/userView');
const AdminController = require('./Controller/adminController');
const AdminView = require('./View/adminView');
const QuizView = require('./View/quizView');
const { addQuiz, getAllQuizzes } = require('./Model/quizModel');

const server = http.createServer((req, res) => {
    const userController = new UserController();
    const userView = new UserView();

    const adminController = new AdminController();
    const adminView = new AdminView();
    const quizView = new QuizView();

    const { pathname } = url.parse(req.url);
    const queryParams = querystring.parse(url.parse(req.url).query);

    if (req.method === 'POST' && pathname === '/register') {
        let data = '';
    
        req.on('data', (chunk) => {
            data += chunk;
        });
    
        req.on('end', () => {
            try {
                const registeredUser = userController.registerUser(data);
    
                userView.sendSuccessResponse(res, 'User registered successfully', registeredUser);
            } catch (error) {
                userView.sendErrorResponse(res, 400, error.message);
            }
        });
    } else if (req.method === 'POST' && pathname === '/login') {
        let data = '';
    
        req.on('data', (chunk) => {
            data += chunk;
        });
    
        req.on('end', () => {
            try {
                const user = userController.loginUser(data);
    
                if (user) {
                    userView.sendSuccessResponse(res, 'Login successful');
                } else {
                    userView.sendErrorResponse(res, 401, 'Authentication failed');
                }
            } catch (error) {
                userView.sendErrorResponse(res, 400, error.message);
            }
        });
    } else if (req.method === 'POST' && pathname === '/admin/register') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            try {
                const adminData = JSON.parse(data);
                const registeredAdmin = adminController.registerAdmin(adminData);
                delete adminData.password;
                adminView.sendSuccessResponse(res, 'Registered admin successfully', adminData);
            } catch (error) {
                adminView.sendErrorResponse(res, 400, 'Invalid data');
            }
        });
    } else if (req.method === 'POST' && pathname === '/admin/login') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            try {
                const { username, password } = JSON.parse(data);
                const admin = adminController.loginAdmin(username, password);
                if (admin) {
                    delete admin.password;
                    adminView.sendLogInSuccessResponse(res, 'Login successful', { admin, access_token: 'MyVerySecretAccessToken' });
                } else {
                    adminView.sendErrorResponse(res, 401, 'Authentication failed');
                }
            } catch (error) {
                adminView.sendErrorResponse(res, 400, 'Invalid data');
            }
        });
    } else if (req.method === 'POST' && pathname === '/admin/addQuiz') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            const { question, options, correctAnswer, questionID } = JSON.parse(data);
            const token = req.headers.authorization;

            try {
                const addedQuiz = addQuiz(question, options, correctAnswer, questionID);
                const quizResponse = {
                    question: addedQuiz.question,
                    options: addedQuiz.options,
                    questionID: addedQuiz.questionID,
                };
                quizView.sendSuccessResponse(res, 'Quiz added successfully', quizResponse);
            } catch (error) {
                console.error(error);
                quizView.sendErrorResponse(res, 400, 'Invalid data');
            }
        });
    } else if (req.method === 'GET' && pathname === '/user/takeQuiz') {
        try {
            const data = getAllQuizzes();
            delete data.correctAnswer;
            quizView.sendSuccessResponse(res, 'Quizzes fetched successfully', data);
        } catch (error) {
            quizView.sendErrorResponse(res, 401, 'No quizzes are stored');
        }
    } else {
        userView.sendErrorResponse(res, 404, 'Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

