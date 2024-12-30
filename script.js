document.getElementById('mute').addEventListener('click', function() {
    document.getElementById('musica').muted = true;
});

document.getElementById('volume').addEventListener('click', function() {
    document.getElementById('musica').muted = false;
});

document.getElementById('next-page').addEventListener('click', function() {
    const nomeStudente = document.getElementById('nome-studente').value;
    if (nomeStudente) {
        localStorage.setItem('nomeStudente', nomeStudente);
        window.location.href = 'casate.html';
    } else {
        alert('Per favore, inserisci il tuo nome.');
    }
});
document.addEventListener("DOMContentLoaded", function() {
    var audio = document.getElementById("musica");

    // Attiva la musica appena la pagina è caricata
    audio.volume = 1;  // Imposta il volume al massimo
    audio.play().catch(function(e) {
        console.log('Impossibile riprodurre la musica automaticamente: ' + e);
    });

    // Assicurati che la musica non venga messa in pausa
    audio.addEventListener('play', function() {
        if (audio.paused) {
            audio.play();
        }
    });
});

function goToCasate() {
    window.location.href = "casate.html";  // Reindirizza alla pagina casate.html
}
