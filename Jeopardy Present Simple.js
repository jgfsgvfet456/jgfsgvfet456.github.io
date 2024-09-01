document.addEventListener('DOMContentLoaded', () => {
    const values = document.querySelectorAll('[data-question]');
    const maxScore = 250;  // Puntuación máxima para ganar

    values.forEach(item => {
        item.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            const answer = this.getAttribute('data-answer');
            const points = this.getAttribute('data-points');
            const image = this.getAttribute('data-image');
            openModal(question, answer, points, image, this);
        });
    });
});

function openModal(question, answer, points, image, element) {
    const modal = document.getElementById('question-modal');
    const questionText = document.getElementById('question-text');
    const feedbackText = document.getElementById('feedback-text');
    const questionImage = document.getElementById('question-image');
    const submitButton = document.getElementById('submit-answer');

    questionText.textContent = question;
    feedbackText.textContent = '';
    document.getElementById('user-answer').disabled = false;
    submitButton.disabled = false;

    if (image) {
        questionImage.src = image;
        questionImage.style.display = 'block';
    } else {
        questionImage.style.display = 'none';
    }
    
    modal.setAttribute('data-answer', answer);
    modal.setAttribute('data-points', points);
    modal.style.display = 'block';
    
    // Solo añadir la clase 'clicked' al elemento actual
    element.classList.add('clicked');

    submitButton.onclick = function() {
        checkAnswer(element);
        submitButton.disabled = true;  // Desactivar botón de enviar
        document.getElementById('user-answer').disabled = true;  // Desactivar campo de respuesta
    };
}

function checkAnswer(element) {
    const modal = document.getElementById('question-modal');
    const userAnswer = document.getElementById('user-answer').value.trim().toLowerCase().replace(/\s+/g, ' ');
    const correctAnswer = modal.getAttribute('data-answer').trim().toLowerCase().replace(/\s+/g, ' ');
    const points = parseInt(modal.getAttribute('data-points'));
    const feedbackText = document.getElementById('feedback-text');

    if (userAnswer === correctAnswer) {
        feedbackText.textContent = `¡Correcto! ¡Ganaste ${points} puntos!`;
        feedbackText.style.color = '#27ae60';
        element.classList.add('correct');
        updateScore(points);
    } else {
        feedbackText.textContent = `Incorrecto. La respuesta correcta era: ${modal.getAttribute('data-answer')}`;
        feedbackText.style.color = '#c0392b';
        element.classList.add('incorrect');
    }

    // Deshabilitar solo el elemento de pregunta actual
    element.removeEventListener('click', openModal); 
    element.style.pointerEvents = 'none';

    // Mostrar botón para pasar a la siguiente pregunta
    document.getElementById('next-question').style.display = 'block';
}

function closeQuestion() {
    const modal = document.getElementById('question-modal');
    modal.style.display = 'none';
    document.getElementById('user-answer').value = '';
    document.getElementById('next-question').style.display = 'none';  // Ocultar botón de siguiente pregunta
}

function updateScore(points) {
    const currentScoreElement = document.getElementById('current-score');
    let currentScore = parseInt(currentScoreElement.textContent);
    currentScore += points;
    currentScoreElement.textContent = currentScore;

    if (currentScore >= 250) {  // Comprobar si la puntuación alcanza el máximo
        showVictoryMessage();
    }
}

function showVictoryMessage() {
    const victoryMessage = document.createElement('div');
    victoryMessage.style.position = 'fixed';
    victoryMessage.style.top = '0';
    victoryMessage.style.left = '0';
    victoryMessage.style.width = '100%';
    victoryMessage.style.height = '100%';
    victoryMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    victoryMessage.style.color = 'white';
    victoryMessage.style.display = 'flex';
    victoryMessage.style.alignItems = 'center';
    victoryMessage.style.justifyContent = 'center';
    victoryMessage.style.fontSize = '48px';
    victoryMessage.style.zIndex = '1000';
    victoryMessage.textContent = '¡Felicidades! ¡Has ganado!';

    const backToMainButton = document.createElement('button');
    backToMainButton.textContent = 'Volver al Juego Principal';
    backToMainButton.style.marginTop = '20px';
    backToMainButton.onclick = function() {
        window.location.href = 'index.html'; // Cambia 'index.html' a la URL del juego principal
    };

    victoryMessage.appendChild(backToMainButton);
    document.body.appendChild(victoryMessage);
}

// Función para abrir el juego de Jeopardy
function openJeopardyGame() {
    const jeopardyContainer = document.getElementById('jeopardy-container');
    const jeopardyIframe = document.getElementById('jeopardy-frame');

    jeopardyIframe.src = "jeopardy/jeopardy.html"; // Asegúrate de que esta ruta sea correcta
    jeopardyContainer.style.display = 'block';
    game.scene.pause();
}

// Maneja mensajes desde el iframe de Jeopardy
window.addEventListener('message', function(event) {
    if (event.data === 'closeJeopardy') {
        closeJeopardy();
    } else if (event.data === 'winJeopardy') {
        awardPoints();
        closeJeopardy();
    }
});

function closeJeopardy() {
    const jeopardyContainer = document.getElementById('jeopardy-container');
    const jeopardyIframe = document.getElementById('jeopardy-frame');
    
    jeopardyContainer.style.display = 'none';
    jeopardyIframe.src = ""; // Resetea la fuente del iframe para prevenir problemas
    game.scene.resume();
}

function awardPoints() {
    score += 10; // Otorga 10 puntos
    scoreText.setText('Score: ' + score);
    console.log("¡Has ganado en Jeopardy! 10 puntos añadidos.");
}

function notifyWin() {
    window.parent.postMessage('jeopardyWin', '*');
}

