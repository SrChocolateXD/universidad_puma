const formulario = document.getElementById("formulario");
const listaCursos = document.getElementById("listaCursos");
const buscar = document.getElementById("buscar");
const mensaje = document.getElementById("mensaje");
const totalCursos = document.getElementById("totalCursos");

let modoEditar = false;
let idEditar = null;
let cursosGlobal = [];

formulario.addEventListener("submit", async function (e) {
    e.preventDefault();

    const curso = {
        codigo: document.getElementById("codigo").value,
        nombre: document.getElementById("nombre").value,
        creditos: document.getElementById("creditos").value,
        docente: document.getElementById("docente").value
    };

    if (modoEditar) {
        await fetch(`/api/cursos/${idEditar}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(curso)
        });

        mostrarMensaje("Curso actualizado correctamente", "warning");

        modoEditar = false;
        idEditar = null;

        formulario.querySelector("button").innerHTML = `
            <i class="bi bi-save"></i>
            Registrar Curso
        `;

        formulario.querySelector("button").className = "btn btn-success btn-lg";

    } else {
        await fetch("/api/cursos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(curso)
        });

        mostrarMensaje("Curso registrado correctamente", "success");
    }

    formulario.reset();
    listarCursos();
});

async function listarCursos() {
    const respuesta = await fetch("/api/cursos");
    const cursos = await respuesta.json();

    cursosGlobal = cursos;
    mostrarTabla(cursosGlobal);
}

function mostrarTabla(cursos) {
    listaCursos.innerHTML = "";
    totalCursos.textContent = cursos.length;

    if (cursos.length === 0) {
        listaCursos.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    No hay cursos registrados
                </td>
            </tr>
        `;
        return;
    }

    cursos.forEach((curso, index) => {
        listaCursos.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${curso.codigo}</td>
                <td>${curso.nombre}</td>
                <td>${curso.creditos}</td>
                <td>${curso.docente}</td>
                <td>
                    <button 
                        class="btn btn-warning btn-sm me-1 mb-1"
                        onclick="editarCurso(${curso.id})">
                        <i class="bi bi-pencil-square"></i>
                        Editar
                    </button>

                    <button 
                        class="btn btn-danger btn-sm mb-1"
                        onclick="eliminarCurso(${curso.id})">
                        <i class="bi bi-trash-fill"></i>
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
}

function editarCurso(id) {
    const curso = cursosGlobal.find(c => c.id === id);

    document.getElementById("codigo").value = curso.codigo;
    document.getElementById("nombre").value = curso.nombre;
    document.getElementById("creditos").value = curso.creditos;
    document.getElementById("docente").value = curso.docente;

    modoEditar = true;
    idEditar = id;

    formulario.querySelector("button").innerHTML = `
        <i class="bi bi-pencil-square"></i>
        Actualizar Curso
    `;

    formulario.querySelector("button").className = "btn btn-warning btn-lg";
}

async function eliminarCurso(id) {
    const confirmar = confirm("¿Seguro que deseas eliminar este curso?");

    if (!confirmar) {
        return;
    }

    await fetch(`/api/cursos/${id}`, {
        method: "DELETE"
    });

    mostrarMensaje("Curso eliminado correctamente", "danger");

    listarCursos();
}

buscar.addEventListener("input", function () {
    const texto = buscar.value.toLowerCase();

    const cursosFiltrados = cursosGlobal.filter(curso =>
        curso.codigo.toLowerCase().includes(texto) ||
        curso.nombre.toLowerCase().includes(texto) ||
        curso.creditos.toString().includes(texto) ||
        curso.docente.toLowerCase().includes(texto)
    );

    mostrarTabla(cursosFiltrados);
});

function mostrarMensaje(texto, tipo) {
    mensaje.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${texto}
            <button 
                type="button" 
                class="btn-close" 
                data-bs-dismiss="alert">
            </button>
        </div>
    `;

    setTimeout(() => {
        mensaje.innerHTML = "";
    }, 3000);
}

listarCursos();