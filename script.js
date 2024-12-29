// Caricamento delle domande dal file JSON
fetch('questions.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("Problema nel caricare il file JSON");
        }
        return response.json();
    })
    .then(data => {
        questions = data.questions;
        console.log("Domande caricate: ", questions); // Aggiunto il log per debug
        startGame();
    })
    .catch(error => {
        console.error("Errore nel caricamento del JSON: ", error);
        alert("Errore nel caricamento delle domande. Assicurati che il file questions.json sia presente.");
    });

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
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

backgroundMusic.play();

function startGame() {
    console.log("Inizio del gioco"); // Aggiunto log per debug
    showQuestion();
    nextButton.addEventListener("click", nextQuestion);
    submitLeaderboardButton.addEventListener("click", submitLeaderboard);
}

function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById("question").innerText = question.question;
    answerButtons.innerHTML = ''; // Clear previous answers

    question.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.addEventListener("click", () => checkAnswer(answer.correct));
        answerButtons.appendChild(button);
    });
}

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

function endGame() {
    scoreContainer.classList.remove("hidden");
    scoreElement.innerText = score;
    nextButton.classList.add("hidden");
}

function submitLeaderboard() {
    const playerName = prompt("Enter your name for the leaderboard:");
    if (playerName) {
        let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
        leaderboard.push({ name: playerName, score: score });
        leaderboard.sort((a, b) => b.score - a.score); // Sort leaderboard by score
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
        window.location.href = "leaderboard.html";
    }
}
