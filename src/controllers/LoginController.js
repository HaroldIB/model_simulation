const bcrypt = require("bcrypt");
const { use } = require("../routes/login");

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
    //Aumentamos el siguiente código para verificar si hay error en la Base de Datos
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al conectar con la base de datos." });
    }
    conn.query(
      "SELECT * FROM Usuario WHERE email_u = ?",
      [data.email],
      (err, userdata) => {
        //Aumentamos el siguiente código para verificar si hay error en la Base de Datos
        if (err) {
          return res
            .status(500)
            .json({ error: "Error al consultar el usuario." });
        }

        if (userdata.length > 0) {
          const user = userdata[0]; // Solo maneja el primer usuario que coincida
          bcrypt.compare(data.password, user.password_u, (err, isMatch) => {
            //Aumentamos el siguiente código para verificar si hay error en la Base de Datos
            if (err) {
              return res
                .status(500)
                .json({ error: "Error al comparar contraseñas." });
            }

            if (!isMatch) {
              res.render("login/index", {
                error: "*Error: Contraseña incorrecta!",
              });
            } else {
              req.session.loggedin = true;
              req.session.name = user.nombre_u;

              // Redirigimos según el tipo de usuario
              if (user.tipo_u === "Estudiante") {
                res.redirect("/home_student");
              } else if (user.tipo_u === "Investigador") {
                res.redirect("/home_admin");
              } else {
                res.redirect("/"); // Redirige a la página principal si el tipo no es reconocido
              }
            }
          });
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

                        req.session.loggedin = true;
                        req.session.name = data.name;
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
      "SELECT * FROM Usuario WHERE email_u = ?",
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
                "INSERT INTO Usuario SET ?",
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
                    "INSERT INTO Investigador SET ?",
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
  if (req.session.loggedin == true) {
    req.session.destroy();
  }
  res.redirect("/");
}

module.exports = {
  login,
  register,
  storeUser,
  auth,
  logout,
  storeAdmin,
};
