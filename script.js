// ============ Datos usados por la terminal interactiva ============
const CERTS = [
  'CCNA: Introduction to Networks (Cisco Networking Academy)',
  'Introduction to Cybersecurity (Cisco Networking Academy)',
  'Linux Essentials (LPI / Cisco Networking Academy)'
];

const COMMANDS = {
  help: () =>
    ['Comandos disponibles:',
     '  whoami     -> quién soy',
     '  skills     -> habilidades técnicas',
     '  certs      -> certificaciones',
     '  projects   -> proyectos destacados',
     '  contact    -> cómo contactarme',
     '  clear      -> limpiar pantalla'].join('\n'),
  whoami: () =>
    'Raymer de la Cruz — Especialista Jr. en Soporte Técnico, Redes y SOC.\nEstudiante de TI en el ITLA. Cert. Cisco CCNA 1 y Linux.',
  skills: () =>
    ['Ciberseguridad & SOC : Wireshark, Snort, RED HAWK, WHOIS',
     'Redes & Telecom      : Packet Tracer, VLSM, DHCP, Firewalls',
     'Sistemas             : Windows Server 2016, AD, Hyper-V, RRAS',
     'Soporte              : Diagnóstico HW/SW, atención a usuarios'].join('\n'),
  certs: () => CERTS.map((c) => '✓ ' + c).join('\n') + '\n\nBaja hasta "~/certs --verify" para verlos.',
  projects: () =>
    ['1. Auditoría web con RED HAWK (Kali/Ubuntu)',
     '2. Topología multisitio en Packet Tracer',
     '3. Infraestructura Windows Server 2016'].join('\n'),
  contact: () =>
    'Email: rdlc2901@gmail.com\nLinkedIn: /in/raymer-de-la-cruz-75b349392\nGitHub: raymerdelacruz.github.io'
};

// ============ Boot sequence en el hero ============
const BOOT_LINES = [
  '$ whoami',
  'raymer_delacruz',
  '$ status --check',
  '[OK] Perfil de Soporte Técnico y Redes cargado',
  '[OK] Módulo SOC listo',
  '$ ./portfolio --launch'
];

function typeBootSequence(el, lines, onDone) {
  let lineIndex = 0;
  let charIndex = 0;
  let output = '';

  function step() {
    if (lineIndex >= lines.length) {
      if (onDone) onDone();
      return;
    }
    const currentLine = lines[lineIndex];
    if (charIndex < currentLine.length) {
      output += currentLine[charIndex];
      el.textContent = output;
      charIndex++;
      setTimeout(step, 18);
    } else {
      output += '\n';
      lineIndex++;
      charIndex = 0;
      setTimeout(step, 220);
    }
  }
  step();
}

function initHeroTerminal() {
  const bootLog = document.getElementById('bootLog');
  const inputLine = document.getElementById('termInputLine');
  const input = document.getElementById('termInput');
  if (!bootLog) return;

  typeBootSequence(bootLog, BOOT_LINES, () => {
    inputLine.hidden = false;
    input.focus({ preventScroll: true });
  });

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const raw = input.value.trim();
    const cmd = raw.toLowerCase();
    input.value = '';

    if (!cmd) return;

    if (cmd === 'clear') {
      bootLog.textContent = '';
      return;
    }

    const handler = COMMANDS[cmd];
    const response = handler ? handler() : `bash: ${raw}: comando no encontrado (escribe "help")`;
    bootLog.textContent += `\nraymer@itla:~$ ${raw}\n${response}\n`;
    bootLog.parentElement.scrollTop = bootLog.parentElement.scrollHeight;
  });
}

// ============ Barra de progreso de scroll ============
function initScrollProgress() {
  const bar = document.getElementById('scanProgress');
  if (!bar) return;
  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// ============ Revelado de secciones + títulos tipo máquina de escribir ============
function initRevealOnScroll() {
  const panels = document.querySelectorAll('.reveal-panel');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          const heading = entry.target.querySelector('.type-heading');
          if (heading && !heading.classList.contains('typed')) {
            const text = heading.dataset.text || heading.textContent;
            heading.style.setProperty('--chars', text.length + 'ch');
            heading.classList.add('typed');
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  panels.forEach((p) => observer.observe(p));
}

// ============ Modal de certificados ============
function initCertModal() {
  const modal = document.getElementById('certModal');
  const frame = document.getElementById('certFrame');
  const title = document.getElementById('certModalTitle');
  const closeBtn = document.getElementById('closeCertModal');
  if (!modal) return;

  document.querySelectorAll('.js-view-cert').forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.src;
      const name = btn.dataset.title || 'certificate.pdf';
      frame.src = src;
      title.textContent = `cat "${name}.pdf"`;
      modal.showModal();
    });
  });

  function closeModal() {
    modal.close();
    frame.src = '';
  }

  closeBtn.addEventListener('click', closeModal);
  document.querySelector('.js-close-modal')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const inDialog =
      rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width;
    if (!inDialog) closeModal();
  });
  modal.addEventListener('cancel', () => { frame.src = ''; });
}

// ============ Menú móvil ============
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroTerminal();
  initScrollProgress();
  initRevealOnScroll();
  initCertModal();
  initNavToggle();
});
