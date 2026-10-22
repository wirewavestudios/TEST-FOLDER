/* main.js - shared on EVERY page (navbar, dropdowns, mobile menu, Book Studio effect) */
(function () {
    'use strict';

    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    // Shared keyframes (also used by the hero text on the home page)
    if (!document.getElementById('char-keyframes')) {
        const style = document.createElement('style');
        style.id = 'char-keyframes';
        style.textContent = '@keyframes charReveal{0%{opacity:0;transform:translateX(-12px) rotateX(-30deg)}70%,100%{opacity:1;transform:translateX(0) rotateX(0)}}';
        document.head.appendChild(style);
    }

    // Navbar background on scroll
    function handleScroll() {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile menu
    function closeMenu() {
        if (!hamburger || !navLinks) return;
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
    }
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    }

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
        });
        navLinks.addEventListener('click', function (e) {
            const link = e.target.closest('a');
            if (!link || window.innerWidth > 768) return;
            if (link.parentElement.classList.contains('has-dropdown')) return;
            closeMenu();
        });
        document.addEventListener('click', function (e) {
            if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
        });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    }

    // Mobile dropdowns
    document.querySelectorAll('.has-dropdown').forEach(function (parent) {
        const link = parent.querySelector(':scope > a');
        if (!link) return;
        link.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                parent.classList.toggle('submenu-open');
            }
        });
    });

    // Book Studio button: re-spell text + draw border every 5s
    const btn = document.getElementById('bookStudioBtn');
    if (btn && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const text = btn.textContent.trim();
        function triggerEffect() {
            btn.classList.remove('draw-border');
            btn.innerHTML = '';
            text.split('').forEach(function (ch, i) {
                const s = document.createElement('span');
                s.textContent = ch === ' ' ? '\u00A0' : ch;
                s.style.cssText = 'opacity:0;display:inline-block;animation:charReveal .3s ' + (i * 0.06) + 's forwards';
                btn.appendChild(s);
            });
            setTimeout(function () { btn.classList.add('draw-border'); }, text.length * 60 + 300);
            setTimeout(function () { btn.classList.remove('draw-border'); }, 2000);
        }
        setTimeout(triggerEffect, 1000);
        setInterval(triggerEffect, 5000);
    }
})();
