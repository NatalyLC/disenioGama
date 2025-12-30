document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("horario-lista");
    if (!contenedor || !window.obtenerProgramacion) return;

    const bloques = await window.obtenerProgramacion();

    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutosActual = ahora.getMinutes();
    const totalMinutosActual = horaActual * 60 + minutosActual;

    bloques.forEach(b => {
        const item = document.createElement("div");
        item.className = "horario-item";

        // Convertir horas HH:MM a minutos totales
        const [hIni, mIni] = b.inicio.split(":").map(Number);
        const [hFin, mFin] = b.fin.split(":").map(Number);
        const minutosInicio = hIni * 60 + mIni;
        const minutosFin = hFin * 60 + mFin;

        // Revisar si está “EN VIVO”
        const estaEnVivo = totalMinutosActual >= minutosInicio && totalMinutosActual < minutosFin;
        if (estaEnVivo) item.classList.add("en-vivo");

        item.innerHTML = `
            <div class="horario-hora">${b.inicio} - ${b.fin}</div>
            <div class="horario-programa">${b.programa}</div>
        `;

        contenedor.appendChild(item);
    });
});

// Mostrar fecha actual
const fechaDiv = document.getElementById("fecha-hoy");
if (fechaDiv) {
    const hoy = new Date();
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    fechaDiv.textContent = hoy.toLocaleDateString('es-ES', opciones);
}
