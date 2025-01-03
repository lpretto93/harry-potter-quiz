// Global variables
let currentUser = "";
let selectedHouse = "";
let currentQuestionIndex = 0;
let score = 0;

const questions = [
    { question: "Qual è il simbolo della casa di Grifondoro?", answers: ["Leone", "Serpente", "Tasso", "Aquila"], correct: 0 },
    { question: "Chi è il fondatore di Serpeverde?", answers: ["Godric", "Salazar", "Helga", "Rowena"], correct: 1 },
    // Add more questions as needed
];

// Navigation functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const screenElement = document.getElementById(screenId);
    if (screenElement) {
        screenElement.classList.add('active');
    } else {
        console.error(`Schermata con ID ${screenId} non trovata.`);
    }
}

// Event listeners for the start screen
const usernameInput = document.getElementById('username-input');
const usernameSubmit = document.getElementById('username-submit');
const usernameError = document.getElementById('username-error');

usernameSubmit.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username === "") {
        alert("Per favore, inserisci un nome valido.");
        return;
    }

    // Check if the user has already participated (simulation)
    if (localStorage.getItem(username)) {
        usernameError.classList.remove('hidden');
    } else {
        currentUser = username;
        showScreen('letter-screen');
    }
});

// Event for going to the houses screen
const toHousesButton = document.getElementById('to-houses');
toHousesButton.addEventListener('click', () => {
    console.log('Pulsante "Scopri le casate" cliccato.');
    showScreen('houses-screen');
});

// Event listeners for choosing houses
const houses = document.querySelectorAll('.house');
houses.forEach(house => {
    house.addEventListener('click', () => {
        selectedHouse = house.getAttribute('data-house');
        showScreen('quiz-screen');
        loadQuestion();
    });
});

// Quiz functions
const questionElement = document.getElementById('question');
const answersContainer = document.getElementById('answers-container');
const nextQuestionButton = document.getElementById('next-question');

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    answersContainer.innerHTML = "";

    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.addEventListener('click', () => {
            if (index === currentQuestion.correct) {
                score++;
            }
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
            } else {
                showResult();
            }
        });
        answersContainer.appendChild(button);
    });
}

// Function to show the result
function showResult() {
    const resultMessage = document.getElementById('result-message');
    const resultLogo = document.getElementById('result-logo');

    if (score / questions.length >= 0.9) {
        resultMessage.textContent = `Congratulazioni! Sei stato assegnato a ${selectedHouse}!`;
        resultLogo.src = `images/houses/${selectedHouse.toLowerCase()}.png`;
    } else if (score / questions.length >= 0.7) {
        const randomHouse = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'].filter(house => house !== selectedHouse)[Math.floor(Math.random() * 3)];
        resultMessage.textContent = `Hai fatto del tuo meglio! Sei stato assegnato a ${randomHouse}.`;
        resultLogo.src = `images/houses/${randomHouse.toLowerCase()}.png`;
    } else {
        resultMessage.textContent = "Mi spiace, non sei stato ammesso a Hogwarts.";
        resultLogo.src = "images/denied.png";
    }

    showScreen('result-screen');
}

// Event listeners for viewing the ranking
const viewRankingButton = document.getElementById('view-ranking');
viewRankingButton.addEventListener('click', () => {
    localStorage.setItem(currentUser, true);
    alert("Classifica non implementata in questa demo.");
    // Redirect or implement ranking here
});

// Funzione per mostrare il risultato
function showResult() {
    const resultMessage = document.getElementById('result-message');
    const resultLogo = document.getElementById('result-logo');

   
