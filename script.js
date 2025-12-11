// ===================================
// Navigation Scroll Effect
// ===================================
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

// ===================================
// Mobile Menu Toggle
// ===================================
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ===================================
// Role Carousel Animation
// ===================================
const roles = [
    'Sr. DevSecOps Engineer',
    'MLOps Engineer',
    'Cloud Architect',
    'Site Reliability Engineer',
    'AI/ML Engineer',
    'Security Engineer',
    'GTM Engineer',
    'Observability Specialist',
    'Python Developer',
    'DevOps Architect'
];

let currentRoleIndex = 0;
const roleElement = document.getElementById('rotating-role');

function rotateRole() {
    roleElement.style.opacity = '0';
    roleElement.style.transform = 'translateY(20px)';

    setTimeout(() => {
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        roleElement.textContent = roles[currentRoleIndex];
        roleElement.style.opacity = '1';
        roleElement.style.transform = 'translateY(0)';
    }, 300);
}

// Initial setup
roleElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

// Rotate every 3 seconds
setInterval(rotateRole, 3000);

// ===================================
// Smooth Scroll for Navigation Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Intersection Observer for Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .expertise-card, .timeline-item, .education-card, .publication-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// Skill Tags Interaction
// ===================================
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });

    tag.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===================================
// Dynamic Year in Footer
// ===================================
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer p');
if (footerText) {
    footerText.innerHTML = footerText.innerHTML.replace('2025', currentYear);
}

// ===================================
// Parallax Effect for Hero Background
// ===================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.gradient-orb');

    orbs.forEach((orb, index) => {
        const speed = 0.5 + (index * 0.2);
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===================================
// Active Navigation Link Highlight
// ===================================
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ===================================
// Typing Effect for Hero Description (Optional Enhancement)
// ===================================
function createTypingEffect(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ===================================
// Copy Email to Clipboard
// ===================================
const emailLink = document.querySelector('a[href^="mailto:"]');
if (emailLink) {
    emailLink.addEventListener('click', (e) => {
        const email = emailLink.getAttribute('href').replace('mailto:', '');

        // Create temporary input to copy email
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        // Optional: Show a tooltip or notification
        console.log('Email copied to clipboard!');
    });
}

// ===================================
// Performance Optimization: Lazy Load Images
// ===================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// Add Cursor Trail Effect (Optional Premium Feature)
// ===================================
const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll('.circle');

if (circles.length > 0) {
    circles.forEach(function (circle) {
        circle.x = 0;
        circle.y = 0;
    });

    window.addEventListener('mousemove', function (e) {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });

    function animateCircles() {
        let x = coords.x;
        let y = coords.y;

        circles.forEach(function (circle, index) {
            circle.style.left = x - 12 + 'px';
            circle.style.top = y - 12 + 'px';
            circle.style.scale = (circles.length - index) / circles.length;

            circle.x = x;
            circle.y = y;

            const nextCircle = circles[index + 1] || circles[0];
            x += (nextCircle.x - x) * 0.3;
            y += (nextCircle.y - y) * 0.3;
        });

        requestAnimationFrame(animateCircles);
    }

    animateCircles();
}

// ===================================
// Console Message for Recruiters
// ===================================
console.log('%c👋 Hello, Recruiter!', 'color: #6366f1; font-size: 24px; font-weight: bold;');
console.log('%cInterested in my work? Let\'s connect!', 'color: #14b8a6; font-size: 16px;');
console.log('%cEmail: rakesh.mlops12@gmail.com', 'color: #ec4899; font-size: 14px;');
console.log('%cGitHub: https://github.com/drakeshnag-rjo', 'color: #f59e0b; font-size: 14px;');

// ===================================
// Dynamic Google Scholar Publication Count
// ===================================
async function updatePublicationCount() {
    const publicationsElement = document.getElementById('publications-count');
    const scholarUserId = 'bz6-A4oAAAAJ';

    try {
        // Attempt to fetch from Google Scholar
        // Note: This may be blocked by CORS, so we'll use a fallback
        const response = await fetch(`https://scholar.google.com/citations?user=${scholarUserId}&hl=en`);
        const html = await response.text();

        // Parse the HTML to extract publication count
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Google Scholar shows publications in a table
        const publicationRows = doc.querySelectorAll('#gsc_a_b .gsc_a_t');
        const count = publicationRows.length;

        if (count > 0) {
            publicationsElement.textContent = `${count}+`;
            console.log(`✅ Updated publication count: ${count}+`);
        }
    } catch (error) {
        console.log('ℹ️ Using static publication count (Google Scholar fetch blocked by CORS)');
        // Keep the static count of 7+ as fallback
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', updatePublicationCount);

// ===================================
// Toggle Experience Details
// ===================================
function toggleDetails(button) {
    const timelineContent = button.closest('.timeline-content');
    const details = timelineContent.querySelector('.experience-details');
    const buttonText = button.querySelector('span');
    const svg = button.querySelector('svg');

    if (details.classList.contains('expanded')) {
        details.classList.remove('expanded');
        buttonText.textContent = 'View Details';
        svg.style.transform = 'rotate(0deg)';
    } else {
        details.classList.add('expanded');
        buttonText.textContent = 'Hide Details';
        svg.style.transform = 'rotate(180deg)';
    }
}

