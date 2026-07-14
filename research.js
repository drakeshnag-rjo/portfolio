// ===================================
// Research Page — Navigation + Publications
// Data source: data/publications.json (single source of truth,
// refreshed from Google Scholar — see .claude/skills/portfolio-updater)
// ===================================

// --- Navbar (scroll style + mobile menu) ---
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// --- Publications ---
const TYPE_LABELS = {
    journal: 'Journal',
    conference: 'Conference',
    patent: 'Patent',
    book: 'Book'
};

let allPublications = [];
let activeFilter = 'all';
let activeSort = 'citations';

const listEl = document.getElementById('publications-list');

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function renderPublications() {
    const filtered = allPublications.filter(
        p => activeFilter === 'all' || p.type === activeFilter
    );

    const sorted = [...filtered].sort((a, b) =>
        activeSort === 'year'
            ? b.year - a.year || b.citations - a.citations
            : b.citations - a.citations || b.year - a.year
    );

    if (sorted.length === 0) {
        listEl.innerHTML = '<p class="pub-authors">No publications in this category yet.</p>';
        return;
    }

    listEl.innerHTML = sorted
        .map((pub, i) => `
        <article class="publication-card">
            <div class="pub-number">${String(i + 1).padStart(2, '0')}</div>
            <div class="pub-content">
                <div class="pub-meta">
                    <span class="pub-badge ${pub.type}">${TYPE_LABELS[pub.type] || pub.type}</span>
                    <span class="pub-year">${pub.year}</span>
                    ${pub.citations > 0 ? `<span class="pub-citations"><i class="fas fa-quote-right"></i> ${pub.citations} citations</span>` : ''}
                </div>
                <h4>${escapeHtml(pub.title)}</h4>
                <p class="pub-authors">${escapeHtml(pub.authors)}</p>
                <p class="pub-venue">${escapeHtml(pub.venue)}</p>
            </div>
        </article>`)
        .join('');
}

function renderMetrics(profile, pubCount) {
    const m = profile.metrics;
    document.getElementById('metric-citations').textContent = m.citations.toLocaleString();
    document.getElementById('metric-hindex').textContent = m.h_index;
    document.getElementById('metric-i10').textContent = m.i10_index;
    document.getElementById('metric-pubcount').textContent = pubCount;
    document.getElementById('metrics-updated').textContent =
        `Last updated ${profile.last_updated}`;
}

async function loadPublications() {
    try {
        const response = await fetch('data/publications.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        allPublications = data.publications;
        renderMetrics(data.scholar_profile, allPublications.length);
        renderPublications();
    } catch (err) {
        console.error('Failed to load publications:', err);
        listEl.innerHTML = `
            <p class="pub-authors">
                Could not load the publication list. View it directly on
                <a href="https://scholar.google.com/citations?hl=en&user=bz6-A4oAAAAJ"
                   target="_blank" rel="noopener">Google Scholar</a>.
            </p>`;
    }
}

// Filter chips
document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelector('.filter-chip.active')?.classList.remove('active');
        chip.classList.add('active');
        activeFilter = chip.dataset.filter;
        renderPublications();
    });
});

// Sort select
document.getElementById('pub-sort-select').addEventListener('change', e => {
    activeSort = e.target.value;
    renderPublications();
});

loadPublications();
