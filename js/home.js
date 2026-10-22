/* home.js - ONLY loaded on index.html (hero slider, carousels, music player) */
(function () {
    'use strict';

    // ============ HERO SLIDER ============
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) {
        const AUTO = 5000;
        const slides = [
            { bg: 'https://i.pinimg.com/736x/47/c3/fc/47c3fc5015e93f5d494b37dfecac3640.jpg', outline: 'Recording', solid: 'Studio', desc: 'Professional recording, mixing & mastering services tailored to artists, producers, and content creators.' },
            { bg: 'https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?auto=format&fit=crop&w=1920&q=80', outline: 'Audio', solid: 'Mastering', desc: 'High-end mastering services for a professional sound finish with industry-leading equipment.' },
            { bg: 'https://i.pinimg.com/736x/8c/d6/71/8cd671cca1014d39b169999c34788db3.jpg', outline: 'Vocal', solid: 'Recording', desc: 'Crystal clear vocal tracks captured in our acoustically treated rooms by expert engineers.' }
        ];
        const outlineTxt = document.getElementById('outline-txt');
        const solidTxt = document.getElementById('solid-txt');
        const descTxt = document.getElementById('desc-txt');
        const navItems = document.querySelectorAll('.nav-item');
        const sliderNav = document.getElementById('sliderNav');
        const scrollDown = document.getElementById('scrollDown');
        const hero = document.getElementById('hero');
        let current = 0, timer, busy = false, charTimeout;

        function animateOutline(text) {
            outlineTxt.innerHTML = '';
            text.split('').forEach(function (ch, i) {
                const s = document.createElement('span');
                s.className = 'char';
                s.textContent = ch === ' ' ? '\u00A0' : ch;
                s.style.animation = 'charReveal .4s ' + (i * 0.07) + 's forwards';
                outlineTxt.appendChild(s);
            });
        }

        function setSlide(i, instant) {
            heroBg.classList.remove('zoom-in');
            void heroBg.offsetWidth;
            heroBg.style.backgroundImage = "url('" + slides[i].bg + "')";
            heroBg.classList.add('zoom-in');
            solidTxt.style.opacity = descTxt.style.opacity = '0';
            outlineTxt.innerHTML = '';
            clearTimeout(charTimeout);
            charTimeout = setTimeout(function () {
                animateOutline(slides[i].outline);
                solidTxt.textContent = slides[i].solid;
                descTxt.textContent = slides[i].desc;
                solidTxt.style.opacity = descTxt.style.opacity = '1';
                busy = false;
            }, instant ? 0 : 100);
            navItems.forEach(function (n, idx) { n.classList.toggle('active', idx === i); });
        }

        function changeSlide(i) {
            if (busy || i === current) return;
            busy = true;
            current = i;
            setSlide(i);
        }
        function next() { changeSlide((current + 1) % slides.length); }
        function prev() { changeSlide((current - 1 + slides.length) % slides.length); }
        function startAuto() { timer = setInterval(next, AUTO); }
        function resetAuto() { clearInterval(timer); startAuto(); }

        navItems.forEach(function (item) {
            const idx = parseInt(item.getAttribute('data-index'), 10);
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', 'Slide ' + (idx + 1) + ': ' + slides[idx].outline + ' ' + slides[idx].solid);
        });
        sliderNav.addEventListener('click', function (e) {
            const item = e.target.closest('.nav-item');
            if (!item) return;
            resetAuto();
            changeSlide(parseInt(item.getAttribute('data-index'), 10));
        });
        sliderNav.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            const item = e.target.closest('.nav-item');
            if (!item) return;
            e.preventDefault();
            resetAuto();
            changeSlide(parseInt(item.getAttribute('data-index'), 10));
        });

        // Left/Right arrows only while hero is on screen (Up/Down left alone so the page scrolls)
        document.addEventListener('keydown', function (e) {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
            if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
            const r = hero.getBoundingClientRect();
            if (r.bottom < 100 || r.top > window.innerHeight - 100) return;
            resetAuto();
            e.key === 'ArrowRight' ? next() : prev();
        });

        // Swipe only on the hero
        let sx = 0, sy = 0;
        hero.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
        hero.addEventListener('touchend', function (e) {
            const dx = sx - e.changedTouches[0].clientX, dy = sy - e.changedTouches[0].clientY;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) { resetAuto(); dx > 0 ? next() : prev(); }
        });

        if (scrollDown) scrollDown.addEventListener('click', function () {
            window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
        });

        slides.forEach(function (s) { new Image().src = s.bg; });
        setSlide(0, true);
        startAuto();
    }

    // ============ GENERIC CAROUSEL (services + artists) ============
    function makeCarousel(o) {
        const track = document.getElementById(o.track);
        const left = document.getElementById(o.left);
        const right = document.getElementById(o.right);
        if (!track || !left || !right) return;
        const total = track.children.length;
        let page = 0, max = 0, auto;

        function visible() { return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3; }
        function render() {
            track.style.transform = 'translateX(-' + (page * 100) + '%)';
            left.disabled = page === 0;
            right.disabled = page >= max;
        }
        function layout() {
            max = Math.ceil(total / visible()) - 1;
            page = Math.min(Math.max(page, 0), max);
            render();
        }
        function go(p) {
            if (p < 0 || p > max) return;
            page = p;
            render();
            if (o.auto) { clearInterval(auto); startAuto(); }
        }
        function startAuto() {
            if (!o.auto) return;
            auto = setInterval(function () { go(page >= max ? 0 : page + 1); }, o.auto);
        }
        left.addEventListener('click', function () { go(page - 1); });
        right.addEventListener('click', function () { go(page + 1); });

        let tx = 0;
        const box = track.parentElement;
        box.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
        box.addEventListener('touchend', function (e) {
            const d = tx - e.changedTouches[0].clientX;
            if (Math.abs(d) > 50) go(d > 0 ? page + 1 : page - 1);
        });

        let rt;
        window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 150); });
        layout();
        startAuto();
    }
    makeCarousel({ track: 'servicesTrack', left: 'carouselLeft', right: 'carouselRight' });
    makeCarousel({ track: 'artistsTrack', left: 'artistsLeft', right: 'artistsRight', auto: 5000 });

    // ============ MUSIC PLAYER ============
    const items = Array.from(document.querySelectorAll('.track-item'));
    if (!items.length) return;

    const audio = new Audio();
    audio.volume = 0.8;
    audio.preload = 'metadata';
    let cur = null;

    const $ = function (id) { return document.getElementById(id); };
    const playBtn = $('playPauseBtn'), fill = $('progressFill'), slider = $('progressSlider');
    const curT = $('currentTime'), durT = $('durationTime'), nowP = $('nowPlaying');
    const muteBtn = $('muteBtn'), vol = $('volumeSlider');

    function fmt(s) {
        if (!isFinite(s)) return '0:00';
        const m = Math.floor(s / 60), r = Math.floor(s % 60);
        return m + ':' + (r < 10 ? '0' : '') + r;
    }
    function load(i) {
        cur = i;
        audio.src = items[i].getAttribute('data-src');
        audio.play().catch(function () {
            nowP.textContent = 'Could not play this track';
        });
        items.forEach(function (it, idx) { it.classList.toggle('active', idx === i); });
        nowP.textContent = items[i].querySelector('.track-title').textContent + ' \u2014 ' + items[i].querySelector('.track-artist').textContent;
    }
    function toggle() {
        if (cur === null) return load(0);
        audio.paused ? audio.play() : audio.pause();
    }
    function muteIcon() {
        muteBtn.textContent = (audio.muted || audio.volume === 0) ? '\uD83D\uDD07' : audio.volume < 0.5 ? '\uD83D\uDD09' : '\uD83D\uDD0A';
    }

    items.forEach(function (it, i) {
        it.addEventListener('click', function () { cur === i ? toggle() : load(i); });
    });
    playBtn.addEventListener('click', toggle);
    audio.addEventListener('play', function () { playBtn.textContent = '\u23F8'; playBtn.setAttribute('aria-label', 'Pause'); });
    audio.addEventListener('pause', function () { playBtn.textContent = '\u25B6'; playBtn.setAttribute('aria-label', 'Play'); });
    audio.addEventListener('ended', function () { load((cur + 1) % items.length); });
    audio.addEventListener('loadedmetadata', function () {
        durT.textContent = fmt(audio.duration);
        if (cur !== null) items[cur].querySelector('.track-duration').textContent = fmt(audio.duration);
    });
    audio.addEventListener('timeupdate', function () {
        const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
        fill.style.width = pct + '%';
        slider.value = pct;
        curT.textContent = fmt(audio.currentTime);
    });
    slider.addEventListener('input', function () {
        if (audio.duration) audio.currentTime = (slider.value / 100) * audio.duration;
    });
    vol.addEventListener('input', function () { audio.volume = vol.value; audio.muted = false; muteIcon(); });
    muteBtn.addEventListener('click', function () { audio.muted = !audio.muted; muteIcon(); });
})();
