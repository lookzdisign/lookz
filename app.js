const projects = [
    {
        "id": 1,
        "title": "Kirby",
        "image": "images/gallery/kirby.webp",
        "alt": "Kirby Thumbnail",
        "link": "https://youtube.com",
        "views": "N/A"
    },
     {
        "id": 2,
        "title": "jojo",
        "image": "images/gallery/jojo.png",
        "alt": "jojo Thumbnail",
        "link": "https://youtube.com",
        "views": "N/A"
    },
    {
        "id": 3,
        "title": "ippo",
        "image": "images/gallery/ippo.png",
        "alt": "jojo Thumbnail",
        "link": "https://youtube.com",
        "views": "N/A"
    },
    {
        "id": 4,
        "title": "Teen Titan Go",
        "image": "images/gallery/Teen_titan_go.png",
        "alt": "Teen Titan Go Thumbnail",
        "link": "https://youtube.com",
        "views": "N/A"
    },
    {
        "id": 5,
        "title": "Img 2602",
        "image": "images/gallery/IMG_2602.png",
        "alt": "Img 2602 Thumbnail",
        "link": "https://youtube.com",
        "views": "N/A"
    },
    {
        "id": 6,
        "title": "Img 2601",
        "image": "images/gallery/IMG_2601.png",
        "alt": "Img 2601 Thumbnail",
        "link": "https://youtube.com",
        "views": "N/A"
    },
    {
        "id": 7,
        "title": "Img 2600",
        "image": "images/gallery/IMG_2600.png",
        "alt": "Img 2600 Thumbnail",
        "link": "https://youtube.com",
        "views": "N/A"
    },
    {
        "id": 8,
        "title": "Img 2589",
        "image": "images/gallery/IMG_2589.png",
        "alt": "Img 2589 Thumbnail",
        "link": "https://youtube.com",
        "views": "N/A"
    },
    {
        "id": 9,
        "title": "Img 2587",
        "image": "images/gallery/IMG_2587.png",
        "alt": "Img 2587 Thumbnail",
        "link": "https://youtube.com",
        "views": "N/A"
    },
    {
        "id": 10,
        "title": "hollow knight",
        "image": "images/gallery/hollow knight corrigé.png",
        "alt": "jojo Thumbnail",
        "link": "https://youtube.com",
        "views": "N/A"
    },
    {
        "id": 11,
        "title": "mario galaxy",
        "image": "images/gallery/mario galaxy sans sauté v2.png",
        "alt": "jojo Thumbnail",
        "link": "https://youtube.com",
        "views": "N/A"
    },
    {
        "id": 12,
        "title": "mastu",
        "image": "images/gallery/minia mastu.png",
        "alt": "jojo Thumbnail",
        "link": "https://youtube.com",
        "views": "N/A"
    },
    {
        "id": 13,
        "title": "Img 2582",
        "image": "images/gallery/IMG_2582.png",
        "alt": "Img 2582 Thumbnail",
        "link": "https://youtube.com",
        "views": "N/A"
    }
];

function renderGallery() {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;
    gallery.innerHTML = '';

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';

        card.innerHTML = `
            <img src="${project.image}" alt="${project.alt}" loading="lazy">
            <div class="project-info">
                <h3>${project.title}</h3>
            </div>
        `;

        card.addEventListener('click', () => openModal(project));
        gallery.appendChild(card);
    });
}

function openModal(project) {
    const modal = document.getElementById('video-modal');
    const modalImg = document.getElementById('modal-img');

    modalImg.src = project.image;
    modalImg.alt = project.alt;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function setupModal() {
    const modal = document.getElementById('video-modal');
    const closeBtn = document.querySelector('.close-modal');

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.style.display = 'block';
    // Small delay to ensure display: block is registered before transform
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.style.display = 'none';
        }, 500);
    }, 3000);
}

function setupEmailCopy() {
    const emailLink = document.querySelector('.social-btn.email');
    if (emailLink) {
        emailLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailLink.getAttribute('href').replace('mailto:', '');
            navigator.clipboard.writeText(email).then(() => {
                showToast();
            });
        });
    }
}

function setupSlider() {
    const container = document.getElementById('ba-container');
    const afterImg = document.querySelector('.ba-image-after');
    const handle = document.querySelector('.ba-handle');

    if (container && afterImg && handle) {
        let ticking = false;
        container.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rect = container.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    let percent = (x / rect.width) * 100;
                    percent = Math.max(0, Math.min(percent, 100));
                    afterImg.style.clipPath = `inset(0 0 0 ${percent}%)`;
                    handle.style.left = `${percent}%`;
                    ticking = false;
                });
                ticking = true;
            }
        });

        // persistence logic: do not reset to center on leave
        container.addEventListener('mouseleave', () => {
            // No reset needed
        });

        container.addEventListener('mouseenter', () => {
            afterImg.style.transition = 'none';
            handle.style.transition = 'none';
        });
    }
}

function setupScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        // Add staggered delay via inline style
        card.style.transitionDelay = `${index * 100}ms`;
        observer.observe(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
    setupModal();
    setupEmailCopy();
    setupSlider();
    setupScrollReveal();

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
