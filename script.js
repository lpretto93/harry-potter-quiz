// Selezione degli elementi dal DOM
const startButton = document.getElementById('start-btn');
const playerNameInput = document.getElementById('player-name');
const gameContainer = document.getElementById('game-container');
const questionTitle = document.getElementById('question-title');
const answerButtons = document.querySelectorAll('.answer-btn');
const correctAudio = document.getElementById('correct-audio');
const wrongAudio = document.getElementById('wrong-audio');

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

// Mostra la domanda corrente
function showQuestion() {
    const questionObj = questions[currentQuestionIndex];
    questionTitle.textContent = questionObj.question;

    // Assegna le risposte ai pulsanti
    answerButtons.forEach((button, index) => {
        button.textContent = questionObj.answers[index];
        button.onclick = () => checkAnswer(index); // Gestisce il click
        button.classList.remove('selected'); // Rimuove la selezione da tutte le risposte
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
    image.style.top = '70%';
    image.style.left = '50%';
    image.style.transform = 'translateX(-50%)';
    image.style.zIndex = '1000';

    if (selectedIndex === correctAnswerIndex) {
        image.src = 'right.png';
        correctAudio.play(); // Suona l'audio giusto
        score++; // Incrementa il punteggio se la risposta è corretta
    } else {
        image.src = 'wrong.png';
        wrongAudio.play(); // Suona l'audio sbagliato
    }

    document.body.appendChild(image);

    // Rimuovi l'immagine dopo un paio di secondi
    setTimeout(() => {
        image.remove();
    }, 2000);

    // Passa alla prossima domanda
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        setTimeout(() => {
            showQuestion(); // Mostra la prossima domanda dopo 1 secondo
            isAnswering = false; // Permette di rispondere nuovamente
        }, 1500);
    }
}

// Gestisce l'inizio del gioco
startButton.addEventListener('click', async () => {
    playerName = playerNameInput.value.trim();
    if (playerName === '') {
        alert('Inserisci un nome!');
        return;
    }

    // Nasconde la schermata iniziale
    document.getElementById('player-name-container').style.display = 'none';

    // Carica le domande
    const allQuestions = await loadQuestions();
    questions = getRandomQuestions(allQuestions);
    gameContainer.style.display = 'block'; // Mostra il gioco

    showQuestion(); // Mostra la prima domanda
});
