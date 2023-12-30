const fs = require('fs');

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

    return { score };
};


module.exports = {
    addQuiz,
    getAllQuizzes,
    takeQuiz,
};
