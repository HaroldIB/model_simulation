-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-11-2024 a las 18:32:57
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `motionsim`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datos_uso_sistema`
--

CREATE TABLE `datos_uso_sistema` (
  `id_datos_uso_sistema` int(11) NOT NULL,
  `fecha_d` date NOT NULL,
  `hora_d` time NOT NULL,
  `tiempo_d` int(11) NOT NULL,
  `id_investigador` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `datos_uso_sistema`
--

INSERT INTO `datos_uso_sistema` (`id_datos_uso_sistema`, `fecha_d`, `hora_d`, `tiempo_d`, `id_investigador`) VALUES
(2, '2024-11-02', '02:33:14', 0, 2),
(3, '2024-11-02', '02:33:50', 0, 2),
(4, '2024-11-02', '02:39:59', 0, 2),
(5, '2024-11-02', '02:40:19', 0, 2),
(6, '2024-11-02', '02:41:18', 0, 2),
(7, '2024-11-02', '02:58:07', 0, 2),
(8, '2024-11-02', '02:58:23', 0, 2),
(9, '2024-11-02', '09:43:31', 0, 2),
(10, '2024-11-02', '09:57:29', 0, 2),
(11, '2024-11-02', '09:58:38', 0, 2),
(12, '2024-11-02', '11:18:59', 0, 2),
(13, '2024-11-02', '11:20:13', 0, 2),
(14, '2024-11-02', '11:21:27', 0, 2),
(15, '2024-11-02', '11:23:22', 0, 2),
(16, '2024-11-02', '11:23:53', 0, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante`
--

CREATE TABLE `estudiante` (
  `id_estudiante` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `grado_e` varchar(50) NOT NULL,
  `instituto_e` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiante`
--

INSERT INTO `estudiante` (`id_estudiante`, `id_usuario`, `grado_e`, `instituto_e`) VALUES
(1, 2, 'Pre Universitario', 'UPEA'),
(2, 3, 'Cuarto de Secundaria', 'San José II'),
(3, 5, 'Tercero de Secundaria', 'Prefacultativos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante_datos_uso_sistema`
--

CREATE TABLE `estudiante_datos_uso_sistema` (
  `id_estudiante` int(11) NOT NULL,
  `id_datos_uso_sistema` int(11) NOT NULL,
  `fecha_ingreso` date NOT NULL,
  `numero_ingreso` int(11) NOT NULL,
  `tiempo_sesion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiante_datos_uso_sistema`
--

INSERT INTO `estudiante_datos_uso_sistema` (`id_estudiante`, `id_datos_uso_sistema`, `fecha_ingreso`, `numero_ingreso`, `tiempo_sesion`) VALUES
(2, 2, '2024-11-02', 1, 3),
(2, 3, '2024-11-02', 2, 5),
(2, 5, '2024-11-02', 3, 4),
(2, 6, '2024-11-02', 4, 49),
(3, 8, '2024-11-02', 1, 12),
(3, 10, '2024-11-02', 2, 822),
(3, 16, '2024-11-02', 3, 37);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante_simulacion`
--

CREATE TABLE `estudiante_simulacion` (
  `id_estudiante` int(11) NOT NULL,
  `id_simulacion` int(11) NOT NULL,
  `fecha_realizacion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiante_simulacion`
--

INSERT INTO `estudiante_simulacion` (`id_estudiante`, `id_simulacion`, `fecha_realizacion`) VALUES
(3, 1, '2024-11-02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `investigador`
--

CREATE TABLE `investigador` (
  `id_investigador` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `universidad_i` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `investigador`
--

INSERT INTO `investigador` (`id_investigador`, `id_usuario`, `universidad_i`) VALUES
(2, 4, 'UPEA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `simulacion`
--

CREATE TABLE `simulacion` (
  `id_simulacion` int(11) NOT NULL,
  `tipo_s` varchar(50) NOT NULL,
  `nombre_s` varchar(100) NOT NULL,
  `parametros_s` text NOT NULL,
  `descripcion_s` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `simulacion`
--

INSERT INTO `simulacion` (`id_simulacion`, `tipo_s`, `nombre_s`, `parametros_s`, `descripcion_s`) VALUES
(1, 'MRU', 'Problema 1: Cálculo de la Distancia en MRU', '{\r\n \"parametros\":{\r\n  \"velocidad\":4,\r\n  \"tiempo\": 60\r\n }\r\n}', 'En un paseo por el campo, ves a un motociclista surcando el camino con su moto. La moto se desplaza suavemente con un movimiento constante y uniforme. Esa moto tiene una velocidad aproximada de \r\n80 [m/s]. ¿Cuánto recorrerá en solo \r\n5 segundos?');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `simulacion_datos_uso_sistema`
--

CREATE TABLE `simulacion_datos_uso_sistema` (
  `id_simulacion` int(11) NOT NULL,
  `id_datos_uso_sistema` int(11) NOT NULL,
  `numero_repeticion` int(11) NOT NULL,
  `valor_parametros` text NOT NULL,
  `tiempo_simulacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `simulacion_datos_uso_sistema`
--

INSERT INTO `simulacion_datos_uso_sistema` (`id_simulacion`, `id_datos_uso_sistema`, `numero_repeticion`, `valor_parametros`, `tiempo_simulacion`) VALUES
(1, 14, 1, '1', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre_u` varchar(100) NOT NULL,
  `email_u` varchar(100) NOT NULL,
  `password_u` varchar(255) NOT NULL,
  `tipo_u` enum('Investigador','Estudiante') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre_u`, `email_u`, `password_u`, `tipo_u`) VALUES
(2, 'Harold Bustamante Chuquimia', 'harold@email.com', '1234', 'Estudiante'),
(3, 'Harold Israel Bustamante Chuquimia', 'haroldbustamante@email.com', '$2b$12$7LinfRSv37iPJ.8JaKeksu6uM37Zp3Cn9AfNqfd7Z5Oe2wsQr07T2', 'Estudiante'),
(4, 'Harold Bustamante', 'haroldbustamante22@gmail.com', '$2b$12$WnHeJFehy.G4oCBi6DxgV..KBmdiUTybbLmuC/aF.COqb3ulmzBBG', 'Investigador'),
(5, 'Milagros Bustamante', 'mia@email.com', '$2b$12$WN1YRijh/KUHH.L6UNTJNeVofejv/c4A6izHWvFmijnMdgq1TWziq', 'Estudiante');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `datos_uso_sistema`
--
ALTER TABLE `datos_uso_sistema`
  ADD PRIMARY KEY (`id_datos_uso_sistema`),
  ADD KEY `id_investigador` (`id_investigador`);

--
-- Indices de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD PRIMARY KEY (`id_estudiante`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `estudiante_datos_uso_sistema`
--
ALTER TABLE `estudiante_datos_uso_sistema`
  ADD PRIMARY KEY (`id_estudiante`,`id_datos_uso_sistema`,`fecha_ingreso`),
  ADD KEY `id_datos_uso_sistema` (`id_datos_uso_sistema`);

--
-- Indices de la tabla `estudiante_simulacion`
--
ALTER TABLE `estudiante_simulacion`
  ADD PRIMARY KEY (`id_estudiante`,`id_simulacion`,`fecha_realizacion`),
  ADD KEY `id_simulacion` (`id_simulacion`);

--
-- Indices de la tabla `investigador`
--
ALTER TABLE `investigador`
  ADD PRIMARY KEY (`id_investigador`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `simulacion`
--
ALTER TABLE `simulacion`
  ADD PRIMARY KEY (`id_simulacion`);

--
-- Indices de la tabla `simulacion_datos_uso_sistema`
--
ALTER TABLE `simulacion_datos_uso_sistema`
  ADD PRIMARY KEY (`id_simulacion`,`id_datos_uso_sistema`),
  ADD KEY `id_datos_uso_sistema` (`id_datos_uso_sistema`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email_u` (`email_u`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `datos_uso_sistema`
--
ALTER TABLE `datos_uso_sistema`
  MODIFY `id_datos_uso_sistema` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  MODIFY `id_estudiante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `investigador`
--
ALTER TABLE `investigador`
  MODIFY `id_investigador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `simulacion`
--
ALTER TABLE `simulacion`
  MODIFY `id_simulacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `datos_uso_sistema`
--
ALTER TABLE `datos_uso_sistema`
  ADD CONSTRAINT `datos_uso_sistema_ibfk_1` FOREIGN KEY (`id_investigador`) REFERENCES `investigador` (`id_investigador`);

--
-- Filtros para la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD CONSTRAINT `estudiante_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `estudiante_datos_uso_sistema`
--
ALTER TABLE `estudiante_datos_uso_sistema`
  ADD CONSTRAINT `estudiante_datos_uso_sistema_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`),
  ADD CONSTRAINT `estudiante_datos_uso_sistema_ibfk_2` FOREIGN KEY (`id_datos_uso_sistema`) REFERENCES `datos_uso_sistema` (`id_datos_uso_sistema`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `estudiante_simulacion`
--
ALTER TABLE `estudiante_simulacion`
  ADD CONSTRAINT `estudiante_simulacion_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`),
  ADD CONSTRAINT `estudiante_simulacion_ibfk_2` FOREIGN KEY (`id_simulacion`) REFERENCES `simulacion` (`id_simulacion`);

--
-- Filtros para la tabla `investigador`
--
ALTER TABLE `investigador`
  ADD CONSTRAINT `investigador_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `simulacion_datos_uso_sistema`
--
ALTER TABLE `simulacion_datos_uso_sistema`
  ADD CONSTRAINT `simulacion_datos_uso_sistema_ibfk_1` FOREIGN KEY (`id_simulacion`) REFERENCES `simulacion` (`id_simulacion`),
  ADD CONSTRAINT `simulacion_datos_uso_sistema_ibfk_2` FOREIGN KEY (`id_datos_uso_sistema`) REFERENCES `datos_uso_sistema` (`id_datos_uso_sistema`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
