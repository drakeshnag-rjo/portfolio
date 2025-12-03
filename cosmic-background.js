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
        this.solarSystems = [];
        this.bigBangs = [];
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
        this.createSolarSystems(1);
        this.createBigBangs(1);

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
                baseOpacity: Math.random() * 0.2 + 0.3, // Darker base (0.3 - 0.5)
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                blinkFrequency: Math.random() * 0.08 + 0.03, // Faster blinking (0.03 - 0.11)
                blinkPhase: Math.random() * Math.PI * 2,
                blinkIntensity: Math.random() * 0.4 + 0.4, // Stronger blink (0.4 - 0.8)
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
            const baseRadius = Math.random() * 100 + 80;
            this.galaxies.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radiusX: baseRadius,
                radiusY: baseRadius * (0.4 + Math.random() * 0.4), // 40-80% of radiusX for ellipse
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
            const baseRadius = Math.random() * 60 + 40;
            this.wormholes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radiusX: baseRadius,
                radiusY: baseRadius * (0.5 + Math.random() * 0.3), // 50-80% of radiusX for ellipse
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
            const baseRadius = Math.random() * 50 + 30;
            const baseHorizon = Math.random() * 80 + 60;
            this.blackholes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radiusX: baseRadius,
                radiusY: baseRadius * (0.6 + Math.random() * 0.3), // 60-90% of radiusX for ellipse
                eventHorizonX: baseHorizon,
                eventHorizonY: baseHorizon * (0.6 + Math.random() * 0.3), // 60-90% of eventHorizonX
                rotation: 0,
                rotationSpeed: 0.02,
                vx: 0,
                vy: 0,
                friction: 0.92
            });
        }
    }

    createSolarSystems(count) {
        for (let i = 0; i < count; i++) {
            const planets = [];
            const planetCount = 5 + Math.floor(Math.random() * 4); // 5-8 planets

            for (let j = 0; j < planetCount; j++) {
                const baseOrbit = 40 + (j * 25);
                planets.push({
                    orbitRadiusX: baseOrbit, // Semi-major axis
                    orbitRadiusY: baseOrbit * (0.7 + Math.random() * 0.25), // 70-95% for elliptical orbit
                    radius: 2 + Math.random() * 4, // Planet size
                    speed: 0.005 + (Math.random() * 0.01) / (j + 1), // Slower for outer planets
                    angle: Math.random() * Math.PI * 2,
                    color: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'][j % 6]
                });
            }

            this.solarSystems.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                sunRadius: 12,
                planets: planets,
                vx: 0,
                vy: 0,
                friction: 0.92
            });
        }
    }

    createBigBangs(count) {
        for (let i = 0; i < count; i++) {
            this.bigBangs.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                particles: [],
                state: 'charging', // charging, exploding, fading
                timer: 0,
                maxTimer: 100 + Math.random() * 100,
                radius: 0,
                maxRadius: 200 + Math.random() * 100,
                color: '#ffffff'
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
                    const radiusX = (i / 100) * galaxy.radiusX;
                    const radiusY = (i / 100) * galaxy.radiusY;
                    const x = Math.cos(angle) * radiusX;
                    const y = Math.sin(angle) * radiusY;
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
            // Draw elliptical core
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, galaxy.radiusX * 0.3, galaxy.radiusY * 0.3, 0, 0, Math.PI * 2);
            const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.radiusX * 0.3);
            coreGradient.addColorStop(0, galaxy.color + 'AA');
            coreGradient.addColorStop(1, galaxy.color + '00');
            this.ctx.fillStyle = coreGradient;
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
                const ringRadiusX = (wormhole.radiusX * pulse) - (i * 8);
                const ringRadiusY = (wormhole.radiusY * pulse) - (i * 8);
                if (ringRadiusX > 0 && ringRadiusY > 0) {
                    this.ctx.beginPath();
                    this.ctx.ellipse(0, 0, ringRadiusX, ringRadiusY, 0, 0, Math.PI * 2);
                    const opacity = (1 - i / 8) * 0.4;
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }
            }
            const centerGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, wormhole.radiusX * 0.5);
            centerGradient.addColorStop(0, '#000000');
            centerGradient.addColorStop(0.5, '#3b82f6AA');
            centerGradient.addColorStop(1, '#3b82f600');
            this.ctx.fillStyle = centerGradient;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, wormhole.radiusX * 0.5, wormhole.radiusY * 0.5, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawBlackholes() {
        this.blackholes.forEach(blackhole => {
            blackhole.rotation += blackhole.rotationSpeed;
            this.applyPhysics(blackhole, 1.5);

            // Draw elliptical event horizon
            const horizonGradient = this.ctx.createRadialGradient(
                blackhole.x, blackhole.y, blackhole.radiusX,
                blackhole.x, blackhole.y, blackhole.eventHorizonX
            );
            horizonGradient.addColorStop(0, '#8b5cf680');
            horizonGradient.addColorStop(0.5, '#8b5cf640');
            horizonGradient.addColorStop(1, '#8b5cf600');
            this.ctx.fillStyle = horizonGradient;
            this.ctx.beginPath();
            this.ctx.ellipse(blackhole.x, blackhole.y, blackhole.eventHorizonX, blackhole.eventHorizonY, 0, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.save();
            this.ctx.translate(blackhole.x, blackhole.y);
            this.ctx.rotate(blackhole.rotation);
            for (let i = 0; i < 3; i++) {
                this.ctx.beginPath();
                this.ctx.ellipse(0, 0, blackhole.radiusX * 1.5, blackhole.radiusY * 0.3, 0, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(139, 92, 246, ${0.3 - i * 0.1})`;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
            this.ctx.restore();

            // Draw elliptical black hole core
            this.ctx.beginPath();
            this.ctx.ellipse(blackhole.x, blackhole.y, blackhole.radiusX, blackhole.radiusY, 0, 0, Math.PI * 2);
            this.ctx.fillStyle = '#000000';
            this.ctx.fill();
        });
    }

    drawSolarSystems() {
        this.solarSystems.forEach(system => {
            this.applyPhysics(system, 1.8);

            // Draw the sun with glow effect
            const sunGradient = this.ctx.createRadialGradient(
                system.x, system.y, 0,
                system.x, system.y, system.sunRadius * 2
            );
            sunGradient.addColorStop(0, '#fbbf24');
            sunGradient.addColorStop(0.5, '#f59e0b');
            sunGradient.addColorStop(1, '#f59e0b00');

            this.ctx.fillStyle = sunGradient;
            this.ctx.beginPath();
            this.ctx.arc(system.x, system.y, system.sunRadius * 2, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw sun core
            this.ctx.fillStyle = '#fbbf24';
            this.ctx.beginPath();
            this.ctx.arc(system.x, system.y, system.sunRadius, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw elliptical orbits and planets
            system.planets.forEach(planet => {
                // Draw elliptical orbit path
                this.ctx.beginPath();
                this.ctx.ellipse(system.x, system.y, planet.orbitRadiusX, planet.orbitRadiusY, 0, 0, Math.PI * 2);
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();

                // Update planet angle
                planet.angle += planet.speed;

                // Calculate planet position on elliptical orbit
                const planetX = system.x + Math.cos(planet.angle) * planet.orbitRadiusX;
                const planetY = system.y + Math.sin(planet.angle) * planet.orbitRadiusY;

                // Draw planet with glow
                const planetGradient = this.ctx.createRadialGradient(
                    planetX, planetY, 0,
                    planetX, planetY, planet.radius * 2
                );
                planetGradient.addColorStop(0, planet.color);
                planetGradient.addColorStop(0.7, planet.color + '80');
                planetGradient.addColorStop(1, planet.color + '00');

                this.ctx.fillStyle = planetGradient;
                this.ctx.beginPath();
                this.ctx.arc(planetX, planetY, planet.radius * 2, 0, Math.PI * 2);
                this.ctx.fill();

                // Draw planet core
                this.ctx.fillStyle = planet.color;
                this.ctx.beginPath();
                this.ctx.arc(planetX, planetY, planet.radius, 0, Math.PI * 2);
                this.ctx.fill();
            });
        });
    }

    drawBigBangs() {
        this.bigBangs.forEach(bang => {
            if (bang.state === 'charging') {
                bang.timer++;
                const progress = bang.timer / 100;

                // Draw gathering energy
                const radius = 5 + progress * 10;
                const opacity = progress;

                const gradient = this.ctx.createRadialGradient(
                    bang.x, bang.y, 0,
                    bang.x, bang.y, radius * 4
                );
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.4, '#fbbf24');
                gradient.addColorStop(1, 'rgba(251, 191, 36, 0)');

                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(bang.x, bang.y, radius * 4, 0, Math.PI * 2);
                this.ctx.fill();

                // Implosion effect lines
                for (let i = 0; i < 8; i++) {
                    const angle = (Date.now() / 500) + (i * Math.PI / 4);
                    const dist = 50 - (progress * 40);
                    this.ctx.beginPath();
                    this.ctx.moveTo(bang.x + Math.cos(angle) * dist, bang.y + Math.sin(angle) * dist);
                    this.ctx.lineTo(bang.x + Math.cos(angle) * (dist - 10), bang.y + Math.sin(angle) * (dist - 10));
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${progress})`;
                    this.ctx.stroke();
                }

                if (bang.timer >= 100) {
                    bang.state = 'exploding';
                    // Create explosion particles
                    for (let i = 0; i < 100; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = Math.random() * 8 + 2;
                        bang.particles.push({
                            x: bang.x,
                            y: bang.y,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            life: 1.0,
                            color: ['#ffffff', '#fbbf24', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 4)],
                            size: Math.random() * 3 + 1
                        });
                    }
                }
            } else if (bang.state === 'exploding') {
                // Draw shockwave
                bang.radius += 5;
                if (bang.radius < bang.maxRadius) {
                    this.ctx.beginPath();
                    this.ctx.arc(bang.x, bang.y, bang.radius, 0, Math.PI * 2);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${1 - bang.radius / bang.maxRadius})`;
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }

                // Update and draw particles
                bang.particles.forEach((p, index) => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.life -= 0.01;
                    p.vx *= 0.95;
                    p.vy *= 0.95;

                    if (p.life > 0) {
                        this.ctx.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2, '0');
                        this.ctx.beginPath();
                        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        this.ctx.fill();
                    } else {
                        bang.particles.splice(index, 1);
                    }
                });

                if (bang.particles.length === 0 && bang.radius >= bang.maxRadius) {
                    // Reset
                    bang.state = 'charging';
                    bang.timer = 0;
                    bang.radius = 0;
                    bang.x = Math.random() * this.canvas.width;
                    bang.y = Math.random() * this.canvas.height;
                }
            }
        });
    }


    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGalaxies();
        this.drawWormholes();
        this.drawBlackholes();
        this.drawSolarSystems();
        this.drawBigBangs();
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
