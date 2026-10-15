// Mobile menu
const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');

if (menuBtn && nav) {
    const mobile = window.matchMedia('(max-width: 640px)');

    const setOpen = (open) => {
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        nav.hidden = !open;
    };

    const sync = () => setOpen(false);
    sync();
    mobile.addEventListener('change', sync);

    menuBtn.addEventListener('click', () => {
        setOpen(menuBtn.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
            setOpen(false);
            menuBtn.focus();
        }
    });
}

// Header rule appears once the page scrolls
const header = document.querySelector('.header');
if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

// Looping videos: play only while on screen, and never for reduced motion
const videos = document.querySelectorAll('video[data-loop]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (videos.length) {
    if (reduceMotion.matches) {
        videos.forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });
    } else if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(({ target, isIntersecting }) => {
                if (isIntersecting) target.play().catch(() => {});
                else target.pause();
            });
        }, { threshold: 0.25 });
        videos.forEach((v) => io.observe(v));
    }
}

// Scroll reveal: show the second image once the figure is mostly on screen,
// and reset only after it has fully left, so the swap replays on return
const reveals = document.querySelectorAll('[data-reveal]');
if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(({ target, intersectionRatio }) => {
            if (intersectionRatio >= 0.6) target.classList.add('is-revealed');
            else if (intersectionRatio === 0) target.classList.remove('is-revealed');
        });
    }, { threshold: [0, 0.6] });
    reveals.forEach((r) => io.observe(r));
}

// Video playlist: swap posters from the list, load YouTube only when asked
document.querySelectorAll('[data-vplayer]').forEach((player) => {
    const stage = player.querySelector('.vplayer__stage');
    const items = player.querySelectorAll('.vplayer__item');

    const play = (item) => {
        items.forEach((i) => i.removeAttribute('aria-current'));
        item.setAttribute('aria-current', 'true');
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${item.dataset.id}?autoplay=1&rel=0&playsinline=1`;
        iframe.title = item.querySelector('.vplayer__title').textContent;
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        iframe.allowFullscreen = true;
        stage.replaceChildren(iframe);
    };

    stage.addEventListener('click', (e) => {
        const poster = e.target.closest('.vplayer__poster');
        if (!poster) return;
        e.preventDefault();
        play(player.querySelector('.vplayer__item[aria-current="true"]') || items[0]);
    });

    items.forEach((item) => item.addEventListener('click', (e) => {
        e.preventDefault();
        play(item);
    }));
});

// Footer year
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
