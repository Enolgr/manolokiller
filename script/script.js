let manolo = document.getElementById("manolo");
let contador = document.getElementById("numero");
let balasContainer = document.querySelector(".balas");
let mapa = document.querySelector(".mapa");
let gameOverModal = document.getElementById("gameOverModal");
let finalScore = document.getElementById("finalScore");
let restartButton = document.getElementById("restartButton");

// Velocidades (pueden ser aleatorias o fijas según lo que necesites)
let speedX = 3 + Math.random() * 5; // Ejemplo: velocidad inicial en X
let speedY = 3 + Math.random() * 5; // Ejemplo: velocidad inicial en Y

let posX = Math.random() * (mapa.clientWidth - manolo.clientWidth);
let posY = Math.random() * (mapa.clientHeight - manolo.clientHeight);

let count = 0;             // Puntuación (clics en Manolo)
let balasRestantes = 12;    // Número inicial de balas

let isGameOver = false;    // Bandera para finalizar el juego
let animationFrame;        // Referencia para detener la animación

manolo.style.position = "absolute";

// Guarda el HTML inicial de las balas para restaurarlo al reiniciar
const defaultBalasHTML = balasContainer.innerHTML;

// Función para mover a Manolo dentro de la "mapa"
function moveManolo() {
    if (isGameOver) return; // Si el juego terminó, se detiene el movimiento

    posX += speedX;
    posY += speedY;

    let maxWidth = mapa.clientWidth - manolo.clientWidth;
    let maxHeight = mapa.clientHeight - manolo.clientHeight;

    // Colisión con los bordes laterales
    if (posX <= 0) {
        posX = 0;
        speedX *= -1;
    } else if (posX >= maxWidth) {
        posX = maxWidth;
        speedX *= -1;
    }

    // Colisión con los bordes superior/inferior
    if (posY <= 0) {
        posY = 0;
        speedY *= -1;
    } else if (posY >= maxHeight) {
        posY = maxHeight;
        speedY *= -1;
    }

    manolo.style.transform = `translate(${posX}px, ${posY}px)`;

    animationFrame = requestAnimationFrame(moveManolo);
}

// Inicia el movimiento de Manolo
moveManolo();

// Evento de clic en Manolo
manolo.addEventListener("click", function (event) {
    event.stopPropagation(); // Evita que el clic se propague al fondo

    if (balasRestantes > 0) {
        count++;
        contador.textContent = count;

        // Aumentar velocidad de Manolo
        speedX *= 1.1;
        speedY *= 1.1;

        // Efecto de pantalla invertida (negativo)
        document.body.style.filter = "none"; // Reinicia el filtro
        void document.body.offsetWidth; // Fuerza reflow para que se aplique el cambio
        document.body.style.filter = "invert(1)";
        setTimeout(() => {
            document.body.style.filter = "none"; // Vuelve al estado normal
        }, 50);
    }
});

// Evento de clic en cualquier parte de la pantalla para gastar una bala
document.body.addEventListener("click", function () {
    if (balasRestantes > 0) {
        balasRestantes--;

        // Remueve la primera bala (primer <img> en el contenedor)
        let primeraBala = balasContainer.querySelector("img");
        if (primeraBala) {
            primeraBala.remove();
        }
    }

    if (balasRestantes === 0) {
        endGame(); // Finaliza el juego si se acaban las balas
    }
});

// Función para terminar el juego
function endGame() {
    isGameOver = true; // Detiene el movimiento de Manolo
    cancelAnimationFrame(animationFrame); // Detiene la animación

    // Muestra el modal con el puntaje final
    finalScore.textContent = count;
    gameOverModal.style.display = "flex";
}

// Evento para reiniciar el juego
restartButton.addEventListener("click", function () {
    // Reinicia las variables del juego
    count = 0;
    balasRestantes = 12;
    isGameOver = false;

    // Actualiza la UI
    contador.textContent = count;
    // Restaura las balas usando el HTML inicial guardado
    balasContainer.innerHTML = defaultBalasHTML;
    gameOverModal.style.display = "none";

    // Reinicia posición y velocidad de Manolo
    posX = Math.random() * (mapa.clientWidth - manolo.clientWidth);
    posY = Math.random() * (mapa.clientHeight - manolo.clientHeight);
    speedX = 3 + Math.random() * 5;
    speedY = 3 + Math.random() * 5;

    // Reinicia la animación
    moveManolo();
});
