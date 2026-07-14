// ============================================================
// Hero 3D scene — a slowly rotating network sphere ("the cloud")
// with an inner wireframe core, mouse parallax and scroll drift.
// Three.js is loaded as an ES module via the import map in the
// page <head>. If WebGL is unavailable the hero silently falls
// back to its CSS gradient backdrop.
// ============================================================
import * as THREE from 'three';

const canvas = document.getElementById('hero-canvas');
if (canvas) init(canvas);

function init(canvas) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
        return; // no WebGL — CSS backdrop remains
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 6;

    const group = new THREE.Group();
    scene.add(group);

    // --- Node cloud on a jittered sphere ---
    const NODE_COUNT = 220;
    const RADIUS = 2.4;
    const positions = new Float32Array(NODE_COUNT * 3);
    const colors = new Float32Array(NODE_COUNT * 3);
    const teal = new THREE.Color('#2dd4bf');
    const violet = new THREE.Color('#a78bfa');
    const nodes = [];

    for (let i = 0; i < NODE_COUNT; i++) {
        // even-ish distribution via golden spiral + jitter
        const t = i / NODE_COUNT;
        const phi = Math.acos(1 - 2 * t);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const r = RADIUS * (0.92 + ((i * 37) % 17) / 17 * 0.18);
        const v = new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        nodes.push(v);
        positions.set([v.x, v.y, v.z], i * 3);
        const c = teal.clone().lerp(violet, t);
        colors.set([c.r, c.g, c.b], i * 3);
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(pointsGeo, new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    }));
    group.add(points);

    // --- Connections between near neighbours ---
    const linePositions = [];
    const MAX_DIST = 1.05;
    for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
            if (nodes[i].distanceTo(nodes[j]) < MAX_DIST) {
                linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z,
                    nodes[j].x, nodes[j].y, nodes[j].z);
            }
        }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
        color: 0x3b4a6b,
        transparent: true,
        opacity: 0.28,
        depthWrite: false
    }));
    group.add(lines);

    // --- Inner wireframe core ---
    const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.05, 1),
        new THREE.MeshBasicMaterial({ color: 0x2dd4bf, wireframe: true, transparent: true, opacity: 0.32 })
    );
    group.add(core);

    const coreGlow = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.55, 2),
        new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.18 })
    );
    group.add(coreGlow);

    // Offset the sphere to the right on wide screens so the hero
    // text keeps breathing room; centered on narrow screens.
    function layout() {
        const { clientWidth: w, clientHeight: h } = canvas;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        group.position.x = w > 900 ? 2.5 : 0;
        group.position.y = w > 900 ? 0 : 0.9;
        const scale = w > 900 ? 0.92 : 0.7;
        group.scale.setScalar(scale);
    }
    layout();
    window.addEventListener('resize', layout);

    // --- Pointer parallax ---
    const pointer = { x: 0, y: 0 };
    window.addEventListener('pointermove', (e) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    // --- Render loop: pause when hidden or off-screen ---
    let heroVisible = true;
    new IntersectionObserver(([entry]) => {
        heroVisible = entry.isIntersecting;
    }).observe(canvas);

    const clock = new THREE.Clock();

    // Note: no document.hidden check — browsers already suspend
    // requestAnimationFrame in hidden tabs; heroVisible handles
    // the scrolled-past case.
    function frame() {
        if (heroVisible) {
            const t = clock.getElapsedTime();
            group.rotation.y = t * 0.08 + window.scrollY * 0.0006;
            group.rotation.x = Math.sin(t * 0.15) * 0.08 + pointer.y * 0.12;
            group.rotation.z = pointer.x * 0.05;
            core.rotation.y = -t * 0.2;
            core.rotation.x = t * 0.12;
            coreGlow.rotation.y = t * 0.3;
            camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.04;
            camera.position.y += (-pointer.y * 0.25 - camera.position.y) * 0.04;
            camera.lookAt(group.position.x, 0, 0);
            renderer.render(scene, camera);
        }
        if (!reducedMotion) requestAnimationFrame(frame);
    }

    if (reducedMotion) {
        // single static frame — no animation
        renderer.render(scene, camera);
        window.addEventListener('resize', () => renderer.render(scene, camera));
    } else {
        requestAnimationFrame(frame);
    }
}
