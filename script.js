document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('light-mode');
        });
    }

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('is-active');
        });
    }

    // Close mobile menu when a nav link is clicked
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (mobileMenu) mobileMenu.classList.remove('is-active');
        });
    });

    // Intersection Observer for Scroll Fade-In Animations
    const faders = document.querySelectorAll('.fade-in');
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    faders.forEach(fader => appearOnScroll.observe(fader));

    // Typing Animation for Hero Section
    const textArray = ["Scalable Systems.", "Robust REST APIs.", "High-Performance Backends."];
    let textIndex = 0, charIndex = 0, isDeleting = false;
    const typingElement = document.querySelector('.typing-text');

    function typeEffect() {
        const currentText = textArray[textIndex];
        if (isDeleting) { charIndex--; } else { charIndex++; }
        typingElement.textContent = currentText.substring(0, charIndex);

        let typeSpeed = isDeleting ? 50 : 100;
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            typeSpeed = 500;
        }
        setTimeout(typeEffect, typeSpeed);
    }
    if (typingElement) setTimeout(typeEffect, 1000);

    // =============================================
    // Skills Physics Playground (2D DOM-based)
    // =============================================
    const scene = document.querySelector('.ps2d-scene');
    if (!scene) return;

    const skills = [
        { name: "Java 17", color: "#e76f00" },
        { name: "Spring Boot", color: "#6db33f" },
        { name: "PostgreSQL", color: "#336791" },
        { name: "Oracle DB", color: "#f80000" },
        { name: "Hibernate", color: "#59666c" },
        { name: "REST APIs", color: "#00f2fe" },
        { name: "Docker", color: "#2496ed" },
        { name: "AWS", color: "#ff9900" },
        { name: "Git", color: "#f05032" },
        { name: "JUnit 5", color: "#25a162" },
        { name: "Microservices", color: "#a855f7" },
        { name: "SonarQube", color: "#4e9bcd" },
    ];

    const TILE = 120, BOUNCE = 0.55, FRICTION = 0.985, GRAVITY = 0.45;
    const tiles = [];

    function rand(a, b) { return a + Math.random() * (b - a); }

    skills.forEach((sk, i) => {
        const el = document.createElement('div');
        el.className = 'ps2d-tile';
        el.style.background = sk.color;
        el.style.borderColor = shadeColor(sk.color, -20);
        el.style.width = TILE + 'px';
        el.style.height = TILE + 'px';
        el.innerHTML = `<div class="ps2d-row"><div class="ps2d-logo-wrap"><span class="ps2d-emoji">${getEmoji(sk.name)}</span></div><span class="ps2d-text">${sk.name}</span></div>`;
        scene.appendChild(el);

        tiles.push({
            el, w: TILE, h: TILE,
            x: rand(TILE, scene.clientWidth - TILE * 2),
            y: -TILE - i * (TILE + 20),
            vx: rand(-1.5, 1.5), vy: 0,
            angle: 0, va: 0,
            dragging: false
        });
    });

    function getEmoji(name) {
        const map = {
            "Java 17": "☕", "Spring Boot": "🍃", "PostgreSQL": "🐘",
            "Oracle DB": "🔴", "Hibernate": "🐻", "REST APIs": "🔗",
            "Docker": "🐳", "AWS": "☁️", "Git": "🔀",
            "JUnit 5": "✅", "Microservices": "🧩", "SonarQube": "📊"
        };
        return map[name] || "💻";
    }

    function shadeColor(color, percent) {
        let num = parseInt(color.replace("#", ""), 16);
        let r = Math.min(255, Math.max(0, (num >> 16) + percent));
        let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
        let b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
        return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
    }

    // Drag state
    let dragTile = null, dragOffX = 0, dragOffY = 0, lastMX = 0, lastMY = 0, prevMX = 0, prevMY = 0;

    scene.addEventListener('pointerdown', e => {
        const rect = scene.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        for (let i = tiles.length - 1; i >= 0; i--) {
            const t = tiles[i];
            if (mx > t.x && mx < t.x + t.w && my > t.y && my < t.y + t.h) {
                dragTile = t; t.dragging = true;
                dragOffX = mx - t.x; dragOffY = my - t.y;
                lastMX = prevMX = mx; lastMY = prevMY = my;
                t.el.style.zIndex = 100;
                t.el.style.cursor = 'grabbing';
                break;
            }
        }
    });

    window.addEventListener('pointermove', e => {
        if (!dragTile) return;
        const rect = scene.getBoundingClientRect();
        prevMX = lastMX; prevMY = lastMY;
        lastMX = e.clientX - rect.left; lastMY = e.clientY - rect.top;
        dragTile.x = lastMX - dragOffX;
        dragTile.y = lastMY - dragOffY;
    });

    window.addEventListener('pointerup', () => {
        if (!dragTile) return;
        dragTile.vx = (lastMX - prevMX) * 0.8;
        dragTile.vy = (lastMY - prevMY) * 0.8;
        dragTile.dragging = false;
        dragTile.el.style.zIndex = '';
        dragTile.el.style.cursor = 'grab';
        dragTile = null;
    });

    // Physics loop
    function step() {
        const W = scene.clientWidth, H = scene.clientHeight;

        tiles.forEach(t => {
            if (t.dragging) { t.vx = 0; t.vy = 0; render(t); return; }

            t.vy += GRAVITY;
            t.vx *= FRICTION;
            t.vy *= FRICTION;
            t.x += t.vx;
            t.y += t.vy;
            t.va *= 0.96;
            t.angle += t.va;

            // Floor
            if (t.y + t.h > H) {
                t.y = H - t.h; t.vy *= -BOUNCE;
                t.va += t.vx * 0.002;
                if (Math.abs(t.vy) < 1) t.vy = 0;
            }
            // Left wall
            if (t.x < 0) { t.x = 0; t.vx *= -BOUNCE; }
            // Right wall
            if (t.x + t.w > W) { t.x = W - t.w; t.vx *= -BOUNCE; }
            // Ceiling
            if (t.y < 0) { t.y = 0; t.vy *= -BOUNCE; }

            render(t);
        });

        // Tile-to-tile collisions (simple AABB push)
        for (let i = 0; i < tiles.length; i++) {
            for (let j = i + 1; j < tiles.length; j++) {
                resolveCollision(tiles[i], tiles[j]);
            }
        }

        requestAnimationFrame(step);
    }

    function resolveCollision(a, b) {
        if (a.dragging || b.dragging) return;
        const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
        const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
        if (overlapX <= 0 || overlapY <= 0) return;

        if (overlapX < overlapY) {
            const push = overlapX / 2;
            if (a.x < b.x) { a.x -= push; b.x += push; } else { a.x += push; b.x -= push; }
            const tmpVx = a.vx; a.vx = b.vx * BOUNCE; b.vx = tmpVx * BOUNCE;
        } else {
            const push = overlapY / 2;
            if (a.y < b.y) { a.y -= push; b.y += push; } else { a.y += push; b.y -= push; }
            const tmpVy = a.vy; a.vy = b.vy * BOUNCE; b.vy = tmpVy * BOUNCE;
        }
    }

    function render(t) {
        t.el.style.transform = `translate3d(${t.x.toFixed(1)}px, ${t.y.toFixed(1)}px, 0) rotate(${t.angle.toFixed(3)}rad)`;
    }

    requestAnimationFrame(step);
});
