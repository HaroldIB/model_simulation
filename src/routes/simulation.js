const express = require("express");
const SimulationController = require("../controllers/SimulationController");
const router = express.Router();

router.get("/simulations/simulation", SimulationController.simulation);
router.get("/simulations/simulation2", SimulationController.simulation2);
router.get("/simulations/simulation3", SimulationController.simulation3);
router.get("/simulations_mru", SimulationController.simulationMRU);
router.get("/simulations_mruv", SimulationController.simulationMRUV);
router.get(
  "/simulations/simulation_mruv",
  SimulationController.simulation_mruv
);

router.get(
  "/simulations/simulation2_mruv",
  SimulationController.simulation2_mruv
);
router.post(
  "/guardar-datos-simulacion",
  SimulationController.guardarDatosSimulacion
);

module.exports = router;
