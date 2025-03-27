
let currentUser = '';
let currentQuestionIndex = 0;
let questions = [];
let selectedHouse = '';

// Carica le domande
function loadQuestions() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            loadQuestion();
        })
        .catch(error => console.error('Error loading questions:', error));
}

// Avvia il gioco
function startGame() {
    const username = document.getElementById('username-input').value;
    if (username.trim() === '') {
        alert('Per favore inserisci un nome valido!');
        return;
    }
    currentUser = username;
    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('letter-screen').classList.add('active');
}

// Vai alla schermata delle casate
function goToHousesScreen() {
    document.getElementById('letter-screen').classList.remove('active');
    document.getElementById('houses-screen').classList.add('active');
}

// Avvia il quiz
function startQuiz(house) {
    selectedHouse = house;
    currentQuestionIndex = 0;
    document.getElementById('houses-screen').classList.remove('active');
    document.getElementById('quiz-screen').classList.add('active');
    loadQuestions();
}

// Carica una domanda
function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        document.getElementById('question').textContent = question.question;
        const answersContainer = document.getElementById('answers-container');
        answersContainer.innerHTML = '';
        
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.onclick = () => checkAnswer(index);
            answersContainer.appendChild(button);
        });

        document.getElementById('next-question').style.display = 'none';
    } else {
        showResult();
    }
}

// Controlla la risposta
function checkAnswer(selectedAnswerIndex) {
    const correctAnswerIndex = questions[currentQuestionIndex].answers.indexOf(questions[currentQuestionIndex].correctAnswer);
    if (selectedAnswerIndex === correctAnswerIndex) {
        // Aggiungi animazione di magia
        const magic = document.createElement('div');
        magic.classList.add('magic-effect');
        document.body.appendChild(magic);
        setTimeout(() => magic.remove(), 1000);
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

// Mostra il risultato finale
function showResult() {
    alert('Il quiz è finito! Calcolando il risultato...');
}

// Carica le domande quando il gioco inizia
loadQuestions();
