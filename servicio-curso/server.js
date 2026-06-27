const express = require("express");
const cors = require("cors");
const path = require("path");
const conexion = require("./db");

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Listar cursos

app.get("/api/cursos", (req, res) => {

    const sql = "SELECT * FROM cursos";

    conexion.query(sql, (error, resultados) => {

        if (error) {
            return res.status(500).json(error);
        }

        res.json(resultados);

    });

});

// registrar cursos

app.post("/api/cursos", (req, res) => {

    const {
        codigo,
        nombre,
        creditos,
        docente
    } = req.body;

    const sql = `
        INSERT INTO cursos
        (codigo,nombre,creditos,docente)
        VALUES (?,?,?,?)
    `;

    conexion.query(
        sql,
        [codigo, nombre, creditos, docente],
        (error, resultado) => {

            if (error) {
                return res.status(500).json(error);
            }

            res.json({
                mensaje: "Curso registrado correctamente"
            });

        });

});

// actualizar

app.put("/api/cursos/:id", (req, res) => {

    const id = req.params.id;

    const {
        codigo,
        nombre,
        creditos,
        docente
    } = req.body;

    const sql = `
        UPDATE cursos
        SET
        codigo=?,
        nombre=?,
        creditos=?,
        docente=?
        WHERE id=?
    `;

    conexion.query(
        sql,
        [
            codigo,
            nombre,
            creditos,
            docente,
            id
        ],
        (error, resultado) => {

            if (error) {
                return res.status(500).json(error);
            }

            res.json({
                mensaje: "Curso actualizado correctamente"
            });

        });

});

// eliminar cursos

app.delete("/api/cursos/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM cursos WHERE id=?";

    conexion.query(sql, [id], (error, resultado) => {

        if (error) {
            return res.status(500).json(error);
        }

        res.json({
            mensaje: "Curso eliminado correctamente"
        });

    });

});

app.listen(PORT, () => {

    console.log(`Servidor funcionando en http://localhost:${PORT}`);

});