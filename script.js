
let questions = [];  // Array per le domande
let currentQuestionIndex = 0;  // Indice della domanda corrente
let score = 0;  // Punteggio dell'utente

// Funzione per caricare le domande da JSON
function loadQuestions() {
    fetch('questions.json')  // Carica il file JSON
        .then(response => {
            if (!response.ok) {
                throw new Error('Impossibile caricare il file JSON');
            }
            return response.json();
        })
        .then(data => {
            questions = data.questions;  // Memorizza le domande
            loadQuestion();  // Carica la prima domanda
        })
        .catch(error => {
            console.error('Errore nel caricare le domande:', error);
        });
}

// Funzione per caricare la domanda corrente
function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        document.getElementById('question').textContent = currentQuestion.question;
        let answers = currentQuestion.answers;
        let buttons = document.querySelectorAll('#answers-container button');
        buttons.forEach((button, index) => {
            button.textContent = answers[index];
            button.classList.remove('correct', 'incorrect');
            button.disabled = false;
        });
        document.getElementById('next-question').style.display = 'none';  // Nascondi il pulsante per la domanda successiva fino a che l'utente non risponde
    } else {
        showResult();  // Mostra il risultato finale quando tutte le domande sono completate
    }
}

// Funzione per verificare la risposta selezionata
function checkAnswer(selectedAnswer) {
    let correctAnswer = questions[currentQuestionIndex].correctAnswer;
    let buttons = document.querySelectorAll('#answers-container button');
    buttons.forEach(button => {
        button.disabled = true;  // Disabilita tutti i pulsanti dopo che una risposta è stata selezionata
    });

    if (selectedAnswer === correctAnswer) {
        document.querySelector(`#answers-container button:nth-child(${questions[currentQuestionIndex].answers.indexOf(selectedAnswer) + 1})`).classList.add('correct');
        score++;  // Incrementa il punteggio se la risposta è corretta
    } else {
        document.querySelector(`#answers-container button:nth-child(${questions[currentQuestionIndex].answers.indexOf(correctAnswer) + 1})`).classList.add('correct');
        document.querySelector(`#answers-container button:nth-child(${questions[currentQuestionIndex].answers.indexOf(selectedAnswer) + 1})`).classList.add('incorrect');
    }

    document.getElementById('next-question').style.display = 'block';  // Mostra il pulsante per la domanda successiva
}

// Funzione per passare alla domanda successiva
function nextQuestion() {
    currentQuestionIndex++;  // Incrementa l'indice della domanda
    loadQuestion();  // Carica la nuova domanda
}

// Funzione per mostrare il risultato finale
function showResult() {
    const resultMessage = document.getElementById('result-message');
    const resultLogo = document.getElementById('result-logo');

    // Determina il risultato in base al punteggio
    if (score / questions.length >= 0.9) {
        resultMessage.textContent = `Congratulazioni! Sei stato assegnato a ${selectedHouse}!`;
        resultLogo.src = `images/houses/${selectedHouse.toLowerCase()}.png`;
    } else if (score / questions.length >= 0.7) {
        const randomHouse = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'].filter(house => house !== selectedHouse)[Math.floor(Math.random() * 3)];
        resultMessage.textContent = `Hai fatto del tuo meglio! Sei stato assegnato a ${randomHouse}.`;
        resultLogo.src = `images/houses/${randomHouse.toLowerCase()}.png`;
    } else {
        resultMessage.textContent = "Mi spiace, non sei stato ammesso a Hogwarts.";
        resultLogo.src = "images/denied.png";
    }

    showScreen('result-screen');  // Mostra lo schermo del risultato
}

// Carica le domande all'inizio
loadQuestions();
