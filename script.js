document.getElementById('start-button').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    if (username) {
        // Controlla se l'utente è già presente nella classifica
        if (localStorage.getItem(username)) {
            alert('Hai già partecipato alla selezione!');
            // Mostra denied.png
            document.body.innerHTML = '<img src="images/denied.png" alt="Denied">';
        } else {
            localStorage.setItem(username, 'partecipato');
            document.getElementById('username-screen').style.display = 'none';
            document.getElementById('letter-screen').style.display = 'block';
        }
    } else {
        alert('Per favore, inserisci un nome utente.');
    }
});

document.getElementById('next-button').addEventListener('click', function() {
    document.getElementById('letter-screen').style.display = 'none';
    document.getElementById('houses-screen').style.display = 'block';
});

document.querySelectorAll('.house').forEach(function(house) {
    house.addEventListener('click', function() {
        const selectedHouse = this.getAttribute('data-house');
        localStorage.setItem('selectedHouse', selectedHouse);
        document.getElementById('houses-screen').style.display = 'none';
        document.getElementById('quiz-screen').style.display = 'block';
        // Genera il quiz
        generateQuiz();
    });
});

function generateQuiz() {
    const quizContainer = document.getElementById('quiz');
    for (let i = 1; i <= 50; i++) {
        const question = document.createElement('div');
        question.innerHTML = `<p>Domanda ${i}</p><input type="text" id="answer${i}">`;
        quizContainer.appendChild(question);
    }
}

document.getElementById('submit-quiz').addEventListener('click', function() {
    let correctAnswers = 0;
    for (let i = 1; i <= 50; i++) {
        const answer = document.getElementById(`answer${i}`).value;
        if (answer.toLowerCase() === 'corretto') { // Sostituisci con la logica di verifica delle risposte
            correctAnswers++;
        }
    }
    const percentage = (correctAnswers / 50) * 100;
    const selectedHouse = localStorage.getItem('selectedHouse');
    let assignedHouse = selectedHouse;
    if (percentage < 70) {
        document.body.innerHTML = '<img src="images/denied.png" alt="Denied">';
        return;
    } else if (percentage < 90) {
        const houses = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];
        houses.splice(houses.indexOf(selectedHouse), 1);
        assignedHouse = houses[Math.floor(Math.random() * houses.length)];
    }
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('result').innerHTML = `<img src="images/houses/${assignedHouse.toLowerCase()}.png" alt="${assignedHouse}"><p>Congratulazioni! Sei stato assegnato a ${assignedHouse}!</p>`;
});

document.getElementById('show-leaderboard').addEventListener('click', function() {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('leaderboard-screen').style.display = 'block';
    // Mostra la classifica
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = '';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        leaderboard.innerHTML += `<p>${key}: ${value}</p>`;
    }
});
