function simulation(req, res) {
  if (req.session.loggedin) {
    const idEstudiante = req.session.idEstudiante; // Id del estudiante desde la sesión
    const idSimulacion = 1; // Id de la simulación que estás viendo, ajusta esto si es dinámico

    const tipo_datos = "simulacion";

    req.getConnection((err, connection) => {
      if (err) {
        console.error("Error al obtener la conexión:", err);
        res.send("Error al conectarse a la base de datos");
        return;
      }
      connection.query(
        "SELECT COUNT(*) AS total FROM simulacion_datos_uso_sistema WHERE id_simulacion = ?",
        [idSimulacion],
        (error, results) => {
          if (error) {
            console.error(
              "Error al realizar la consulta de número de realizaciones:",
              error
            );
            res.send("Error al obtener los datos");
            return;
          }
          const numeroRealizacion = results[0].total + 1;

          connection.query(
            "INSERT INTO datos_uso_sistema (tipo_datos, id_investigador) VALUES (?, 1 )",
            [tipo_datos],
            (err, resultados) => {
              if (err) {
                console.error("Error al realizar la consulta:", err);
                res.send("Error al obtener los datos");
                return;
              }
              const idDatosUsoSistema = resultados.insertId;

              connection.query(
                "INSERT INTO simulacion_datos_uso_sistema (id_simulacion, id_datos_uso_sistema, numero_repeticion) VALUES (?, ?, ?)",
                [idSimulacion, idDatosUsoSistema, numeroRealizacion],
                (err) => {
                  if (err) {
                    console.error(
                      "Error al insertar en simulacion_datos_uso_sistema:",
                      err
                    );
                    return res.status(500).send({
                      error: "Error al guardar los datos de la simulación",
                    });
                  }
                }
              );
            }
          );
        }
      );
    });

    res.render("simulations/simulation", {
      name: req.session.name,
      simulation: req.session.name,
    });
  } else {
    res.redirect("/login");
  }
}

function guardarDatosSimulacion(req, res) {
  if (req.session.loggedin) {
    const { speed, simulationTime } = req.body;
    console.log("La velocidad de la simulación que se realiza es: ", speed);
    const idEstudiante = req.session.idEstudiante; // Obtenemos el ID del estudiante de la sesión
    const idSimulacion = 1; // Ajusta este ID si es dinámico
    const fechaActual = new Date();
    const fecha = fechaActual.toISOString().split("T")[0]; // Formato de fecha 'YYYY-MM-DD'
    const hora = fechaActual.toTimeString().split(" ")[0]; // Formato de hora 'HH:MM:SS'
    const tipo_datos = "simulacion";
    const valor_parametros = JSON.stringify({
      speed,
      simulationTime,
    });
    const tiempo_simulacion = simulationTime;
    req.getConnection((err, connection) => {
      if (err) {
        console.error("Error al obtener la conexión:", err);
        return res
          .status(500)
          .send({ error: "Error al conectarse a la base de datos" });
      }
      connection.query(
        "SELECT COUNT(*) AS total FROM estudiante_simulacion WHERE id_estudiante = ? AND id_simulacion = ?",
        [idEstudiante, idSimulacion],
        (error, results) => {
          if (error) {
            console.error(
              "Error al realizar la consulta de número de realizaciones:",
              error
            );
            res.send("Error al obtener los datos");
            return;
          }
          const numeroRealizacion = results[0].total + 1;
          connection.query(
            "INSERT INTO datos_uso_sistema (tipo_datos, id_investigador) VALUES (?, 1 )",
            [tipo_datos],
            (err, resultados) => {
              if (err) {
                console.error("Error al realizar la consulta:", err);
                res.send("Error al obtener los datos");
                return;
              }
              const idDatosUsoSistema = resultados.insertId;
              console.log(
                "Se insroto datos_uso_sistema con id",
                idDatosUsoSistema
              );

              connection.query(
                "INSERT INTO estudiante_simulacion (id_estudiante, id_simulacion, fecha_realizacion, hora_realizacion, numero_realizacion, valor_parametros, tiempo_simulacion) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                  idEstudiante,
                  idSimulacion,
                  fecha,
                  hora,
                  numeroRealizacion,
                  valor_parametros,
                  tiempo_simulacion,
                ],
                (error, resultados) => {
                  if (error) {
                    console.error(
                      "Error al insertar en Estudiante_Simulacion:",
                      error
                    );

                    return res
                      .status(500)
                      .send("Error al registrar la simulación");
                  }
                }
              );
            }
          );
        }
      );
    });
  }
}

function simulation2(req, res) {
  if (req.session.loggedin) {
    res.render("simulations/simulation2", { name: req.session.name });
  } else {
    res.redirect("/login");
  }
}

function simulation3(req, res) {
  if (req.session.loggedin) {
    res.render("simulations/simulation3", { name: req.session.name });
  } else {
    res.redirect("/login");
  }
}

function simulationMRU(req, res) {
  if (req.session.loggedin) {
    res.render("simulations_mru", { name: req.session.name });
  } else {
    res.redirect("/");
  }
}

function simulationMRUV(req, res) {
  if (req.session.loggedin) {
    res.render("simulations_mruv", { name: req.session.name });
  } else {
    res.redirect("/");
  }
}

function simulation_mruv(req, res) {
  if (req.session.loggedin) {
    res.render("simulations/simulation_mruv", { name: req.session.name });
  } else {
    res.redirect("/login");
  }
}

function simulation2_mruv(req, res) {
  if (req.session.loggedin) {
    res.render("simulations/simulation2_mruv", { name: req.session.name });
  } else {
    res.redirect("/login");
  }
}
module.exports = {
  simulation,
  simulation2,
  simulation3,
  simulation_mruv,
  simulation2_mruv,
  simulationMRU,
  simulationMRUV,
  guardarDatosSimulacion,
};
