// Elementos del DOM
let manolo = document.getElementById("manolo");
let contador = document.getElementById("numero");
let balasContainer = document.querySelector(".balas");
let mapa = document.querySelector(".mapa");
let gameOverModal = document.getElementById("gameOverModal");
let finalScore = document.getElementById("finalScore");
let restartButton = document.getElementById("restartButton");

// Velocidades fijas al inicio (sin aleatoriedad)
let speedX = 5;  
let speedY = 5;

// Posición inicial (aleatoria dentro de los límites del contenedor "mapa")
let posX = Math.random() * (mapa.clientWidth - manolo.clientWidth);
let posY = Math.random() * (mapa.clientHeight - manolo.clientHeight);

let count = 0;             // Puntuación (clics en Manolo)
let balasRestantes = 12;    // Número inicial de balas

let isGameOver = false;    // Bandera para finalizar el juego
let animationFrame;        // Referencia para detener la animación

// Aseguramos que Manolo pueda moverse
manolo.style.position = "absolute";
// Añade un halo a Manolo
manolo.style.boxShadow = "0 0 15px 5px rgba(255, 255, 255, 0.75)";

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

        // Aumenta la velocidad de Manolo
        speedX *= 1.1;
        speedY *= 1.1;

        // Efecto de pantalla invertida (negativo) por 50ms
        document.body.style.filter = "none"; // Reinicia el filtro
        void document.body.offsetWidth;       // Fuerza un reflow
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
    speedX = 5;
    speedY = 5;

    // Reinicia la animación
    moveManolo();
});

// Función para actualizar la variable CSS --vh
function updateVh() {
    // Calcula 1% de la altura actual de la ventana
    let vh = window.innerHeight * 0.01;
    // Establece la variable --vh en el :root
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Ejecuta al cargar la página
updateVh();

// Actualiza la variable en cada cambio de tamaño de la ventana
window.addEventListener('resize', updateVh);
