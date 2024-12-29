// Selezione degli elementi dal DOM
const startButton = document.getElementById('start-btn');
const playerNameInput = document.getElementById('player-name');
const gameContainer = document.getElementById('game-container');
const questionTitle = document.getElementById('question-title');
const answerButtons = document.querySelectorAll('.answer-btn');
const leaderboardModal = document.getElementById('leaderboard-modal');
const leaderboardList = document.getElementById('leaderboard-list');
const nextButton = document.getElementById('next-btn');

// Variabili globali per lo stato del gioco
let playerName = '';
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let isAnswering = false; // Per evitare risposte durante il "black screen"

// Funzione per caricare le domande dal file JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json'); // Carica il file JSON dallo stesso livello
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

// Funzione per resettare la selezione delle risposte
function resetAnswerSelection() {
    answerButtons.forEach(button => {
        button.classList.remove('selected'); // Rimuove la classe "selected" da ogni pulsante
        button.disabled = false; // Riabilita i pulsanti (nel caso fossero disabilitati)
    });
}

// Mostra la domanda corrente
function showQuestion() {
    if (isAnswering) return; // Non permette di rispondere durante il "black screen"
    
    // Reset della selezione precedente delle risposte
    resetAnswerSelection();

    const questionObj = questions[currentQuestionIndex];
    questionTitle.textContent = questionObj.question;

    // Assegna le risposte ai pulsanti
    answerButtons.forEach((button, index) => {
        button.textContent = questionObj.answers[index];
        button.onclick = () => checkAnswer(index); // Gestisce il click
    });
}

// Verifica la risposta selezionata
function checkAnswer(selectedIndex) {
    if (isAnswering) return; // Evita di rispondere se già in attesa
    isAnswering = true;

    const correctAnswerIndex = questions[currentQuestionIndex].correct;

    // Mostra l'effetto visivo (immagine giusta o sbagliata)
    const image = document.createElement('img');
    image.classList.add('answer-effect');
    image.style.position = 'absolute';
    image.style.top = '50%';
    image.style.left = '50%';
    image.style.transform = 'translate(-50%, -50%)';
    image.style.zIndex = '1000';

    if (selectedIndex === correctAnswerIndex) {
        image.src = 'right.png';  // Usa il percorso relativo per le immagini locali
        score++; // Incrementa il punteggio se la risposta è corretta
    } else {
        image.src = 'wrong.png';
    }
    
    document.body.appendChild(image);

    // Rimuovi l'immagine dopo un paio di secondi
    setTimeout(() => {
        image.remove();
    }, 2000);

    // Mostra la schermata nera per mezzo secondo
    document.body.style.backgroundColor = 'black';
    setTimeout(() => {
        document.body.style.backgroundColor = ''; // Torna al colore normale
    }, 500);

    currentQuestionIndex++; // Passa alla prossima domanda

    if (currentQuestionIndex < questions.length) {
        setTimeout(() => {
            showQuestion(); // Mostra la prossima domanda dopo 3 secondi
            isAnswering = false; // Permette di rispondere nuovamente
        }, 3000);
    } else {
        setTimeout(() => {
            alert("Hai completato il gioco!"); // Mostra un messaggio di fine gioco
        }, 3000);
    }
}

// Gestisce l'inizio del gioco
startButton.addEventListener('click', async () => {
    playerName = playerNameInput.value.trim(); // Rimuove spazi bianchi

    if (playerName === "") {
        alert("Per favore, inserisci il tuo nome!"); // Verifica che il nome sia valido
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
});

