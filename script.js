(function() {
    const AUTO_SLIDE_INTERVAL = 5000; // matches CSS animation duration

    // ============ SLIDE DATA ============
    const slides = [
        {
            bg: 'https://i.pinimg.com/736x/47/c3/fc/47c3fc5015e93f5d494b37dfecac3640.jpg?auto=format&fit=crop&w=1920&q=80',
            outline: 'Recording',
            solid: 'Studio',
            desc: 'Professional recording, mixing & mastering services tailored to artists, producers, and content creators.'
        },
        {
            bg: 'https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?auto=format&fit=crop&w=1920&q=80',
            outline: 'Audio',
            solid: 'Mastering',
            desc: 'High-end mastering services for a professional sound finish with industry-leading equipment.'
        },
        {
            bg: 'https://i.pinimg.com/736x/8c/d6/71/8cd671cca1014d39b169999c34788db3.jpg?auto=format&fit=crop&w=1920&q=80',
            outline: 'Vocal',
            solid: 'Recording',
            desc: 'Crystal clear vocal tracks captured in our acoustically treated rooms by expert engineers.'
        }
    ];


    
    const heroBg = document.getElementById('hero-bg');
    const outlineTxt = document.getElementById('outline-txt');
    const solidTxt = document.getElementById('solid-txt');
    const descTxt = document.getElementById('desc-txt');
    const navItems = document.querySelectorAll('.nav-item');
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const scrollDown = document.getElementById('scrollDown');
    const sliderNav = document.getElementById('sliderNav');

    let currentIndex = 0;
    let autoSlideInterval;
    let isTransitioning = false;
    let charAnimationTimeout = null;

    function animateOutlineText(text) {
        outlineTxt.innerHTML = '';
        if (!text) return;
        const chars = text.split('');
        chars.forEach((char, i) => {
            const span = document.createElement('span');
            span.classList.add('char');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animation = `charReveal 0.4s ${i * 0.07}s forwards`;
            outlineTxt.appendChild(span);
        });
        if (!document.getElementById('char-keyframes')) {
            const style = document.createElement('style');
            style.id = 'char-keyframes';
            style.textContent = `
                @keyframes charReveal {
                    0% { opacity: 0; transform: translateX(-12px) rotateX(-30deg); }
                    70% { opacity: 1; transform: translateX(0) rotateX(0deg); }
                    100% { opacity: 1; transform: translateX(0) rotateX(0deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    function changeSlide(index) {
        if (isTransitioning || index === currentIndex) return;
        isTransitioning = true;
        currentIndex = index;

        heroBg.classList.remove('zoom-in');
        void heroBg.offsetWidth;
        heroBg.style.backgroundImage = `url('${slides[index].bg}')`;
        heroBg.classList.add('zoom-in');

        solidTxt.style.opacity = '0';
        descTxt.style.opacity = '0';

        if (charAnimationTimeout) clearTimeout(charAnimationTimeout);
        outlineTxt.innerHTML = '';
        charAnimationTimeout = setTimeout(() => {
            animateOutlineText(slides[index].outline);
            solidTxt.innerText = slides[index].solid;
            descTxt.innerText = slides[index].desc;
            solidTxt.style.opacity = '1';
            descTxt.style.opacity = '1';
            isTransitioning = false;
        }, 100);

        navItems.forEach(item => item.classList.remove('active'));
        if (navItems[index]) navItems[index].classList.add('active');
    }

    sliderNav.addEventListener('click', function(e) {
        const navItem = e.target.closest('.nav-item');
        if (!navItem) return;
        const index = parseInt(navItem.getAttribute('data-index'), 10);
        if (!isNaN(index) && index !== currentIndex) {
            resetAutoSlide();
            changeSlide(index);
        }
    });

    sliderNav.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const navItem = e.target.closest('.nav-item');
            if (!navItem) return;
            const index = parseInt(navItem.getAttribute('data-index'), 10);
            if (!isNaN(index)) {
                resetAutoSlide();
                changeSlide(index);
            }
        }
    });

    navItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        const idx = parseInt(item.getAttribute('data-index'), 10);
        item.setAttribute('aria-label', `Slide ${idx}: ${slides[idx]?.outline || ''} ${slides[idx]?.solid || ''}`);
    });

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            const next = (currentIndex + 1) % slides.length;
            changeSlide(next);
        }, AUTO_SLIDE_INTERVAL);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    function handleScroll() {
        if (window.scrollY > 40) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }

    // ============ NAVBAR & DROPDOWN ============
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    }
    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
    }

    function setupDropdowns() {
        const dropdownParents = document.querySelectorAll('.has-dropdown');
        dropdownParents.forEach(parent => {
            const link = parent.querySelector(':scope > a');
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    parent.classList.toggle('submenu-open');
                }
            });
        });
    }

    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
    });

    navLinks.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;
        if (window.innerWidth <= 768) {
            if (link.parentElement.classList.contains('has-dropdown')) return;
            closeMenu();
        }
    });

    document.addEventListener('click', function(e) {
        if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMenu();
    });

    scrollDown.addEventListener('click', () => {
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    });

    // Keyboard arrow hero navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            resetAutoSlide();
            changeSlide((currentIndex + 1) % slides.length);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            resetAutoSlide();
            changeSlide((currentIndex - 1 + slides.length) % slides.length);
        }
    });

    // Touch swipe hero
    let touchStartX = 0, touchStartY = 0;
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener('touchend', function(e) {
        const diffX = touchStartX - e.changedTouches[0].clientX;
        const diffY = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                resetAutoSlide();
                changeSlide((currentIndex + 1) % slides.length);
            } else {
                resetAutoSlide();
                changeSlide((currentIndex - 1 + slides.length) % slides.length);
            }
        }
    });

    // ============ SERVICES CAROUSEL ============
    const track = document.getElementById('servicesTrack');
    const leftArrow = document.getElementById('carouselLeft');
    const rightArrow = document.getElementById('carouselRight');
    const totalCards = document.querySelectorAll('.service-card').length;
    let visibleCards = 3;
    let currentSlide = 0;
    let maxSlide = 0;

    function updateCarouselLayout() {
        if (window.innerWidth <= 768) visibleCards = 1;
        else if (window.innerWidth <= 1024) visibleCards = 2;
        else visibleCards = 3;

        maxSlide = Math.ceil(totalCards / visibleCards) - 1;
        if (currentSlide > maxSlide) currentSlide = maxSlide;
        if (currentSlide < 0) currentSlide = 0;

        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateArrowState();
    }

    function updateArrowState() {
        leftArrow.disabled = currentSlide === 0;
        rightArrow.disabled = currentSlide >= maxSlide;
    }

    function goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex > maxSlide) return;
        currentSlide = slideIndex;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateArrowState();
    }

    leftArrow.addEventListener('click', () => {
        if (currentSlide > 0) goToSlide(currentSlide - 1);
    });
    rightArrow.addEventListener('click', () => {
        if (currentSlide < maxSlide) goToSlide(currentSlide + 1);
    });

    let servicesTouchStartX = 0;
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('touchstart', (e) => {
        servicesTouchStartX = e.touches[0].clientX;
    }, { passive: true });
    carouselContainer.addEventListener('touchend', (e) => {
        const diff = servicesTouchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentSlide < maxSlide) goToSlide(currentSlide + 1);
            else if (diff < 0 && currentSlide > 0) goToSlide(currentSlide - 1);
        }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateCarouselLayout, 150);
    });

    // ============ MUSIC PLAYER ============
    const musicPlayer = {
    audio: new Audio(),
    tracks: [],
    currentTrack: null,

    init() {
        this.tracks = Array.from(document.querySelectorAll('.track-item'));
        if (this.tracks.length === 0) return;
        this.audio.volume = 0.8;

        // Track click: if same track -> toggle, else load & play
        this.tracks.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (this.currentTrack === index) {
                    this.togglePlay();
                } else {
                    this.loadTrack(index);
                }
            });
        });

        // Play/Pause button
        const playBtn = document.getElementById('playPauseBtn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlay());
        }

        // Audio events
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('play', () => this.updatePlayButton(true));
        this.audio.addEventListener('pause', () => this.updatePlayButton(false));

        // Progress seek
        document.getElementById('progressSlider').addEventListener('input', (e) => {
            const seekTime = (e.target.value / 100) * this.audio.duration;
            if (isNaN(seekTime)) return;
            this.audio.currentTime = seekTime;
        });

        // Volume & mute
        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            this.audio.volume = e.target.value;
            this.updateMuteIcon();
        });
        document.getElementById('muteBtn').addEventListener('click', () => {
            this.audio.muted = !this.audio.muted;
            this.updateMuteIcon();
        });

        // Preload first track (no autoplay)
        if (this.tracks.length > 0) {
            const firstSrc = this.tracks[0].getAttribute('data-src');
            this.audio.src = firstSrc;
            this.audio.load();
        }
    },

    loadTrack(index, autoplay = true) {
        if (index < 0 || index >= this.tracks.length) return;
        this.currentTrack = index;
        const src = this.tracks[index].getAttribute('data-src');
        if (!src) return;
        this.audio.src = src;
        this.audio.load();
        if (autoplay) {
            this.audio.play().catch(() => {});
        }
        this.updateActiveClass();
        this.updateNowPlaying();
    },

    togglePlay() {
        if (this.currentTrack === null) {
            if (this.tracks.length > 0) this.loadTrack(0);
            return;
        }
        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
    },

    updatePlayButton(playing) {
        const btn = document.getElementById('playPauseBtn');
        if (btn) {
            btn.textContent = playing ? '⏸' : '▶';
        }
    },

    updateActiveClass() {
        this.tracks.forEach((item, idx) => {
            item.classList.remove('active');
            if (idx === this.currentTrack) {
                item.classList.add('active');
            }
        });
    },

    updateNowPlaying() {
        if (this.currentTrack === null) return;
        const item = this.tracks[this.currentTrack];
        const title = item.querySelector('.track-title').textContent;
        const artist = item.querySelector('.track-artist').textContent;
        document.getElementById('nowPlaying').textContent = `${title} — ${artist}`;
    },

    updateDuration() {
        if (!isNaN(this.audio.duration)) {
            document.getElementById('durationTime').textContent = this.formatTime(this.audio.duration);
        }
    },

    updateProgress() {
        const current = this.audio.currentTime || 0;
        const duration = this.audio.duration || 1;
        const percent = (current / duration) * 100;
        document.getElementById('progressFill').style.width = percent + '%';
        document.getElementById('progressSlider').value = percent;
        document.getElementById('currentTime').textContent = this.formatTime(current);
        if (!isNaN(duration)) {
            document.getElementById('durationTime').textContent = this.formatTime(duration);
        }
    },

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    },

    updateMuteIcon() {
        const btn = document.getElementById('muteBtn');
        if (this.audio.muted || this.audio.volume === 0) {
            btn.textContent = '🔇';
        } else if (this.audio.volume < 0.5) {
            btn.textContent = '🔉';
        } else {
            btn.textContent = '🔊';
        }
    },

    nextTrack() {
        if (this.tracks.length === 0) return;
        const next = (this.currentTrack + 1) % this.tracks.length;
        this.loadTrack(next);
    }
};

    // ============ INIT ============
    function init() {
        heroBg.style.backgroundImage = `url('${slides[0].bg}')`;
        heroBg.classList.add('zoom-in');
        solidTxt.innerText = slides[0].solid;
        descTxt.innerText = slides[0].desc;
        animateOutlineText(slides[0].outline);
        navItems[0].classList.add('active');
        startAutoSlide();
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        updateCarouselLayout();
        setupDropdowns();

        // Initialize the music player
if (document.getElementById('artistsTrack')) {
    artistsCarousel.init();
}
        if (document.querySelector('.track-list')) {
            musicPlayer.init();
        }
    }

    function preloadImages() {
        slides.forEach(slide => { const img = new Image(); img.src = slide.bg; });
    }
    preloadImages();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }


    // ============ ARTISTS CAROUSEL ============
const artistsCarousel = {
    track: document.getElementById('artistsTrack'),
    leftArrow: document.getElementById('artistsLeft'),
    rightArrow: document.getElementById('artistsRight'),
    totalCards: 9,
    visibleCards: 3,
    currentSlide: 0,
    maxSlide: 0,
    autoInterval: null,

    init() {
        if (!this.track) return;
        this.updateLayout();
        this.leftArrow.addEventListener('click', () => this.goToSlide(this.currentSlide - 1));
        this.rightArrow.addEventListener('click', () => this.goToSlide(this.currentSlide + 1));
        this.startAutoSlide();
        window.addEventListener('resize', () => this.updateLayout());
    },

    updateLayout() {
        if (window.innerWidth <= 768) {
            this.visibleCards = 1;
        } else if (window.innerWidth <= 1024) {
            this.visibleCards = 2;
        } else {
            this.visibleCards = 3;
        }
        this.maxSlide = Math.ceil(this.totalCards / this.visibleCards) - 1;
        if (this.currentSlide > this.maxSlide) this.currentSlide = this.maxSlide;
        if (this.currentSlide < 0) this.currentSlide = 0;
        this.track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        this.updateArrows();
    },

    goToSlide(index) {
        if (index < 0 || index > this.maxSlide) return;
        this.currentSlide = index;
        this.track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        this.updateArrows();
        this.resetAutoSlide();
    },

    updateArrows() {
        if (this.leftArrow) this.leftArrow.disabled = this.currentSlide === 0;
        if (this.rightArrow) this.rightArrow.disabled = this.currentSlide >= this.maxSlide;
    },

    startAutoSlide() {
        this.autoInterval = setInterval(() => {
            const next = (this.currentSlide + 1) % (this.maxSlide + 1);
            this.goToSlide(next);
        }, 5000);
    },

    resetAutoSlide() {
        clearInterval(this.autoInterval);
        this.startAutoSlide();
    }
};
    
function init() {
    heroBg.style.backgroundImage = `url('${slides[0].bg}')`;
    heroBg.classList.add('zoom-in');
    solidTxt.innerText = slides[0].solid;
    descTxt.innerText = slides[0].desc;
    animateOutlineText(slides[0].outline);
    navItems[0].classList.add('active');
    startAutoSlide();
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    updateCarouselLayout();
    setupDropdowns();

    

    // Artists carousel (if present)
    if (document.getElementById('artistsTrack')) {  
        artistsCarousel.init();
    }

    // Music player (if present)
    if (document.querySelector('.track-list')) {
        musicPlayer.init();
    }
}

// ========== BOOK STUDIO BUTTON – RE‑SPELL + BORDER DRAW EVERY 5s ==========
(function() {
    const btn = document.getElementById('bookStudioBtn');
    if (!btn) return;

    const originalText = 'Book Studio';

    function spellText(element, text, callback) {
        // Clear current text
        element.innerHTML = '';

        // Split text into characters
        const chars = text.split('');
        chars.forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            span.style.animation = `charReveal 0.3s ${i * 0.06}s forwards`;
            element.appendChild(span);
        });

        // Trigger callback after last character appears
        const totalTime = chars.length * 60 + 300; // (delay * count) + animation duration
        setTimeout(callback, totalTime);
    }

    function triggerEffect() {
        // Remove previous border class
        btn.classList.remove('draw-border');

        // Re‑spell the text
        spellText(btn, originalText, () => {
            // After spelling finishes, draw the border
            btn.classList.add('draw-border');
        });

        // Remove border class after a short display period
        setTimeout(() => {
            btn.classList.remove('draw-border');
        }, 2000); // border visible for 2 seconds before next cycle
    }

    // Initial run after a short delay
    setTimeout(triggerEffect, 1000);

    // Repeat every 5 seconds
    setInterval(triggerEffect, 5000);
})();

})();

