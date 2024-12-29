let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let username = "";

const startButton = document.getElementById("start-btn");
const usernameInput = document.getElementById("username");
const quizContainer = document.querySelector(".quiz-container");
const questionElement = document.getElementById("question");
const answerButtons = document.querySelectorAll(".answer-btn");
const scoreElement = document.getElementById("score");
const feedbackImage = document.getElementById("feedback-image");
const feedbackSound = document.getElementById("feedback-sound");
const leaderboardButton = document.getElementById("view-leaderboard-btn");

startButton.addEventListener("click", startGame);
leaderboardButton.addEventListener("click", viewLeaderboard);

function startGame() {
    username = usernameInput.value;
    if (username === "") {
        alert("Per favore inserisci un nome.");
        return;
    }

    // Nascondi la schermata di avvio e mostra il quiz
    document.querySelector(".start-screen").style.display = "none";
    quizContainer.style.display = "block";

    loadQuestions();
    displayQuestion();
}

function loadQuestions() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
        })
        .catch(error => console.log(error));
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showFinalScore();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    currentQuestion.answers.forEach((answer, index) => {
        answerButtons[index].innerText = answer;
        answerButtons[index].onclick = () => handleAnswer(index);
    });
}

function handleAnswer(selectedIndex) {
    const currentQuestion = questions[currentQuestionIndex];
    const correctIndex = currentQuestion.correct;

    if (selectedIndex === correctIndex) {
        score++;
        feedbackImage.src = 'right.png';
        feedbackSound.src = 'right.mp3';
    } else {
        feedbackImage.src = 'wrong.png';
        feedbackSound.src = 'wrong.mp3';
    }

    feedbackImage.style.display = 'block';
    feedbackSound.play();

    setTimeout(() => {
        feedbackImage.style.display = 'none';
        currentQuestionIndex++;
        displayQuestion();
    }, 1000);
}

function showFinalScore() {
    alert(`Il tuo punteggio finale è ${score}`);
    scoreElement.innerText = score;
}

function viewLeaderboard() {
    window.location.href = "leaderboard.html";
}
