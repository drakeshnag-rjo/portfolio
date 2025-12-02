// Wormhole Gravitational Pull Effect
class WormholeGravity {
    constructor() {
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.wormholeCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.init();
    }

    init() {
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Update wormhole center on resize
        window.addEventListener('resize', () => {
            this.wormholeCenter.x = window.innerWidth / 2;
            this.wormholeCenter.y = window.innerHeight / 2;
        });

        this.animate();
    }

    animate() {
        // Calculate offset from center based on mouse position
        const dx = this.mouse.x - this.wormholeCenter.x;
        const dy = this.mouse.y - this.wormholeCenter.y;

        // Scale the effect (smaller values = more subtle)
        const pullStrength = 0.05;
        const offsetX = dx * pullStrength;
        const offsetY = dy * pullStrength;

        // Apply transform to the wormhole pseudo-elements
        // We'll use CSS custom properties to control the position
        document.documentElement.style.setProperty('--wormhole-offset-x', `${offsetX}px`);
        document.documentElement.style.setProperty('--wormhole-offset-y', `${offsetY}px`);

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new WormholeGravity());
} else {
    new WormholeGravity();
}
