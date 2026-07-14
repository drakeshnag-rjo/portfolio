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

// --- 3D tilt cards with moving glare (pointer devices only) ---
const finePointer = window.matchMedia('(hover: hover)').matches;
if (!reducedMotion && finePointer) {
    document.querySelectorAll('.tilt').forEach(card => {
        card.addEventListener('pointermove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform =
                `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-2px)`;
            // glare position, consumed by .tilt::after in CSS
            card.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
            card.style.setProperty('--my', `${(y + 0.5) * 100}%`);
        });
        card.addEventListener('pointerleave', () => {
            card.style.transform = '';
        });
    });
}

// --- Cursor spotlight (a soft light that follows the pointer) ---
if (!reducedMotion && finePointer) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
    let gx = -1000, gy = -1000, tx = gx, ty = gy, glowRaf = null;
    const step = () => {
        gx += (tx - gx) * 0.12;
        gy += (ty - gy) * 0.12;
        glow.style.transform = `translate(${gx}px, ${gy}px)`;
        if (Math.abs(tx - gx) + Math.abs(ty - gy) > 0.5) {
            glowRaf = requestAnimationFrame(step);
        } else {
            glowRaf = null;
        }
    };
    window.addEventListener('pointermove', e => {
        tx = e.clientX;
        ty = e.clientY;
        if (!glowRaf) glowRaf = requestAnimationFrame(step);
    }, { passive: true });
}

// --- Magnetic buttons ---
if (!reducedMotion && finePointer) {
    document.querySelectorAll('.btn, .contact-link').forEach(el => {
        el.addEventListener('pointermove', e => {
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            el.style.transform = `translate(${dx * 0.12}px, ${dy * 0.22}px)`;
        });
        el.addEventListener('pointerleave', () => {
            el.style.transform = '';
        });
    });
}

// --- Count-up numbers (runs when an element becomes visible) ---
function countUp(el, duration = 1100) {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d[\d,]*)(\+?)$/);
    if (!match) return; // non-numeric stats (e.g. "Ph.D.") stay as-is
    const target = parseInt(match[1].replace(/,/g, ''), 10);
    const suffix = match[2];
    if (reducedMotion || !target) return;
    const t0 = performance.now();
    const tick = now => {
        const p = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}
window.countUp = countUp;

// hero stats + research banner metrics count up once on load/reveal
window.addEventListener('load', () => {
    document.querySelectorAll('.stat-item h3, .research-metrics h4').forEach(el => countUp(el));
});

// --- Scroll progress bar ---
if (document.querySelector('section')) {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    const update = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : '0%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
}

// --- Rotating role (hero) ---
const roleElement = document.getElementById('rotating-role');
if (roleElement) {
    const roles = [
        'Sr. DevSecOps Engineer',
        'MLOps Engineer',
        'AIOps Architect',
        'Forward Deployed Engineer',
        'Cloud Solutions Architect',
        'AI/ML Engineer',
        'Security Engineer',
        'GTM Engineer',
        'Observability Specialist',
        'DevOps Architect'
    ];
    if (reducedMotion) {
        // roles are content, not decoration — keep rotating them even
        // with reduced motion (common default on iOS), just without
        // the typing animation
        let i = 0;
        setInterval(() => {
            i = (i + 1) % roles.length;
            roleElement.textContent = roles[i];
        }, 4000);
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
    fetch('data/publications.json', { cache: 'no-cache' })
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
