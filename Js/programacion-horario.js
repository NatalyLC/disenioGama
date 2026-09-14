document.addEventListener("DOMContentLoaded", async () => {

    /*
    =========================================================
    ELEMENTOS DEL DOM
    =========================================================
    */

    const reloj = document.getElementById("reloj-hora");

    const programaActual = document.getElementById("programa-actual");
    const horaProgramaActual = document.getElementById("hora-programa-actual");

    const barraProgreso = document.getElementById("barra-progreso");
    const porcentajeProgreso = document.getElementById("porcentaje-progreso");

    const siguienteHora1 = document.getElementById("siguiente-hora-1");
    const siguientePrograma1 = document.getElementById("siguiente-programa-1");

    const siguienteHora2 = document.getElementById("siguiente-hora-2");
    const siguientePrograma2 = document.getElementById("siguiente-programa-2");


    /*
    =========================================================
    OBTENER PROGRAMACIÓN
    =========================================================
    */

    if (!window.obtenerProgramacion) {
        console.warn("No se encontró obtenerProgramacion()");
        return;
    }

    let bloques = [];

    try {
        bloques = await window.obtenerProgramacion();
    } catch (error) {
        console.error("Error al obtener la programación:", error);
        return;
    }


    /*
    =========================================================
    HORA DE ECUADOR
    =========================================================

    Usamos America/Guayaquil para que funcione correctamente
    aunque el computador tenga otra zona horaria.
    */

    function obtenerHoraEcuador() {

        const ahora = new Date();

        const partes = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Guayaquil",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }).formatToParts(ahora);

        const resultado = {};

        partes.forEach(parte => {
            if (parte.type !== "literal") {
                resultado[parte.type] = parte.value;
            }
        });

        return {
            horas: Number(resultado.hour),
            minutos: Number(resultado.minute),
            segundos: Number(resultado.second)
        };
    }


    /*
    =========================================================
    CONVERTIR HH:MM A MINUTOS
    =========================================================
    */

    function convertirAMinutos(hora) {

        if (!hora) return 0;

        const partes = hora.split(":");

        const horas = Number(partes[0]) || 0;
        const minutos = Number(partes[1]) || 0;

        return (horas * 60) + minutos;
    }


    /*
    =========================================================
    FORMATO DE HORA
    =========================================================
    */

    function formatoHora(hora) {

        if (!hora) return "";

        return hora;
    }


    /*
    =========================================================
    ACTUALIZAR RELOJ
    =========================================================
    */

    function actualizarReloj() {

        if (!reloj) return;

        const hora = obtenerHoraEcuador();

        const horas = hora.horas;
        const minutos = hora.minutos;
        const segundos = hora.segundos;


        /*
        Aguja de los minutos
        60 minutos = 360 grados
        */

        const gradosMinutos =
            (minutos * 6) + (segundos * 0.1);


        /*
        Aguja de las horas
        12 horas = 360 grados
        */

        const gradosHoras =
            ((horas % 12) * 30) +
            (minutos * 0.5);


        /*
        Actualizar agujas
        */

        const agujaHora =
            document.querySelector(".aguja-hora");

        const agujaMinuto =
            document.querySelector(".aguja-minuto");


        if (agujaHora) {

            agujaHora.style.transform =
                `translateX(-50%) rotate(${gradosHoras}deg)`;

        }


        if (agujaMinuto) {

            agujaMinuto.style.transform =
                `translateX(-50%) rotate(${gradosMinutos}deg)`;

        }

    }


    /*
    =========================================================
    OBTENER PROGRAMA ACTUAL
    =========================================================
    */

    function obtenerProgramaActual() {

        const horaEcuador = obtenerHoraEcuador();

        const minutosActuales =
            horaEcuador.horas * 60 +
            horaEcuador.minutos +
            (horaEcuador.segundos / 60);


        let indiceActual = -1;


        /*
        Buscar el programa que está al aire
        */

        bloques.forEach((bloque, indice) => {

            const inicio =
                convertirAMinutos(bloque.inicio);

            const fin =
                convertirAMinutos(bloque.fin);


            /*
            Horarios normales
            */

            if (fin > inicio) {

                if (
                    minutosActuales >= inicio &&
                    minutosActuales < fin
                ) {
                    indiceActual = indice;
                }

            }


            /*
            Horarios que cruzan medianoche
            */

            else if (fin < inicio) {

                if (
                    minutosActuales >= inicio ||
                    minutosActuales < fin
                ) {
                    indiceActual = indice;
                }

            }

        });


        return {
            indice: indiceActual,
            minutos: minutosActuales
        };

    }


    /*
    =========================================================
    ACTUALIZAR INFORMACIÓN DEL PROGRAMA
    =========================================================
    */

    function actualizarProgramacion() {

        if (!bloques || bloques.length === 0) {

            if (programaActual)
                programaActual.textContent = "SIN PROGRAMACIÓN";

            if (horaProgramaActual)
                horaProgramaActual.textContent = "--:--";

            return;
        }


        const resultado = obtenerProgramaActual();

        const indiceActual = resultado.indice;
        const minutosActuales = resultado.minutos;


        /*
        =====================================================
        NO HAY PROGRAMA AL AIRE
        =====================================================
        */

        if (indiceActual === -1) {

            if (programaActual)
                programaActual.textContent = "FUERA DE PROGRAMACIÓN";

            if (horaProgramaActual)
                horaProgramaActual.textContent = "--:--";

            if (barraProgreso)
                barraProgreso.style.width = "0%";

            if (porcentajeProgreso)
                porcentajeProgreso.textContent = "0%";


            /*
            Buscar próximos programas
            */

            const proximos = bloques
                .filter(bloque => {
                    return convertirAMinutos(bloque.inicio) > minutosActuales;
                });


            if (proximos[0]) {

                if (siguienteHora1)
                    siguienteHora1.textContent =
                        `${formatoHora(proximos[0].inicio)} - ${formatoHora(proximos[0].fin)}`;

                if (siguientePrograma1)
                    siguientePrograma1.textContent =
                        proximos[0].programa;

            }


            if (proximos[1]) {

                if (siguienteHora2)
                    siguienteHora2.textContent =
                        `${formatoHora(proximos[1].inicio)} - ${formatoHora(proximos[1].fin)}`;

                if (siguientePrograma2)
                    siguientePrograma2.textContent =
                        proximos[1].programa;

            }

            return;
        }


        /*
        =====================================================
        PROGRAMA ACTUAL
        =====================================================
        */

        const actual = bloques[indiceActual];


        const inicio =
            convertirAMinutos(actual.inicio);

        let fin =
            convertirAMinutos(actual.fin);


        /*
        Si termina después de medianoche
        */

        if (fin <= inicio) {
            fin += 1440;
        }


        let minutosComparacion = minutosActuales;

        if (
            fin > 1440 &&
            minutosActuales < inicio
        ) {
            minutosComparacion += 1440;
        }


        /*
        Duración total
        */

        const duracion =
            fin - inicio;


        /*
        Tiempo transcurrido
        */

        const transcurrido =
            minutosComparacion - inicio;


        /*
        Porcentaje
        */

        let porcentaje =
            (transcurrido / duracion) * 100;


        porcentaje =
            Math.max(0, Math.min(100, porcentaje));


        porcentaje =
            Math.round(porcentaje);


        /*
        Mostrar programa
        */

        if (programaActual) {
            programaActual.textContent =
                actual.programa;
        }


        /*
        Mostrar horario
        */

        if (horaProgramaActual) {
            horaProgramaActual.textContent =
                `${formatoHora(actual.inicio)} - ${formatoHora(actual.fin)}`;
        }


        /*
        Actualizar barra
        */

        if (barraProgreso) {
            barraProgreso.style.width =
                `${porcentaje}%`;
        }


        /*
        Actualizar porcentaje
        */

        if (porcentajeProgreso) {
            porcentajeProgreso.textContent =
                `${porcentaje}%`;
        }


        /*
        =====================================================
        PROGRAMAS SIGUIENTES
        =====================================================
        */

        const siguiente1 =
            bloques[indiceActual + 1];

        const siguiente2 =
            bloques[indiceActual + 2];


        /*
        Primer programa siguiente
        */

        if (siguiente1) {

            if (siguienteHora1) {
                siguienteHora1.textContent =
                    `${formatoHora(siguiente1.inicio)} - ${formatoHora(siguiente1.fin)}`;
            }

            if (siguientePrograma1) {
                siguientePrograma1.textContent =
                    siguiente1.programa;
            }

        } else {

            if (siguienteHora1)
                siguienteHora1.textContent = "--:--";

            if (siguientePrograma1)
                siguientePrograma1.textContent = "SIN PROGRAMACIÓN";

        }


        /*
        Segundo programa siguiente
        */

        if (siguiente2) {

            if (siguienteHora2) {
                siguienteHora2.textContent =
                    `${formatoHora(siguiente2.inicio)} - ${formatoHora(siguiente2.fin)}`;
            }

            if (siguientePrograma2) {
                siguientePrograma2.textContent =
                    siguiente2.programa;
            }

        } else {

            if (siguienteHora2)
                siguienteHora2.textContent = "--:--";

            if (siguientePrograma2)
                siguientePrograma2.textContent = "SIN PROGRAMACIÓN";

        }

    }


    /*
    =========================================================
    INICIALIZAR
    =========================================================
    */

    actualizarReloj();
    actualizarProgramacion();


    /*
    =========================================================
    ACTUALIZAR RELOJ CADA SEGUNDO
    =========================================================
    */

    setInterval(() => {

        actualizarReloj();

    }, 1000);


    /*
    =========================================================
    ACTUALIZAR PROGRAMACIÓN CADA 15 SEGUNDOS
    =========================================================
    */

    setInterval(() => {

        actualizarProgramacion();

    }, 15000);

});
