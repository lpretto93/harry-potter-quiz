const startButton = document.getElementById('start-btn');
const playerNameInput = document.getElementById('player-name');
const gameContainer = document.getElementById('game-container');
const questionTitle = document.getElementById('question-title');
const answerButtons = document.querySelectorAll('.answer-btn');
const leaderboardModal = document.getElementById('leaderboard-modal');
const leaderboardList = document.getElementById('leaderboard-list');
const nextButton = document.getElementById('next-btn');
const lightningContainer = document.getElementById('lightning-container');

let playerName = '';
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let answeredQuestions = [];

// Lista di tutte le domande
const allQuestions = [
    { 
        question: "Chi è l'autore del libro 'Magia per principianti'?",  
        answers: ["Gilderoy Lockhart", "Hermione Granger", "Newt Scamander", "Phineas Nigellus Black"],  
        correct: 2  
    },
    { 
        question: "Qual è il nome completo del padre di Harry Potter?",  
        answers: ["James Harold Potter", "James Sirius Potter", "James Potter", "John Potter"],  
        correct: 3  
    },
    { 
        question: "Qual è la pozione che permette di cambiare aspetto?",  
        answers: ["Amortentia", "Polisucco", "Veritaserum", "Felix Felicis"],  
        correct: 1  
    },
    { 
        question: "Chi era il Direttore della Gringott nella serie di Harry Potter?",  
        answers: ["Ragnok", "Brutus Scrimgeour", "Tom Riddle", "Barty Crouch Sr."],  
        correct: 0  
    },
    { 
        question: "Cosa significa il nome 'Riddle' in italiano?",  
        answers: ["Indovinello", "Romantico", "Predizione", "Reclamo"],  
        correct: 0  
    },
    { 
        question: "Qual è il nome della gemella di Fred Weasley?",  
        answers: ["Ginevra Weasley", "Fleur Delacour", "Hermione Granger", "Georgina Weasley"],  
        correct: 3  
    },
    { 
        question: "Cosa succede a un mangiamorte che infrange il giuramento del silenzio?",  
        answers: ["Perde la sua magia", "Viene punito da Voldemort", "Viene ucciso", "Non succede nulla"],  
        correct: 2  
    },
    { 
        question: "Chi ha ucciso il basilisco in 'Harry Potter e la Camera dei Segreti'?",  
        answers: ["Harry Potter", "Ginny Weasley", "Tom Riddle", "Ron Weasley"],  
        correct: 0  
    },
    { 
        question: "Qual è la prima lezione di Harry Potter alla scuola di magia?",  
        answers: ["Difesa contro le arti oscure", "Pozioni", "Trasfigurazione", "Bacchette magiche"],  
        correct: 1  
    },
    { 
        question: "Dove si trova il nascondiglio della Camera dei Segreti?",  
        answers: ["Sotto il lago", "Nel sotterraneo di Hogwarts", "Nella biblioteca", "Nel corridoio principale"],  
        correct: 1  
    },
    { 
        question: "Qual è il nome completo di Lord Voldemort?",  
        answers: ["Tom Marvolo Riddle", "Tom Felix Riddle", "Marvolo L. Riddle", "Voldemort Tom Marvolo"],  
        correct: 0  
    }
    // Aggiungi altre domande qui...
];

// Funzione per pescare 25 domande casuali
function getRandomQuestions() {
    const availableQuestions = [...allQuestions]; // Copia dell'elenco di tutte le domande
    let selectedQuestions = [];

    while (selectedQuestions.length < 25 && availableQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const question = availableQuestions.splice(randomIndex, 1)[0]; // Rimuove la domanda dalla lista
        selectedQuestions.push(question);
    }

    return selectedQuestions;
}

// Funzione per mostrare una domanda
function showQuestion() {
    const questionObj = questions[currentQuestionIndex];
    questionTitle.textContent = questionObj.question;

    // Popola le risposte nei bottoni
    answerButtons.forEach((button, index) => {
        button.textContent = questionObj.answers[index];
        button.onclick = () => checkAnswer(index);
    });
}

// Funzione per verificare la risposta
function checkAnswer(selectedIndex) {
    const correctAnswerIndex = questions[currentQuestionIndex].correct;

    if (selectedIndex === correctAnswerIndex) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showLeaderboard();
    }
}

// Funzione per mostrare la classifica
function showLeaderboard() {
    leaderboardModal.style.display = 'block';
    const leaderboardItem = document.createElement('li');
    leaderboardItem.textContent = `${playerName} - Punteggio: ${score}`;
    leaderboardList.appendChild(leaderboardItem);
    nextButton.style.display = 'block';
}

// Funzione per iniziare il gioco
startButton.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();
    if (playerName === "") {
        alert("Per favore, inserisci il tuo nome!");
        return;
    }

    // Nascondi la schermata di inserimento nome
    document.getElementById('player-name-container').style.display = 'none';

    // Ottieni 25 domande randomiche
    questions = getRandomQuestions();

    // Mostra la prima domanda
    gameContainer.style.display = 'block';
    showQuestion();
});

// Funzione per gestire il click sul tasto "Gioca ancora"
nextButton.addEventListener('click', () => {
    leaderboardModal.style.display = 'none';
    score = 0;
    currentQuestionIndex = 0;

    // Inizia una nuova partita
    showQuestion();
});
