let manolo = document.getElementById("manolo");
let contador = document.getElementById("numero");
let balasContainer = document.querySelector(".balas");
let mapa = document.querySelector(".mapa");
let gameOverModal = document.getElementById("gameOverModal");
let finalScore = document.getElementById("finalScore");
let restartButton = document.getElementById("restartButton");

// Nuevos elementos para el modal de inicio
let firstTimeModal = document.getElementById("firstTimeModal");
let startGameButton = document.getElementById("startGameButton");

// Velocidades iniciales (se mantienen aleatorias; si deseas fijas, asigna valores constantes)
let speedX = 3 + Math.random() * 5;
let speedY = 3 + Math.random() * 5;

let posX = Math.random() * (mapa.clientWidth - manolo.clientWidth);
let posY = Math.random() * (mapa.clientHeight - manolo.clientHeight);

let count = 0;            // Puntuación (número de golpes a Manolo)
let balasRestantes = 12;   // Número de balas inicial

let isGameOver = false;   // Indica si el juego ha terminado
let animationFrame;       // Referencia para la animación

manolo.style.position = "absolute";

// Función para mover a Manolo dentro del contenedor "mapa"
function moveManolo() {
  if (isGameOver) return; // Se detiene el movimiento si el juego terminó

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

// NOTA: No llamamos a moveManolo() inmediatamente; se llamará cuando se presione "Empezar Juego".

// Manejador global de clics en el documento
document.addEventListener("click", function (event) {
  // No procesar clics si el juego ya terminó o si el clic fue en alguno de los modales
  if (isGameOver) return;
  if (event.target.closest("#gameOverModal") || event.target.closest("#firstTimeModal")) return;

  // Cada clic gasta una bala (sin importar si se golpea a Manolo o no)
  if (balasRestantes > 0) {
    balasRestantes--;
    let firstBullet = balasContainer.querySelector("img");
    if (firstBullet) firstBullet.remove();
  }

  // Si el clic se realizó sobre Manolo → ¡Golpe exitoso!
  if (event.target.id === "manolo") {
    count++;
    contador.textContent = count;

    // Aumenta la velocidad de Manolo en un 10%
    speedX *= 1.1;
    speedY *= 1.1;

    // Efecto de pantalla invertida (negativo) por 50ms
    document.body.style.filter = "none"; // Reinicia el filtro
    void document.body.offsetWidth; // Fuerza reflow
    document.body.style.filter = "invert(1)";
    setTimeout(() => {
      document.body.style.filter = "none";
    }, 50);
  } else {
    // Si se falla (clic fuera de Manolo), se muestra la imagen "agujero" en la posición del clic
    let agujero = document.createElement("img");
    agujero.src = "./img/agujero.png";
    agujero.style.position = "absolute";
    agujero.style.left = event.clientX + "px";
    agujero.style.top = event.clientY + "px";
    agujero.style.transform = "translate(-50%, -50%)";
    agujero.style.width = "300px"; // El doble de grande que antes (ajusta según necesites)
    document.body.appendChild(agujero);
    setTimeout(() => {
      agujero.remove();
    }, 1000);
  }

  // Si se han gastado todas las balas, finaliza el juego
  if (balasRestantes === 0) {
    endGame();
  }
});

// Función para finalizar el juego
function endGame() {
  isGameOver = true; // Detiene el movimiento de Manolo
  cancelAnimationFrame(animationFrame);
  finalScore.textContent = count;
  gameOverModal.style.display = "flex";
}

// Evento para reiniciar el juego
restartButton.addEventListener("click", function () {
  // Reiniciar las variables del juego
  count = 0;
  balasRestantes = 12;
  isGameOver = false;
  contador.textContent = count;

  // Restaurar las 12 balas en el HTML
  let bulletsHTML = "";
  for (let i = 0; i < 12; i++) {
    bulletsHTML += `<img src="./img/bala.png" alt="Bala" />`;
  }
  balasContainer.innerHTML = bulletsHTML;
  gameOverModal.style.display = "none";

  // Reiniciar posición y velocidad de Manolo
  posX = Math.random() * (mapa.clientWidth - manolo.clientWidth);
  posY = Math.random() * (mapa.clientHeight - manolo.clientHeight);
  speedX = 3 + Math.random() * 5;
  speedY = 3 + Math.random() * 5;

  moveManolo();
});

// Evento para empezar el juego (solo la primera vez)
startGameButton.addEventListener("click", function () {
  firstTimeModal.style.display = "none";
  moveManolo();
});
