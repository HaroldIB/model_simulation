// Obtener elementos del DOM
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const largeInput = document.getElementById("largeInput");
const speedInput = document.getElementById("speedInput");
const distanceInput = document.getElementById("distanceInput");

const simulationTimeInput = document.getElementById("simulationTime");
const simulationDistanceInput = document.getElementById("simulationDistance");
const endButton = document.getElementById("endButton");
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
let trainHeight = 120;
let trainWidth = 150;

let tunelHeight = 140;
let tunelWidth = 300;

let graph;
let velocityGraph;
let shouldStartSimulation = true;
const initialPlanePositionX = 50;
const initialPlanePositionY = 150;
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
  tunel.y = initialPlanePositionY;
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
    initialPlanePositionX,
    canvasWidthPixels
  );
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

function loadAndDrawImage() {
  simulationDistance =
    Number(distanceInput.value) + 2 * Number(largeInput.value);
  // distanceInput.value = simulationDistance;
  // simulationTimeInput.value = Number(simulationTimeInput.value); // Fijamos el tiempo en 2 segundos
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
  // simulationDistanceInput.disabled = true;
  // speedInput.disabled = true;
  // simulationTimeInput.disabled = true;
}

function enableButtonsAndInputs() {
  startButton.disabled = false;
  // simulationDistanceInput.disabled = false;
  // speedInput.disabled = false;
  // simulationTimeInput.disabled = false;
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
    "El tiempo que tadar el tren en cruzar el tunel es: " +
    (Number(largeInput.value) + Number(distanceInput.value)) /
      Number(speedInput.value) +
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

// Controladores de eventos
document.getElementById("modalButton").onclick = function () {
  document.getElementById("modal").style.visibility = "hidden";
};

startButton.addEventListener("click", function () {
  init();
});

endButton.addEventListener("click", endSimulation);

// Inicialización
window.onload = loadAndDrawImage;
background = new Background("/img/background_train.jpg", canvas, context);
