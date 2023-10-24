// quizModel.js
const fs = require('fs');

//load quizzes from JSON file
const loadQuizzes = () => {
    try {
        const data = fs.readFileSync('quiz.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

//save quizzes to JSON File
const saveQuizzes = (quizzes) => {
    fs.writeFileSync('quiz.json', JSON.stringify(quizzes, null, 2), 'utf8');
};

class Quiz {
    constructor(question, options,correctAnswer,questionID) {
        this.question = question;
        this.options = options;
        this.correctAnswer= correctAnswer;
        this.questionID= questionID;
    }
}

const addQuiz = (question, options,correctAnswer,questionID) => {
    const quiz = new Quiz(question, options,correctAnswer,questionID);
    const quizzes = loadQuizzes();
    quizzes.push(quiz);
    saveQuizzes(quizzes);
    return quiz;
};

const getAllQuizzes = () => loadQuizzes();

module.exports = {
    addQuiz,
    getAllQuizzes,
};