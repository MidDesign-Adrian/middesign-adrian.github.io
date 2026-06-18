// MidDesign — Portfolio Website Scripts


// =========================================
// ACTIVE NAV LINK — page-based
// =========================================
(function markActivePage() {
    const page = document.body.dataset.page;
    if (!page || page === 'home') return;
    const link = document.querySelector(`.nav__links a[href="${page}.html"]`);
    if (link && !link.classList.contains('nav__cta')) {
        link.classList.add('active');
    }
})();

// =========================================
// MAGNETIC BUTTONS
// =========================================
const magnetBtns = document.querySelectorAll('.btn--primary');

magnetBtns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width  / 2;
        const y = e.clientY - rect.top  - rect.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.28}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), background-position 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease';
        btn.style.transform  = '';
        setTimeout(() => { btn.style.transition = ''; }, 600);
    });
});

// =========================================
// NAVBAR: scrolled class
// =========================================
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// =========================================
// MOBILE MENU TOGGLE
// =========================================
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
});

// =========================================
// SCROLL-IN ANIMATIONS
// =========================================
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

// =========================================
// WORK PAGE: FILTER BUTTON TOGGLE
// =========================================
const workFilters = document.querySelector('.work-filters');
if (workFilters) {
    workFilters.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        workFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
    });
}

// =========================================
// CONTACT FORM
// =========================================
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn      = form.querySelector('button[type="submit"]');
        const origText = btn.innerHTML;
        btn.disabled  = true;
        btn.innerHTML = 'Sending&hellip;';

        try {
            const response = await fetch(form.action, {
                method:  'POST',
                body:    new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.reset();
                btn.style.display         = 'none';
                formSuccess.style.display = 'block';
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                    btn.style.display         = '';
                    btn.disabled              = false;
                    btn.innerHTML             = origText;
                }, 6000);
            } else {
                btn.disabled  = false;
                btn.innerHTML = origText;
                alert('Something went wrong. Please try again or email adrian.cole@middesignstudio.com directly.');
            }
        } catch {
            btn.disabled  = false;
            btn.innerHTML = origText;
            alert('Something went wrong. Please try again or email adrian.cole@middesignstudio.com directly.');
        }
    });
}
