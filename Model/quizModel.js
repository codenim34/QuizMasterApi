const fs = require('fs');
const leaderboardFilePath = 'leaderboard.json';

// Load quizzes from JSON file
const loadQuizzes = () => {
    try {
        const data = fs.readFileSync('quiz.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Save quizzes to JSON File
const saveQuizzes = (quizzes) => {
    fs.writeFileSync('quiz.json', JSON.stringify(quizzes, null, 2), 'utf8');
};

class Quiz {
    constructor(question, options, correctAnswers, questionID) {
        this.question = question;
        this.options = options;
        this.correctAnswers = correctAnswers; // Correct answers now an array
        this.questionID = questionID;
    }
}

const addQuiz = (question, options, correctAnswers, questionID) => {
    const quiz = new Quiz(question, options, correctAnswers, questionID);
    const quizzes = loadQuizzes();
    quizzes.push(quiz);
    saveQuizzes(quizzes);
    return quiz;
};

const getAllQuizzes = () => {
    return loadQuizzes();
};

const takeQuiz = (userResponses) => {
    console.log("Received User Responses:", userResponses);
    const quizzes = loadQuizzes();
    let score = 0;

    userResponses.forEach(response => {
        const quiz = quizzes.find(q => q.questionID === response.questionID);
        if (quiz) {
            // Check if all user's answers match the correct answers
            const isCorrect = quiz.correctAnswers.length === response.userAnswers.length &&
                response.userAnswers.every(answer => quiz.correctAnswers.includes(answer));
            if (isCorrect) {
                score++;
            }
        }
    });

    updateLeaderboard(userResponses.username, score); // Pass the correct username
    return { score };
};


const loadLeaderboard = () => {
    try {
        const data = fs.readFileSync(leaderboardFilePath, 'utf8');

        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};


const saveLeaderboard = (leaderboard) => {
    fs.writeFileSync(leaderboardFilePath, JSON.stringify(leaderboard, null, 2), 'utf8');
};

const updateLeaderboard = (username, score) => {
    console.log(`Updating leaderboard for ${username} with score ${score}`);

    const leaderboard = loadLeaderboard();
    const userEntryIndex = leaderboard.findIndex(entry => entry.username === username);

    if (userEntryIndex !== -1) {
        leaderboard[userEntryIndex].marks.push(score);
    } else {
        leaderboard.push({ username: username, marks: [score] });
    }

    saveLeaderboard(leaderboard);
};





module.exports = {
    addQuiz,
    getAllQuizzes,
    takeQuiz,
    loadLeaderboard
};
