// Selezione degli elementi dal DOM
const startButton = document.getElementById('start-btn');
const playerNameInput = document.getElementById('player-name');
const gameContainer = document.getElementById('game-container');
const questionTitle = document.getElementById('question-title');
const answerButtons = document.querySelectorAll('.answer-btn');
const signatureLabel = document.getElementById('signature-label');
const signatureElement = document.getElementById('signature');
const continueButton = document.getElementById('continue-btn');
const playerNameSpan = document.getElementById('player-name-span');

// Elementi audio
const correctSound = new Audio('right.mp3');
const wrongSound = new Audio('wrong.mp3');
const backgroundMusic = new Audio('background-music.mp3');

// Variabili per gestire lo stato del volume
let isMuted = false;
let score = 0;
let currentQuestionIndex = 0;
let questions = [];
let playerName = '';
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
let startTime;

// Funzione per caricare le domande dal file JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error('Errore nel caricamento delle domande');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        alert('Impossibile caricare le domande. Riprova più tardi.');
    }
}

// Funzione per avviare il gioco
startButton.addEventListener('click', async () => {
    playerName = playerNameInput.value.trim(); // Rimuove spazi bianchi

    if (playerName === "") {
        alert("Per favore, inserisci il tuo nome!");
        return;
    }

    // Mostra la firma con il nome
    signatureElement.textContent = playerName;
    signatureElement.style.animation = "write-signature 3s steps(" + playerName.length + ") forwards";

    // Nasconde la schermata dell'invito
    document.getElementById('invitation-container').style.display = 'none';
    document.getElementById('signature-label').style.display = 'block'; // Mostra la firma

    // Carica le domande e avvia il gioco
    const allQuestions = await loadQuestions();
    questions = getRandomQuestions(allQuestions);

    // Mostra il contenitore del gioco
    gameContainer.style.display = 'block';
    showQuestion();

    // Riproduce la musica di sottofondo
    backgroundMusic.loop = true;
    backgroundMusic.play();

    // Salva l'orario di inizio del gioco
    startTime = Date.now();
});

// Funzione per selezionare casualmente 25 domande
function getRandomQuestions(allQuestions) {
    const selectedQuestions = [];
    while (selectedQuestions.length < 25 && allQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        selectedQuestions.push(allQuestions.splice(randomIndex, 1)[0]);
    }
    return selectedQuestions;
}

// Funzione per gestire la risposta selezionata
function handleAnswer(selectedIndex) {
    const correctAnswerIndex = questions[currentQuestionIndex].correct;

    answerButtons.forEach(button => {
        button.disabled = true;
    });

    if (selectedIndex === correctAnswerIndex) {
        correctSound.play();
        score++;
    } else {
        wrongSound.play();
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            endGame();
        }
    }, 1000);
}

// Mostra la domanda corrente
function showQuestion() {
    const questionObj = questions[currentQuestionIndex];
    questionTitle.textContent = questionObj.question;

    answerButtons.forEach((button, index) => {
        button.textContent = questionObj.answers[index];
        button.onclick = () => handleAnswer(index);
    });
}

// Funzione per visualizzare la lettera di ringraziamento
function showThankYouLetter() {
    // Mostra la lettera di ringraziamento
    document.getElementById('thank-you-letter').style.display = 'block';
    playerNameSpan.textContent = playerName; // Inserisci il nome del giocatore
}

// Mostra la classifica finale e salva i risultati
function endGame() {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    leaderboard.push({ name: playerName, score, time: timeTaken });
    leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
    if (leaderboard.length > 10) leaderboard.pop();
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    // Mostra la lettera di ringraziamento dopo il gioco
    showThankYouLetter();
}
