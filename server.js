const http = require('http');
const UserController = require('./Controller/userController');
const UserView = require('./View/userView');
const AdminController= require('./Controller/adminController');
const AdminView =require('./View/adminView');

const  QuizView = require('./View/quizView');
const {addQuiz, getAllQuizzes, takeQuiz} = require("./Model/quizModel");


const server = http.createServer((req, res) => {
    const userController = new UserController();
    const userView = new UserView();

    //admin controller, admin view

    const adminController = new AdminController();
    const adminView = new AdminView();
    const quizView= new QuizView();


    if (req.method === 'POST' && req.url === '/register') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            try {
                const userData = JSON.parse(data);
                const registeredUser = userController.registerUser(userData);
                delete  registeredUser.password;
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
                    userView.sendSuccessResponse(res, 'Login successful');
                } else {
                    userView.sendErrorResponse(res, 401, 'Authentication failed');
                }
            } catch (error) {
                userView.sendErrorResponse(res, 400, 'Invalid data');
            }
        });
    }else if(req.method==='POST'  && req.url==='/admin/register'){
           let data='';
           req.on('data',(chunk)=>{
               data+=chunk;
           });

           req.on('end',()=>{
               try{
                   const adminData= JSON.parse(data);
                   const registeredAdmin = adminController.registerAdmin(adminData);
                   delete adminData.password;
                   adminView.sendSuccessResponse(res,"Registered admin successfully", adminData);
               }catch (error){
                   adminView.sendErrorResponse(res,400,'Invalid data');
               }
           })


    }else if(req.method==='POST' && req.url==='/admin/login'){
         let data='';
         req.on('data',chunk => {
              data+=chunk;
         });

         req.on('end',()=>{
             try {
                 const {username, password} = JSON.parse(data);
                 const admin = adminController.loginAdmin(username,password);
                 if(admin){
                     delete  admin.password;
                     adminView.sendLogInSuccessResponse(res,"login successful", {admin, access_token: "MyVerySecretAccessToken"});
                 }else{
                     adminView.sendErrorResponse(res,401,'Authentication failed');
                 }

             }catch (error){
                 adminView.sendErrorResponse(res,400,'Invalid');
             }
         })
    }else if( req.method==="POST" && req.url==="/admin/addQuiz"){

        let data="";
         req.on('data',(chunk)=>{
             data+=chunk;
         });

         req.on('end',()=>{
             const {question,options,correctAnswer,questionID} = JSON.parse(data);
            const token= req.headers.authorization;

            try{

                const addedQuiz= addQuiz(question, options,correctAnswer,questionID);
                const quizResponse = {
                    question: addedQuiz.question,
                    options: addedQuiz.options,
                    questionID: addedQuiz.questionID
                    // You can omit the correctAnswer property here
                };
                quizView.sendSuccessResponse(res,"added successfully",quizResponse);
            } catch (error){
                console.log(error);
                quizView.sendErrorResponse(res,400,"invalid data");
            }






         })

    }else if(req.method==="GET" && req.url==="/user/takeQuiz"){

        try{
           const data= getAllQuizzes();


           quizView.sendSuccessResponse(res,"fetched successfully",data);

        }catch (error){
            quizView.sendErrorResponse(res,401,"No quiz is stored");
        }

    }else if(req.method === "POST" && req.url==="/user/submitQuiz"){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {


            let userResponses;
            try {
                userResponses = JSON.parse(body);
                const result = takeQuiz(userResponses);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(result));
            } catch (error) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Invalid JSON in request body'}));

            }
        });
    }
    else {
        userView.sendErrorResponse(res, 404, 'Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});





