# QuizMasterAPI Documentation

## Introduction

Welcome to the QuizMasterAPI, a simple Node.js-based quiz application that allows users to register, login, take quizzes, view their quiz history and compare to others in the leaderboard. Additionally, administrators can register, login, add quizzes, and view the leaderboard. This documentation provides an overview of the project structure, functionality, and usage.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Installation](#installation)
3. [Usage](#usage)
    - [User Operations](#user-operations)
    - [Admin Operations](#admin-operations)
4. [Endpoints](#endpoints)
5. [GitHub Repository](#github-repository)
6. [Developers](#Developers)

## Project Structure

The QuizApp project is organized into the following directories:

- **Controller:**
  - adminController.js
  - userController.js

- **Database:**
  - admins.json
  - chemistry.json
  - english.json
  - leaderboard.json
  - math.json
  - mistakes.json
  - physics.json
  - quiz.json
  - users.json

- **Model:**
  - adminModel.js
  - quizModel.js
  - userModel.js

- **View:**
  - adminView.js
  - quizView.js
  - userView.js

- **Others:**
  - node_modules (dependencies folder)
  - package-lock.json
  - package.json
  - server.js

## Installation

To run the QuizApp on your local machine, follow these steps:

1. Ensure you have Node.js installed. If not, download and install it from [https://nodejs.org/](https://nodejs.org/).

2. Clone the GitHub repository to your local machine.

    ```bash
    git clone https://github.com/codenim34/QuizMasterApi.git
    ```

3. Navigate to the project directory.

    ```bash
    cd QuizMasterApi
    ```

4. Install the project dependencies.

    ```bash
    npm install
    ```

## Usage

### User Operations

#### User Registration

To register a new user, send a POST request to `/register` with the user's information in the request body.

#### User Login

To log in as a user, send a POST request to `/login` with the user's credentials in the request body. Successful login returns an access token.

#### Take Quiz

1. Get 10 random quizzes: Send a GET request to `/user/takeQuiz`.
2. Get 10 random quizzes for a specific subject (e.g., physics): Send a GET request to `/user/takeQuiz/physics`.
3. Submit Quiz: Send a POST request to `/user/submitQuiz` with the user's quiz responses.

#### View Mistaken Questions

To view randomly fetched mistaken questions, send a GET request to `/user/mistakes`.

#### View Quiz History

To view the quiz history, send a GET request to `/user/quizhistory`.

### Admin Operations

#### Admin Registration

To register a new admin, send a POST request to `/admin/register` with the admin's information in the request body.

#### Admin Login

To log in as an admin, send a POST request to `/admin/login` with the admin's credentials in the request body. Successful login returns an access token.

#### Add Quiz

To add a quiz for a specific subject (e.g., physics), send a POST request to `/admin/addQuiz/physics` with the quiz details in the request body. Admin authentication is required.

#### View Leaderboard

To view the leaderboard, send a GET request to `/leaderboard`.

## Endpoints

1. **User Endpoints:**
    - `POST /register`: User registration.
    - `POST /login`: User login.
    - `GET /user/takeQuiz`: Get 10 random quizzes.
    - `GET /user/takeQuiz/{subject}`: Get 10 random quizzes for a specific subject.
    - `POST /user/submitQuiz`: Submit a quiz.
    - `GET /user/mistakes`: View mistaken questions.
    - `GET /user/quizhistory`: View quiz history.
    - `GET /leaderboard`: View the leaderboard.
    

2. **Admin Endpoints:**
    - `POST /admin/register`: Admin registration.
    - `POST /admin/login`: Admin login.
    - `POST /admin/addQuiz/{subject}`: Add a quiz for a specific subject.
    - `GET /leaderboard`: View the leaderboard.

## GitHub Repository

The QuizApp GitHub repository can be found at [https://github.com/codenim34/QuizMasterApi.git](https://github.com/codenim34/QuizMasterApi.git).

## Developers

The QuizMasterAPI project is developed and maintained by [@codenim34](https://github.com/codenim34), [@takitajwar17](https://github.com/takitajwar17) & [@imtiaz-risat](https://github.com/imtiaz-risat).
