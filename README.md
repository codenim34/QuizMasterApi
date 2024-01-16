# QuizMasterAPI Documentation

## Introduction

Welcome to the QuizMasterAPI, a simple Node.js-based quiz application that allows users to register, login, take quizzes, view their quiz history and compare to others in the leaderboard. Additionally, administrators can register, login, add quizzes, and view the leaderboard. This documentation provides an overview of the project structure, functionality, and usage.

## Project Context

This project is developed by our team, [XtraDrill](#developers), for the Software Project Lab (SWE 4304) during the 3rd semester at the Islamic University of Technology. It represents one of the initial projects undertaken by our team during the early stages of our academic journey.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Installation](#installation)
3. [Usage](#usage)
    - [User Operations](#user-operations)
    - [Admin Operations](#admin-operations)
4. [Endpoints](#endpoints)
5. [GitHub Repository](#github-repository)
6. [Developers](#developers)

## Project Structure

The QuizMasterAPI adopts the **Model-View-Controller (MVC) design pattern**, a widely employed architectural principle in software development. This pattern partitions the application into three cohesive elements:

***Model:*** Manages data handling and encapsulates the core business logic of the application.

***View:*** Concerned with the presentation layer and the user interface, ensuring that data is displayed appropriately to users.

***Controller:*** Acts as an intermediary, processing user inputs, modifying the model as necessary, and updating the view accordingly.

#### The QuizMasterAPI project is organized as follows:

- **Model:**
  - adminModel.js
  - quizModel.js
  - userModel.js

- **View:**
  - adminView.js
  - quizView.js
  - userView.js

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

- **Others:**
  - node_modules (dependencies folder)
  - package-lock.json
  - package.json
  - server.js

## Installation

To run the QuizMasterAPI on your local machine, follow these steps:

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

#### 1. User Registration

To register a new user, send a POST request to `/register` with the user's information in the request body.

#### 2. User Login

To log in as a user, send a POST request to `/login` with the user's credentials in the request body. Successful login returns an access token.

#### 3. Take Quiz

1. Get 10 random quizzes: Send a GET request to `/user/takeQuiz`.
2. Get 10 random quizzes for a specific subject (e.g., physics): Send a GET request to `/user/takeQuiz/physics`.
3. Submit Quiz: Send a POST request to `/user/submitQuiz` with the user's quiz responses.

#### 4. View Mistaken Questions

To view randomly fetched mistaken questions, send a GET request to `/user/mistakes`.

#### 5. View Quiz History

To view the quiz history, send a GET request to `/user/quizhistory`.

#### 6. View Leaderboard

To view the leaderboard, send a GET request to `/leaderboard`.

### Admin Operations

#### 1. Admin Registration

To register a new admin, send a POST request to `/admin/register` with the admin's information in the request body.

#### 2. Admin Login

To log in as an admin, send a POST request to `/admin/login` with the admin's credentials in the request body. Successful login returns an access token.

#### 3. Add Quiz

To add a quiz for a specific subject (e.g., physics), send a POST request to `/admin/addQuiz/physics` with the quiz details in the request body. Admin authentication is required.

#### 4. View Leaderboard

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

The QuizMasterAPI GitHub repository can be found at [https://github.com/codenim34/QuizMasterApi.git](https://github.com/codenim34/QuizMasterApi.git).

## Developers

The QuizMasterAPI project is developed and maintained by [@codenim34](https://github.com/codenim34), [@takitajwar17](https://github.com/takitajwar17) & [@imtiaz-risat](https://github.com/imtiaz-risat).
