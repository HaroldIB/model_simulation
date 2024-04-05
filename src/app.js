// Importamos las dependencias necesarias
const express = require("express"); // Express es un framework para construir aplicaciones web en Node.js
const { engine } = require("express-handlebars"); // Handlebars es un motor de plantillas para Express
const myconnection = require("express-myconnection"); // express-myconnection es un middleware de Express para MySQL
const mysql = require("mysql"); // MySQL es un módulo para trabajar con bases de datos MySQL
const session = require("express-session"); // express-session es un middleware de Express para manejar sesiones
const bodyParser = require("body-parser"); // body-parser es un middleware para analizar el cuerpo de las solicitudes HTTP
const loginRoutes = require("./routes/login"); // Importamos el archivo de rutas de login
// Creamos una nueva aplicación Express
const app = express();

// Configuramos el puerto en el que se ejecutará la aplicación
app.set("port", process.env.PORT || 4000);

// Configuramos la ubicación de las vistas de la aplicación
app.set("views", __dirname + "/views");

// Configuramos el motor de plantillas de la aplicación para usar Handlebars
app.engine(
  ".hbs",
  engine({
    extname: ".hbs", // Establecemos la extensión de los archivos de plantilla en .hbs
  })
);
app.set("view engine", ".hbs"); // Establecemos Handlebars como el motor de plantillas de la aplicación

// Usamos body-parser para analizar el cuerpo de las solicitudes HTTP
app.use(bodyParser.urlencoded({ extended: true })); // Analiza los cuerpos de las solicitudes en formato urlencoded
app.use(bodyParser.json()); // Analiza los cuerpos de las solicitudes en formato JSON

app.use(
  myconnection(mysql, {
    // Configuramos la conexión a la base de datos
    host: process.env.DB_HOST || "localhost", // La dirección del servidor de la base de datos
    user: process.env.DB_USER || "root", // El nombre de usuario de la base de datos
    password: process.env.DB_PASSWORD || "", // La contraseña de la base de datos
    port: process.env.DB_PORT || 3306, // El puerto de la base de datos
    database: process.env.DB_NAME || "user_login", // El nombre de la base de datos
  })
);
app.use(session({ secret: "secret", resave: true, saveUninitialized: true })); // Configuramos la sesión

// Iniciamos el servidor en el puerto configurado
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port")); // Imprimimos un mensaje en la consola cuando el servidor se inicia
});

app.use("/", loginRoutes); // Usamos las rutas de login en la aplicación
app.get("/", (req, res) => {
  if (req.session.loggedin == true) {
    res.render("home", { name: req.session.name });
  } else {
    res.redirect("/login");
  }
});
