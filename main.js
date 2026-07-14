// ============================================================
// Shared page behaviour — safe on every page (all hooks are
// null-guarded, so index.html, research.html and the policy
// pages can all load this single file).
// ============================================================

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Navbar scroll state + mobile menu ---
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    navMenu.querySelectorAll('.nav-link').forEach(link =>
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        })
    );
}

// --- Active nav highlight (single-page anchors only) ---
const sections = document.querySelectorAll('section[id]');
if (sections.length) {
    const highlight = () => {
        const y = window.scrollY + 120;
        sections.forEach(section => {
            const within = y >= section.offsetTop && y < section.offsetTop + section.offsetHeight;
            const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (link) link.classList.toggle('active', within);
        });
    };
    window.addEventListener('scroll', highlight, { passive: true });
}

// --- Reveal on scroll ---
// Rect-based rather than IntersectionObserver: IO never reports
// intersection in some embedded browsers with hidden documents,
// which would leave the page permanently invisible.
const revealEls = [...document.querySelectorAll('.reveal')];
if (revealEls.length) {
    if (reducedMotion) {
        revealEls.forEach(el => el.classList.add('visible'));
    } else {
        let pending = revealEls;
        const check = () => {
            const limit = window.innerHeight * 0.92;
            pending = pending.filter(el => {
                if (el.getBoundingClientRect().top < limit) {
                    el.classList.add('visible');
                    return false;
                }
                return true;
            });
            if (!pending.length) window.removeEventListener('scroll', check);
        };
        window.addEventListener('scroll', check, { passive: true });
        window.addEventListener('resize', check, { passive: true });
        check();
    }
}

// --- 3D tilt cards (pointer devices only) ---
if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt').forEach(card => {
        card.addEventListener('pointermove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform =
                `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-2px)`;
        });
        card.addEventListener('pointerleave', () => {
            card.style.transform = '';
        });
    });
}

// --- Rotating role (hero) ---
const roleElement = document.getElementById('rotating-role');
if (roleElement) {
    const roles = [
        'Sr. DevSecOps Engineer',
        'MLOps Engineer',
        'Cloud Solutions Architect',
        'AI/ML Engineer',
        'Security Engineer',
        'GTM Engineer',
        'Observability Specialist',
        'DevOps Architect'
    ];
    if (reducedMotion) {
        roleElement.textContent = roles[0];
    } else {
        // typewriter cycle
        let roleIndex = 0, charIndex = 0, deleting = false;
        const tick = () => {
            const word = roles[roleIndex];
            charIndex += deleting ? -1 : 1;
            roleElement.textContent = word.slice(0, charIndex);
            let delay = deleting ? 32 : 58;
            if (!deleting && charIndex === word.length) {
                delay = 2200;
                deleting = true;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                delay = 350;
            }
            setTimeout(tick, delay);
        };
        tick();
    }
}

// --- Publication count from the data file (single source of truth) ---
const publicationsElement = document.getElementById('publications-count');
if (publicationsElement) {
    fetch('data/publications.json')
        .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
        .then(data => {
            publicationsElement.textContent = `${data.publications.length}`;
            const cites = document.getElementById('citations-count');
            if (cites) cites.textContent = `${data.scholar_profile.metrics.citations}+`;
        })
        .catch(() => { /* keep static fallback text */ });
}

// --- Experience expand/collapse (event delegation, no inline JS) ---
document.addEventListener('click', e => {
    const button = e.target.closest('.expand-btn');
    if (!button) return;
    const details = button.closest('.timeline-content')?.querySelector('.experience-details');
    if (!details) return;
    const expanded = details.classList.toggle('expanded');
    button.querySelector('span').textContent = expanded ? 'Hide Details' : 'View Details';
    button.setAttribute('aria-expanded', expanded);
    const svg = button.querySelector('svg');
    if (svg) svg.style.transform = expanded ? 'rotate(180deg)' : '';
});

// --- Footer year ---
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
