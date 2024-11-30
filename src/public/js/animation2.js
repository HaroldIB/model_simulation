// Obtener elementos del DOM
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
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
let planeHeight = 40;
let planeWidth = 40;
let graph;
let velocityGraph;
let shouldStartSimulation = true;
const initialPlanePositionX = 50;
const initialPlanePositionY = 200;
const framesPerSecond = 60;
const fixedDeltaTime = 1 / 60;

// Definiciones de funciones
function initPlane() {
  plane = new ImageParticle("/img/plane.png", planeWidth, planeHeight);
  plane.x = initialPlanePositionX - plane.width;
  plane.y = initialPlanePositionY;
  plane.img.onload = function () {
    plane.draw(context);
  };
  pixelsPerMeter = canvasWidthPixels / simulationDistance;
  // La velocidad se calcula automáticamente basada en la distancia y el tiempo
  plane.vx =
    (simulationDistance / Number(simulationTimeInput.value)) * pixelsPerMeter;
}

function initRuler() {
  ruler = new Ruler(
    simulationDistance,
    10,
    initialPlanePositionY + planeHeight,
    initialPlanePositionX,
    canvasWidthPixels
  );
  ruler.draw(context);
}

function initGraphs() {
  const maxTime = Number(simulationTimeInput.value);
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
  const speed = plane.vx / pixelsPerMeter;
  velocityGraph.addPoint(time, speed);
  velocityGraph.draw();
}

function loadAndDrawImage() {
  simulationDistance = Number(distanceInput.value); // Fijamos la distancia en 160 metros
  distanceInput.value = simulationDistance;
  simulationTimeInput.value = Number(simulationTimeInput.value); // Fijamos el tiempo en 2 segundos
  background.image = new Image();
  background.image.onload = function () {
    background.draw(simulationDistance);
    planeWidth = -0.0034 * simulationDistance + 41.72;
    initPlane();
    initRuler();
  };
  background.image.src = "/img/background_plane.png";
  initGraphs();
}

function disableButtonsAndInputs() {
  startButton.disabled = true;
  // simulationDistanceInput.disabled = true;
  // speedInput.disabled = true;
  simulationTimeInput.disabled = true;
}

function enableButtonsAndInputs() {
  startButton.disabled = false;
  // simulationDistanceInput.disabled = false;
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
  const velocity = simulationDistance / Number(simulationTimeInput.value);
  modalText.textContent =
    "La velocidad del avión es: " + velocity.toFixed(0) + " m/s";
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
  const distance = plane.vx * fixedDeltaTime;
  plane.x += distance;
  plane.draw(context);
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
background = new Background("img/background.jpg", canvas, context);
