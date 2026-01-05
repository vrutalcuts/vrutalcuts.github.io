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
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorTrail = document.createElement('div');
cursorTrail.className = 'cursor-trail';
document.body.appendChild(cursorTrail);

// Add cursor styles
const cursorStyles = document.createElement('style');
cursorStyles.textContent = `
    .custom-cursor {
        width: 12px;
        height: 12px;
        border: 2px solid rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        mix-blend-mode: difference;
        background: rgba(255, 255, 255, 0.1);
        transition: opacity 0.2s ease, transform 0.2s ease;
    }
    
    .cursor-trail {
        width: 40px;
        height: 40px;
        border: 2px solid rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        mix-blend-mode: difference;
        transition: opacity 0.2s ease, transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
    }
    
    body {
        cursor: none;
    }
    
    /* Hide custom cursor (dot) when hovering interactive elements */
    .custom-cursor.hidden {
        opacity: 0;
    }
    
    /* Ring (trail) stays visible but scales up */
    .cursor-trail.hover {
        transform: translate(-50%, -50%) scale(1.5);
        border-color: rgba(255, 255, 255, 0.8);
        background: rgba(255, 255, 255, 0.05);
    }
`;
document.head.appendChild(cursorStyles);

let cursorX = 0, cursorY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
});

function animateTrail() {
    trailX += (cursorX - trailX) * 0.3;
    trailY += (cursorY - trailY) * 0.3;

    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';

    requestAnimationFrame(animateTrail);
}
animateTrail();

// Cursor hover effects
const interactiveElements = document.querySelectorAll('a, button, .link-card, .social-icon, .cta-button');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        // Do NOT hide the dot, just scale the ring
        cursorTrail.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cursorTrail.classList.remove('hover');
    });
});

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

