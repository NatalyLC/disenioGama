// CONFIGURACIÓN
const EXCEL_URL = "../Archivos/Parrilla del 05 al 11 de enero del 2026.xlsx";
const FILA_INICIO = 5; // fila 6 real
const FILA_FIN = 42;   // fila 43 real

// COLUMNAS (base 0)
const COL_HORA_INICIO = 0; // A
const COL_HORA_FIN = 1;    // B
const COL_LUN_VIE = 5;     // F
const COL_SABADO = 12;     // M
const COL_DOMINGO = 13;    // N

// Convierte número de Excel a HH:MM
function excelHoraANormal(h) {
    if (typeof h === "number") {
        const totalMinutos = Math.round(h * 24 * 60);
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;
        return `${horas.toString().padStart(2,'0')}:${minutos.toString().padStart(2,'0')}`;
    }
    return h; // si ya es texto
}

// CARGAR EXCEL
async function cargarProgramacion() {
    const response = await fetch(EXCEL_URL);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const filas = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    return procesarFilas(filas);
}

// PROCESAR FILAS
function procesarFilas(filas) {
    const hoy = new Date().getDay(); // 0=dom, 6=sab
    let columnaPrograma;

    if (hoy >= 1 && hoy <= 5) columnaPrograma = COL_LUN_VIE;
    else if (hoy === 6) columnaPrograma = COL_SABADO;
    else columnaPrograma = COL_DOMINGO;

    const bloques = [];
    let programaActual = null;
    let inicioBloque = null;

    for (let i = FILA_INICIO; i <= FILA_FIN; i++) {
        const fila = filas[i];
        if (!fila) continue;

        const horaInicio = excelHoraANormal(fila[COL_HORA_INICIO]);
        const horaFin = excelHoraANormal(fila[COL_HORA_FIN]);
        const celdaPrograma = fila[columnaPrograma];

        if (celdaPrograma && celdaPrograma.toString().trim() !== "") {
            if (programaActual && celdaPrograma !== programaActual) {
                bloques.push({
                    inicio: inicioBloque,
                    fin: excelHoraANormal(filas[i - 1][COL_HORA_FIN]),
                    programa: programaActual
                });
                inicioBloque = horaInicio;
            } else if (!programaActual) {
                inicioBloque = horaInicio;
            }
            programaActual = celdaPrograma;
        }
    }

    // cerrar último bloque
    if (programaActual) {
        bloques.push({
            inicio: inicioBloque,
            fin: excelHoraANormal(filas[FILA_FIN][COL_HORA_FIN]),
            programa: programaActual
        });
    }

    return bloques;
}

// EXPONER FUNCIÓN GLOBAL
window.obtenerProgramacion = async function () {
    return await cargarProgramacion();
};

// PAGINADOR
ddocument.addEventListener("DOMContentLoaded", () => {
    let paginaActual = 1;
    const paginaTotal = 1;
    const spanNumero = document.getElementById("pagina-numero");
    const spanActual = document.getElementById("pagina-actual");
    const spanTotal = document.getElementById("pagina-total");
    const btnAnterior = document.getElementById("pagina-anterior");
    const btnSiguiente = document.getElementById("pagina-siguiente");

    // Inicializar
    spanNumero.textContent = paginaActual;
    spanActual.textContent = paginaActual;
    spanTotal.textContent = paginaTotal;

    btnAnterior.addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            actualizarPaginador();
        }
    });

    btnSiguiente.addEventListener("click", () => {
        if (paginaActual < paginaTotal) {
            paginaActual++;
            actualizarPaginador();
        }
    });

    function actualizarPaginador() {
        spanNumero.textContent = paginaActual;
        spanActual.textContent = paginaActual;
    }
});
