/**
 * =============================================================================
 * Parth Vinodray Dhola — Production Engine
 * Lightweight, accessible, zero-dependency interactive script.
 * Features:
 *   - Smooth cursor spotlight glow (RAF throttled)
 *   - Accessible WAI-ARIA tabbed experience navigation (keyboard + mouse)
 *   - Real-time client-side LTH model compression simulator
 *   - Mobile drawer menu with escape-key & outside click dismissal
 *   - Interactive profile avatar flip
 *   - Non-neon color palette switcher with localStorage persistence
 *   - Responsive scroll-elevated navigation
 * =============================================================================
 */

'use strict';

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. CURSOR SPOTLIGHT TRACKER (Throttled with requestAnimationFrame)
    // -------------------------------------------------------------------------
    const spotlight = document.getElementById('spotlight');
    let mouseX = 0;
    let mouseY = 0;
    let rafScheduled = false;

    function updateSpotlight() {
      document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
      rafScheduled = false;
    }

    if (spotlight && window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!rafScheduled) {
          rafScheduled = true;
          requestAnimationFrame(updateSpotlight);
        }
      }, { passive: true });
    }

    // -------------------------------------------------------------------------
    // 2. EXPERIENCE SECTION - ACCESSIBLE WAI-ARIA TAB SWITCHER
    // -------------------------------------------------------------------------
    const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
    const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));
    const tabHighlight = document.querySelector('.tab-highlight');

    function setActiveTab(index, setFocus = false) {
      if (index < 0 || index >= tabButtons.length) return;
      const isMobile = window.innerWidth <= 768;

      tabButtons.forEach((btn, i) => {
        const isSelected = i === index;
        btn.classList.toggle('active', isSelected);
        btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        btn.setAttribute('tabindex', isSelected ? '0' : '-1');
        if (isSelected && setFocus) {
          btn.focus();
        }
      });

      tabPanels.forEach((panel, i) => {
        const isSelected = i === index;
        panel.classList.toggle('active', isSelected);
      });

      if (tabHighlight) {
        if (isMobile) {
          tabHighlight.style.transform = `translateX(${index * 120}px)`;
        } else {
          tabHighlight.style.transform = `translateY(${index * 48}px)`;
        }
      }
    }

    tabButtons.forEach((btn, index) => {
      // Click handler
      btn.addEventListener('click', () => {
        setActiveTab(index, false);
      });

      // Keyboard navigation per W3C Tab Pattern
      btn.addEventListener('keydown', (e) => {
        let newIndex = null;

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          newIndex = (index + 1) % tabButtons.length;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          newIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          newIndex = tabButtons.length - 1;
        }

        if (newIndex !== null) {
          setActiveTab(newIndex, true);
        }
      });
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const activeBtn = document.querySelector('.tab-btn.active');
        if (activeBtn) {
          const index = parseInt(activeBtn.getAttribute('data-tab') || '0', 10);
          setActiveTab(index, false);
        }
      }, 100);
    }, { passive: true });

    // -------------------------------------------------------------------------
    // 3. INTERACTIVE LTH COMPRESSION SIMULATOR
    // -------------------------------------------------------------------------
    const slider = document.getElementById('sparsity-slider');
    const sparsityVal = document.getElementById('sparsity-val');
    const metricAcc = document.getElementById('metric-acc');
    const metricParams = document.getElementById('metric-params');
    const metricSize = document.getElementById('metric-size');
    const metricTarget = document.getElementById('metric-target');
    const widgetCaption = document.getElementById('widget-caption');

    const totalWeights = 25974;
    const fullSizeKiB = 50.73;

    function updateLTHSimulator(sparsity) {
      if (!sparsityVal || !metricParams || !metricSize || !metricAcc || !metricTarget || !widgetCaption) return;

      sparsityVal.textContent = `${sparsity}%`;
      const remainingRatio = 1 - sparsity / 100;
      const activeWeights = Math.round(totalWeights * remainingRatio);
      const sizeKiB = (fullSizeKiB * remainingRatio * 0.5 + fullSizeKiB * 0.5 * remainingRatio).toFixed(1);

      metricParams.textContent = `${activeWeights.toLocaleString()} / ${totalWeights.toLocaleString()}`;
      metricSize.textContent = `${Math.max(12.5, parseFloat(sizeKiB))} KiB`;

      if (sparsity === 0) {
        metricAcc.textContent = '96.15%';
        metricAcc.style.color = '#ccd6f6';
        metricTarget.textContent = 'Standard CPU/GPU';
        metricTarget.style.color = '#a8b2d1';
        widgetCaption.innerHTML = '● <strong>Dense Baseline:</strong> Full network weights initialized and trained from scratch (20 epochs).';
      } else if (sparsity <= 75) {
        // Winning ticket zone
        const acc = (96.15 + (sparsity / 75) * 1.25).toFixed(2);
        metricAcc.textContent = `${acc}%`;
        metricAcc.style.color = 'var(--green)';
        metricTarget.textContent = 'Edge Robot (PiOS)';
        metricTarget.style.color = '#34d399';
        widgetCaption.innerHTML = `✓ <strong>Winning Ticket:</strong> Iterative pruning with original init matches/beats dense accuracy using only <strong>${100 - sparsity}% of weights</strong>.`;
      } else {
        // Extreme sparsity ceiling
        const penalty = ((sparsity - 75) / 20) * 18;
        const acc = Math.max(68.5, (97.4 - penalty)).toFixed(1);
        metricAcc.textContent = `${acc}%`;
        metricAcc.style.color = '#fbbf24';
        metricTarget.textContent = 'Ultra-low Microcontroller';
        metricTarget.style.color = '#fbbf24';
        widgetCaption.innerHTML = '⚠️ <strong>Sparsity Ceiling:</strong> Beyond ~80% sparsity, accuracy drops off as essential feature layers lose representation capacity.';
      }
    }

    if (slider) {
      slider.addEventListener('input', (e) => {
        updateLTHSimulator(parseInt(e.target.value, 10));
      });
      updateLTHSimulator(74); // default winning ticket state
    }

    // -------------------------------------------------------------------------
    // 4. MOBILE DRAWER NAVIGATION & ACCESSIBILITY
    // -------------------------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');

    function openMobileMenu() {
      if (!mobileDrawer || !menuToggle) return;
      mobileDrawer.classList.add('open');
      document.body.classList.add('menu-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      mobileDrawer.setAttribute('aria-hidden', 'false');
    }

    function closeMobileMenu() {
      if (!mobileDrawer || !menuToggle) return;
      mobileDrawer.classList.remove('open');
      document.body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
    }

    if (menuToggle && mobileDrawer) {
      menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileDrawer.classList.contains('open');
        if (isOpen) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });

      document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
          closeMobileMenu();
        });
      });

      // Close on Escape key press
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
          closeMobileMenu();
          menuToggle.focus();
        }
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (mobileDrawer.classList.contains('open') && !mobileDrawer.contains(e.target) && e.target !== menuToggle) {
          closeMobileMenu();
        }
      });
    }

    // -------------------------------------------------------------------------
    // 5. AVATAR & CO-PILOT PHOTO TOGGLE
    // -------------------------------------------------------------------------
    const avatarToggleBtn = document.getElementById('avatar-toggle-btn');
    const photoFlipCard = document.getElementById('photo-flip-card');
    const mainPhoto = document.getElementById('main-photo');
    let isDogAvatar = false;

    function toggleAvatar() {
      if (!mainPhoto) return;
      isDogAvatar = !isDogAvatar;
      mainPhoto.style.opacity = '0';
      setTimeout(() => {
        mainPhoto.src = isDogAvatar ? 'avatar.jpg' : 'photo.png';
        mainPhoto.alt = isDogAvatar ? 'Parth’s Dog & Co-pilot' : 'Parth Vinodray Dhola';
        mainPhoto.style.opacity = '1';
      }, 150);
    }

    if (avatarToggleBtn) {
      avatarToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAvatar();
      });
    }

    if (photoFlipCard) {
      photoFlipCard.addEventListener('click', () => {
        toggleAvatar();
      });
    }

    // -------------------------------------------------------------------------
    // 6. COLOR PALETTE THEME SWITCHER (localStorage persistence)
    // -------------------------------------------------------------------------
    const themeSwatches = document.querySelectorAll('.theme-swatch');
    const savedTheme = localStorage.getItem('parth-portfolio-theme') || 'sage';

    function applyTheme(themeName) {
      document.documentElement.setAttribute('data-theme', themeName);
      try {
        localStorage.setItem('parth-portfolio-theme', themeName);
      } catch (err) {
        // Handle storage quota or private browsing mode
      }

      themeSwatches.forEach(swatch => {
        const isCurrent = swatch.getAttribute('data-set-theme') === themeName;
        swatch.classList.toggle('active', isCurrent);
      });
    }

    // Initial theme execution
    applyTheme(savedTheme);

    themeSwatches.forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        e.stopPropagation();
        const theme = swatch.getAttribute('data-set-theme');
        if (theme) {
          applyTheme(theme);
        }
      });
    });

    // -------------------------------------------------------------------------
    // 7. NAVBAR SCROLL ELEVATION (Throttled with requestAnimationFrame)
    // -------------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    let scrollY = 0;
    let scrollRafScheduled = false;

    function updateNavbarElevation() {
      if (navbar) {
        if (scrollY > 50) {
          navbar.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.5)';
          navbar.style.height = '70px';
        } else {
          navbar.style.boxShadow = 'none';
          navbar.style.height = '85px';
        }
      }
      scrollRafScheduled = false;
    }

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
      if (!scrollRafScheduled) {
        scrollRafScheduled = true;
        requestAnimationFrame(updateNavbarElevation);
      }
    }, { passive: true });
  });
})();
