const http = require("http");
const url = require("url");
const querystring = require("querystring");
const UserController = require("./Controller/userController");
const UserView = require("./View/userView");
const AdminController = require("./Controller/adminController");
const AdminView = require("./View/adminView");
const { addQuiz, getAllQuizzes, takeQuiz, loadLeaderboard} = require("./Model/quizModel");

const QuizView = require("./View/quizView");

const server = http.createServer((req, res) => {
  const userController = new UserController();
  const userView = new UserView();

  const adminController = new AdminController();
  const adminView = new AdminView();
  const quizView = new QuizView();
  const { pathname } = url.parse(req.url);

  if (req.method === "POST" && pathname === "/register") {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        const registeredUser = userController.registerUser(data);

        userView.sendSuccessResponse(
            res,
            "User registered successfully",
            registeredUser
        );
      } catch (error) {
        userView.sendErrorResponse(res, 400, error.message);
      }
    });
  } else if (req.method === "POST" && pathname === "/login") {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      try {
        const result = userController.loginUser(data);

        if (result) {
          const { user, accessToken } = result;
          delete user.password;
          userView.sendLogInSuccessResponse(res, "Login successful", {
            user,
            access_token: accessToken,
          });
        } else {
          userView.sendErrorResponse(res, 401, "Authentication failed");
        }
      } catch (error) {
        userView.sendErrorResponse(res, 400, error.message);
      }
    });
  } else if (req.method === "POST" && pathname === "/admin/register") {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      try {
        const registeredAdmin = adminController.registerAdmin(data);
        adminView.sendSuccessResponse(
            res,
            "Admin registered successfully",
            registeredAdmin
        );
      } catch (error) {
        adminView.sendErrorResponse(res, 400, error.message);
      }
    });
  } else if (req.method === "POST" && pathname === "/admin/login") {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      try {
        const loginResult = adminController.loginAdmin(data);

        if (loginResult) {
          const { admin, accessToken } = loginResult;
          delete admin.password;
          adminView.sendLogInSuccessResponse(res, "Login successful", {
            admin,
            access_token: accessToken,
          });
        } else {
          adminView.sendErrorResponse(res, 401, "Authentication failed");
        }
      } catch (error) {
        adminView.sendErrorResponse(res, 400, error.message);
      }
    });
  } else if (req.method === "POST" && pathname === "/admin/addQuiz") {
    adminController.authenticateAdmin(req, res, () => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });

      req.on("end", () => {
        const { question, options, correctAnswers, questionID } = JSON.parse(
            data
        );
        try {
          const addedQuiz = addQuiz(
              question,
              options,
              correctAnswers,
              questionID
          );
          const quizResponse = {
            question: addedQuiz.question,
            options: addedQuiz.options,
            questionID: addedQuiz.questionID,
          };
          quizView.sendSuccessResponse(
              res,
              "Quiz added successfully",
              quizResponse
          );
        } catch (error) {
          console.error(error);
          quizView.sendErrorResponse(res, 400, "Invalid data");
        }
      });
    });
  } else if (req.method === "GET" && req.url === "/user/takeQuiz") {
    try {
      const data = getAllQuizzes();

      quizView.sendSuccessResponse(res, "fetched successfully", data);
    } catch (error) {
      quizView.sendErrorResponse(res, 401, "No quiz is stored");
    }
  } else if (req.method === "POST" && req.url === "/user/submitQuiz") {
    userController.authenticateUser(req, res, () => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          let userResponses = JSON.parse(body);
          userResponses.username = req.user.username;
          const result = takeQuiz(userResponses);

          const response = {
            name: req.user.name,
            score: result.score,
          };
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(response));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
              JSON.stringify({ error: "Invalid JSON in request body" })
          );
        }
      });
    });
  } else if (req.method === "GET" && req.url === "/leaderboard") {
    try {
      const leaderboard = loadLeaderboard();

      // Calculate the total score for each user and sort the leaderboard
      const sortedLeaderboard = leaderboard.map(entry => ({
        username: entry.username,
        score: entry.marks.reduce((acc, cur) => acc + cur, 0)
      })).sort((a, b) => b.score - a.score);

      quizView.sendSuccessResponse(
          res,
          "Leaderboard fetched successfully",
          sortedLeaderboard
      );
    } catch (error) {
      quizView.sendErrorResponse(res, 500, "Internal Server Error");
    }
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
