const formulario = document.getElementById("formulario");
const listaEstudiantes = document.getElementById("listaEstudiantes");
const buscar = document.getElementById("buscar");
const mensaje = document.getElementById("mensaje");
const totalEstudiantes = document.getElementById("totalEstudiantes");

let modoEditar = false;
let idEditar = null;
let estudiantesGlobal = [];

formulario.addEventListener("submit", async function (e) {
    e.preventDefault();

    const estudiante = {
        codigo: document.getElementById("codigo").value,
        nombres: document.getElementById("nombres").value,
        apellidos: document.getElementById("apellidos").value,
        correo: document.getElementById("correo").value,
        carrera: document.getElementById("carrera").value
    };

    if (modoEditar) {
        await fetch(`/api/estudiantes/${idEditar}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(estudiante)
        });

        mostrarMensaje("Estudiante actualizado correctamente", "warning");

        modoEditar = false;
        idEditar = null;

        formulario.querySelector("button").innerHTML = `
            <i class="bi bi-save-fill"></i>
            Registrar
        `;

        formulario.querySelector("button").className = "btn btn-success btn-lg";
    } else {
        await fetch("/api/estudiantes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(estudiante)
        });

        mostrarMensaje("Estudiante registrado correctamente", "success");
    }

    formulario.reset();
    listarEstudiantes();
});

async function listarEstudiantes() {
    const respuesta = await fetch("/api/estudiantes");
    const estudiantes = await respuesta.json();

    estudiantesGlobal = estudiantes;
    mostrarTabla(estudiantesGlobal);
}

function mostrarTabla(estudiantes) {
    listaEstudiantes.innerHTML = "";
    totalEstudiantes.textContent = estudiantes.length;

    if (estudiantes.length === 0) {
        listaEstudiantes.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    No hay estudiantes registrados
                </td>
            </tr>
        `;
        return;
    }

    estudiantes.forEach((estudiante, index) => {
        listaEstudiantes.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${estudiante.codigo}</td>
                <td>${estudiante.nombres}</td>
                <td>${estudiante.apellidos}</td>
                <td>${estudiante.correo}</td>
                <td>${estudiante.carrera}</td>
                <td>
                    <button 
                        class="btn btn-warning btn-sm me-1 mb-1" 
                        onclick="editarEstudiante(${estudiante.id})">
                        <i class="bi bi-pencil-square"></i>
                        Editar
                    </button>

                    <button 
                        class="btn btn-danger btn-sm mb-1" 
                        onclick="eliminarEstudiante(${estudiante.id})">
                        <i class="bi bi-trash-fill"></i>
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
}

async function editarEstudiante(id) {
    const estudiante = estudiantesGlobal.find(e => e.id === id);

    document.getElementById("codigo").value = estudiante.codigo;
    document.getElementById("nombres").value = estudiante.nombres;
    document.getElementById("apellidos").value = estudiante.apellidos;
    document.getElementById("correo").value = estudiante.correo;
    document.getElementById("carrera").value = estudiante.carrera;

    modoEditar = true;
    idEditar = id;

    formulario.querySelector("button").innerHTML = `
        <i class="bi bi-pencil-square"></i>
        Actualizar estudiante
    `;

    formulario.querySelector("button").className = "btn btn-warning btn-lg";
}

async function eliminarEstudiante(id) {
    const confirmar = confirm("¿Seguro que deseas eliminar este estudiante?");

    if (!confirmar) {
        return;
    }

    await fetch(`/api/estudiantes/${id}`, {
        method: "DELETE"
    });

    mostrarMensaje("Estudiante eliminado correctamente", "danger");

    listarEstudiantes();
}

buscar.addEventListener("input", function () {
    const texto = buscar.value.toLowerCase();

    const estudiantesFiltrados = estudiantesGlobal.filter(estudiante =>
        estudiante.codigo.toLowerCase().includes(texto) ||
        estudiante.nombres.toLowerCase().includes(texto) ||
        estudiante.apellidos.toLowerCase().includes(texto) ||
        estudiante.correo.toLowerCase().includes(texto) ||
        estudiante.carrera.toLowerCase().includes(texto)
    );

    mostrarTabla(estudiantesFiltrados);
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

listarEstudiantes();