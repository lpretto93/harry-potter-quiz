// Array di nomi già presenti nella classifica
const leaderboard = ["HARRY", "HERMIONE", "RON", "DRACO"];

// Funzione per aggiornare il nome nella lettera
function updateName() {
    const nameInput = document.getElementById('name-input').value.toUpperCase();
    document.getElementById('name-placeholder').textContent = nameInput || "__________";
}

// Funzione per validare il nome
function validateName() {
    const nameInput = document.getElementById('name-input').value.toUpperCase();
    
    // Se il nome è vuoto, mostra un avviso
    if (!nameInput) {
        alert("Please enter a name!");
        return;
    }

    // Verifica se il nome è già presente nella classifica (un esempio di array)
    if (leaderboard.includes(nameInput)) {
        showDeniedScreen(); // Mostra la schermata "Denied" se il nome è nella leaderboard
    } else {
        showInvitation(nameInput); // Mostra l'invito se il nome non è nella leaderboard
    }
}

// Funzione per mostrare la schermata "Access Denied"
function showDeniedScreen() {
    // Nascondiamo la lettera di invito
    document.getElementById('invitation-container').style.display = 'none';
    
    // Mostriamo l'immagine "Denied"
    document.getElementById('denied-screen').style.display = 'flex'; 
}

// Funzione per mostrare il resto dell'invito
function showInvitation(name) {
    // Mostriamo il contenuto dell'invito personalizzato con il nome
    const letterContent = `
        We are thrilled to invite you to Hogwarts School of Witchcraft and Wizardry.
        <br><br>Welcome, ${name}!
        <br><br>Please prepare your belongings and await further instructions.
    `;
    
    // Aggiorniamo il contenuto della lettera
    document.getElementById('letter-content').innerHTML = letterContent;
    
    // Mostriamo la firma
    document.getElementById('signature-container').style.display = 'block'; 
    
    // Nascondiamo il campo di input per il nome
    document.getElementById('name-input').style.display = 'none'; 
    
    // Nascondiamo il pulsante di firma
    document.getElementById('sign-btn').style.display = 'none'; 
}

// Nascondere la schermata "Denied" quando la pagina viene caricata
window.onload = function() {
    document.getElementById('denied-screen').style.display = 'none';
};

document.getElementById('sign-btn').addEventListener('click', function() {
    // Nascondi la lettera di invito
    document.getElementById('invitation-container').style.display = 'none';

    // Mostra la nuova lettera di ammissione
    document.getElementById('admission-letter').style.display = 'block';

    // Popola il nome dell'utente nella lettera di ammissione
    let userName = document.getElementById('name-input').value;
    document.getElementById('user-name').innerText = userName;
});

// Funzione per selezionare la casata preferita
// Funzione per memorizzare la casata preferita
function chooseHouse(house) {
    // Memorizziamo la casata scelta nel localStorage
    localStorage.setItem('preferredHouse', house);

    // Mostriamo il risultato della selezione della casata
    document.getElementById('house-selection-result').style.display = 'block';
    document.getElementById('chosen-house').innerText = house; // Mostriamo la casata scelta

    // Nascondiamo i pulsanti delle altre casate
    let houses = document.querySelectorAll('.house');
    houses.forEach(function(houseElement) {
        houseElement.style.pointerEvents = 'none'; // Disabilitiamo ulteriori clic dopo la scelta
    });
}


// Funzione per determinare la casata finale
function assignHouse(score, totalQuestions) {
    // Recuperiamo la casata preferita dall'utente
    const preferredHouse = localStorage.getItem('preferredHouse');

    // Calcoliamo la percentuale di risposte corrette
    const correctPercentage = (score / totalQuestions) * 100;

    // Se il punteggio è almeno l'80%, l'utente va nella sua casata preferita
    if (correctPercentage >= 80 && preferredHouse) {
        console.log(`You have earned your preferred house: ${preferredHouse}!`);
        return preferredHouse;
    } else {
        // Altrimenti, scegliamo una casata casuale tra quelle rimaste
        const houses = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];
        
        // Se la preferita è stata scelta, la rimuoviamo dalla lista
        const remainingHouses = houses.filter(house => house !== preferredHouse);
        
        // Se la preferita è stata scelta, assegnamo una delle altre casate a caso
        const randomHouse = remainingHouses[Math.floor(Math.random() * remainingHouses.length)];
        console.log(`You didn't reach 80% correct answers. You are assigned to: ${randomHouse}`);
        return randomHouse;
    }
}

// Esempio di utilizzo: supponiamo che l'utente abbia risposto correttamente a 8 su 10 domande
const score = 8;
const totalQuestions = 10;
const assignedHouse = assignHouse(score, totalQuestions);


// Funzione per mostrare la casata assegnata alla fine
function showFinalHouse() {
    const finalHouse = assignHouse(score, totalQuestions);
    document.getElementById('final-house').innerText = finalHouse;
    document.getElementById('final-assignment').style.display = 'block';
}
// Recupero della casata preferita al termine del gioco
window.onload = function() {
    const finalHouse = localStorage.getItem('preferredHouse');
    if (finalHouse) {
        document.getElementById('final-house').innerText = finalHouse;
    } else {
        document.getElementById('final-house').innerText = "You didn't choose a house!";
    }
};
