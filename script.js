function goToHousesIntro() {
  const playerName = document.getElementById('player-name').value.trim();
  if (!playerName) {
    alert("Per favore, inserisci il tuo nome prima di continuare!");
    return;
  }

  // Salva il nome del giocatore per usarlo nelle schermate successive
  localStorage.setItem('playerName', playerName);

  // Passa alla schermata delle casate
  window.location.href = 'houses.html';
}

function goToQuiz() {
  // Passa alla schermata del quiz
  window.location.href = 'quiz.html';
}
