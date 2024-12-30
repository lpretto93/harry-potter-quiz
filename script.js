// Variabile per l'audio
let audio = document.getElementById('background-audio');

// Funzione per iniziare la musica al caricamento della pagina
window.addEventListener('load', () => {
  // Verifica se l'audio non è già in riproduzione
  if (!audio.paused) {
    return;
  }
  audio.play().catch((err) => {
    console.log('Errore nel riprodurre l\'audio: ' + err);
  });
});

// Funzione per attivare/disattivare l'audio
function toggleAudio() {
  const audioIcon = document.getElementById('audio-icon');

  if (audio.paused) {
    // Se l'audio è in pausa, lo riproduciamo
    audio.play();
    audioIcon.src = 'volume.png'; // Cambia l'icona in volume attivo
    audioIcon.alt = 'Audio On';
  } else {
    // Se l'audio è in riproduzione, lo mettiamo in pausa
    audio.pause();
    audioIcon.src = 'mute.png'; // Cambia l'icona in mute
    audioIcon.alt = 'Audio Off';
  }
}

// Funzione per andare alla pagina successiva (casate)
function goToHousesIntro() {
  window.location.href = 'houses.html'; // Cambia URL per la pagina delle casate
}
