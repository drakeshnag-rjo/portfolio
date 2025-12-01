// Cosmic Background with Interactive Effects - Enhanced Physics
class CosmicBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.galaxies = [];
        this.wormholes = [];
        this.blackholes = [];
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.init();
    }

    init() {
        // Setup canvas
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        // Changed z-index to -1 to sit ON TOP of the CSS wormhole background (which should be -2)
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        document.body.prepend(this.canvas);

        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.createStars(250);
        this.createGalaxies(3);
        this.createWormholes(2);
        this.createBlackholes(2);

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createStars(count) {
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 0.5,
                opacity: Math.random(),
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                vx: (Math.random() - 0.5) * 0.5, // Base velocity
                vy: (Math.random() - 0.5) * 0.5,
                friction: 0.95 // Friction for smooth movement
            });
        }
    }

    createGalaxies(count) {
        for (let i = 0; i < count; i++) {
            this.galaxies.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 100 + 80,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.002,
                arms: 3 + Math.floor(Math.random() * 3),
                color: ['#6366f1', '#ec4899', '#14b8a6'][Math.floor(Math.random() * 3)],
                vx: 0,
                vy: 0,
                friction: 0.92
            });
        }
    }

    createWormholes(count) {
        for (let i = 0; i < count; i++) {
            this.wormholes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 60 + 40,
                rotation: 0,
                rotationSpeed: 0.03,
                pulsePhase: Math.random() * Math.PI * 2,
                vx: 0,
                vy: 0,
                friction: 0.92
            });
        }
    }

    createBlackholes(count) {
        for (let i = 0; i < count; i++) {
            this.blackholes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 50 + 30,
                eventHorizon: Math.random() * 80 + 60,
                rotation: 0,
                rotationSpeed: 0.02,
                vx: 0,
                vy: 0,
                friction: 0.92
            });
        }
    }

    applyPhysics(obj, pullFactor = 1) {
        const dx = this.mouse.x - obj.x;
        const dy = this.mouse.y - obj.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Stronger pull, but capped to prevent flying off too fast
        // Pull strength increases as you get closer
        const force = Math.min(1000 / (distance * distance + 100), 0.5) * pullFactor;

        const angle = Math.atan2(dy, dx);

        obj.vx += Math.cos(angle) * force;
        obj.vy += Math.sin(angle) * force;

        // Apply velocity
        obj.x += obj.vx;
        obj.y += obj.vy;

        // Apply friction (damping)
        obj.vx *= obj.friction || 0.95;
        obj.vy *= obj.friction || 0.95;

        // Screen wrapping
        if (obj.x < -100) obj.x = this.canvas.width + 100;
        if (obj.x > this.canvas.width + 100) obj.x = -100;
        if (obj.y < -100) obj.y = this.canvas.height + 100;
        if (obj.y > this.canvas.height + 100) obj.y = -100;
    }

    drawStars() {
        this.stars.forEach(star => {
            // Much stronger pull for light stars
            this.applyPhysics(star, 5.0);

            // Twinkle effect
            star.opacity += star.twinkleSpeed;
            if (star.opacity > 1 || star.opacity < 0.2) {
                star.twinkleSpeed *= -1;
            }

            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fill();
        });
    }

    drawGalaxies() {
        this.galaxies.forEach(galaxy => {
            galaxy.rotation += galaxy.rotationSpeed;
            this.applyPhysics(galaxy, 2.0); // Heavy objects move slower

            this.ctx.save();
            this.ctx.translate(galaxy.x, galaxy.y);
            this.ctx.rotate(galaxy.rotation);

            // Draw spiral arms
            for (let arm = 0; arm < galaxy.arms; arm++) {
                const armAngle = (Math.PI * 2 / galaxy.arms) * arm;
                this.ctx.beginPath();
                for (let i = 0; i < 100; i++) {
                    const angle = armAngle + (i * 0.1);
                    const radius = (i / 100) * galaxy.radius;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    if (i === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
                this.ctx.strokeStyle = galaxy.color + '40';
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
            }

            // Galaxy core
            const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.radius * 0.3);
            coreGradient.addColorStop(0, galaxy.color + 'AA');
            coreGradient.addColorStop(1, galaxy.color + '00');
            this.ctx.fillStyle = coreGradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, galaxy.radius * 0.3, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        });
    }

    drawWormholes() {
        this.wormholes.forEach(wormhole => {
            wormhole.rotation += wormhole.rotationSpeed;
            wormhole.pulsePhase += 0.05;
            const pulse = Math.sin(wormhole.pulsePhase) * 0.2 + 1;

            this.applyPhysics(wormhole, 2.5);

            this.ctx.save();
            this.ctx.translate(wormhole.x, wormhole.y);
            this.ctx.rotate(wormhole.rotation);

            // Draw concentric rings
            for (let i = 0; i < 8; i++) {
                const ringRadius = (wormhole.radius * pulse) - (i * 8);
                if (ringRadius > 0) {
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
                    const opacity = (1 - i / 8) * 0.4;
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }
            }

            // Wormhole center
            const centerGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, wormhole.radius * 0.5);
            centerGradient.addColorStop(0, '#000000');
            centerGradient.addColorStop(0.5, '#6366f1AA');
            centerGradient.addColorStop(1, '#6366f100');
            this.ctx.fillStyle = centerGradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, wormhole.radius * 0.5, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        });
    }

    drawBlackholes() {
        this.blackholes.forEach(blackhole => {
            blackhole.rotation += blackhole.rotationSpeed;
            this.applyPhysics(blackhole, 1.5);

            // Event horizon glow
            const horizonGradient = this.ctx.createRadialGradient(
                blackhole.x, blackhole.y, blackhole.radius,
                blackhole.x, blackhole.y, blackhole.eventHorizon
            );
            horizonGradient.addColorStop(0, '#ec489980');
            horizonGradient.addColorStop(0.5, '#ec489940');
            horizonGradient.addColorStop(1, '#ec489900');
            this.ctx.fillStyle = horizonGradient;
            this.ctx.beginPath();
            this.ctx.arc(blackhole.x, blackhole.y, blackhole.eventHorizon, 0, Math.PI * 2);
            this.ctx.fill();

            // Accretion disk
            this.ctx.save();
            this.ctx.translate(blackhole.x, blackhole.y);
            this.ctx.rotate(blackhole.rotation);

            for (let i = 0; i < 3; i++) {
                this.ctx.beginPath();
                this.ctx.ellipse(0, 0, blackhole.radius * 1.5, blackhole.radius * 0.3, 0, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(236, 72, 153, ${0.3 - i * 0.1})`;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
            this.ctx.restore();

            // Black hole center
            this.ctx.beginPath();
            this.ctx.arc(blackhole.x, blackhole.y, blackhole.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = '#000000';
            this.ctx.fill();
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawGalaxies();
        this.drawWormholes();
        this.drawBlackholes();
        this.drawStars();

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CosmicBackground());
} else {
    new CosmicBackground();
}
