// Elementi DOM
const startButton = document.getElementById('start-btn');
const playerNameInput = document.getElementById('player-name');
const gameContainer = document.getElementById('game-container');
const questionTitle = document.getElementById('question-title');
const answerButtons = document.querySelectorAll('.answer-btn');
const volumeIcon = document.getElementById('volume-icon');

// Audio
const backgroundMusic = new Audio('background-music.mp3');
const correctSound = new Audio('right.mp3');
const wrongSound = new Audio('wrong.mp3');

// Variabili di gioco
let isMuted = false;
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Funzione per caricare domande
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) throw new Error('Errore nel caricamento delle domande');
        return await response.json();
    } catch (error) {
        console.error(error);
        alert('Errore nel caricamento delle domande.');
        return [];
    }
}

// Mostra la domanda corrente
function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionTitle.textContent = question.question;
    answerButtons.forEach((btn, index) => {
        btn.textContent = question.answers[index];
        btn.onclick = () => handleAnswer(index);
        btn.disabled = false;
    });
}

// Gestisce la risposta
function handleAnswer(selectedIndex) {
    const correctIndex = questions[currentQuestionIndex].correct;
    answerButtons.forEach(btn => (btn.disabled = true));

    if (selectedIndex === correctIndex) {
        playSound(correctSound);
        showFeedback('right.png');
        score++;
    } else {
        playSound(wrongSound);
        showFeedback('wrong.png');
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        setTimeout(showQuestion, 1000);
    } else {
        setTimeout(showEndGame, 1000);
    }
}

// Mostra immagine feedback
function showFeedback(imageSrc) {
    const feedbackImage = document.createElement('img');
    feedbackImage.src = imageSrc;
    feedbackImage.className = 'answer-effect';
    document.body.appendChild(feedbackImage);
    feedbackImage.addEventListener('animationend', () => feedbackImage.remove());
}

// Mostra punteggio finale
function showEndGame() {
    alert(`Gioco terminato! Punteggio: ${score}`);
    resetGame();
}

// Resetta il gioco
function resetGame() {
    currentQuestionIndex = 0;
    score = 0;
    gameContainer.style.display = 'none';
    playerNameInput.value = '';
    document.getElementById('player-name-container').style.display = 'block';
}

// Inizio gioco
startButton.addEventListener('click', async () => {
    const playerName = playerNameInput.value.trim();
    if (!playerName) return alert('Inserisci il tuo nome!');

    document.getElementById('player-name-container').style.display = 'none';
    gameContainer.style.display = 'block';
    questions = await loadQuestions();
    backgroundMusic.loop = true;
    toggleMute(false); // Attiva audio
    showQuestion();
    backgroundMusic.play();
});

// Gestione volume
volumeIcon.addEventListener('click', () => {
    isMuted = !isMuted;
    toggleMute(isMuted);
});

function toggleMute(mute) {
    volumeIcon.src = mute ? 'mute.png' : 'volume.png';
    backgroundMusic.muted = mute;
    correctSound.muted = mute;
    wrongSound.muted = mute;
}

function playSound(sound) {
    if (!isMuted) sound.play();
}
