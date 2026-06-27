const express = require("express");
const cors = require("cors");
const path = require("path");
const conexion = require("./db");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/estudiantes", (req, res) => {
    const sql = "SELECT * FROM estudiantes";

    conexion.query(sql, (error, resultados) => {
        if (error) {
            return res.status(500).json({
                mensaje: "Error al listar estudiantes",
                error
            });
        }

        res.json(resultados);
    });
});

app.post("/api/estudiantes", (req, res) => {
    const { codigo, nombres, apellidos, correo, carrera } = req.body;

    const sql = `
        INSERT INTO estudiantes 
        (codigo, nombres, apellidos, correo, carrera)
        VALUES (?, ?, ?, ?, ?)
    `;

    conexion.query(sql, [codigo, nombres, apellidos, correo, carrera], (error, resultado) => {
        if (error) {
            return res.status(500).json({
                mensaje: "Error al registrar estudiante",
                error
            });
        }

        res.status(201).json({
            mensaje: "Estudiante registrado correctamente",
            id: resultado.insertId
        });
    });
});

app.put("/api/estudiantes/:id", (req, res) => {
    const { id } = req.params;
    const { codigo, nombres, apellidos, correo, carrera } = req.body;

    const sql = `
        UPDATE estudiantes
        SET codigo = ?, nombres = ?, apellidos = ?, correo = ?, carrera = ?
        WHERE id = ?
    `;

    conexion.query(sql, [codigo, nombres, apellidos, correo, carrera, id], (error, resultado) => {
        if (error) {
            return res.status(500).json({
                mensaje: "Error al actualizar estudiante",
                error
            });
        }

        res.json({
            mensaje: "Estudiante actualizado correctamente"
        });
    });
});

app.delete("/api/estudiantes/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM estudiantes WHERE id = ?";

    conexion.query(sql, [id], (error, resultado) => {
        if (error) {
            return res.status(500).json({
                mensaje: "Error al eliminar estudiante",
                error
            });
        }

        res.json({
            mensaje: "Estudiante eliminado correctamente"
        });
    });
});

app.listen(PORT, () => {
    console.log(`Microservicio estudiantes funcionando en http://localhost:${PORT}`);
});