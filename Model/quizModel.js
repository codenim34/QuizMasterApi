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
    constructor(question, options,correct_ans,id) {
        this.question = question;
        this.options = options;
        this.correct_ans= correct_ans;
        this.id=id;
    }
}

const addQuiz = (question, options,correct_ans,id) => {
    const quiz = new Quiz(question, options,correct_ans,id);
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