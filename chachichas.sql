DROP DATABASE IF EXISTS chachichas;
CREATE DATABASE chachichas;
USE chachichas;

CREATE TABLE usuarios(
	pk_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(120),
    usuario VARCHAR(120),
    pass VARCHAR(120),
    rol INT DEFAULT 1,
    estado INT DEFAULT 1
);

INSERT INTO usuarios (nombre, usuario, pass) VALUES ('Erick', 'erick', '1234');
INSERT INTO usuarios (nombre, usuario, pass) VALUES ('Prueba', 'prueba', '1234');

SELECT user, host
FROM mysql.user;