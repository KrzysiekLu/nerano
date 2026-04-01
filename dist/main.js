// Language Detection and Redirection Logic
(function() {
  const currentPath = window.location.pathname;
  const isEnglishPage = currentPath.endsWith('en.html');
  const isPolishPage = currentPath.endsWith('index.html') || currentPath.endsWith('/');
  const userLang = (navigator.language || navigator.userLanguage).toLowerCase();

  // Check if browser preference suggests English
  const prefersEnglish = userLang.startsWith('en');
  
  // Get language preference from localStorage (manually set by user)
  const savedLang = localStorage.getItem('user_lang_pref');

  // REDIRECTION LOGIC:
  // Only auto-redirect if the user hasn't explicitly chosen a language yet (savedLang is null)
  if (!savedLang) {
    if (prefersEnglish && !isEnglishPage) {
      window.location.href = 'en.html';
    } else if (!prefersEnglish && isEnglishPage) {
      window.location.href = 'index.html';
    }
  }

  // Handle language switch clicks to persist choice and stop automatic redirection
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-switch a').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetHref = link.getAttribute('href');
        if (targetHref.includes('en.html')) {
          localStorage.setItem('user_lang_pref', 'en');
        } else {
          localStorage.setItem('user_lang_pref', 'pl');
        }
      });
    });

    // Jerry Story accordion (mobile only ≤991px)
    document.querySelectorAll('.jerry-story__acc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.innerWidth > 991) return;
        const li = btn.closest('li');
        const isOpen = li.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen);
      });
    });

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        hamburger.classList.toggle('is-open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
      });
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('is-open');
          hamburger.classList.remove('is-open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Dynamic year in footer
    const yearEl = document.getElementById('current-year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });

    // Obsługa efektu reveal (centrum ekranu) na Mobile i Desktop
    const observerOptions = {
        root: null,
        rootMargin: '-45% 0px -45% 0px', // Bardziej selektywne okno ( centralne 16% ekranu)
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card').forEach(card => observer.observe(card));

    // Auto-hide navbar on scroll down, reveal on scroll up or hover
    let lastScrollY = window.scrollY;
    const navHeader = document.querySelector('header');
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      // Zamknij mobile menu przy scrollowaniu
      if (navLinks && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }

      if (currentScrollY > 80) {
        if (currentScrollY > lastScrollY) {
          navHeader.classList.add('nav-hidden');
        } else {
          navHeader.classList.remove('nav-hidden');
        }
      } else {
        navHeader.classList.remove('nav-hidden');
      }
      lastScrollY = currentScrollY;
    }, { passive: true });
  });
})();

