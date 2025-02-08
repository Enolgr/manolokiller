let manolo = document.getElementById("manolo");
let contador = document.getElementById("numero");
let balasContainer = document.querySelector(".balas");
let mapa = document.querySelector(".mapa");
let gameOverModal = document.getElementById("gameOverModal");
let finalScore = document.getElementById("finalScore");
let restartButton = document.getElementById("restartButton");

let speedX = 3 + Math.random() * 5; // Velocidad inicial en X (5-10)
let speedY = 3 + Math.random() * 5; // Velocidad inicial en Y (5-10)

let posX = Math.random() * (mapa.clientWidth - manolo.clientWidth);
let posY = Math.random() * (mapa.clientHeight - manolo.clientHeight);

let count = 0; // Contador de clics en Manolo
let balasRestantes = 12; // Número inicial de balas

let isGameOver = false; // Controla si el juego ha terminado
let animationFrame; // Para detener la animación

manolo.style.position = "absolute";

// Función para generar las balas dinámicamente
function generarBalas() {
    balasContainer.innerHTML = "";
    for (let i = 0; i < balasRestantes; i++) {
        let bala = document.createElement("img");
        bala.src = "./img/bala.png";
        bala.alt = "Bala";
        balasContainer.appendChild(bala);
    }
}

// Mueve a Manolo dentro de la caja
function moveManolo() {
    if (isGameOver) return; // Detener el movimiento si el juego termina

    posX += speedX;
    posY += speedY;

    let maxWidth = mapa.clientWidth - manolo.clientWidth;
    let maxHeight = mapa.clientHeight - manolo.clientHeight;

    // Verifica colisión con bordes laterales
    if (posX <= 0) {
        posX = 0;
        speedX *= -1;
    } else if (posX >= maxWidth) {
        posX = maxWidth;
        speedX *= -1;
    }

    // Verifica colisión con bordes superior/inferior
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
    event.stopPropagation(); // Evita que el click en Manolo cuente como un click en el fondo

    if (balasRestantes > 0) {
        count++;
        contador.textContent = count;

        // Aumentar velocidad de Manolo
        speedX *= 1.1;
        speedY *= 1.1;

        // Forzar reinicio del filtro para que siempre se vea el efecto
        document.body.style.filter = "none"; // Resetea antes de aplicar el efecto
        void document.body.offsetWidth; // Forzar un reflow del navegador
        document.body.style.filter = "invert(1)";

        setTimeout(() => {
            document.body.style.filter = "none"; // Vuelve a su estado normal
        }, 50); // 0.02s = 20ms
    }
});
;

// Evento de clic en cualquier parte de la pantalla para gastar balas
document.body.addEventListener("click", function () {
    if (balasRestantes > 0) {
        balasRestantes--;
        generarBalas();
    }

    if (balasRestantes === 0) {
        endGame(); // Llama a la función para finalizar el juego
    }
});

// Función para terminar el juego
function endGame() {
    isGameOver = true; // Detiene el movimiento de Manolo
    cancelAnimationFrame(animationFrame); // Detiene la animación

    // Mostrar el modal con el puntaje
    finalScore.textContent = count;
    gameOverModal.style.display = "flex";
}

// Evento para reiniciar el juego
restartButton.addEventListener("click", function () {
    // Reiniciar variables
    count = 0;
    balasRestantes = 12;
    isGameOver = false;

    // Reiniciar UI
    contador.textContent = count;
    generarBalas();
    gameOverModal.style.display = "none";

    // Reiniciar posición y velocidad de Manolo
    posX = Math.random() * (mapa.clientWidth - manolo.clientWidth);
    posY = Math.random() * (mapa.clientHeight - manolo.clientHeight);
    speedX = 5 + Math.random() * 5;
    speedY = 5 + Math.random() * 5;

    // Reiniciar animación
    moveManolo();
});

// Generar las balas al inicio
generarBalas();
