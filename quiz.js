document.addEventListener("DOMContentLoaded", function() {
    const questionElement = document.getElementById("domanda");
    const answersElement = document.getElementById("risposte");
    const nextButton = document.getElementById("next-question");

    let currentQuestionIndex = 0;
    let questions = [];

    // Fetch questions from questions.json
    fetch("questions.json")
        .then(response => response.json())
        .then(data => {
            questions = data;
            displayQuestion();
        })
        .catch(error => console.error("Error loading questions:", error));

    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            questionElement.textContent = question.question;
            answersElement.innerHTML = "";

            question.answers.forEach(answer => {
                const button = document.createElement("button");
                button.textContent = answer;
                button.addEventListener("click", () => selectAnswer(answer));
                answersElement.appendChild(button);
            });
        } else {
            questionElement.textContent = "Quiz completato!";
            answersElement.innerHTML = "";
            nextButton.style.display = "none";
        }
    }

    function selectAnswer(answer) {
        // Handle answer selection logic here
        console.log("Selected answer:", answer);
    }

    nextButton.addEventListener("click", () => {
        currentQuestionIndex++;
        displayQuestion();
    });
});
