let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let username = '';

const questionContainer = document.getElementById("question-container");
const answerButtons = document.getElementById("answer-buttons");
const resultContainer = document.getElementById("result");
const nextButton = document.getElementById("next-button");
const scoreContainer = document.getElementById("score-container");
const scoreElement = document.getElementById("score");
const submitLeaderboardButton = document.getElementById("submit-leaderboard");

const backgroundMusic = document.getElementById("background-music");
const rightSound = document.getElementById("right-sound");
const wrongSound = document.getElementById("wrong-sound");

const usernameInput = document.getElementById("username");
const startButton = document.getElementById("start-button");
const usernameContainer = document.getElementById("username-container");
const quizContainer = document.getElementById("quiz-container");

backgroundMusic.play();

// Caricamento delle domande dal file JSON
fetch('questions.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Errore nel caricamento delle domande');
        }
        return response.json();
    })
    .then(data => {
        questions = data.questions;
    })
    .catch(error => {
        console.error("Errore nel caricamento delle domande: ", error);
        alert("Errore nel caricamento delle domande.");
    });

// Inizializza il gioco quando si preme il tasto "Inizia il Gioco"
startButton.addEventListener("click", () => {
    username = usernameInput.value.trim();
    if (username === '') {
        alert("Per favore, inserisci un nome.");
        return;
    }

    // Nasconde la sezione del nome utente e mostra il quiz
    usernameContainer.classList.add("hidden");
    quizContainer.classList.remove("hidden");

    startGame();
});

// Funzione per avviare il gioco
function startGame() {
    showQuestion();
    nextButton.addEventListener("click", nextQuestion);
    submitLeaderboardButton.addEventListener("click", submitLeaderboard);
}

// Mostra la domanda e le risposte
function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById("question").innerText = question.question;
    answerButtons.innerHTML = ''; // Clear previous answers

    question.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.addEventListener("click", () => checkAnswer(answer.correct));
        answerButtons.appendChild(button);
    });
}

// Controlla se la risposta è corretta
function checkAnswer(isCorrect) {
    if (isCorrect) {
        resultContainer.innerHTML = "<img src='right.png' alt='Correct' style='width:100%; height:auto;'>";
        rightSound.play();
        score++;
    } else {
        resultContainer.innerHTML = "<img src='wrong.png' alt='Wrong' style='width:100%; height:auto;'>";
        wrongSound.play();
    }
    nextButton.classList.remove("hidden");
}

// Passa alla domanda successiva
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endGame();
    }
    resultContainer.innerHTML = ''; // Clear result
    nextButton.classList.add("hidden");
}

// Fine del gioco
function endGame() {
    scoreContainer.classList.remove("hidden");
    scoreElement.innerText = score;
    nextButton.classList.add("hidden");
}

// Salva la classifica
function submitLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name: username, score: score });
    leaderboard.sort((a, b) => b.score - a.score); // Sort leaderboard by score
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    window.location.href = "leaderboard.html";
}

