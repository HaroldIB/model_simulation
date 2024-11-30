const bcrypt = require("bcrypt");
const { use } = require("../routes/login");

function index(req, res) {
  if (req.session.loggedin == true) {
    res.render("home_student", { name: req.session.name });
  } else {
    res.redirect("/login");
  }
}
function login(req, res) {
  if (req.session.loggedin != true) {
    res.render("login/index");
  } else {
    res.redirect("/");
  }
}

function auth(req, res) {
  const data = req.body;

  req.getConnection((err, conn) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al conectar con la base de datos." });
    }

    conn.query(
      "SELECT * FROM Usuario WHERE email_u = ?",
      [data.email],
      (err, userdata) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error al consultar el usuario." });
        }

        if (userdata.length > 0) {
          const user = userdata[0];

          bcrypt.compare(
            data.password,
            user.password_u,
            async (err, isMatch) => {
              if (err) {
                return res
                  .status(500)
                  .json({ error: "Error al comparar contraseñas." });
              }

              if (!isMatch) {
                return res.render("login/index", {
                  error: "*Error: Contraseña incorrecta!",
                });
              }

              // Si las credenciales son correctas
              const horaInicio = Math.floor(Date.now() / 1000);
              req.session.loggedin = true;
              req.session.name = user.nombre_u;
              req.session.horaInicio = horaInicio;

              // Convertir las consultas a promesas
              try {
                // Primera consulta: número de ingreso
                const [numeroIngresoResult] = await new Promise(
                  (resolve, reject) => {
                    conn.query(
                      "SELECT MAX(eus.numero_ingreso) AS maxIngreso FROM Estudiante_Datos_Uso_Sistema eus " +
                        "JOIN Estudiante e ON eus.id_estudiante = e.id_estudiante " +
                        "JOIN Usuario u ON e.id_usuario = u.id_usuario WHERE u.id_usuario = ?",
                      [user.id_usuario],
                      (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                      }
                    );
                  }
                );

                req.session.numeroIngreso = numeroIngresoResult.maxIngreso
                  ? numeroIngresoResult.maxIngreso + 1
                  : 1;

                // Segunda consulta: ID del estudiante
                const [estudianteResult] = await new Promise(
                  (resolve, reject) => {
                    conn.query(
                      "SELECT e.id_estudiante FROM Estudiante e " +
                        "JOIN Usuario u ON e.id_usuario = u.id_usuario WHERE u.id_usuario = ?",
                      [user.id_usuario],
                      (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                      }
                    );
                  }
                );

                req.session.idEstudiante = estudianteResult
                  ? estudianteResult.id_estudiante
                  : null;

                // Guardar la sesión antes de redirigir
                req.session.save((err) => {
                  if (err) {
                    console.error("Error al guardar la sesión:", err);
                    return res
                      .status(500)
                      .json({ error: "Error al guardar la sesión." });
                  }

                  // Redirigir según el tipo de usuario
                  if (user.tipo_u === "Estudiante") {
                    res.redirect("/home_student");
                  } else if (user.tipo_u === "Investigador") {
                    res.redirect("/home_admin");
                  } else {
                    res.redirect("/");
                  }
                });
              } catch (error) {
                console.error("Error en las consultas:", error);
                return res
                  .status(500)
                  .json({ error: "Error en el proceso de autenticación." });
              }
            }
          );
        } else {
          res.render("login/index", {
            error: "*Error: Usuario no encontrado!",
          });
        }
      }
    );
  });
}

function register(req, res) {
  if (req.session.loggedin != true) {
    res.render("login/register");
  } else {
    res.redirect("/");
  }
}

function storeUser(req, res) {
  const data = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return res.status(500).send("Database connection error.");
    }
    conn.query(
      "SELECT * FROM Usuario WHERE email_u = ?",
      [data.email],
      (err, userdata) => {
        if (err) {
          console.error("Error during SELECT query:", err);
          return res.status(500).send("Database query error.");
        }
        if (userdata.length > 0) {
          return res.render("login/register", {
            error: "*Error: El Usuario ya existe!",
          });
        } else {
          bcrypt
            .hash(data.password, 12)
            .then((hash) => {
              const userData = {
                nombre_u: data.name,
                email_u: data.email,
                password_u: hash,
                tipo_u: "Estudiante", // Esto asume que siempre estamos registrando estudiantes
              };
              req.getConnection((err, conn) => {
                if (err) {
                  console.error("Error connecting to the database:", err);
                  return res.status(500).send("Database connection error.");
                }

                conn.query(
                  "INSERT INTO Usuario SET ?",
                  [userData],
                  (err, result) => {
                    if (err) {
                      console.error("Error during INSERT INTO Usuario:", err);
                      return res.status(500).send("Database insertion error.");
                    }

                    const userId = result.insertId;
                    const studentData = {
                      id_usuario: userId,
                      grado_e: data.grade, // El grado seleccionado en el formulario
                      instituto_e: data.institution, // El nombre del instituto o universidad
                    };

                    conn.query(
                      "INSERT INTO Estudiante SET ?",
                      [studentData],
                      (err, rows) => {
                        if (err) {
                          console.error(
                            "Error during INSERT INTO Estudiante:",
                            err
                          );
                          return res
                            .status(500)
                            .send("Database insertion error.");
                        }

                        // req.session.loggedin = true;
                        // req.session.name = data.name;
                        req.flash(
                          "success_msg",
                          "Registro exitoso. Ahora inicie sesión."
                        );
                        res.redirect("/");
                      }
                    );
                  }
                );
              });
            })
            .catch((bcryptErr) => {
              console.error("Error during password hashing:", bcryptErr);
              return res.status(500).send("Password hashing error.");
            });
        }
      }
    );
  });
}

function storeAdmin(req, res) {
  const investigadorData = {
    name: "Harold Bustamante",
    email: "haroldbustamante22@gmail.com",
    password: "admin",
    universidad: "UPEA",
  };
  req.getConnection((err, conn) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return res.status(500).send("Database connection error.");
    }
    conn.query(
      "SELECT * FROM usuario WHERE email_u = ?",
      [investigadorData.email],
      (err, userdata) => {
        if (err) {
          console.error("Error during SELECT query:", err);
          return res.status(500).send("Database query error.");
        }
        if (userdata.length > 0) {
          console.log("El investigador ya existe abandonando la creación");
          return; // No hacer nada si el investigador ya existe
        } else {
          bcrypt.hash(investigadorData.password, 12).then((hash) => {
            const userData = {
              nombre_u: investigadorData.name,
              email_u: investigadorData.email,
              password_u: hash,
              tipo_u: "Investigador", // Se registra como "Investigador"
            };

            req.getConnection((err, conn) => {
              if (err) {
                console.error("Error connecting to the database:", err);
                return res.status(500).send("Database connection error.");
              }
              conn.query(
                "INSERT INTO usuario SET ?",
                [userData],
                (err, result) => {
                  if (err) {
                    console.error("Error during INSERT INTO Usuario:", err);
                    return res.status(500).send("Database insertion error.");
                  }
                  const userId = result.insertId;
                  const investigadorDetails = {
                    id_usuario: userId,
                    universidad_i: investigadorData.universidad, // Universidad del investigador
                  };
                  conn.query(
                    "INSERT INTO investigador SET ?",
                    [investigadorDetails],
                    (err, rows) => {
                      if (err) {
                        console.error(
                          "Error during INSERT INTO Investigador:",
                          err
                        );
                        return res
                          .status(500)
                          .send("Database insertion error.");
                      }
                      console.log("Investigador created successfully.");
                    }
                  );
                }
              );
            });
          });
        }
      }
    );
  });
  res.redirect("/");
}

function logout(req, res) {
  req.getConnection((err, conn) => {
    if (req.session.loggedin == true) {
      //Datos de Uso del Sistema
      const fechaActual = new Date().toISOString().split("T")[0];
      const horaActual = new Date().toTimeString().split(" ")[0];
      const tiempoInicial = 0; // El tiempo inicial será 0 al ingresar
      const idInvestigador = 1; // El tiempo inicial será 0 al ingresar

      const datosSistema = {
        tipo_datos: "estudiante",
        id_investigador: idInvestigador,
      };
      conn.query(
        "INSERT INTO datos_uso_sistema SET ?",
        datosSistema,
        (err, resultDatos) => {
          if (err) {
            console.error("Error al insertar en Datos_Uso_Sistema:", err);
            return res
              .status(500)
              .json({ error: "Error al registrar datos del sistema" });
          }

          const idDatosUsoSistema = resultDatos.insertId;
          const fechaIngreso = new Date().toISOString().split("T")[0];
          const horaFin = Math.floor(Date.now() / 1000); // Hora de cierre de sesión
          const tiempoSesion = horaFin - req.session.horaInicio; // Tiempo en segundos
          const queryInsert =
            "INSERT INTO estudiante_datos_uso_sistema (id_estudiante, id_datos_uso_sistema, fecha_ingreso, hora_ingreso, numero_ingreso, tiempo_sesion) VALUES (?, ?, ?, ?, ?, ?)";
          idEstudiante = req.session.idEstudiante; // O como tengas configurado
          numeroIngreso = req.session.numeroIngreso || 1; // Recuperar el número de ingreso
          if (err) {
            console.error("Error al conectar con la base de datos:", err);
            return res.redirect("/");
          }
          conn.query(
            queryInsert,
            [
              idEstudiante,
              idDatosUsoSistema,
              fechaIngreso,
              horaActual,
              numeroIngreso,
              tiempoSesion,
            ],
            (err) => {
              if (err) {
                console.error("Error al guardar datos de uso:", err);
              }

              // Después de guardar, destruir la sesión
              req.session.destroy();
              res.redirect("/");
            }
          );
        }
      );
    }
  });
}

module.exports = {
  login,
  register,
  storeUser,
  auth,
  logout,
  storeAdmin,
  index,
};
