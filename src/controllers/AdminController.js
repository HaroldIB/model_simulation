function homeAdmin(req, res) {
  if (req.session.loggedin) {
    // Accede a la conexión a la base de datos
    req.getConnection((err, connection) => {
      if (err) {
        console.error("Error al obtener la conexión:", err);
        res.send("Error al conectarse a la base de datos");
        return;
      }

      // Realiza la consulta a la base de datos
      connection.query(
        // " SELECT u.id_usuario, u.nombre_u, e.grado_e, e.instituto_e, COALESCE(MAX(edus.numero_ingreso), 0) as ing_sist FROM Usuario u INNER JOIN Estudiante e ON u.id_usuario = e.id_usuario LEFT JOIN Estudiante_Datos_Uso_Sistema edus ON e.id_estudiante = edus.id_estudiante WHERE u.tipo_u = 'Estudiante' GROUP BY u.id_usuario, u.nombre_u, e.grado_e, e.instituto_e ORDER BY u.nombre_u",
          "SELECT u.id_usuario, u.nombre_u, e.grado_e, e.instituto_e, " +
          "COALESCE(MAX(edus.numero_ingreso), 0) AS ing_sist, " +
          "COALESCE(SUM(edus.tiempo_sesion), 0) AS tiempo_total " + // Sumar el tiempo de sesión
          "FROM Usuario u " +
          "INNER JOIN Estudiante e ON u.id_usuario = e.id_usuario " +
          "LEFT JOIN Estudiante_Datos_Uso_Sistema edus ON e.id_estudiante = edus.id_estudiante " +
          "WHERE u.tipo_u = 'Estudiante' " +
          "GROUP BY u.id_usuario, u.nombre_u, e.grado_e, e.instituto_e " +
          "ORDER BY u.nombre_u",
        (err, resultados) => {
          if (err) {
            console.error("Error al realizar la consulta:", err);
            res.send("Error al obtener los datos");
            return;
          }
          // Renderiza la vista home_admin con los datos
          res.render("home_admin", {
            name: req.session.name,
            datos: resultados,
          });
        }
      );
    });
  } else {
    res.redirect("/");
  }
}

module.exports = {
  homeAdmin,
};
