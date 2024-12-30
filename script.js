// Variabili principali
const startButton = document.getElementById('start-btn');
const playerNameInput = document.getElementById('player-name');
const gameContainer = document.getElementById('game-container');
const questionTitle = document.getElementById('question-title');
const answerButtons = document.querySelectorAll('.answer-btn');
const volumeIcon = document.getElementById('volume-icon');

// Audio
const correctSound = new Audio('right.mp3');
const wrongSound = new Audio('wrong.mp3');
const backgroundMusic = new Audio('background-music.mp3');

// Stato del gioco
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let startTime;
let isMuted = false;
let gameEnded = false;

// Imposta i volumi iniziali
correctSound.volume = 1;
wrongSound.volume = 1;
backgroundMusic.volume = 0.5; // Musica di sottofondo leggermente più bassa

// Funzione per verificare se il nome è unico
function isNameUnique(name) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    return !leaderboard.some(entry => entry.name.toLowerCase() === name.toLowerCase());
}

// Carica le domande
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) throw new Error('Errore nel caricamento delle domande');
        return await response.json();
    } catch (error) {
        console.error(error);
        alert('Impossibile caricare le domande. Riprova più tardi.');
    }
}

// Seleziona 25 domande casuali
function getRandomQuestions(allQuestions) {
    const selectedQuestions = [];
    while (selectedQuestions.length < 25 && allQuestions.length > 0) {
        const index = Math.floor(Math.random() * allQuestions.length);
        selectedQuestions.push(allQuestions.splice(index, 1)[0]);
    }
    return selectedQuestions;
}

// Mostra una domanda
function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionTitle.textContent = question.question;
    answerButtons.forEach((button, index) => {
        button.textContent = question.answers[index];
        button.onclick = () => handleAnswer(index);
    });
}

// Gestisce la risposta
function handleAnswer(index) {
    const correctIndex = questions[currentQuestionIndex].correct;
    if (index === correctIndex) {
        playSound(correctSound);
        score++;
    } else {
        playSound(wrongSound);
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endGame();
    }
}

// Suona l'audio se non è mutato
function playSound(sound) {
    if (!isMuted) {
        sound.currentTime = 0; // Riavvia il suono
        sound.play().catch(err => console.error('Errore nella riproduzione audio:', err));
    }
}

// Fine del gioco
function endGame() {
    gameEnded = true;
    const endTime = new Date().getTime();
    const elapsedTime = Math.floor((endTime - startTime) / 1000);

    // Salva il risultato
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name: playerNameInput.value, score, time: elapsedTime });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    // Mostra la classifica
    window.location.href = 'leaderboard.html';
}

// Gestisce il mute
volumeIcon.addEventListener('click', () => {
    isMuted = !isMuted;
    volumeIcon.src = isMuted ? 'mute.png' : 'volume.png';

    // Applica lo stato di mute a tutti gli audio
    backgroundMusic.muted = isMuted;
    correctSound.muted = isMuted;
    wrongSound.muted = isMuted;
});

// Inizio del gioco
startButton.addEventListener('click', async () => {
    if (gameEnded) return;

    const playerName = playerNameInput.value.trim();
    if (playerName === '') {
        alert('Inserisci il tuo nome!');
        return;
    }
    if (!isNameUnique(playerName)) {
        alert('Il nome è già nella classifica. Non puoi giocare di nuovo.');
        return;
    }

    document.getElementById('player-name-container').style.display = 'none';
    const allQuestions = await loadQuestions();
    questions = getRandomQuestions(allQuestions);
    gameContainer.style.display = 'block';
    startTime = new Date().getTime();
    showQuestion();

    // Avvia la musica di sottofondo
    backgroundMusic.loop = true;
    backgroundMusic.play().catch(err => console.error('Errore nella riproduzione della musica:', err));
});
