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


  // HAMBURGER AND NAV OVERLAY
  const hamburger = document.querySelector('.hamburger');
  const navOverlay = document.getElementById('navOverlay');
  const navClose = document.getElementById('navClose');

  if (hamburger && navOverlay) {
    const toggleNav = () => {
      hamburger.classList.toggle('open');
      navOverlay.classList.toggle('open');
      if (navOverlay.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };
    hamburger.addEventListener('click', toggleNav);
    if (navClose) navClose.addEventListener('click', toggleNav);
    
    const overlayLinks = navOverlay.querySelectorAll('a');
    overlayLinks.forEach(link => {
      link.addEventListener('click', toggleNav);
    });
  }


  // 3. STAGGERED FADE-IN ANIMATIONS
  const allFadeEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  allFadeEls.forEach((el, i) => {
    el.style.transitionDelay = (i % 6 * 80) + 'ms';
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  allFadeEls.forEach(el => revealObserver.observe(el));

  // PROJECT MODAL
  const modalOverlay = document.getElementById('project-modal');
  if (modalOverlay) {
    const projectCards = document.querySelectorAll('.project-card');
    const modalClose = modalOverlay.querySelector('.modal-close');
    
    const mBadge = modalOverlay.querySelector('.modal-badge');
    const mTitle = modalOverlay.querySelector('.modal-title');
    const mDesc = modalOverlay.querySelector('.modal-desc');
    const mYear = modalOverlay.querySelector('.modal-year');
    const mRole = modalOverlay.querySelector('.modal-role');
    const mTools = modalOverlay.querySelector('.modal-tools');
    const mObj = modalOverlay.querySelector('.modal-obj');
    const mDir = modalOverlay.querySelector('.modal-direction');
    const mColors = modalOverlay.querySelector('.modal-colors');
    const mFont = modalOverlay.querySelector('.modal-font');
    const mProcess = modalOverlay.querySelector('.modal-process');
    const mOutcome = modalOverlay.querySelector('.modal-outcome');
    const mLabel = modalOverlay.querySelector('.modal-bottom-label');

    const closeModal = () => {
      modalOverlay.classList.remove('modal-active');
      document.body.classList.remove('modal-open');
    };

    projectCards.forEach(card => {
      card.addEventListener('click', () => {
        if(mBadge) mBadge.textContent = card.getAttribute('data-category') || '';
        if(mTitle) mTitle.textContent = card.getAttribute('data-title') || '';
        if(mDesc) mDesc.textContent = card.getAttribute('data-overview') || card.getAttribute('data-desc') || '';
        if(mYear) mYear.textContent = card.getAttribute('data-year') || '';
        if(mRole) mRole.textContent = card.getAttribute('data-role') || '';
        if(mObj) mObj.textContent = card.getAttribute('data-objective') || '';
        if(mDir) mDir.textContent = card.getAttribute('data-direction') || '';
        if(mProcess) mProcess.textContent = card.getAttribute('data-process') || '';
        if(mOutcome) mOutcome.textContent = card.getAttribute('data-outcome') || '';
        if(mLabel) mLabel.textContent = card.getAttribute('data-label') || '';
        if(mFont) mFont.textContent = card.getAttribute('data-font') || '';

        if(mTools) {
          mTools.innerHTML = '';
          const tools = (card.getAttribute('data-tools') || '').split('·').map(t => t.trim());
          tools.forEach(t => {
            if(t) mTools.innerHTML += `<div style="margin-bottom:4px;"><span class="chip">${t}</span></div>`;
          });
        }
        
        if(mColors) {
          mColors.innerHTML = '';
          for(let i=1; i<=3; i++) {
             let col = card.getAttribute(`data-color-${i}`);
             if(col) {
                mColors.innerHTML += `<div style="width:16px;height:16px;border-radius:50%;background:${col};border:0.5px solid var(--border);"></div>`;
             }
          }
        }

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

  // HERO MOUSE PARALLAX
  const heroVisual = document.querySelector('.hero-right');
  if (heroVisual) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      heroVisual.style.transform = `translate(${x}px, ${y}px)`;
      heroVisual.style.transition = 'transform 0.8s ease';
    });
  }

  // HERO H1 SPLIT STAGGER
  document.querySelectorAll('.hero h1 .char').forEach((ch, i) => {
    ch.style.animationDelay = (i * 40) + 'ms';
  });

  // MAGNETIC BUTTONS
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 400ms ease';
    });
  });

  // STUDIO PARALLAX
  const callout = document.querySelector('.studio-callout');
  if (callout) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const rate = scrolled * 0.04;
      callout.style.backgroundPositionY = rate + 'px';
    });
  }

  // CUSTOM CURSOR
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (dot && ring) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let raf;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    });

    function lerp(a, b, t) { return a + (b - a) * t; }
    function tick() {
      ringX = lerp(ringX, mouseX, 0.10);
      ringY = lerp(ringY, mouseY, 0.10);
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      raf = requestAnimationFrame(tick);
    }
    tick();
  }

  // CONTACT FORM JS (MAILTO)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      const subject = encodeURIComponent(`Project Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      
      window.location.href = `mailto:krishna.lpu2025@gmail.com?subject=${subject}&body=${body}`;
    });
  }

});
