const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const menuList = document.getElementById('menu-principal');
const modeToggle = document.querySelector('.mode-toggle');
const contactForm = document.querySelector('.contact__form');
const contactMessage = document.querySelector('.contact__message');
const currentYearEl = document.getElementById('current-year');

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(theme) {
  if (theme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    modeToggle?.querySelector('.mode-toggle__icon').textContent = '☀️';
  } else {
    body.removeAttribute('data-theme');
    modeToggle?.querySelector('.mode-toggle__icon').textContent = '🌙';
  }
}

const savedTheme = localStorage.getItem('altair-theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  applyTheme(prefersDark.matches ? 'dark' : 'light');
}

prefersDark.addEventListener('change', event => {
  if (!localStorage.getItem('altair-theme')) {
    applyTheme(event.matches ? 'dark' : 'light');
  }
});

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });
}

menuList?.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 820) {
      nav.classList.remove('nav--open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

modeToggle?.addEventListener('click', () => {
  const isDark = body.getAttribute('data-theme') === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';
  applyTheme(nextTheme);
  localStorage.setItem('altair-theme', nextTheme);
});

if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    event.preventDefault();
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (!targetElement.hasAttribute('tabindex')) {
      targetElement.setAttribute('tabindex', '-1');
    }
    if (typeof targetElement.focus === 'function') {
      targetElement.focus({ preventScroll: true });
    }
  });
});

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('toast--visible');
  setTimeout(() => {
    toast.classList.remove('toast--visible');
  }, 4000);
}

function validateForm(form) {
  const fields = ['nombre', 'empresa', 'whatsapp', 'correo', 'mensaje'];
  let isValid = true;

  fields.forEach(name => {
    const field = form.elements[name];
    if (!field) return;
    if (!field.value.trim()) {
      field.setAttribute('aria-invalid', 'true');
      field.classList.add('is-invalid');
      isValid = false;
    } else {
      field.removeAttribute('aria-invalid');
      field.classList.remove('is-invalid');
    }
  });

  return isValid;
}

contactForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!validateForm(contactForm)) {
    showToast('Por favor, completa todos los campos requeridos.');
    return;
  }

  const payload = {
    nombre: contactForm.nombre.value.trim(),
    empresa: contactForm.empresa.value.trim(),
    whatsapp: contactForm.whatsapp.value.trim(),
    correo: contactForm.correo.value.trim(),
    mensaje: contactForm.mensaje.value.trim(),
    origen: 'Altair IA - Web'
  };

  console.log('Solicitud enviada Altair IA', payload);

  contactForm.reset();
  contactForm.querySelectorAll('.is-invalid').forEach(field => field.classList.remove('is-invalid'));
  contactMessage?.removeAttribute('hidden');
  showToast('¡Gracias! Hemos recibido su solicitud.');

  // Ejemplo para conectar con webhook n8n/Make:
  // fetch('https://tu-webhook-n8n-o-make', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload)
  // }).then(response => {
  //   if (!response.ok) throw new Error('Error en webhook');
  //   return response.json();
  // }).then(data => console.log('Webhook procesado', data))
  //   .catch(error => console.error('Webhook error', error));
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 820 && nav?.classList.contains('nav--open')) {
    nav.classList.remove('nav--open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});
