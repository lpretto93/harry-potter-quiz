// Array per il quiz
const questions = [
    {
        question: "What is the name of the dark wizard who killed Harry's parents?",
        answers: ["Voldemort", "Sirius Black", "Draco Malfoy", "Bellatrix Lestrange"],
        correct: 0
    },
    {
        question: "What is the name of the school for young witches and wizards?",
        answers: ["Hogwarts", "Beauxbatons", "Durmstrang", "Ilvermorny"],
        correct: 0
    },
    {
        question: "What type of creature is Dobby?",
        answers: ["House Elf", "Goblin", "Troll", "Giant"],
        correct: 0
    }
];

let currentQuestionIndex = 0;
let score = 0;
let userName = "";

// Funzione per iniziare il gioco
function startGame() {
    userName = document.getElementById('player-name').value;
    if (userName === "") {
        alert("Please enter your name.");
        return;
    }
    document.getElementById('invitation-container').style.display = 'none';
    document.getElementById('thank-you-letter').style.display = 'block';
    typeWriter("thank-you-letter", "We are excited to welcome you to Hogwarts! Before we proceed, please complete the following short knowledge test to begin your magical journey.");
}

// Funzione di scrittura del testo
function typeWriter(id, text) {
    let i = 0;
    let speed = 50; // Velocità della scrittura

    function write() {
        if (i < text.length) {
            document.getElementById(id).innerHTML += text.charAt(i);
            i++;
            setTimeout(write, speed);
        }
    }

    write();
}

// Funzione per iniziare il quiz
function startQuiz() {
    document.getElementById('thank-you-letter').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    showQuestion();
}

// Mostra la domanda attuale
function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question').textContent = question.question;
    
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = ''; // Pulisce le risposte

    question.answers.forEach((answer, index) => {
        const answerElement = document.createElement('div');
        answerElement.textContent = answer;
        answerElement.classList.add('answer');
        answerElement.onclick = () => checkAnswer(index);
        answersContainer.appendChild(answerElement);
    });
}

// Controlla se la risposta è corretta
function checkAnswer(selectedIndex) {
    const question = questions[currentQuestionIndex];
    const answers = document.querySelectorAll('.answer');

    if (selectedIndex === question.correct) {
        answers[selectedIndex].classList.add('correct');
        score++;
    } else {
        answers[selectedIndex].classList.add('incorrect');
    }

    // Blocca le risposte dopo la selezione
    answers.forEach(answer => answer.onclick = null);

    document.getElementById('next-btn').style.display = 'block';
}

// Passa alla domanda successiva
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
        document.getElementById('next-btn').style.display = 'none';
    } else {
        showResult();
    }
}

// Mostra il risultato
function showResult() {
    document.getElementById('quiz-container').style.display = 'none';
    const resultDiv = document.getElementById('result');

    if (score / questions.length > 0.8) {
        resultDiv.textContent = `Congratulations, ${userName}! You have been accepted to Hogwarts!`;
    } else {
        resultDiv.textContent = `Thank you for taking the test, ${userName}. You scored ${score}/${questions.length}.`;
    }
    resultDiv.style.display = 'block';
}
