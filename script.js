// ===== PARTICLES BACKGROUND =====
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';
document.body.insertBefore(canvas, document.body.firstChild);

const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null, radius: 200 }; // Increased interaction radius

// Set canvas size
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5; // Slightly larger variation
        this.speedX = Math.random() * 1.5 - 0.75; // 3x faster speed
        this.speedY = Math.random() * 1.5 - 0.75; // 3x faster speed
        this.opacity = Math.random() * 0.5 + 0.3; // Slightly brighter
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius && mouse.x !== null) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= dx * force * 0.05; // Stronger repulsion
            this.y -= dy * force * 0.05;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles
function initParticles() {
    particles = [];
    // Increased density: divide by 9000 instead of 15000 (more particles)
    const numberOfParticles = Math.floor((canvas.width * canvas.height) / 9000);
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}
initParticles();
window.addEventListener('resize', initParticles);

// Mouse move event
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections
    particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Increased connection distance
            if (distance < 130) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - distance / 130)})`;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(animate);
}
animate();

// ===== CUSTOM CURSOR =====
const supportsCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (supportsCustomCursor) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorTrail = document.createElement('div');
    cursorTrail.className = 'cursor-trail';
    document.body.appendChild(cursorTrail);

    let cursorX = null;
    let cursorY = null;
    let trailX = 0;
    let trailY = 0;

    document.addEventListener('mousemove', (event) => {
        cursorX = event.clientX;
        cursorY = event.clientY;

        if (!document.body.classList.contains('custom-cursor-active')) {
            trailX = cursorX;
            trailY = cursorY;
            document.body.classList.add('custom-cursor-active');
        }

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
    });

    function hideCustomCursor() {
        document.body.classList.remove('custom-cursor-active');
        cursorTrail.classList.remove('hover');
        cursorX = null;
        cursorY = null;
    }

    document.addEventListener('mouseleave', hideCustomCursor);
    window.addEventListener('blur', hideCustomCursor);

    function animateTrail() {
        if (cursorX !== null && cursorY !== null) {
            trailX += (cursorX - trailX) * 0.3;
            trailY += (cursorY - trailY) * 0.3;
            cursorTrail.style.left = `${trailX}px`;
            cursorTrail.style.top = `${trailY}px`;
        }

        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    const interactiveElements = document.querySelectorAll('a, button, .link-card, .social-icon, .cta-button');
    interactiveElements.forEach((element) => {
        element.addEventListener('mouseenter', () => cursorTrail.classList.add('hover'));
        element.addEventListener('mouseleave', () => cursorTrail.classList.remove('hover'));
    });
}

// ===== GLITCH EFFECT FOR TITLE =====
const profileName = document.querySelector('.profile-name');
if (profileName) {
    const originalText = profileName.textContent;
    let isGlitching = false;

    function glitchEffect() {
        if (isGlitching) return;
        isGlitching = true;

        const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
        let iterations = 0;

        const interval = setInterval(() => {
            profileName.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                })
                .join('');

            iterations += 1 / 3;

            if (iterations >= originalText.length) {
                clearInterval(interval);
                profileName.textContent = originalText;
                isGlitching = false;
            }
        }, 30);
    }

    // Auto-glitch on load
    setTimeout(glitchEffect, 800);

    // Auto-glitch every 7 seconds
    setInterval(glitchEffect, 7000);

    // Trigger on hover
    profileName.addEventListener('mouseenter', glitchEffect);
}

// ===== WAVE ANIMATION ON HOVER =====
const socialIcons = document.querySelectorAll('.social-icon');
socialIcons.forEach((icon, index) => {
    icon.addEventListener('mouseenter', () => {
        socialIcons.forEach((otherIcon, otherIndex) => {
            if (otherIndex !== index) {
                const distance = Math.abs(otherIndex - index);
                const delay = distance * 50;
                setTimeout(() => {
                    otherIcon.style.transform = 'translateY(-3px) scale(1.05)';
                    setTimeout(() => {
                        otherIcon.style.transform = '';
                    }, 200);
                }, delay);
            }
        });
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
