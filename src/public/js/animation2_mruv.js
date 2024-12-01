// Obtener elementos del DOM
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const endButton = document.getElementById("endButton");

// const speedInput = document.getElementById("speedInput");
const simulationTimeInput = document.getElementById("timeInput");
const simulationAcelerationInput = document.getElementById("acelerationInput");
const simulationDistanceInput = document.getElementById("simulationDistance");

const velocityGraphCanvas = document.getElementById("velocityGraphCanvas");
const velocityGraphContext = velocityGraphCanvas.getContext("2d");
const graphCanvas = document.getElementById("graphCanvas");
const graphContext = graphCanvas.getContext("2d");

// Declaración de variables y constantes
let totalFrames;
let frameCount = 0;
let camion;
let clock;
let distanceDisplay;
let ruler;
let background;
let animationId;
let canvasWidthPixels = canvas.width - 100;
let pixelsPerMeter;
let simulationDistance;
let camionHeight = 40;
let camionWidth = 40;
let graph;
let velocityGraph;
let shouldStartSimulation = true;
const initialCamionPositionX = 50;
const initialCamionPositionY = 200;
const framesPerSecond = 60;
const fixedDeltaTime = 1 / 60;

// Definiciones de funciones

function initMoto() {
  camion = new ImageParticle("/img/ball.png", camionWidth, camionHeight);
  camion.x = initialCamionPositionX - camion.width;
  camion.y = initialCamionPositionY;
  camion.img.onload = function () {
    camion.draw(context);
  };
  pixelsPerMeter = canvasWidthPixels / simulationDistance;
  camion.ax = Number(simulationAcelerationInput.value) * pixelsPerMeter;
  // camion.vx = (Number(simulationAcelerationInput) || 2) * pixelsPerMeter;
}
function initRuler() {
  ruler = new Ruler(
    simulationDistance,
    10,
    initialCamionPositionY + camionHeight,
    initialCamionPositionX,
    canvasWidthPixels
  );
  ruler.draw(context);
}

function initGraphs() {
  const maxTime = Number(simulationTimeInput.value);
  const maxDistance = simulationDistance;
  const maxSpeed =
    Number(simulationAcelerationInput.value) *
    Number(simulationTimeInput.value);
  graph = new Graph(
    graphCanvas,
    graphContext,
    maxTime,
    maxDistance,
    "Distancia (m)"
  );
  graph.draw();
  velocityGraph = new Graph(
    velocityGraphCanvas,
    velocityGraphContext,
    maxTime,
    maxSpeed,
    "Velocidad (m/s)"
  );
  velocityGraph.draw();
}

function updateAndDrawGraphs() {
  const time = frameCount / 60;
  graph.addPoint(time, distanceDisplay.distance / pixelsPerMeter);
  graph.draw();
  const speed = camion.vx / pixelsPerMeter;
  velocityGraph.addPoint(time, speed);
  velocityGraph.draw();
}
function loadAndDrawImage() {
  simulationDistance =
    0.5 *
    Number(simulationAcelerationInput.value) *
    Number(simulationTimeInput.value) *
    Number(simulationTimeInput.value);
  background.image = new Image();
  background.image.onload = function () {
    background.draw(simulationDistance);
    camionWidth = -0.0034 * simulationDistance + 41.72;
    initMoto();
    initRuler();
  };
  background.image.src = "/img/mesa_billar.png";
  initGraphs();
}
function disableButtonsAndInputs() {
  startButton.disabled = true;
  simulationDistanceInput.disabled = true;
  // speedInput.disabled = true;
  simulationTimeInput.disabled = true;
}
function enableButtonsAndInputs() {
  startButton.disabled = false;
  simulationDistanceInput.disabled = false;
  // speedInput.disabled = false;
  simulationTimeInput.disabled = false;
}
function init() {
  loadAndDrawImage();
  clock = new Clock();
  distanceDisplay = new DistanceDisplay(10, 60);
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  disableButtonsAndInputs();
  frameCount = 0;
  totalFrames = framesPerSecond * Number(simulationTimeInput.value);
  animFrame();
}
function handleAnimationEnd() {
  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modalText");
  const distanceInMeters = distanceDisplay.distance / pixelsPerMeter;
  modalText.textContent =
    "La distancia alcanzada por el motociclista es: " +
    distanceInMeters.toFixed(0) +
    " m";
  modal.style.visibility = "visible";
  enableButtonsAndInputs();
}
function animFrame() {
  background.draw(simulationDistance);
  ruler.draw(context);
  updateAndDrawGraphs();
  onEachStep();
  frameCount++;
  if (frameCount < totalFrames) {
    animationId = requestAnimationFrame(animFrame, canvas);
  } else {
    handleAnimationEnd();
  }
}
function onEachStep() {
  const speed = camion.ax * fixedDeltaTime;
  camion.vx += speed;
  const distance = camion.vx * fixedDeltaTime; // Distancia que la moto ha recorrido desde el último cuadro en metros
  camion.x += distance; // Convierte la distancia a píxeles antes de añadirla a moto.x
  camion.draw(context);
  clock.update();
  clock.draw(context);
  distanceDisplay.update(distance, pixelsPerMeter);
  distanceDisplay.draw(context);
}
function endSimulation() {
  // Cancela la animación
  cancelAnimationFrame(animationId);
  frameCount = 0;
  // Restablece los valores de Tiempo de Simulación y Distancia
  clock.reset();
  distanceDisplay.reset();
  loadAndDrawImage();
  enableButtonsAndInputs();
}

function showModal(message, disableConfirmButton) {
  const modal = document.getElementById("alertModal");
  const modalText = document.getElementById("alertModalText");
  const confirmButton = document.getElementById("confirmButton");
  modalText.textContent = message;
  modal.style.display = "flex";
  confirmButton.disabled = disableConfirmButton;
}

// Controladores de eventos
document.getElementById("modalButton").onclick = function () {
  document.getElementById("modal").style.visibility = "hidden";
};
document.getElementById("confirmButton").onclick = function () {
  document.getElementById("alertModal").style.display = "none"; // Cambia 'visibility' a 'display'
  shouldStartSimulation = true;
  if (shouldStartSimulation) {
    init();
  }
};
document.getElementById("cancelButton").onclick = function () {
  document.getElementById("alertModal").style.display = "none"; // Cierra el mensaje
  shouldStartSimulation = false; // Evita que la simulación se inicie
};

startButton.addEventListener("click", function () {
  const aceleration = Number(simulationAcelerationInput.value);
  // const speed = Number(speedInput.value);
  const simulationTime = Number(simulationTimeInput.value);
  const simulationDistance = Number(simulationDistanceInput.value);

  if (
    aceleration < 0 ||
    simulationTime < 0 ||
    simulationDistance < 0 ||
    isNaN(aceleration) ||
    isNaN(simulationTime) ||
    isNaN(simulationDistance) ||
    //  .value.includes("e") ||
    simulationTimeInput.value.includes("e") ||
    simulationDistanceInput.value.includes("e") ||
    // speedInput.value === "" ||
    simulationTimeInput.value === "" ||
    simulationDistanceInput.value === "" ||
    // speedInput.value.includes("+") ||
    simulationTimeInput.value.includes("+") ||
    simulationDistanceInput.value.includes("+") ||
    // speedInput.value.includes(",") ||
    simulationTimeInput.value.includes(",") ||
    simulationDistanceInput.value.includes(",")
  ) {
    showModal(
      "Valor incorrecto. Por favor, ingresa un número no negativo.",
      true
    );
    return;
  }

  if (aceleration * simulationTime > simulationDistance) {
    showModal(
      "La Distancia de Simulación es muy pequeña!!. " +
        "Esto puede resultar en que no se vea toda la simulación. " +
        "¿Deseas continuar de todos modos?",
      false
    );
  } else {
    init();

    fetch("/guardar-datos-simulacion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // speed: speed,
        simulationTime: simulationTime,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos guardados con éxito:", data);
      })
      .catch((error) => {
        console.error("Error al guardar los datos:", error);
      });
  }
});
endButton.addEventListener("click", endSimulation);

simulationDistanceInput.addEventListener("input", loadAndDrawImage);

// Inicialización
window.onload = loadAndDrawImage;
background = new Background("/img/mesa_billar.png", canvas, context);
