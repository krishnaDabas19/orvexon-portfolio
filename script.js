document.addEventListener('DOMContentLoaded', () => {
  // 1. PAGE LOAD FADE-IN
  document.body.classList.add('page-loaded');

  // 2. PAGE TRANSITION ON NAVIGATION
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('http') &&
      !href.startsWith('mailto') &&
      link.target !== '_blank'
    ) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 280ms ease';
        setTimeout(() => {
          window.location.href = href;
        }, 280);
      });
    }
  });

  // THEME TOGGLE
  const themeToggle = document.getElementById('theme-toggle');
  
  if (themeToggle) {
    const updateIcon = (theme) => {
      if (theme === 'light') {
        themeToggle.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41M12 17a5 5 0 100-10a5 5 0 000 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>';
      } else {
        themeToggle.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
      }
    };

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    updateIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      let newTheme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateIcon(newTheme);
    });
  }

  // NAVBAR SCROLL BEHAVIOR
  const navbar = document.querySelector('.navbar') || document.querySelector('header');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('nav-scrolled');
      } else {
        navbar.classList.remove('nav-scrolled');
      }
    });
  }

  // ACTIVE NAV LINK
  const navLinks = document.querySelectorAll('nav .nav-link, .mobile-nav-link');
  const currentPath = window.location.pathname;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath.endsWith(href) || (currentPath.endsWith('/') && href === 'index.html'))) {
      link.classList.add('nav-active');
    }
  });

  // MOBILE MENU
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  
  if (mobileMenuBtn && mobileNavOverlay && mobileNavClose) {
    const closeMenu = () => {
      document.body.classList.remove('menu-open');
    };

    mobileMenuBtn.addEventListener('click', () => {
      document.body.classList.add('menu-open');
    });

    mobileNavClose.addEventListener('click', closeMenu);

    const mobileLinks = mobileNavOverlay.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // 3. STAGGERED FADE-IN ANIMATIONS
  const fadeEls = document.querySelectorAll('.fade-in');
  fadeEls.forEach((el, i) => {
    el.style.transitionDelay = (i * 70) + 'ms';
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => observer.observe(el));

  // PROJECT MODAL
  const modalOverlay = document.getElementById('project-modal');
  if (modalOverlay) {
    const projectCards = document.querySelectorAll('.project-card');
    const modalClose = modalOverlay.querySelector('.modal-close');
    
    const mBadge = modalOverlay.querySelector('.modal-badge');
    const mTitle = modalOverlay.querySelector('.modal-title');
    const mObj = modalOverlay.querySelector('.modal-obj');
    const mProcess = modalOverlay.querySelector('.modal-process');
    const mDecision = modalOverlay.querySelector('.modal-decision');
    const mTools = modalOverlay.querySelector('.modal-tools');
    const mLabel = modalOverlay.querySelector('.modal-bottom-label');

    const closeModal = () => {
      modalOverlay.classList.remove('modal-active');
      document.body.classList.remove('modal-open');
    };

    projectCards.forEach(card => {
      card.addEventListener('click', () => {
        mBadge.textContent = card.getAttribute('data-category');
        mTitle.textContent = card.getAttribute('data-title');
        mObj.textContent = card.getAttribute('data-objective');
        mProcess.textContent = card.getAttribute('data-process');
        mDecision.textContent = card.getAttribute('data-decision');
        mLabel.textContent = card.getAttribute('data-label');

        mTools.innerHTML = '';
        const tools = (card.getAttribute('data-tools') || '').split('·').map(t => t.trim());
        tools.forEach(t => {
          if(t) {
            const span = document.createElement('span');
            span.className = 'chip';
            span.textContent = t;
            mTools.appendChild(span);
          }
        });

        const modalImgContainer = modalOverlay.querySelector('.modal-img');
        const mImgSrc = card.getAttribute('data-modal-img');
        if (mImgSrc) {
          modalImgContainer.innerHTML = `<img src="${mImgSrc}" alt="" loading="lazy">`;
        } else {
          modalImgContainer.innerHTML = '<span>[ preview ]</span>';
        }

        modalOverlay.classList.add('modal-active');
        document.body.classList.add('modal-open');
      });
    });

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // WORK FILTER
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length > 0) {
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('filter-active'));
        btn.classList.add('filter-active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
          const fCat = card.getAttribute('data-filter-cat');
          if (filter === 'all' || fCat === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // 4. BACK TO TOP BUTTON
  const btt = document.createElement('button');
  btt.id = 'back-to-top';
  btt.innerHTML = '↑';
  btt.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(btt);

  window.addEventListener('scroll', () => {
    btt.classList.toggle('show', window.scrollY > 400);
  });

  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
