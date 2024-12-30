// Array di nomi già presenti nella classifica
const leaderboard = ["HARRY", "HERMIONE", "RON", "DRACO"];

// Funzione per aggiornare il nome nella lettera
function updateName() {
    const nameInput = document.getElementById('name-input').value.trim().toUpperCase();
    document.getElementById('name-placeholder').textContent = nameInput || "__________";
}

// Funzione per validare il nome e decidere il percorso successivo
function validateName() {
    const nameInput = document.getElementById('name-input').value.trim().toUpperCase();
    if (!nameInput) {
        alert("Please enter a name!");
        return;
    }
    leaderboard.includes(nameInput) ? showDeniedScreen() : showInvitation(nameInput);
}

// Mostra la schermata "Access Denied"
function showDeniedScreen() {
    toggleVisibility('invitation-container', false);
    toggleVisibility('denied-screen', true);
}

// Mostra l'invito personalizzato
function showInvitation(name) {
    document.getElementById('letter-content').innerHTML = `
        We are thrilled to invite you to Hogwarts School of Witchcraft and Wizardry.
        <br><br>Welcome, ${name}!
        <br><br>Please prepare your belongings and await further instructions.
    `;
    toggleVisibility('signature-container', true);
    toggleVisibility('name-input', false);
    toggleVisibility('sign-btn', false);
}

// Funzione generica per mostrare/nascondere un elemento
function toggleVisibility(elementId, isVisible) {
    document.getElementById(elementId).style.display = isVisible ? 'block' : 'none';
}

// Inizializzazione della pagina al caricamento
window.onload = function () {
    toggleVisibility('denied-screen', false);
    toggleVisibility('admission-letter', false);
    toggleVisibility('final-assignment', false);
};

// Evento click sul pulsante "Sign"
document.getElementById('sign-btn').addEventListener('click', function () {
    toggleVisibility('invitation-container', false);
    toggleVisibility('admission-letter', true);

    const userName = document.getElementById('name-input').value.trim();
    document.getElementById('user-name').innerText = userName || "Student";
});

// Funzione per selezionare una casata
function chooseHouse(house) {
    localStorage.setItem('preferredHouse', house);
    document.getElementById('chosen-house').innerText = house;
    toggleVisibility('house-selection-result', true);

    document.querySelectorAll('.house').forEach(houseElement => {
        houseElement.style.pointerEvents = 'none';
    });
}

// Funzione per assegnare la casata
function assignHouse(score, totalQuestions) {
    const preferredHouse = localStorage.getItem('preferredHouse');
    const correctPercentage = (score / totalQuestions) * 100;

    if (correctPercentage >= 80 && preferredHouse) {
        return preferredHouse;
    }

    const houses = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];
    const remainingHouses = preferredHouse ? houses.filter(h => h !== preferredHouse) : houses;
    return remainingHouses[Math.floor(Math.random() * remainingHouses.length)];
}

// Mostra la casata finale
function showFinalHouse(score, totalQuestions) {
    const finalHouse = assignHouse(score, totalQuestions);
    document.getElementById('final-house').innerText = finalHouse;
    toggleVisibility('final-assignment', true);
}

// Esempio di utilizzo per assegnare la casata
const exampleScore = 8;
const exampleTotalQuestions = 10;

document.getElementById('finalize-btn').addEventListener('click', function () {
    showFinalHouse(exampleScore, exampleTotalQuestions);
});
