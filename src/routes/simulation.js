const express = require("express");
const SimulationController = require("../controllers/SimulationController");
const router = express.Router();

router.get("/simulations/simulation", SimulationController.simulation);
router.get("/simulations/simulation2", SimulationController.simulation2);
router.get("/simulations_mru", SimulationController.simulationMRU);
router.post(
  "/guardar-datos-simulacion",
  SimulationController.guardarDatosSimulacion
);

module.exports = router;
