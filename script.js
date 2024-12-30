// Selezione degli elementi dal DOM
const startButton = document.getElementById('start-btn');
const playerNameInput = document.getElementById('player-name');
const gameContainer = document.getElementById('game-container');
const questionTitle = document.getElementById('question-title');
const answerButtons = document.querySelectorAll('.answer-btn');
const volumeIcon = document.getElementById('volume-icon');

// Elementi audio
const correctSound = new Audio('right.mp3'); // Suono per risposta corretta
const wrongSound = new Audio('wrong.mp3'); // Suono per risposta errata
const backgroundMusic = new Audio('background-music.mp3'); // Musica di sottofondo

// Variabili globali
let isMuted = false;
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let gameEnded = false; // Nuova variabile per controllare la fine del gioco

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

// Funzione per riprodurre il suono, considerando se il volume è mutato
function playSound(sound) {
    if (!isMuted) {
        sound.play();
    }
}

// Mostra il feedback visivo (giusta o sbagliata)
function showFeedback(imageSrc) {
    const image = document.createElement('img');
    image.src = imageSrc;
    image.classList.add('answer-effect');
    document.body.appendChild(image);

    // Rimuovi l'immagine dopo l'animazione
    setTimeout(() => {
        image.remove();
    }, 1000);
}

// Mostra il punteggio finale
function showEndGame() {
    gameEnded = true; // Imposta lo stato di fine gioco
    alert(`Hai finito il gioco! Il tuo punteggio finale è: ${score}`);
    finalizeGame();
}

// Disabilita la possibilità di resettare il gioco
function finalizeGame() {
    // Nasconde il contenitore del gioco
    gameContainer.style.display = 'none';

    // Nasconde la schermata iniziale permanentemente
    const playerNameContainer = document.getElementById('player-name-container');
    if (playerNameContainer) {
        playerNameContainer.remove();
    }

    // Interrompe la musica di sottofondo
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    // Mostra un messaggio finale
    const endMessage = document.createElement('h1');
    endMessage.textContent = `Grazie per aver giocato! Punteggio: ${score}`;
    endMessage.style.color = 'var(--text-color)';
    document.body.appendChild(endMessage);
}

// Gestisce l'inizio del gioco
startButton.addEventListener('click', async () => {
    if (gameEnded) return; // Impedisce di riavviare se il gioco è finito

    const playerName = playerNameInput.value.trim();
    if (playerName === '') {
        alert('Per favore, inserisci il tuo nome!');
        return;
    }

    // Nasconde la schermata iniziale
    document.getElementById('player-name-container').style.display = 'none';

    // Carica le domande e avvia il gioco
    const allQuestions = await loadQuestions();
    questions = getRandomQuestions(allQuestions);

    // Mostra la prima domanda
    gameContainer.style.display = 'block';
    showQuestion();

    // Riproduce la musica di sottofondo
    backgroundMusic.loop = true;
    backgroundMusic.play();
});

// Gestisce l'icona del volume (mute/unmute per tutti i suoni)
volumeIcon.addEventListener('click', () => {
    isMuted = !isMuted;

    // Cambia l'icona in base allo stato di mute
    if (isMuted) {
        volumeIcon.src = 'mute.png';
        backgroundMusic.pause();
    } else {
        volumeIcon.src = 'volume.png';
        backgroundMusic.play();
    }

    // Muta anche gli altri effetti sonori
    correctSound.muted = isMuted;
    wrongSound.muted = isMuted;
});
