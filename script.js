/* Sadhan NP Portfolio — interactions and motion */
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const progressBar = document.getElementById('progressBar');
  const backToTop = document.getElementById('backToTop');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navAnchors = [...document.querySelectorAll('.nav-links a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile navigation: open, close and close after choosing a section.
  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navLinks.classList.toggle('open', !isOpen);
  });
  navAnchors.forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  }));

  // Scroll progress, navbar appearance and back-to-top button.
  const onScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progressBar) progressBar.style.width = `${progress}%`;
    navbar?.classList.toggle('scrolled', window.scrollY > 25);
    backToTop?.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

  // Reveal elements as they enter the viewport.
  const revealItems = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Highlight the navigation item for the section currently in view.
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        document.querySelectorAll('.nav-links a, .side-dots a').forEach(link => {
          const active = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', active);
          if (active && link.classList.contains('dot')) link.setAttribute('aria-current', 'location');
          else if (link.classList.contains('dot')) link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Typing animation for the hero role line.
  const typedText = document.getElementById('typedText');
  const roles = ['Data Analyst', 'Power BI Developer', 'Business Thinker', 'AI Explorer'];
  if (typedText && !reducedMotion) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;
    const type = () => {
      const current = roles[roleIndex];
      if (deleting) {
        charIndex--;
        typedText.textContent = current.slice(0, Math.max(0, charIndex));
        if (charIndex <= 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          window.setTimeout(type, 350);
          return;
        }
      } else {
        charIndex++;
        typedText.textContent = roles[roleIndex].slice(0, charIndex);
        if (charIndex >= roles[roleIndex].length) {
          deleting = true;
          window.setTimeout(type, 1500);
          return;
        }
      }
      window.setTimeout(type, deleting ? 45 : 85);
    };
    window.setTimeout(type, 1500);
  }

  // Animate skill bars when the skills area becomes visible.
  const skillCards = document.querySelectorAll('.skill-card[data-level]');
  skillCards.forEach(card => card.style.setProperty('--level', `${card.dataset.level}%`));

  // Count-up statistics once, when the experience section appears.
  const counters = document.querySelectorAll('.counter[data-target]');
  const runCounter = element => {
    const target = Number(element.dataset.target);
    const suffix = element.dataset.suffix || '';
    const duration = 1300;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && !reducedMotion) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(counter => counterObserver.observe(counter));
  } else {
    counters.forEach(counter => { counter.textContent = `${counter.dataset.target}${counter.dataset.suffix || ''}`; });
  }

  // Current year in footer.
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
