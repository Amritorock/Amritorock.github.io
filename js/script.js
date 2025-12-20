// Tailwind Config Extension
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Satoshi', 'Inter', 'sans-serif'],
                display: ['Clash Display', 'sans-serif'],
            },
            colors: {
                dark: '#0a0a0a',
                card: 'rgba(255, 255, 255, 0.05)',
                accent: {
                    cyan: '#00f2ff',
                    purple: '#bd00ff',
                    green: '#00ff9d'
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        }
    }
}

// Spotlight Effect
const spotlight = document.getElementById('spotlight');
if (spotlight) {
    document.addEventListener('mousemove', (e) => {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
    });
}

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Entrance
const tl = gsap.timeline();

tl.to(".hero-badge", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
    .to(".hero-text", { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }, "-=0.4")
    .to(".hero-cta", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");

// Bento Cards Animation
const cards = document.querySelectorAll('.bento-card');
cards.forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: index * 0.1 // Stagger effect based on index
    });
});

// Changelog Logic
const REPO_OWNER = 'Amritorock';
const REPO_NAME = 'Amritorock.github.io';
const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/Changelog`;

async function fetchChangelogs() {
    const grid = document.getElementById('changelog-grid');

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch file list');

        const data = await response.json();

        // Filter for text files
        const textFiles = data.filter(file => file.name.endsWith('.txt'));

        // Clear loading state
        grid.innerHTML = '';

        textFiles.forEach(file => {
            const id = file.name.replace('.txt', '');
            const title = id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

            // Assign icon/color based on keywords (simple heuristic)
            let icon = 'fa-file-lines';
            let color = 'text-accent-cyan';
            let hoverColor = 'group-hover:text-accent-cyan';

            if (id.includes('device')) {
                icon = 'fa-microchip';
                color = 'text-accent-purple';
                hoverColor = 'group-hover:text-accent-purple';
            } else if (id.includes('pixel')) {
                icon = 'fa-brands fa-android';
                color = 'text-accent-green';
                hoverColor = 'group-hover:text-accent-green';
            }

            const card = document.createElement('div');
            card.className = 'glass p-6 rounded-3xl cursor-pointer hover:bg-white/5 transition-colors group';
            card.onclick = () => loadChangelog(file.download_url, title);

            card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <i class="fa-solid ${icon} text-2xl ${color}"></i>
                    <span class="text-xs font-mono text-gray-500">Latest</span>
                </div>
                <h3 class="text-2xl font-bold mb-2 ${hoverColor} transition-colors">${title}</h3>
                <p class="text-gray-400 text-sm mb-4">Click to view the full changelog details.</p>
                <span class="${color} text-sm font-medium flex items-center gap-2">Read Log <i class="fa-solid fa-arrow-right text-xs"></i></span>
            `;

            grid.appendChild(card);
        });

    } catch (e) {
        console.error(e);
        grid.innerHTML = `
            <div class="glass p-6 rounded-3xl col-span-1 md:col-span-3 text-center border-red-500/30 border">
                <i class="fa-solid fa-triangle-exclamation text-red-500 text-3xl mb-4"></i>
                <p class="text-gray-400">Failed to load changelogs. Rate limit or network error.</p>
            </div>
        `;
    }
}

async function loadChangelog(url, titleText) {
    const modal = document.getElementById('changelog-modal');
    const content = document.getElementById('changelog-content');
    const title = document.getElementById('changelog-title');

    modal.classList.remove('hidden');
    gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.3 });

    title.innerText = titleText;
    content.innerText = 'Fetching content...';

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load content');
        const text = await response.text();
        content.innerText = text;
    } catch (e) {
        content.innerText = 'Error loading changelog content.';
    }
}

function closeChangelog() {
    const modal = document.getElementById('changelog-modal');
    gsap.to(modal, {
        opacity: 0, duration: 0.2, onComplete: () => {
            modal.classList.add('hidden');
        }
    });
}

// Close modal when clicking outside
document.getElementById('changelog-modal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('changelog-modal')) {
        closeChangelog();
    }
});

// Initialize
fetchChangelogs();
