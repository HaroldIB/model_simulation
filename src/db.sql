-- Creacion de la base de datos
CREATE DATABASE motionsim;
-- Seleccion de la base de datos
USE motionsim;
-- Creacion de la tabla USUARIO
CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_u VARCHAR(100) NOT NULL,
    email_u VARCHAR(100) UNIQUE NOT NULL,
    password_u VARCHAR(255) NOT NULL,
    tipo_u ENUM('Investigador', 'Estudiante') NOT NULL
);
-- Creacion de la tabla INVESTIGADOR
CREATE TABLE investigador (
    id_investigador INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    universidad_i VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);
-- Creacion de la tabla ESTUDIANTE
CREATE TABLE estudiante (
    id_estudiante INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    grado_e VARCHAR(50) NOT NULL,
    instituto_e VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);
-- Creacion de la tabla SIMULACION
CREATE TABLE simulacion (
    id_simulacion INT PRIMARY KEY AUTO_INCREMENT,
    tipo_s VARCHAR(50) NOT NULL,
    nombre_s VARCHAR(100) NOT NULL,
    parametros_s TEXT NOT NULL, -- Se utiliza TEXT en lugar de JSON
    descripcion_s TEXT
);
-- Creacion de la tabla ESTUDIANTE_SIMULACION
CREATE TABLE estudiante_simulacion (
    id_estudiante INT,
    id_simulacion INT,
    fecha_realizacion DATE NOT NULL,
    hora_realizacion TIME NOT NULL,
    numero_realizacion INT NOT NULL,
    valor_parametros TEXT NOT NULL, -- Se utiliza TEXT en lugar de JSON
    tiempo_simulacion INT NOT NULL,
    PRIMARY KEY (
        id_estudiante,
        id_simulacion,
        fecha_realizacion,
        hora_realizacion,
        numero_realizacion
    ),
    FOREIGN KEY (id_estudiante) REFERENCES Estudiante (id_estudiante),
    FOREIGN KEY (id_simulacion) REFERENCES Simulacion (id_simulacion)
);

-- Creacion de la tabla DATOS_USO_SISTEMA
CREATE TABLE datos_uso_sistema (
    id_datos_uso_sistema INT PRIMARY KEY AUTO_INCREMENT,
    tipo_datos TEXT,
    id_investigador INT,
    FOREIGN KEY (id_investigador) REFERENCES Investigador (id_investigador)
);
-- Creacion de la tabla ESTUDIANTE_DATOS_USO_SISTEMA
CREATE TABLE estudiante_datos_uso_sistema (
    id_estudiante INT,
    id_datos_uso_sistema INT,
    fecha_ingreso DATE NOT NULL,
    hora_ingreso TIME NOT NULL,
    numero_ingreso INT NOT NULL,
    tiempo_sesion INT NOT NULL,
    PRIMARY KEY (
        id_estudiante,
        id_datos_uso_sistema
    ),
    FOREIGN KEY (id_estudiante) REFERENCES estudiante (id_estudiante),
    FOREIGN KEY (id_datos_uso_sistema) REFERENCES datos_uso_sistema (id_datos_uso_sistema)
);
-- Creacion de la tabla SIMULACION_DATOS_USO_SISTEMA
CREATE TABLE simulacion_datos_uso_sistema (
    id_simulacion INT,
    id_datos_uso_sistema INT,
    numero_repeticion INT NOT NULL,
    PRIMARY KEY (
        id_simulacion,
        id_datos_uso_sistema
    ),
    FOREIGN KEY (id_simulacion) REFERENCES Simulacion (id_simulacion),
    FOREIGN KEY (id_datos_uso_sistema) REFERENCES Datos_Uso_Sistema (id_datos_uso_sistema)
);