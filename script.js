// Selezione degli elementi dal DOM
const startButton = document.getElementById('start-btn');
const playerNameInput = document.getElementById('player-name');
const gameContainer = document.getElementById('game-container');
const questionTitle = document.getElementById('question-title');
const answerButtons = document.querySelectorAll('.answer-btn');
const signatureLabel = document.getElementById('signature-label');
const signatureElement = document.getElementById('signature');
const continueButton = document.getElementById('continue-btn');
const thankYouLetter = document.getElementById('thank-you-letter');
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

    // Mostra la lettera di ringraziamento
    setTimeout(() => {
        thankYouLetter.style.display = 'block';
        playerNameSpan.textContent = playerName;
        continueButton.style.display = 'block';
    }, 3000); // Aspetta 3 secondi

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

// Mostra la classifica finale e salva i risultati
function endGame() {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    leaderboard.push({ name: playerName, score, time: timeTaken });
    leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
    if (leaderboard.length > 10) leaderboard.pop();
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    // Mostra la classifica finale
    displayLeaderboard();
    currentQuestionIndex = 0;
    score = 0;
}

// Visualizza la classifica finale
function displayLeaderboard() {
    const leaderboardContainer = document.createElement('div');
    leaderboardContainer.id = 'leaderboard-container';
    leaderboardContainer.style.textAlign = 'center';

    let leaderboardHTML = '<h1 style="color: goldenrod;">Classifica Finale</h1>';
    leaderboardHTML += '<table style="margin: 0 auto; border-collapse: collapse; width: 80%;">';
    leaderboardHTML += '<tr><th>Posizione</th><th>Nome</th><th>Punteggio</th><th>Tempo (s)</th></tr>';

    leaderboard.forEach((player, index) => {
        leaderboardHTML += `
            <tr>
                <td style="padding: 10px; border: 1px solid #ccc; color: goldenrod;">${index + 1}</td>
                <td style="padding: 10px; border: 1px solid #ccc; color: goldenrod;">${player.name}</td>
                <td style="padding: 10px; border: 1px solid #ccc; color: goldenrod;">${player.score}</td>
                <td style="padding: 10px; border: 1px solid #ccc; color: goldenrod;">${player.time}</td>
            </tr>
        `;
    });

    leaderboardHTML += '</table>';
    leaderboardContainer.innerHTML = leaderboardHTML;

    document.body.appendChild(leaderboardContainer);
}
