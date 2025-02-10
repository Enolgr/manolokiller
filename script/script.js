let manolo = document.getElementById("manolo");
let contador = document.getElementById("numero");
let balasContainer = document.querySelector(".balas");
let mapa = document.querySelector(".mapa");
let gameOverModal = document.getElementById("gameOverModal");
let finalScore = document.getElementById("finalScore");
let restartButton = document.getElementById("restartButton");

// Elementos para el modal de inicio
let firstTimeModal = document.getElementById("firstTimeModal");
let startGameButton = document.getElementById("startGameButton");

// Crea el objeto de audio para la pista de fondo (BSO)
let bso = new Audio("sounds/bso.mp3");
bso.loop = true;             // Reproduce en loop sin pausas
bso.preload = "auto";        // Fuerza la precarga del audio
bso.volume = 0.3;            // Se reproduce a la mitad del volumen original
bso.load();                  // Inicia la carga del audio

// Velocidades iniciales (aleatorias)
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
  if (isGameOver) return;

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

// NOTA: moveManolo() se invoca al iniciar el juego

document.addEventListener("click", function (event) {
  if (isGameOver) return;
  if (event.target.closest("#gameOverModal") || event.target.closest("#firstTimeModal")) return;

  // Cada clic consume una bala (se reproduce el sonido de disparo)
  if (balasRestantes > 0) {
    new Audio("sounds/shot.mp3").play();
    balasRestantes--;
    let firstBullet = balasContainer.querySelector("img");
    if (firstBullet) firstBullet.remove();
  }

  // Si se hace clic sobre Manolo, se considera un golpe exitoso
  if (event.target.id === "manolo") {
    new Audio("sounds/hit.mp3").play();
    count++;
    contador.textContent = count;
    speedX *= 1.1;
    speedY *= 1.1;
    document.body.style.filter = "invert(1)";
    setTimeout(() => {
      document.body.style.filter = "none";
    }, 50);
  } else {
    // Si se falla, se muestra la imagen de "agujero"
    let agujero = document.createElement("img");
    agujero.src = "./img/agujero.png";
    agujero.style.position = "absolute";
    agujero.style.left = event.clientX + "px";
    agujero.style.top = event.clientY + "px";
    agujero.style.transform = "translate(-50%, -50%)";
    agujero.style.width = "300px";
    document.body.appendChild(agujero);
    setTimeout(() => {
      agujero.remove();
    }, 1000);
  }

  // Finaliza el juego si se han consumido todas las balas
  if (balasRestantes === 0) {
    endGame();
  }
});

function endGame() {
  isGameOver = true;
  cancelAnimationFrame(animationFrame);
  finalScore.textContent = count;
  gameOverModal.style.display = "flex";
}

restartButton.addEventListener("click", function () {
  count = 0;
  balasRestantes = 12;
  isGameOver = false;
  contador.textContent = count;
  let bulletsHTML = "";
  for (let i = 0; i < 12; i++) {
    bulletsHTML += `<img src="./img/bala.png" alt="Bala" />`;
  }
  balasContainer.innerHTML = bulletsHTML;
  gameOverModal.style.display = "none";
  posX = Math.random() * (mapa.clientWidth - manolo.clientWidth);
  posY = Math.random() * (mapa.clientHeight - manolo.clientHeight);
  speedX = 3 + Math.random() * 5;
  speedY = 3 + Math.random() * 5;
  moveManolo();
});

startGameButton.addEventListener("click", function () {
  firstTimeModal.style.display = "none";
  bso.play(); // Inicia la reproducción continua de la BSO inmediatamente
  moveManolo();
});
