// Obtener elementos del DOM
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const startButton = document.getElementById("startButton");
const endButton = document.getElementById("endButton");

const distanceInput = document.getElementById("distanceInput");
const simulationTimeInput = document.getElementById("simulationTime");
// const simulationDistanceInput = document.getElementById("simulationDistance");

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
let planeHeight = 80;
let planeWidth = 40;
let graph;
let velocityGraph;
let shouldStartSimulation = true;
const initialPlanePositionX = 50;
const initialPlanePositionY = 120;
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
  ruler.color = "black";
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

function updateValue(value) {
  document.getElementById("distanceInput").value = value;
  loadAndDrawImage(value); // Llamamos a la función para actualizar el fondo y otras configuraciones
}

function loadAndDrawImage() {
  simulationDistance = Number(distanceInput.value); // Fijamos la distancia en 160 metros
  // distanceInput.value = simulationDistance;
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
  simulationTimeInput.disabled = true;
  distanceInput.disabled = true;
}

function enableButtonsAndInputs() {
  startButton.disabled = false;
  simulationTimeInput.disabled = false;
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
  // const speed = Number(speedInput.value);
  const simulationTime = Number(simulationTimeInput.value);
  const simulationDistance = Number(distanceInput.value);

  if (
    simulationTime <= 0 ||
    simulationDistance <= 0 ||
    isNaN(simulationTime) ||
    isNaN(simulationDistance) ||
    simulationTimeInput.value.includes("e") ||
    distanceInput.value.includes("e") ||
    simulationTimeInput.value === "" ||
    distanceInput.value === "" ||
    simulationTimeInput.value.includes("+") ||
    distanceInput.value.includes("+") ||
    simulationTimeInput.value.includes(",") ||
    distanceInput.value.includes(",")
  ) {
    showModal(
      "Valor incorrecto. Por favor, ingresa un número no negativo.",
      true
    );
    return;
  }

  if (simulationDistance > 5000) {
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
background = new Background("/img/background.jpg", canvas, context);
