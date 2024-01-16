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
    validateQuiz(question, options, correctAnswers);

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

const validateQuiz = (question, options, correctAnswers) => {
    //console.log(correctAnswers.length);
    //console.log(correctAnswers);

    correctAnswers.forEach((answer) => {
        if (answer.length === 0) {
            throw new Error("Invalid data: Correct Answer doesn't contain valid options");
        }
    });
};    

const takeQuiz = (userResponses) => {
    const quizzes = loadQuizzes();
    let score = 0;
    let incorrectQuestions = [];
    let correctQuestions = [];
    let noIncorrectQuestions = 0;

    // Load the user's current mistakes
    const userMistakes = loadMistakes();
    const userMistakesIndex = userMistakes.findIndex(m => m.username === userResponses.username);
    const currentUserMistakes = userMistakesIndex !== -1 ? userMistakes[userMistakesIndex].mistakes : [];

    userResponses.forEach(response => {
        const quiz = quizzes.find(q => q.questionID === response.questionID);
        if (quiz) {
            const isCorrect = quiz.correctAnswers.length === response.userAnswers.length &&
                response.userAnswers.every(answer => quiz.correctAnswers.includes(answer));

            if (isCorrect) {
                score++;
                correctQuestions.push(quiz.questionID);

                // Check if the question is in the user's mistakes and remove it if it is
                const questionIndex = currentUserMistakes.indexOf(quiz.questionID);
                if (questionIndex !== -1) {
                    currentUserMistakes.splice(questionIndex, 1);
                }
            } else {
                incorrectQuestions.push(quiz.questionID);
                noIncorrectQuestions++;

                // Add the incorrect question to the user's mistakes if not already in it
                if (!currentUserMistakes.includes(quiz.questionID)) {
                    currentUserMistakes.push(quiz.questionID);
                }
            }
        }
    });

    let TotalQuestions = score + noIncorrectQuestions;
    let successRate = ((score / TotalQuestions) * 100).toFixed(2);
    updateLeaderboard(userResponses.username, score, TotalQuestions);

    // Update the user's mistakes with the current list
    if (userMistakesIndex !== -1) {
        userMistakes[userMistakesIndex].mistakes = currentUserMistakes;
    } else {
        userMistakes.push({ username: userResponses.username, mistakes: currentUserMistakes });
    }
    saveMistakes(userMistakes);

    return { score, noIncorrectQuestions, TotalQuestions, successRate };
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

const updateLeaderboard = (username, score, totalQuestions) => {
    console.log(`Updating leaderboard for ${username} with score ${score}`);

    const leaderboard = loadLeaderboard();
    const userEntryIndex = leaderboard.findIndex(entry => entry.username === username);

    if (userEntryIndex !== -1) {
        leaderboard[userEntryIndex].marks.push(score);
        const percentage = parseFloat(((score / totalQuestions) * 100).toFixed(2)); // Calculate the percentage as a number
        leaderboard[userEntryIndex].percentages.push(percentage);
    } else {
        leaderboard.push({ username: username, marks: [score], percentages: [parseFloat(((score / totalQuestions) * 100).toFixed(2))] });
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
const updateMistakes = (username, incorrectQuestions, correctQuestions) => {
    const mistakes = loadMistakes();
    let userMistakes = mistakes.find(m => m.username === username);

    if (userMistakes) {
        // Remove correctly answered questions
        correctQuestions.forEach(questionID => {
            const index = userMistakes.mistakes.indexOf(questionID);
            if (index > -1) {
                userMistakes.mistakes.splice(index, 1);
            }
        });

        // Add new mistakes ensuring no duplicates
        incorrectQuestions.forEach(questionID => {
            if (!userMistakes.mistakes.includes(questionID)) {
                userMistakes.mistakes.push(questionID);
            }
        });
    } else {
        // If user not found, create a new entry for incorrect questions
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
    const output = user.marks.map((mark, index) => {
        const percentage = user.percentages[index];
        return `Quiz ${index + 1} : Score-> ${mark} , Rate ->${percentage}%`;
    });

    return output;


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
