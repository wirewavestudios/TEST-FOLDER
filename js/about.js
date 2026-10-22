/* about.js - ONLY loaded on about.html (FAQ accordion + testimonial slider) */
(function () {
    'use strict';

    // ============ FAQ ACCORDION (one open at a time) ============
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item, i) {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!btn || !answer) return;

        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'faq-answer-' + i);
        answer.id = 'faq-answer-' + i;

        btn.addEventListener('click', function () {
            const willOpen = !item.classList.contains('open');
            faqItems.forEach(function (other) {
                other.classList.remove('open');
                const b = other.querySelector('.faq-question');
                if (b) b.setAttribute('aria-expanded', 'false');
            });
            if (willOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ============ TESTIMONIAL SLIDER ============
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const slider = document.querySelector('.testimonial-slider');
    if (!cards.length) return;

    let current = 0;
    let timer = null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function show(index) {
        current = (index + cards.length) % cards.length;
        cards.forEach(function (c, i) { c.classList.toggle('active', i === current); });
        dots.forEach(function (d, i) {
            d.classList.toggle('active', i === current);
            d.setAttribute('aria-current', i === current ? 'true' : 'false');
        });
    }

    function start() {
        if (reduceMotion || timer) return;
        timer = setInterval(function () { show(current + 1); }, 6000);
    }
    function stop() {
        clearInterval(timer);
        timer = null;
    }

    dots.forEach(function (dot, i) {
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
        dot.addEventListener('click', function () { stop(); show(i); start(); });
        dot.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stop(); show(i); start(); }
        });
    });

    if (slider) {
        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        slider.addEventListener('focusin', stop);
        slider.addEventListener('focusout', start);
    }

    show(0);
    start();
})();
