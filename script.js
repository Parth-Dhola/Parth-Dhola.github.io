/**
 * =============================================================================
 * Parth Vinodray Dhola — Production Engine
 * Lightweight, accessible, zero-dependency interactive script.
 * Features:
 *   - Grounded-style scroll-driven staggered reveals (IntersectionObserver)
 *   - 3D interactive card tilt & cursor light reflection
 *   - Magnetic button proximity physics
 *   - Real-time project category filtering
 *   - AeroSense.AI live atmospheric telemetry & XAI simulator
 *   - Weed LTH model compression simulator
 *   - Accessible WAI-ARIA experience tabs
 *   - Mobile drawer navigation with escape-key & outside click dismissal
 *   - Avatar flip & color palette switcher with localStorage persistence
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
    // 2. GROUNDED-STYLE SCROLL-DRIVEN REVEAL ANIMATIONS
    // -------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      // Fallback for older browsers
      revealElements.forEach(el => el.classList.add('is-revealed'));
    }

    // -------------------------------------------------------------------------
    // 3. 3D TILT CARDS & DYNAMIC CURSOR LIGHT SHEEN
    // -------------------------------------------------------------------------
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          card.style.setProperty('--card-mouse-x', `${x}px`);
          card.style.setProperty('--card-mouse-y', `${y}px`);

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = ((y - centerY) / centerY) * -3; // subtle tilt angle
          const rotateY = ((x - centerX) / centerX) * 3;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
      });
    }

    // -------------------------------------------------------------------------
    // 4. MAGNETIC BUTTON HOVER EFFECT
    // -------------------------------------------------------------------------
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translate(0px, 0px)';
        });
      });
    }

    // -------------------------------------------------------------------------
    // 5. PROJECT CATEGORY FILTERING (Instant & Animated)
    // -------------------------------------------------------------------------
    const filterChips = document.querySelectorAll('.filter-chip');
    const projectCards = document.querySelectorAll('.story-project-card');

    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const filter = chip.getAttribute('data-filter') || 'all';

        filterChips.forEach(c => {
          const isActive = c === chip;
          c.classList.toggle('active', isActive);
          c.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('is-hidden');
            // Trigger quick fade in
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1) translateY(0)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.96) translateY(15px)';
            setTimeout(() => {
              card.classList.add('is-hidden');
            }, 300);
          }
        });
      });
    });

    // -------------------------------------------------------------------------
    // 6. AEROSENSE.AI LIVE ATMOSPHERIC TELEMETRY & XAI SIMULATOR
    // -------------------------------------------------------------------------
    const aqiSlider = document.getElementById('aqi-pm25-slider');
    const pm25Val = document.getElementById('pm25-val');
    const aqiCategory = document.getElementById('aqi-category');
    const aqiLatency = document.getElementById('aqi-latency');
    const aqiDriver = document.getElementById('aqi-driver');
    const aqiConfidence = document.getElementById('aqi-confidence');
    const aqiCaption = document.getElementById('aqi-caption');

    function updateAeroSenseSimulator(pm25) {
      if (!pm25Val || !aqiCategory || !aqiLatency || !aqiDriver || !aqiConfidence || !aqiCaption) return;

      pm25Val.textContent = `${pm25} µg/m³`;

      // Continuous XAI sub-index & category estimation
      if (pm25 <= 30) {
        aqiCategory.textContent = 'Good (Clean Air)';
        aqiCategory.style.color = '#34d399';
        aqiLatency.textContent = '< 9.8 ms';
        aqiDriver.textContent = 'O3 / Background (31.2%)';
        aqiConfidence.textContent = '98.4%';
        aqiCaption.innerHTML = '● <strong>XAI Diagnostics:</strong> Atmospheric pollutant telemetry within safe national ambient standards. Zero hazard alert.';
      } else if (pm25 <= 60) {
        aqiCategory.textContent = 'Satisfactory';
        aqiCategory.style.color = '#38bdf8';
        aqiLatency.textContent = '< 11.2 ms';
        aqiDriver.textContent = 'PM2.5 (45.8%)';
        aqiConfidence.textContent = '96.1%';
        aqiCaption.innerHTML = '● <strong>XAI Diagnostics:</strong> Minor particulate concentration. Sensitive groups advised to minimize prolonged outdoor exertion.';
      } else if (pm25 <= 120) {
        aqiCategory.textContent = 'Moderate';
        aqiCategory.style.color = '#f59e0b';
        aqiLatency.textContent = '< 12.4 ms';
        aqiDriver.textContent = 'PM2.5 (64.2%)';
        aqiConfidence.textContent = '94.8%';
        aqiCaption.innerHTML = '● <strong>XAI Diagnostics:</strong> Sub-index analysis identifies fine particulate matter (PM2.5) as the primary contributor to current atmospheric hazard level.';
      } else if (pm25 <= 250) {
        aqiCategory.textContent = 'Poor';
        aqiCategory.style.color = '#f97316';
        aqiLatency.textContent = '< 13.5 ms';
        aqiDriver.textContent = 'PM2.5 / NO2 (78.9%)';
        aqiConfidence.textContent = '97.2%';
        aqiCaption.innerHTML = '⚠️ <strong>XAI Diagnostics:</strong> Severe particulate saturation from combustion & traffic telemetry. Trigger automated IoT air scrubber alert.';
      } else {
        aqiCategory.textContent = 'Severe (Hazardous)';
        aqiCategory.style.color = '#ef4444';
        aqiLatency.textContent = '< 14.1 ms';
        aqiDriver.textContent = 'PM2.5 Dominant (89.4%)';
        aqiConfidence.textContent = '99.1%';
        aqiCaption.innerHTML = '🚨 <strong>XAI Diagnostics:</strong> Critical atmospheric emergency. Model predicts severe smog episode; high-confidence automated REST webhook dispatched.';
      }
    }

    if (aqiSlider) {
      aqiSlider.addEventListener('input', (e) => {
        updateAeroSenseSimulator(parseInt(e.target.value, 10));
      });
      updateAeroSenseSimulator(68); // default
    }

    // -------------------------------------------------------------------------
    // 7. WEED LTH MODEL COMPRESSION SIMULATOR
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
        const acc = (96.15 + (sparsity / 75) * 1.25).toFixed(2);
        metricAcc.textContent = `${acc}%`;
        metricAcc.style.color = 'var(--green)';
        metricTarget.textContent = 'Edge Robot (PiOS)';
        metricTarget.style.color = '#34d399';
        widgetCaption.innerHTML = `✓ <strong>Winning Ticket:</strong> Iterative pruning with original init matches/beats dense accuracy using only <strong>${100 - sparsity}% of weights</strong>.`;
      } else {
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
    // 8. EXPERIENCE SECTION - ACCESSIBLE WAI-ARIA TAB SWITCHER
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
      btn.addEventListener('click', () => {
        setActiveTab(index, false);
      });

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
    // 9. MOBILE DRAWER NAVIGATION & ACCESSIBILITY
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

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
          closeMobileMenu();
          menuToggle.focus();
        }
      });

      document.addEventListener('click', (e) => {
        if (mobileDrawer.classList.contains('open') && !mobileDrawer.contains(e.target) && e.target !== menuToggle) {
          closeMobileMenu();
        }
      });
    }

    // -------------------------------------------------------------------------
    // 10. AVATAR & CO-PILOT PHOTO TOGGLE
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
    // 11. COLOR PALETTE THEME SWITCHER (localStorage persistence)
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
    // 12. NAVBAR SCROLL ELEVATION (Throttled with requestAnimationFrame)
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
