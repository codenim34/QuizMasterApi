const fs = require('fs');
const leaderboardFilePath = 'Database/leaderboard.json';
const mistakesFilePath = 'Database/mistakes.json';
const quizFilePath = 'Database/quiz.json';

// Load quizzes from JSON file
const loadQuizzes = () => {
    try {
        const data = fs.readFileSync(quizFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};
const loadSubjectQuizzes = (subjectName) => {
    try {
        const path = `Database/${subjectName}.json`;
        const data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Save quizzes to JSON File
const saveQuizzes = (quizzes) => {
    fs.writeFileSync(quizFilePath, JSON.stringify(quizzes, null, 2), 'utf8');
};

const saveSubjectQuizzes = (quizzes,subject) => {
    const path = `Database/${subject}.json`;
    fs.writeFileSync(path, JSON.stringify(quizzes, null, 2), 'utf8');
};


class Quiz {
    constructor(question, options, correctAnswers, questionID) {
        this.question = question;
        this.options = options;
        this.correctAnswers = correctAnswers; // Correct answers now an array
        this.questionID = questionID;
    }
}

const addQuiz = ( question, options, correctAnswers) => {
    const quizzes = loadQuizzes();

    // Generate a unique questionID by adding 1 to the maximum existing questionID
    const maxQuestionID = Math.max(...quizzes.map(quiz => parseInt(quiz.questionID) || 0));
    const newQuestionID = (maxQuestionID + 1).toString();

    const quiz = new Quiz(question, options, correctAnswers, newQuestionID);
    quizzes.push(quiz);
    saveQuizzes(quizzes);
    return quiz;
};
const addSubQuiz = ( question, options, correctAnswers,subject) => {
    const quizzes = loadQuizzes();
    const subjectQuizzes = loadSubjectQuizzes(subject);
    // Generate a unique questionID by adding 1 to the maximum existing questionID
    const maxQuestionID = Math.max(...quizzes.map(quiz => parseInt(quiz.questionID) || 0));
    const newQuestionID = (maxQuestionID + 1).toString();

    const quiz = new Quiz(question, options, correctAnswers, newQuestionID);
    quizzes.push(quiz);
    saveQuizzes(quizzes);
    subjectQuizzes.push(quiz);
    saveSubjectQuizzes(subjectQuizzes,subject);
    return quiz;
};


const takeQuiz = (userResponses) => {
    
    const quizzes = loadQuizzes();
    let score = 0;
    let incorrectQuestions = [];
    let noIncorrectQuestions=0;
    userResponses.forEach(response => {
        const quiz = quizzes.find(q => q.questionID === response.questionID);
        if (quiz) {
            const isCorrect = quiz.correctAnswers.length === response.userAnswers.length &&
                response.userAnswers.every(answer => quiz.correctAnswers.includes(answer));
            if (!isCorrect) {
                incorrectQuestions.push(quiz.questionID);
                noIncorrectQuestions++;
            }
            if (isCorrect) {
                score++;
            }
        }

    });
     let TotalQuestions=score+noIncorrectQuestions;
    let sucessRate = ((score/TotalQuestions)*100) + "%";
    updateLeaderboard(userResponses.username, sucessRate);
    updateMistakes(userResponses.username, incorrectQuestions);
   
    return { score,
        noIncorrectQuestions,
        TotalQuestions,
        sucessRate
    };
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

// Load mistakes data from JSON file
const loadMistakes = () => {
    try {
        const data = fs.readFileSync(mistakesFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Save mistakes data to JSON file
const saveMistakes = (mistakes) => {
    fs.writeFileSync(mistakesFilePath, JSON.stringify(mistakes, null, 2), 'utf8');
};

// Function to add mistakes to the mistakes.json
const updateMistakes = (username, incorrectQuestions) => {
    const mistakes = loadMistakes();
    let userMistakes = mistakes.find(m => m.username === username);

    if (userMistakes) {
        // Add new mistakes ensuring no duplicates
        incorrectQuestions.forEach(questionID => {
            if (!userMistakes.mistakes.includes(questionID)) {
                userMistakes.mistakes.push(questionID);
            }
        });
    } else {
        // If user not found, create a new entry
        userMistakes = { username, mistakes: incorrectQuestions };
        mistakes.push(userMistakes);
    }

    saveMistakes(mistakes);
};

// Function to get the questions a user made mistakes on
const getMistakenQuestions = (username) => {
    const mistakes = loadMistakes();
    const userMistakes = mistakes.find(m => m.username === username);

    if (!userMistakes || userMistakes.mistakes.length === 0) {
        return [];
    }

    // Shuffle the mistaken questions
    const shuffledMistakes = userMistakes.mistakes.sort(() => 0.5 - Math.random());

    // Slice the first 10 (or fewer, if there aren't 10)
    const selectedMistakes = shuffledMistakes.slice(0, 10);

    const quizzes = loadQuizzes("quiz");
    return quizzes.filter(quiz => selectedMistakes.includes(quiz.questionID)).map(quiz => {
        return {
            question: quiz.question,
            options: quiz.options,
            questionID: quiz.questionID
        };
    });
};



// New function to get 10 random quizzes
const getRandomQuizzes = () => {
    const quizzes = loadQuizzes("quiz");
    const shuffled = quizzes.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10).map(quiz => {
        return {
            question: quiz.question,
            options: quiz.options,
            questionID: quiz.questionID
        };
    });
};
const getRandomSubQuizzes = (name) => {
    const quizzes = loadSubjectQuizzes(name);
    const shuffled = quizzes.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10).map(quiz => {
        return {
            question: quiz.question,
            options: quiz.options,
            questionID: quiz.questionID
        };
    });
};
const getUserQuizHistory = (username) => {
    const leaderboard = loadLeaderboard();
    const user = leaderboard.find(user => user.username === username);
    if (!user) {
        return null; // or handle as needed
    }
    return user.marks.map((mark, index) => `Quiz ${index + 1}: ${mark}`);
};




module.exports = {
    addQuiz,
    addSubQuiz,
    takeQuiz,
    loadLeaderboard,
    getMistakenQuestions,
    getRandomQuizzes,
    getRandomSubQuizzes,
    getUserQuizHistory,
};
