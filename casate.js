document.addEventListener("DOMContentLoaded", function() {
    const houseLogos = document.querySelectorAll(".casata-logo");

    houseLogos.forEach(function(logo) {
        logo.addEventListener("click", function() {
            const selectedHouse = logo.alt; // Get the house name from the alt attribute
            localStorage.setItem("preferredHouse", selectedHouse); // Store the preferred house in local storage
            window.location.href = "quiz.html"; // Redirect to quiz.html
        });
    });
});
