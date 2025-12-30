document.addEventListener("DOMContentLoaded", () => {

  /* ===== CARGAR HEADER ===== */
  fetch("../Paginas/header.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("header").innerHTML = html;

      // Inicializar funcionalidades del header
      iniciarHeader();
      iniciarMenu();
      activarMenuActual();
    })
    .catch(err => console.error("Error cargando header:", err));

  /* ===== CARGAR FOOTER ===== */
  fetch("../Paginas/footer.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("footer").innerHTML = html;

      // Inicializar funcionalidades del footer
      iniciarFooter();
    })
    .catch(err => console.error("Error cargando footer:", err));

  /* ===== CARRUSEL ===== */
  const track = document.querySelector('.carousel-track');
  if (track) {
    const slides = Array.from(track.children);
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    const slidesToShow = 3;
    const slideWidth = slides[0].offsetWidth + 20;

    let index = slidesToShow;

    // Clonar slides para infinito
    const firstClones = slides.slice(0, slidesToShow).map(slide => slide.cloneNode(true));
    const lastClones = slides.slice(-slidesToShow).map(slide => slide.cloneNode(true));

    lastClones.forEach(clone => track.prepend(clone));
    firstClones.forEach(clone => track.append(clone));

    const allSlides = Array.from(track.children);
    track.style.transform = `translateX(-${slideWidth * index}px)`;

    // Dots
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);

    function updateDots(realIndex) {
      dots.forEach(dot => dot.classList.remove('active'));
      dots[realIndex].classList.add('active');
    }

    function moveCarousel() {
      track.style.transition = 'transform 0.5s ease';
      track.style.transform = `translateX(-${slideWidth * index}px)`;
    }

    track.addEventListener('transitionend', () => {
      if (index >= slides.length + slidesToShow) {
        track.style.transition = 'none';
        index = slidesToShow;
        track.style.transform = `translateX(-${slideWidth * index}px)`;
      }

      if (index < slidesToShow) {
        track.style.transition = 'none';
        index = slides.length + slidesToShow - 1;
        track.style.transform = `translateX(-${slideWidth * index}px)`;
      }

      const realIndex = (index - slidesToShow + slides.length) % slides.length;
      updateDots(realIndex);
    });

    if (nextBtn) nextBtn.addEventListener('click', () => { index++; moveCarousel(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { index--; moveCarousel(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        index = i + slidesToShow;
        moveCarousel();
      });
    });

    setInterval(() => { index++; moveCarousel(); }, 4000);
  }

  /* ===== VIDEO LIVE ===== */
  const video = document.getElementById('live-stream');
  const videoSrc = "https://stream.esradioecuador.com/hls/stream.m3u8";

  if (video) {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function() { video.play(); });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
      video.addEventListener('loadedmetadata', () => { video.play(); });
    }
  }

  /* ===== YOUTUBE ESTÁTICO ===== */
  const ytPlayer = document.getElementById('youtube-player');
  const ytItems = document.querySelectorAll('.youtube-item');
  const ytMain = document.getElementById('youtube-main');

  if (ytItems) {
    ytItems.forEach(item => {
      item.addEventListener('click', () => {
        ytItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const videoId = item.dataset.video;
        if (ytPlayer) ytPlayer.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        if (ytPlayer) ytPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  if (ytMain) {
    ytMain.addEventListener('click', () => {
      ytMain.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/3U_iNSHkBfY?autoplay=1"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen>
        </iframe>
      `;
    });
  }

});

/* ===== HEADER ANIMADO ===== */
function iniciarHeader() {
  const header = document.querySelector('.header');
  const nav = document.querySelector('.nav');
  const navLogo = document.querySelector('.nav-logo');

  if (!header || !nav || !navLogo) return;

  navLogo.style.display = 'none';

  window.addEventListener('scroll', () => {
    if (window.scrollY > header.offsetHeight) {
      // Ocultar header
      header.classList.add('hidden');

      // Fijar menú
      nav.classList.add('fixed');
      document.body.classList.add('menu-fixed');

      // Mostrar logo pequeño
      navLogo.style.display = 'block';
    } else {
      // Mostrar header
      header.classList.remove('hidden');

      // Menú vuelve a su lugar
      nav.classList.remove('fixed');
      document.body.classList.remove('menu-fixed');

      // Ocultar logo pequeño
      navLogo.style.display = 'none';
    }
  });
}

/* ===== MENÚ HAMBURGUESA ===== */
function iniciarMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.querySelector('.menu');
  if (!menuToggle || !menu) return;

  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  });
}

function activarMenuActual() {
  const links = document.querySelectorAll('.menu a');
  const currentPage = window.location.pathname.split('/').pop();

  links.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();

    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ===== INICIAR TODO ===== */
document.addEventListener('DOMContentLoaded', () => {
  iniciarHeader();
  iniciarMenu();
});

/* ===== FUNCIONES DEL FOOTER ===== */
function iniciarFooter() {
  const botonBuzon = document.getElementById('abrir-buzon');
  const modalBuzon = document.getElementById('modal-buzon');
  const cerrarModal = document.querySelector('.modal .cerrar');
  const form = document.getElementById('form-buzon');

  if (!botonBuzon) return;

  botonBuzon.addEventListener('click', () => {
    modalBuzon.style.display = 'block';
  });

  cerrarModal.addEventListener('click', () => {
    modalBuzon.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modalBuzon) {
      modalBuzon.style.display = 'none';
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Gracias! Tu comentario ha sido enviado.');
      modalBuzon.style.display = 'none';
      form.reset();
    });
  }
}
