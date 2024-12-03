// Obtener elementos del DOM
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const endButton = document.getElementById("endButton");

const largeInput = document.getElementById("largeInput");
const speedInput = document.getElementById("speedInput");
const distanceInput = document.getElementById("distanceInput");

const velocityGraphCanvas = document.getElementById("velocityGraphCanvas");
const velocityGraphContext = velocityGraphCanvas.getContext("2d");
const graphCanvas = document.getElementById("graphCanvas");
const graphContext = graphCanvas.getContext("2d");

// Declaración de variables y constantes
let totalFrames;
let frameCount = 0;
let plane;
let clock;
let distanceDisplay;
let ruler;
let background;
let animationId;
let canvasWidthPixels = canvas.width - 100;
let pixelsPerMeter;
let simulationDistance;
let trainHeight = 100;
let trainWidth = 150;

let tunelHeight = 120;
let tunelWidth = 300;

let graph;
let velocityGraph;
let shouldStartSimulation = true;
const initialPlanePositionX = 50;
const initialPlanePositionY = 170;
const framesPerSecond = 60;
const fixedDeltaTime = 1 / 60;

// Definiciones de funciones
function initTrain() {
  train = new ImageParticle("/img/train.png", trainWidth, trainHeight);
  train.x = initialPlanePositionX;
  train.y = initialPlanePositionY;
  train.img.onload = function () {
    train.draw(context);
  };
  tunel = new ImageParticle("/img/tunel.png", tunelWidth, tunelHeight);
  tunel.x =
    initialPlanePositionX +
    (Number(largeInput.value) * canvasWidthPixels) / simulationDistance;
  tunel.y = initialPlanePositionY - 13;
  tunel.img.onload = function () {
    tunel.draw(context);
  };
  pixelsPerMeter = canvasWidthPixels / simulationDistance;
  trainWidth =
    (canvasWidthPixels * Number(largeInput.value)) / simulationDistance;
  tunelWidth =
    (canvasWidthPixels * Number(distanceInput.value)) / simulationDistance;
  // La velocidad se calcula automáticamente basada en la distancia y el tiempo
  train.vx = Number(speedInput.value) * pixelsPerMeter;
}

function initRuler() {
  ruler = new Ruler(
    simulationDistance,
    10,
    initialPlanePositionY + trainHeight,
    initialPlanePositionX +
      (Number(largeInput.value) * canvasWidthPixels) / simulationDistance,
    canvasWidthPixels
  );
  ruler.color = "white";
  ruler.draw(context);
}

function initGraphs() {
  const maxTime =
    (Number(largeInput.value) + Number(distanceInput.value)) /
    Number(speedInput.value);
  const maxDistance = simulationDistance;
  const maxSpeed = (simulationDistance / maxTime) * 1.5; // Ajustamos el máximo de velocidad
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
  const speed = train.vx / pixelsPerMeter;
  velocityGraph.addPoint(time, speed);
  velocityGraph.draw();
}

function updateLargeInputValue(value) {
  document.getElementById("largeInput").textContent = value;
  loadAndDrawImage(value); // Llamamos a la función para actualizar el fondo y otras configuraciones
}
function updateDistanceInputValue(value) {
  document.getElementById("distanceInput").value = value;
  loadAndDrawImage(value); // Llamamos a la función para actualizar el fondo y otras configuraciones
}
function loadAndDrawImage() {
  simulationDistance =
    Number(distanceInput.value) + 2 * Number(largeInput.value);
  background.image = new Image();
  background.image.onload = function () {
    background.draw(simulationDistance);
    // trainWidth = -0.0034 * simulationDistance + 41.72;
    initTrain();
    initRuler();
  };
  background.image.src = "/img/background_train.jpg";
  initGraphs();
}

function disableButtonsAndInputs() {
  startButton.disabled = true;
  largeInput.disabled = true;
  speedInput.disabled = true;
  distanceInput.disabled = true;
}

function enableButtonsAndInputs() {
  startButton.disabled = false;
  largeInput.disabled = false;
  speedInput.disabled = false;
  distanceInput.disabled = false;
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
  totalFrames =
    (framesPerSecond *
      (Number(largeInput.value) + Number(distanceInput.value))) /
    Number(speedInput.value);
  animFrame();
}

function handleAnimationEnd() {
  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modalText");
  const velocity =
    simulationDistance /
    (Number(speedInput.value) /
      (Number(largeInput.value) + Number(distanceInput.value)));
  modalText.textContent =
    "El tiempo que tarda el tren en cruzar el tunel es: " +
    (
      (Number(largeInput.value) + Number(distanceInput.value)) /
      Number(speedInput.value)
    ).toFixed(0) +
    " segundos";
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
  const distance = train.vx * fixedDeltaTime;
  train.x += distance;
  train.draw(context);
  tunel.draw(context);
  clock.update();
  clock.draw(context);
  distanceDisplay.update(distance, pixelsPerMeter);
  distanceDisplay.draw(context);
}

function endSimulation() {
  cancelAnimationFrame(animationId);
  frameCount = 0;
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

// Controladores de eventos
document.getElementById("modalButton").onclick = function () {
  document.getElementById("modal").style.visibility = "hidden";
};

startButton.addEventListener("click", function () {
  const speed = Number(speedInput.value);
  const largeTrain = Number(largeInput.value);
  const simulationDistance = Number(distanceInput.value);

  if (
    speed <= 0 ||
    largeTrain <= 0 ||
    simulationDistance <= 0 ||
    isNaN(speed) ||
    isNaN(largeTrain) ||
    isNaN(simulationDistance) ||
    speedInput.value.includes("e") ||
    distanceInput.value.includes("e") ||
    largeInput.value.includes("e") ||
    speedInput.value === "" ||
    distanceInput.value === "" ||
    largeInput.value === "" ||
    speedInput.value.includes("+") ||
    distanceInput.value.includes("+") ||
    largeInput.value.includes("+") ||
    speedInput.value.includes(",") ||
    distanceInput.value.includes(",") ||
    largeInput.value.includes(",")
  ) {
    showModal(
      "Valor incorrecto. Por favor, ingresa un número no negativo.",
      true
    );
    return;
  }

  if (Number(distanceInput.value) + 2 * Number(largeInput.value) > 2000) {
    showModal(
      "La Distancia de Simulación es muy grande!!. " +
        "Esto puede resultar en que no se la simulación correctamente. " +
        "¿Deseas continuar de todos modos?",
      false
    );
  } else {
    init();
  }
});
endButton.addEventListener("click", endSimulation);

// Inicialización
window.onload = loadAndDrawImage;
background = new Background("/img/background_train.jpg", canvas, context);
