// Selezione degli elementi dal DOM
const startButton = document.getElementById('start-btn');
const playerNameInput = document.getElementById('player-name');
const gameContainer = document.getElementById('game-container');
const questionTitle = document.getElementById('question-title');
const answerButtons = document.querySelectorAll('.answer-btn');
const volumeIcon = document.getElementById('volume-icon');

// Elementi audio
const correctSound = new Audio('right.mp3');
const wrongSound = new Audio('wrong.mp3');
const backgroundMusic = new Audio('background-music.mp3');

// Variabili globali
let isMuted = false;
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let gameEnded = false;
let startTime; // Timestamp di inizio del gioco

// Funzione per caricare le domande dal file JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) throw new Error('Errore nel caricamento delle domande');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        alert('Impossibile caricare le domande. Riprova più tardi.');
    }
}

// Funzione per selezionare casualmente 25 domande
function getRandomQuestions(allQuestions) {
    const selectedQuestions = [];
    while (selectedQuestions.length < 25 && allQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        selectedQuestions.push(allQuestions.splice(randomIndex, 1)[0]);
    }
    return selectedQuestions;
}

// Mostra la domanda corrente
function showQuestion() {
    const questionObj = questions[currentQuestionIndex];
    questionTitle.textContent = questionObj.question;

    // Assegna le risposte ai pulsanti
    answerButtons.forEach((button, index) => {
        button.textContent = questionObj.answers[index];
        button.disabled = false;
        button.onclick = () => handleAnswer(index);
    });

    // Imposta il focus sul primo pulsante
    answerButtons[0].focus();
}

// Gestisce la risposta selezionata
function handleAnswer(selectedIndex) {
    const correctIndex = questions[currentQuestionIndex].correct;

    // Disabilita i pulsanti e rimuove il focus
    answerButtons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === selectedIndex) btn.blur();
    });

    // Effetto visivo e sonoro
    if (selectedIndex === correctIndex) {
        playSound(correctSound);
        showFeedback('right.png');
        score++;
    } else {
        playSound(wrongSound);
        showFeedback('wrong.png');
    }

    // Passa alla prossima domanda con un ritardo
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        setTimeout(() => {
            showQuestion();
        }, 1000);
    } else {
        setTimeout(showEndGame, 1000);
    }
}

// Funzione per riprodurre il suono
function playSound(sound) {
    if (!isMuted) {
        sound.play();
    }
}

// Mostra il feedback visivo
function showFeedback(imageSrc) {
    const image = document.createElement('img');
    image.src = imageSrc;
    image.classList.add('answer-effect');
    document.body.appendChild(image);

    setTimeout(() => {
        image.remove();
    }, 1000);
}

// Mostra il punteggio finale e salva nella classifica
function showEndGame() {
    gameEnded = true;
    const endTime = new Date().getTime(); // Tempo finale
    const timeTaken = Math.round((endTime - startTime) / 1000); // Calcola il tempo impiegato

    alert(`Hai finito il gioco! Il tuo punteggio finale è: ${score} in ${timeTaken} secondi.`);

    saveToLeaderboard(playerNameInput.value, score, timeTaken); // Salva nella classifica
    showLeaderboardLink(); // Mostra il link alla classifica
}

// Salva i dati della classifica in Local Storage
function saveToLeaderboard(name, score, time) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name, score, time });
    leaderboard.sort((a, b) => b.score - a.score || a.time - b.time); // Ordina per punteggio e tempo
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// Mostra il link alla classifica
function showLeaderboardLink() {
    const link = document.createElement('a');
    link.href = 'leaderboard.html';
    link.textContent = 'Visualizza la classifica';
    link.style.display = 'block';
    link.style.marginTop = '20px';
    link.style.fontSize = '1.5rem';
    link.style.color = 'gold';
    document.body.appendChild(link);
}

// Gestisce l'inizio del gioco
startButton.addEventListener('click', async () => {
    if (gameEnded) return;

    const playerName = playerNameInput.value.trim();
    if (playerName === '') {
        alert('Per favore, inserisci il tuo nome!');
        return;
    }

    document.getElementById('player-name-container').style.display = 'none';
    const allQuestions = await loadQuestions();
    questions = getRandomQuestions(allQuestions);

    gameContainer.style.display = 'block';
    startTime = new Date().getTime(); // Timestamp di inizio
    showQuestion();

    backgroundMusic.loop = true;
    backgroundMusic.play();
});

// Gestisce il mute/unmute
volumeIcon.addEventListener('click', () => {
    isMuted = !isMuted;
    volumeIcon.src = isMuted ? 'mute.png' : 'volume.png';
    backgroundMusic[isMuted ? 'pause' : 'play']();
});
