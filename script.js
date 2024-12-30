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

// Variabili per gestire lo stato del volume
let isMuted = false;
let score = 0;
let currentQuestionIndex = 0;
let questions = [];
let playerName = '';
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
let startTime; // Per calcolare il tempo impiegato

// Selezione dei feedback visivi
const correctFeedback = document.getElementById('correct-feedback');
const incorrectFeedback = document.getElementById('incorrect-feedback');

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

    // Disabilita i pulsanti dopo che è stata selezionata una risposta
    answerButtons.forEach(button => {
        button.disabled = true;
    });

    // Interrompe gli effetti precedenti (audio e immagini) prima di partire con nuovi effetti
    stopPreviousEffects();

    // Effetto visivo e sonoro
    if (selectedIndex === correctAnswerIndex) {
        playSound(correctSound); // Suono giusto
        showFeedback(true); // Mostra il feedback giusto
        score++; // Incrementa il punteggio
    } else {
        playSound(wrongSound); // Suono sbagliato
        showFeedback(false); // Mostra il feedback sbagliato
    }

    // Aggiungi il ritardo di 1 secondo prima di caricare la prossima domanda
    setTimeout(() => {
        currentQuestionIndex++;

        // Verifica se ci sono altre domande
        if (currentQuestionIndex < questions.length) {
            showQuestion(); // Mostra la prossima domanda
        } else {
            endGame(); // Fine del gioco
        }
    }, 1000); // Tempo di buffer di 1 secondo
}

// Funzione per riprodurre il suono, considerando se il volume è mutato
function playSound(sound) {
    if (!isMuted) {
        sound.play();
    }
}

// Funzione per fermare gli effetti precedenti (audio e immagini)
function stopPreviousEffects() {
    // Ferma i suoni precedenti
    correctSound.pause();
    wrongSound.pause();
    correctSound.currentTime = 0;
    wrongSound.currentTime = 0;

    // Rimuove le immagini precedenti di feedback
    correctFeedback.style.display = 'none';
    incorrectFeedback.style.display = 'none';
}

// Mostra il feedback visivo (giusto/sbagliato)
function showFeedback(isCorrect) {
    if (isCorrect) {
        correctFeedback.style.display = 'block';
        incorrectFeedback.style.display = 'none';
    } else {
        correctFeedback.style.display = 'none';
        incorrectFeedback.style.display = 'block';
    }
}

// Mostra la domanda corrente
function showQuestion() {
    const questionObj = questions[currentQuestionIndex];
    questionTitle.textContent = questionObj.question;

    // Resetta le classi e abilita i pulsanti
    answerButtons.forEach(button => {
        button.classList.remove('selected');
        button.disabled = false; // Riabilita i pulsanti
    });

    // Assegna le risposte ai pulsanti
    answerButtons.forEach((button, index) => {
        button.textContent = questionObj.answers[index];
        button.onclick = () => handleAnswer(index); // Gestisce il click
    });
}

// Mostra il punteggio finale e salva la classifica
function endGame() {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000); // Calcola il tempo impiegato

    // Aggiungi il giocatore alla classifica
    leaderboard.push({ name: playerName, score, time: timeTaken });
    leaderboard.sort((a, b) => b.score - a.score || a.time - b.time); // Ordina per punteggio e tempo
    if (leaderboard.length > 10) leaderboard.pop(); // Mantieni solo i primi 10

    // Salva la classifica
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    // Mostra la classifica finale
    displayLeaderboard();

    // Resetta il gioco per una nuova partita
    currentQuestionIndex = 0;
    score = 0;
    gameContainer.style.display = 'none';
    document.getElementById('player-name-container').style.display = 'block'; // Mostra la schermata iniziale
}

// Funzione per visualizzare la classifica
function displayLeaderboard() {
    const leaderboardModal = window.open('', '_blank', 'width=600,height=400');
    leaderboardModal.document.write('<h1>Classifica</h1>');
    leaderboardModal.document.write('<table><tr><th>Posizione</th><th>Nome</th><th>Punteggio</th><th>Tempo (s)</th></tr>');
    
    leaderboard.forEach((player, index) => {
        leaderboardModal.document.write(`
            <tr>
                <td>${index + 1}</td>
                <td>${player.name}</td>
                <td>${player.score}</td>
                <td>${player.time}</td>
            </tr>
        `);
    });
    
    leaderboardModal.document.write('</table>');
}

// Gestisce l'inizio del gioco
startButton.addEventListener('click', async () => {
    playerName = playerNameInput.value.trim(); // Rimuove spazi bianchi

    if (playerName === "") {
        alert("Per favore, inserisci il tuo nome!");
        return;
    }

    // Controlla se il nome utente è già presente nella classifica
    if (leaderboard.some(player => player.name === playerName)) {
        alert("Il nome utente è già presente nella classifica. Non puoi giocare di nuovo.");
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

    // Salva l'orario di inizio del gioco
    startTime = Date.now();
});

// Gestisce l'icona del volume (mute/unmute per tutti i suoni)
volumeIcon.addEventListener('click', () => {
    isMuted = !isMuted;

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
