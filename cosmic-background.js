// Cosmic Background with Interactive Effects - Enhanced Physics & Deep Space Colors
class CosmicBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.galaxies = [];
        this.wormholes = [];
        this.blackholes = [];
        this.comets = [];
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
        // Changed z-index to 0 to sit ON TOP of the CSS wormhole background but below content
        this.canvas.style.zIndex = '0';
        this.canvas.style.pointerEvents = 'none';
        document.body.prepend(this.canvas);

        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.createStars(400);
        this.createGalaxies(3);
        this.createWormholes(2);
        this.createBlackholes(2);
        this.createComets(3);

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
                radius: Math.random() * 2.5 + 1.0,
                opacity: Math.random() * 0.5 + 0.5,
                baseOpacity: Math.random() * 0.3 + 0.7, // Base brightness
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                blinkFrequency: Math.random() * 0.05 + 0.02, // Different blink speeds
                blinkPhase: Math.random() * Math.PI * 2, // Random starting phase
                blinkIntensity: Math.random() * 0.5 + 0.3, // How much it blinks
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                friction: 0.95
            });
        }
    }

    createComets(count) {
        this.comets = [];
        for (let i = 0; i < count; i++) {
            this.comets.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 2,
                speed: Math.random() * 2 + 3,
                angle: Math.random() * Math.PI * 2,
                tailLength: 20 + Math.random() * 30,
                color: '#ffffff'
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
                color: ['#3b82f6', '#8b5cf6', '#06b6d4'][Math.floor(Math.random() * 3)],
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

        const force = Math.min(1000 / (distance * distance + 100), 0.5) * pullFactor;

        const angle = Math.atan2(dy, dx);

        obj.vx += Math.cos(angle) * force;
        obj.vy += Math.sin(angle) * force;

        obj.x += obj.vx;
        obj.y += obj.vy;

        obj.vx *= obj.friction || 0.95;
        obj.vy *= obj.friction || 0.95;

        if (obj.x < -100) obj.x = this.canvas.width + 100;
        if (obj.x > this.canvas.width + 100) obj.x = -100;
        if (obj.y < -100) obj.y = this.canvas.height + 100;
        if (obj.y > this.canvas.height + 100) obj.y = -100;
    }

    drawStars() {
        this.stars.forEach(star => {
            this.applyPhysics(star, 5.0);

            // Update blink phase
            star.blinkPhase += star.blinkFrequency;

            // Calculate blinking opacity using sine wave for smooth transitions
            const blinkValue = Math.sin(star.blinkPhase) * star.blinkIntensity;
            star.opacity = star.baseOpacity + blinkValue;

            // Clamp opacity between 0.1 and 1
            star.opacity = Math.max(0.1, Math.min(1, star.opacity));

            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fill();
        });
    }

    drawComets() {
        this.comets.forEach(comet => {
            comet.x += Math.cos(comet.angle) * comet.speed;
            comet.y += Math.sin(comet.angle) * comet.speed;

            if (comet.x < -100) comet.x = this.canvas.width + 100;
            if (comet.x > this.canvas.width + 100) comet.x = -100;
            if (comet.y < -100) comet.y = this.canvas.height + 100;
            if (comet.y > this.canvas.height + 100) comet.y = -100;

            this.ctx.beginPath();
            this.ctx.arc(comet.x, comet.y, comet.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = comet.color;
            this.ctx.fill();

            const tailGradient = this.ctx.createLinearGradient(
                comet.x, comet.y,
                comet.x - Math.cos(comet.angle) * comet.tailLength,
                comet.y - Math.sin(comet.angle) * comet.tailLength
            );
            tailGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            tailGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            this.ctx.beginPath();
            this.ctx.moveTo(comet.x, comet.y);
            this.ctx.lineTo(
                comet.x - Math.cos(comet.angle) * comet.tailLength,
                comet.y - Math.sin(comet.angle) * comet.tailLength
            );
            this.ctx.strokeStyle = tailGradient;
            this.ctx.lineWidth = comet.radius * 2;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
        });
    }

    drawGalaxies() {
        this.galaxies.forEach(galaxy => {
            galaxy.rotation += galaxy.rotationSpeed;
            this.applyPhysics(galaxy, 2.0);
            this.ctx.save();
            this.ctx.translate(galaxy.x, galaxy.y);
            this.ctx.rotate(galaxy.rotation);
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
            for (let i = 0; i < 8; i++) {
                const ringRadius = (wormhole.radius * pulse) - (i * 8);
                if (ringRadius > 0) {
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
                    const opacity = (1 - i / 8) * 0.4;
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }
            }
            const centerGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, wormhole.radius * 0.5);
            centerGradient.addColorStop(0, '#000000');
            centerGradient.addColorStop(0.5, '#3b82f6AA');
            centerGradient.addColorStop(1, '#3b82f600');
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
            const horizonGradient = this.ctx.createRadialGradient(
                blackhole.x, blackhole.y, blackhole.radius,
                blackhole.x, blackhole.y, blackhole.eventHorizon
            );
            horizonGradient.addColorStop(0, '#8b5cf680');
            horizonGradient.addColorStop(0.5, '#8b5cf640');
            horizonGradient.addColorStop(1, '#8b5cf600');
            this.ctx.fillStyle = horizonGradient;
            this.ctx.beginPath();
            this.ctx.arc(blackhole.x, blackhole.y, blackhole.eventHorizon, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.save();
            this.ctx.translate(blackhole.x, blackhole.y);
            this.ctx.rotate(blackhole.rotation);
            for (let i = 0; i < 3; i++) {
                this.ctx.beginPath();
                this.ctx.ellipse(0, 0, blackhole.radius * 1.5, blackhole.radius * 0.3, 0, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(139, 92, 246, ${0.3 - i * 0.1})`;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
            this.ctx.restore();
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
        this.drawComets();
        requestAnimationFrame(() => this.animate());
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CosmicBackground());
} else {
    new CosmicBackground();
}
