(function() {
  const currentPath = window.location.pathname;
  const isEnglishPage = currentPath.endsWith('en.html');
  const isPolishPage = currentPath.endsWith('index.html') || currentPath.endsWith('/');
  const userLang = (navigator.language || navigator.userLanguage).toLowerCase();

  const prefersEnglish = userLang.startsWith('en');
  
  const savedLang = localStorage.getItem('user_lang_pref');

  if (!savedLang) {
    if (prefersEnglish && !isEnglishPage) {
      window.location.href = 'en.html';
    } else if (!prefersEnglish && isEnglishPage) {
      window.location.href = 'index.html';
    }
  }

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

    document.querySelectorAll('.jerry-story__acc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.innerWidth > 991) return;
        const li = btn.closest('li');
        const isOpen = li.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen);
      });
    });

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

    const yearEl = document.getElementById('current-year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();

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

    const observerOptions = {
        root: null,
        rootMargin: '-45% 0px -45% 0px',
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

    let lastScrollY = window.scrollY;
    const navHeader = document.querySelector('header');
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

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

    (function highlightJerry(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (/JERRY/.test(node.nodeValue)) {
          const frag = document.createDocumentFragment();
          node.nodeValue.split(/(JERRY)/g).forEach(part => {
            if (part === 'JERRY') {
              const span = document.createElement('span');
              span.className = 'brand-jerry';
              span.textContent = 'JERRY';
              frag.appendChild(span);
            } else {
              frag.appendChild(document.createTextNode(part));
            }
          });
          node.parentNode.replaceChild(frag, node);
        }
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        !['SCRIPT', 'STYLE', 'A', 'INPUT', 'TEXTAREA'].includes(node.tagName)
      ) {
        Array.from(node.childNodes).forEach(highlightJerry);
      }
    })(document.body);
  });
})();

