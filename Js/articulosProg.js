// Diccionario con todos los programas
const programas = {
    "verdades-o-mentiras": {
        titulo: "Verdades o Mentiras",
        descripcion: `
            “Verdades o Mentiras” es un programa ecuatoriano transmitido por GamaTV que ofrece una mirada profunda y conmovedora a la vida de celebridades del mundo del espectáculo. En cada episodio, el programa invita a figuras de la farándula, como músicos, actores y otras personalidades destacadas, para que enfrenten y desmientan los chismes y controversias que han marcado sus carreras. El formato del programa combina una presentación seria con una narrativa emocional, permitiendo a los invitados contar su versión de la historia y esclarecer malentendidos públicos mientras comparten aspectos íntimos de sus vidas.  
            \nEl enfoque de “Verdades o Mentiras” es particularmente distintivo por su capacidad para mezclar el análisis crítico con una profunda empatía. A través de entrevistas en profundidad y reportajes personales, el programa permite que las celebridades exploren los eventos y situaciones que han sido objeto de crítica o controversia, ofreciendo una plataforma para que presenten sus puntos de vista y expongan la verdad detrás de los rumores. La estructura del programa busca proporcionar una visión equilibrada y comprensiva de las experiencias de los invitados, destacando tanto los desafíos como las lecciones aprendidas.
            \nEl aspecto emocional de “Verdades o Mentiras” resalta la humanidad de las figuras públicas, ofreciendo a los espectadores una conexión más íntima con sus vidas personales. A medida que los invitados relatan sus historias y desmienten los rumores, el programa se convierte en un espacio para la reflexión y la reconciliación, permitiendo a la audiencia ver más allá de la superficie y comprender las realidades detrás de las apariencias. Con su combinación de seriedad y emoción, “Verdades o Mentiras” se establece como un programa que no solo entretiene, sino que también invita a la empatía y la comprensión en el ámbito de la farándula ecuatoriana.
            \nNo te pierdas nuestro programa en el siguiente horario:
        `,
        imagen: "../Imagenes/p1.png",
        horario: `
            Lunes a Viernes: 22:00 a 23:00 \nSábados: 19:00 a 20:00 y 21:00 a 23:00 \nDomingos: 20:30 a 22:00
        `
    },
    "cordova-un-general": {
        titulo: "Córdova, un General Llamado Arrojo",
        descripcion: "Historia del General Córdova y su impacto en la historia del país.",
        imagen: "../Imagenes/p2.png",
        horario: "Lunes a Viernes: 21:00 a 22:00"
    },
    "debora-mujer-colombia": {
        titulo: "Débora la mujer que desnudó a Colombia",
        descripcion: "Análisis del programa y entrevistas con los protagonistas.",
        imagen: "../Imagenes/p3.jpg",
        horario: "Lunes a Viernes: 21:00 a 22:00"
    },
    "virgencita-ecuador": {
        titulo: "La Virgencita Ecuador",
        descripcion: "Historia del General Córdova y su impacto en la historia del país.",
        imagen: "../Imagenes/p2.png",
        horario: "Lunes a Viernes: 21:00 a 22:00"
    },
    "puro-teatro": {
        titulo: "Puro Teatro",
        descripcion: "Análisis del programa y entrevistas con los protagonistas.",
        imagen: "../Imagenes/p3.jpg",
        horario: "Lunes a Viernes: 21:00 a 22:00"
    },
    "berracas": {
        titulo: "Berracas",
        descripcion: "Análisis del programa y entrevistas con los protagonistas.",
        imagen: "../Imagenes/p3.jpg",
        horario: "Lunes a Viernes: 21:00 a 22:00"
    },
    "protagonistas": {
        titulo: "Los Protagonistas",
        descripcion: "Historia del General Córdova y su impacto en la historia del país.",
        imagen: "../Imagenes/p2.png",
        horario: "Lunes a Viernes: 21:00 a 22:00"
    },
    "dw-noticias": {
        titulo: "DW noticias",
        descripcion: "Análisis del programa y entrevistas con los protagonistas.",
        imagen: "../Imagenes/p3.jpg",
        horario: "Lunes a Viernes: 21:00 a 22:00"
    }
};

// Obtener parámetro de la URL
function obtenerParametro(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

document.addEventListener("DOMContentLoaded", () => {
    const progKey = obtenerParametro("programa");
    const data = programas[progKey];

    if (!data) {
        document.getElementById("contenido-programa").innerHTML = "<p>Programa no encontrado.</p>";
        return;
    }

    document.getElementById("titulo-programa").textContent = data.titulo;
    document.getElementById("imagen-programa").src = data.imagen;
    document.getElementById("imagen-programa").alt = data.titulo;
    document.getElementById("descripcion-programa").innerHTML =
        data.descripcion.replace(/\n/g, "<br>");
    document.getElementById("horario-programa").innerHTML =
        data.horario.replace(/\n/g, "<br>");
});
