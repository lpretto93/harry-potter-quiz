// Selezione degli elementi dal DOM
const startButton = document.getElementById('start-btn');
const playerNameInput = document.getElementById('player-name');
const gameContainer = document.getElementById('game-container');
const questionTitle = document.getElementById('question-title');
const answerButtons = document.querySelectorAll('.answer-btn');

// Icona del volume
const volumeIcon = document.getElementById('volume-icon');

// Elementi audio
const correctSound = new Audio('right.mp3'); // Carica l'audio per la risposta corretta
const wrongSound = new Audio('wrong.mp3'); // Carica l'audio per la risposta errata
const backgroundMusic = new Audio('background-music.mp3'); // Musica di sottofondo

// Variabili per controllare lo stato del volume
let isMuted = false;

// Funzione per caricare le domande dal file JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json'); // Carica il file JSON dallo stesso livello
        if (!response.ok) {
            throw new Error('Errore nel caricamento delle domande');
        }
        const data = await response.json();
        console.log('Domande caricate:', data); // Aggiungi un log per controllare i dati caricati
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
    console.log('Domande selezionate:', selectedQuestions); // Aggiungi un log per controllare le domande selezionate
    return selectedQuestions;
}

// Mostra la domanda corrente
function showQuestion() {
    const questionObj = questions[currentQuestionIndex];
    console.log('Domanda corrente:', questionObj); // Log della domanda corrente
    questionTitle.textContent = questionObj.question;

    // Assegna le risposte ai pulsanti
    answerButtons.forEach((button, index) => {
        button.textContent = questionObj.answers[index];
        button.disabled = false; // Rende i pulsanti nuovamente attivi
        button.onclick = () => handleAnswer(index); // Gestisce il click
    });
}

// Gestisce la risposta selezionata
function handleAnswer(selectedIndex) {
    const correctAnswerIndex = questions[currentQuestionIndex].correct;

    // Disabilita i pulsanti dopo che è stata selezionata una risposta
    answerButtons.forEach(button => {
        button.disabled = true;
    });

    // Effetto visivo e sonoro
    if (selectedIndex === correctAnswerIndex) {
        playSound(correctSound); // Suono giusto
        showFeedback('right.png');
        score++; // Incrementa il punteggio
    } else {
        playSound(wrongSound); // Suono sbagliato
        showFeedback('wrong.png');
    }

    // Passa alla domanda successiva
    currentQuestionIndex++;

    // Verifica se ci sono altre domande
    if (currentQuestionIndex < questions.length) {
        showQuestion(); // Mostra la prossima domanda
    } else {
        showEndGame(); // Fine del gioco
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

    // Rimuovi l'immagine dopo l'animazione (dopo 1 secondo)
    setTimeout(() => {
        image.remove(); // Rimuove l'immagine dopo che l'animazione è finita
    }, 1000);
}

// Mostra il punteggio finale
function showEndGame() {
    alert(`Hai finito il gioco! Il tuo punteggio finale è: ${score}`);
    // Resetta il gioco per una nuova partita
    currentQuestionIndex = 0;
    score = 0;
    gameContainer.style.display = 'none';
    document.getElementById('player-name-container').style.display = 'block'; // Mostra la schermata iniziale
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

    // Riproduce la musica di sottofondo
    backgroundMusic.loop = true;  // Imposta la musica in loop
    backgroundMusic.play();
});

// Gestisce l'icona del volume (mute/unmute per tutti i suoni)
volumeIcon.addEventListener('click', () => {
    isMuted = !isMuted; // Cambia lo stato di mute

    // Cambia l'icona in base allo stato di mute
    if (isMuted) {
        volumeIcon.src = 'mute.png';
        backgroundMusic.pause(); // Mute per la musica di sottofondo
    } else {
        volumeIcon.src = 'volume.png';
        backgroundMusic.play(); // Ripristina la musica di sottofondo
    }

    // Muta anche gli altri effetti sonori
    correctSound.muted = isMuted;
    wrongSound.muted = isMuted;
});
