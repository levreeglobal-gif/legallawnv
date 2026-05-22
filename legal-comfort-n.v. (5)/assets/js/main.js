/**
 * LEGAL COMFORT N.V. — MAIN JS CONTROLLER
 * Framework-free, ultra-performant, premium bilingual routing & interactive states.
 */

(function () {
  'use strict';

  // ── Language Localization Dictionary ──
  const locale_dict = {
    "en": {
      "seo-title": "Legal Comfort N.V. | Corporate & Civil Law Firm Paramaribo",
      "skip-to-main": "Skip to main content",
      "topbar-wa": "WhatsApp Direct",
      "topbar-hours": "Office Hours: Mon–Fri · 9:00–14:00",
      "logo-subtitle": "Law Firm · Paramaribo",
      "nav-home": "Home",
      "nav-about": "About",
      "nav-practice": "Practice Areas",
      "nav-method": "Methodology",
      "nav-contact": "Contact",
      "btn-intake": "Request Intake Advisory",
      "p-label": "CORE CAPABILITIES",
      "p-title": "Areas of Professional Specialization",
      "p-subtitle": "Our chambers combine regional mastery with strategic insight to represent entities in complex litigation, contracts, and civil disputes.",
      "p-advice": "Legal Advice",
      "p-advice-detail": "Analytical legal assessments, regulatory guidance, and strategic roadmaps tailored for corporate compliance and secure operations.",
      "p-family": "Family & Person Law",
      "p-family-detail": "Sensitive guidance for estate distributions, separation proceedings, parental authority, alimony, and comprehensive guardianship mandates.",
      "p-criminal": "Criminal Defense",
      "p-criminal-detail": "Vigorous, meticulous representation during regulatory investigations, criminal trials, and statutory appeal defenses.",
      "p-corporate": "Corporate Law",
      "p-corporate-detail": "Entity structuring, joint venture governance, international compliance protocols, shareholder frameworks, and restructuring.",
      "p-contract": "Contract Law",
      "p-contract-detail": "Precision execution of partnership agreements, commercial leases, risk mitigations, procurement records, and enforcement litigation.",
      "p-employment": "Employment Disputes",
      "p-employment-detail": "Employment agreements, dispute defense, union negotiations, statutory collective agreements, and termination compliance.",
      "p-inheritance": "Inheritance & Estates",
      "p-rental": "Lease & Rental Law",
      "p-property": "Property & Real Estate",
      "p-debt": "Debt Recovery Services",
      "p-ip": "Intellectual Property",
      "p-immigration": "Corporate Immigration",
      "ct-title": "Discreet Matter Scoping",
      "ct-body": "We maintain complete confidentiality while structuring standard intakes to clarify your legal vulnerability. Partner with advocates who respect your discretion.",
      "ab-label": "ESTABLISHED STANDARDS",
      "ab-title": "Professional Rigor. Total Transparency.",
      "ab-body": "Good advocacy is rooted in diligent fact-finding and strategic objectivity. Our chambers operate under uncompromised professional ethics to defend client stability. We explain legal situations honestly, providing paths of clarity amid complexity.",
      "val-intake": "Fact-Authoritative Intakes",
      "val-intake-body": "Every engagement begins with systematic review. We outline your exact statutory standing without administrative filter or soft metrics.",
      "val-discretion": "Discretionary Safeguards",
      "val-discretion-body": "Corporate positions, sensitive correspondence, and documents are preserved under absolute institutional security barriers.",
      "ab-quote": "\"Integrity is the bedrock of our practice. We defend client interests with strategic precision and clear objectivity.\"",
      "stat-areas": "Practice Areas",
      "stat-languages": "Active Dialects",
      "stat-agent": "Trade Registered",
      "stat-ded": "Fiduciary Duty",
      "m-label": "ADVISORY PROTOCOL",
      "m-title": "Our Structured Engagement Model",
      "m-subtitle": "We follow strict, standard legal workflows. This guarantees complete visual progress and cost visibility across every transaction phase.",
      "m-s1-title": "Systematic Case Intake",
      "m-s1-body": "Chamber intake meetings, client profiling, documentation collection, and immediate conflict-of-interest analysis.",
      "m-s2-title": "Written Order Definition",
      "m-s2-body": "Comprehensive service confirmation outlining tasks, timelines, standard fees, and rules to protect both parties from administrative drift.",
      "m-s3-title": "Retainer Escrow Activation",
      "m-s3-body": "Case actions, strategic filings, and institutional representation start immediately upon receipt of standard retainer activation.",
      "c-label": "REACH COUNSEL",
      "c-title": "Chambers & Location details",
      "c-subtitle": "Ensure your communication reaches our desk. Let us review your matter. Contact Legal Comfort N.V. directly or schedule a verified face-to-face consult.",
      "co-maps-btn": "Open in Google Maps",
      "f-name": "Your Full Name",
      "f-email": "Secure Email",
      "f-phone": "Telegram / WhatsApp Contact",
      "f-cat": "Core Jurisdiction",
      "f-msg": "Factual Case Overview",
      "f-submit": "Submit Inquiry File",
      "badge-registered": "Authorized Law Firm",
      "badge-bilingual": "Bilingual Service (EN/NL)",
      "badge-discreet": "Discreet & Confidential",
      "hc-title": "Secure Advisory Request",
      "label-address": "Office Address",
      "label-phone": "Phone Chambers",
      "hc-cta": "Engage WhatsApp Desk",
      "foot-tagline": "Progressive and secure Surinamese representation. Grounded advice, absolute discretion, and direct advocacy for individuals and organizations.",
      "foot-title-nav": "NAVIGATION",
      "foot-title-areas": "PRACTICE DOMAINS",
      "foot-title-chamber": "CHAMBERS",
      "wa-panel-status-txt": "Secure Office Connection Live",
      "wa-panel-desc": "We represent partners discreetly. Scan the QR code with your mobile camera to launch our secure WhatsApp chat instantly, or tap the button below.",
      "wa-qr-scan": "Scan for WhatsApp Link",
      "wa-panel-btn-txt": "Launch Chat Instantly",
      "cta-call": "Call",
      "cta-email": "Email",
      "cta-chat": "Chat",
      "toast-form-submitting": "Submitting securely...",
      "toast-form-success": "✓ Inquiry File Submitted!",
      "toast-form-error": "Submit Inquiry File",
      "f-date": "Preferred Appointment Date",
      "f-time": "Preferred Available Time Slot",
      "f-select-date-prompt": "-- Choose an available date first --"
    },
    "nl": {
      "seo-title": "Legal Comfort N.V. | Progressief Advocatenkantoor Paramaribo",
      "skip-to-main": "Sla door naar de hoofdinhoud",
      "topbar-wa": "Direct WhatsApp",
      "topbar-hours": "Kantoortijden: Ma–Vr · 9:00–14:00",
      "logo-subtitle": "Advocatenkantoor · Paramaribo",
      "nav-home": "Home",
      "nav-about": "Over Ons",
      "nav-practice": "Rechtsgebieden",
      "nav-method": "Werkwijze",
      "nav-contact": "Contact",
      "btn-intake": "Eerste Intake Aanvragen",
      "p-label": "RECHTSGEBIEDEN",
      "p-title": "Onze Rechtsgebieden",
      "p-subtitle": "Onze advocaten combineren grondige Surinaamse rechtskennis met strategisch inzicht om u bij te staan in geschillen, contracten en procedures.",
      "p-advice": "Juridisch Advies",
      "p-advice-detail": "Analytische juridische beoordeling, adviezen over regelgeving en strategische routekaarten om risico's betrouwbaar te minimaliseren.",
      "p-family": "Familie- & Personenrecht",
      "p-family-detail": "Zorgvuldige advisering en begeleiding bij echtscheidingen, voogdijvraagstukken, alimentatie en omvangrijke boedelafwikkelingen.",
      "p-criminal": "Strafrecht",
      "p-criminal-detail": "Krachtige en nauwgezette verdediging tijdens strafrechtelijke onderzoeken, rechtszittingen en administratieve beroepsprocedures.",
      "p-corporate": "Ondernemingsrecht",
      "p-corporate-detail": "Vennootschapsstructuren, joint venture-overeenkomsten, corporate governance, aandeelhoudersgeschillen en reorganisaties.",
      "p-contract": "Verbintenissenrecht",
      "p-contract-detail": "Opstellen en beoordelen van waterdichte handelscontracten, commerciële huurafspraken en risicoanalytische reviews.",
      "p-employment": "Arbeidsrecht",
      "p-employment-detail": "Arbeidsovereenkomsten, ontslagprocedures, CAO-onderhandelingen en advies bij complexe arbeidsrechtelijke geschillen.",
      "p-inheritance": "Erfrecht & Boedels",
      "p-rental": "Huurrecht & Lease",
      "p-property": "Vastgoedrecht",
      "p-debt": "Incassoprocedures",
      "p-ip": "Intellectueel Eigendom",
      "p-immigration": "Immigratierecht",
      "ct-title": "Vertrouwelijk Vooronderzoek",
      "ct-body": "Wij beschermen uw belangen met de hoogste zorg. Neem contact op om via een gestructureerde intake uw juridische situatie helder in kaart te brengen.",
      "ab-label": "OERDEGELIJKE STANDAARDEN",
      "ab-title": "Professionele Rigor. Volledige Transparantie.",
      "ab-body": "Goede belangenbehartiging begint met nauwgezette feitenanalyse en objectiviteit. Onze kantoren hanteren strenge ethische maatstaven om uw rechtspositie te beschermen. Wij communiceren eerlijk en direct.",
      "val-intake": "Feitelijke Intakes",
      "val-intake-body": "Elk dossier start met een grondige juridische evaluatie. Wij schetsen uw wettelijke positie direct en zonder omwegen.",
      "val-discretion": "Strikte Geheimhouding",
      "val-discretion-body": "Bedrijfsgegevens, gevoelige dossiers en correspondentie worden bewaard onder de hoogste standaarden van beroepsgeheim.",
      "ab-quote": "\"Integriteit is het fundament van onze praktijk. Wij verdedigen uw belangen met strategische precisie en absolute objectiviteit.\"",
      "stat-areas": "Rechtsgebieden",
      "stat-languages": "Talen (NL/EN)",
      "stat-agent": "K.K.F. Geregistreerd",
      "stat-ded": "Zorgvuldigheid",
      "m-label": "PROTOTYPISCH PROTOCOL",
      "m-title": "Onze Gestructureerde Werkwijze",
      "m-subtitle": "Wij hanteren een transparant stappenplan. Zo behoudt u gedurende elke fase van de procedure volledige controle over kosten en verloop.",
      "m-s1-title": "Systematische Dossier-Intake",
      "m-s1-body": "Kennismaking op ons kantoor, intakeformulieren, inventarisatie van bewijsstukken en directe check op mogelijke belangenverstrengeling.",
      "m-s2-title": "Schriftelijke Opdrachtbevestiging",
      "m-s2-body": "Een sluitende bevestiging waarin de afspraken, verwachte uren, tarieven en eventuele risicofactoren helder zijn vastgelegd.",
      "m-s3-title": "Activering na Voorschot",
      "m-s3-body": "Inhoudelijke werkzaamheden, grifferingsstappen en proceshandelingen starten onmiddellijk na de ontvangst van het afgesproken voorschottermijn.",
      "c-label": "NEEM CONTACT OP",
      "c-title": "Kantoor & Locatiegegevens",
      "c-subtitle": "Laat ons uw case beoordelen. Neem direct contact op met onze balie of plan een geverifieerd persoonlijk consult op kantoor.",
      "co-maps-btn": "Open in Google Maps",
      "f-name": "Uw Volledige Naam",
      "f-email": "Veilig E-mailadres",
      "f-phone": "Telefoon / WhatsApp Nummer",
      "f-cat": "Rechtsgebied",
      "f-msg": "Feitelijke Samenvatting van uw Case",
      "f-submit": "Verstuur Aanvraag",
      "badge-registered": "Geregistreerd Advocatenkantoor",
      "badge-bilingual": "Tweetalige Dienstverlening",
      "badge-discreet": "Discreet & Vertrouwelijk",
      "hc-title": "Direct Contact",
      "label-address": "Kantooradres",
      "label-phone": "Telefoon Kantoor",
      "hc-cta": "WhatsApp Balie Openen",
      "foot-tagline": "Progressieve en betrouwbare Surinaamse belangenbehartiging. Helder advies, discretie en daadkrachtig optreden voor burgers en bedrijven.",
      "foot-title-nav": "NAVIGATIE",
      "foot-title-areas": "RECHTSGEBIEDEN",
      "foot-title-chamber": "KANTOOR",
      "wa-panel-status-txt": "Kantoorbalie Verbinding Actief",
      "wa-panel-desc": "Wij behandelen aanvragen uiterst discreet. Scan de QR-code met de camera van uw mobiele telefoon om direct de WhatsApp chat te openen, of tik hieronder.",
      "wa-qr-scan": "Scan voor Direct Chat",
      "wa-panel-btn-txt": "Open WhatsApp Chat",
      "cta-call": "Bellen",
      "cta-email": "E-mail",
      "cta-chat": "Chat",
      "toast-form-submitting": "Veilig verzenden...",
      "toast-form-success": "✓ Bericht Succesvol Ingediend!",
      "toast-form-error": "Verstuur Aanvraag",
      "f-date": "Voorkeursdatum Afspraak",
      "f-time": "Beschikbaar Tijdstip",
      "f-select-date-prompt": "-- Kies eerst een beschikbare datum --"
    }
  };

  /**
   * Translates the page DOM dynamically according to selected locale
   * @param {string} lang_code - 'en' or 'nl'
   */
  function translatePage(lang_code) {
    if (!locale_dict[lang_code]) return;
    
    // Add dynamic transition effects
    document.body.style.opacity = '0.94';
    document.body.style.transform = 'translateY(2px)';
    document.body.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

    setTimeout(() => {
      // Loop elements with data-i18n
      const translateable = document.querySelectorAll('[data-i18n]');
      translateable.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = locale_dict[lang_code][key];
        
        if (translation) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.setAttribute('placeholder', translation);
          } else {
            // Respect any nested svg tags inside standard triggers or badges
            const iconSvg = el.querySelector('svg');
            if (iconSvg) {
              // Preserve vector, update text node only
              const textSpan = el.querySelector('span');
              if (textSpan) {
                textSpan.textContent = translation;
              } else {
                el.innerHTML = iconSvg.outerHTML + ` <span>${translation}</span>`;
              }
            } else {
              el.textContent = translation;
            }
          }
        }
      });

      // Update HTML attributes for SEO parity
      document.documentElement.lang = lang_code;
      
      // Keep lang toggle selected states
      document.querySelectorAll('.lang-btn, .footer-lang-btn').forEach(btn => {
        const targetLang = btn.getAttribute('data-lang');
        btn.classList.toggle('active', targetLang === lang_code);
      });

      // Smooth fade back in
      document.body.style.opacity = '1';
      document.body.style.transform = 'translateY(0)';
    }, 250);
  }

  // ── Global Language Toggles initialization ──
  function initLanguageSwitcher() {
    // Detect cached preference browser standard
    const savedLang = localStorage.getItem('lc_preferred_lang') || 'en';
    translatePage(savedLang);

    // Dynamic click triggers
    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-lang]');
      if (toggleBtn) {
        const newLang = toggleBtn.getAttribute('data-lang');
        localStorage.setItem('lc_preferred_lang', newLang);
        translatePage(newLang);
        
        // Auto shut mobile nav if active
        const burger = document.querySelector('.burger');
        const mobileNav = document.querySelector('.mobile-nav');
        if (burger && mobileNav && burger.classList.contains('open')) {
          burger.classList.remove('open');
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        }
      }
    });
  }

  // ── Sticky Header Elevation Scroll ──
  function initStickyHeader() {
    const stickyHeader = document.getElementById('sticky-header');
    if (stickyHeader) {
      window.addEventListener('scroll', () => {
        stickyHeader.classList.toggle('scrolled', window.scrollY > 15);
      }, { passive: true });
    }
  }

  // ── Mobile Drawer Slider ──
  function initMobileNav() {
    const burger = document.querySelector('.burger');
    const mobileNav = document.querySelector('.mobile-nav');
    const closeBtn = document.getElementById('mobile-nav-close');
    
    if (burger && mobileNav) {
      const toggleMenu = (forceState) => {
        const isOpened = typeof forceState === 'boolean' ? forceState : !burger.classList.contains('open');
        burger.classList.toggle('open', isOpened);
        mobileNav.classList.toggle('open', isOpened);
        document.body.classList.toggle('nav-open', isOpened);
        document.body.style.overflow = isOpened ? 'hidden' : '';
        burger.setAttribute('aria-expanded', isOpened);
      };

      burger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleMenu(false);
        });
      }

      // Prevent link trapping, close when navigation clicked
      mobileNav.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
          toggleMenu(false);
        }
      });
    }
  }

  // ── Scroll Reveal System (Intersection Observer) ──
  function initScrollAnimation() {
    try {
      const revealItems = document.querySelectorAll('.animate-on-scroll, .practice-card, .value-item, .method-step, .stat-box');
      
      if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              revealObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

        revealItems.forEach(item => {
          item.classList.add('animate-on-scroll');
          revealObserver.observe(item);
        });
      } else {
        // Fallback for older browsers
        revealItems.forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      }

      // ── ABSOLUTE FAIL-SAFE TIMER ──
      // Content MUST never remain hidden under any circumstances (such as layout shift or viewport lag)
      setTimeout(() => {
        revealItems.forEach(el => {
          if (!el.classList.contains('revealed')) {
            el.classList.add('revealed');
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }
        });
      }, 1500);

    } catch (e) {
      console.warn("Scroll animation initialization caught gracefully:", e);
      // Fail-safe layout recovery (immediately reveal all content)
      document.querySelectorAll('.animate-on-scroll, .practice-card, .value-item, .method-step, .stat-box').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }
  }

  // ── Interactive secure form validation ──
  function initFormController() {
    const formEl = document.querySelector('.contact-form-el');
    if (formEl) {
      // Create or locate the feedback element
      let feedback = formEl.querySelector('.form-feedback');
      if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'form-feedback';
        feedback.setAttribute('role', 'status');
        feedback.setAttribute('aria-live', 'polite');
        formEl.appendChild(feedback);
      }

      const dateInput = document.getElementById('client_date');
      const timeSelect = document.getElementById('client_time');

      if (dateInput && timeSelect) {
        // Automatically bound minimum selectable date to today
        const todayStr = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', todayStr);

        dateInput.addEventListener('change', async () => {
          const selectedDate = dateInput.value;
          if (!selectedDate) {
            timeSelect.disabled = true;
            timeSelect.innerHTML = `<option value="">-- Choose a date first --</option>`;
            return;
          }

          timeSelect.disabled = true;
          const activeLang = document.documentElement.lang || 'en';
          timeSelect.innerHTML = `<option value="">${activeLang === 'nl' ? 'Tijdstippen ophalen...' : 'Loading slots...'}</option>`;

          try {
            const res = await fetch(`/api/slots?date=${selectedDate}`);
            if (!res.ok) throw new Error('Failed to load slots');
            const data = await res.json();

            if (data.openSlots && data.openSlots.length > 0) {
              timeSelect.disabled = false;
              let optionsHtml = `<option value="">${activeLang === 'nl' ? '-- Kies een tijdstip --' : '-- Choose a time slot --'}</option>`;
              data.openSlots.forEach(slot => {
                optionsHtml += `<option value="${slot}">${slot} uur</option>`;
              });
              timeSelect.innerHTML = optionsHtml;
            } else {
              timeSelect.disabled = true;
              timeSelect.innerHTML = `<option value="">${activeLang === 'nl' ? 'Geen tijdstippen beschikbaar' : 'No available slots on this date'}</option>`;
            }
          } catch (err) {
            console.error("Error loading time slots:", err);
            timeSelect.disabled = true;
            timeSelect.innerHTML = `<option value="">${activeLang === 'nl' ? 'Fout bij laden tijdstippen' : 'Error loading slots'}</option>`;
          }
        });
      }

      formEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = formEl.querySelector('.form-submit');
        const activeLang = document.documentElement.lang || 'en';

        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = locale_dict[activeLang]["toast-form-submitting"];
        submitBtn.style.opacity = '0.75';

        feedback.className = 'form-feedback';
        feedback.textContent = '';
        feedback.style.display = 'none';

        const nameVal = document.getElementById('client_name')?.value;
        const emailVal = document.getElementById('client_email')?.value;
        const phoneVal = document.getElementById('client_phone')?.value;
        const catVal = document.getElementById('case_category')?.value;
        const dateVal = document.getElementById('client_date')?.value;
        const timeVal = document.getElementById('client_time')?.value;
        const msgVal = document.getElementById('client_message')?.value;
        const honeyVal = document.getElementById('form_honeypot')?.value;
 
        try {
          const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: nameVal,
              email: emailVal,
              phone: phoneVal,
              category: catVal,
              date: dateVal,
              time: timeVal,
              message: msgVal,
              honeypot: honeyVal
            })
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || 'Request failed.');
          }

          submitBtn.classList.remove('loading');
          submitBtn.textContent = locale_dict[activeLang]["toast-form-success"];
          submitBtn.style.background = '#81b045';
          submitBtn.style.color = '#ffffff';
          submitBtn.style.borderColor = '#81b045';
          submitBtn.style.opacity = '1';
 
          feedback.textContent = activeLang === 'nl'
            ? `✓ Intake-aanvraag succesvol ingediend voor ${dateVal} om ${timeVal} uur! Bevestiging is per e-mail naar u verzonden.`
            : `✓ Intake consult requested for ${dateVal} at ${timeVal}! Case file filed securely and confirmation e-mail dispatched.`;
          feedback.className = 'form-feedback success show';
          feedback.style.display = 'block';

          formEl.reset();
          if (timeSelect) {
            timeSelect.disabled = true;
            timeSelect.innerHTML = `<option value="">${activeLang === 'nl' ? '-- Kies eerst een datum --' : '-- Choose a date first --'}</option>`;
          }

          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.style.color = '';
            submitBtn.style.borderColor = '';
            submitBtn.disabled = false;
          }, 6000);

        } catch (err) {
          console.error("Booking submit error:", err);
          submitBtn.classList.remove('loading');
          submitBtn.textContent = locale_dict[activeLang]["toast-form-error"];
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.style.borderColor = '';
          submitBtn.style.opacity = '1';

          feedback.textContent = activeLang === 'nl'
            ? `⚠ Fout: ${err.message || 'Verzoek mislukt. Kies a.u.b. een ander tijdstip.'}`
            : `⚠ Error: ${err.message || 'Scheduling conflict. Please choose a different slot.'}`;
          feedback.className = 'form-feedback error show';
          feedback.style.display = 'block';
        }
      });
    }
  }

  // ── Premium Floating WhatsApp System with QR code ──
  function initWhatsAppWidget() {
    const triggerBtn = document.getElementById('wa-trigger');
    const closeBtn = document.getElementById('wa-close');
    const panelEl = document.getElementById('wa-panel');

    if (triggerBtn && panelEl && closeBtn) {
      // Toggle panel trigger
      triggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        panelEl.classList.toggle('open');
      });

      // Clear layout click close focus
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        panelEl.classList.remove('open');
      });

      // Click outside panel closes it
      document.addEventListener('click', (e) => {
        if (!panelEl.contains(e.target) && !triggerBtn.contains(e.target)) {
          panelEl.classList.remove('open');
        }
      });

      // Press Escape closes panel
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          panelEl.classList.remove('open');
        }
      });

      // Subtle dynamic attention action on load for high conversion
      setTimeout(() => {
        // Only open pane once on first load if screen is desktop size
        if (window.innerWidth > 1024 && !localStorage.getItem('wa_attention_shown')) {
          panelEl.classList.add('open');
          localStorage.setItem('wa_attention_shown', 'true');
        }
      }, 5000);
    }
  }

  // Hide map loader once iframe executes
  function initMapController() {
    const mapIframe = document.querySelector('.contact-map-card iframe');
    const mapPlaceholder = document.querySelector('.map-loading-placeholder');
    if (mapIframe && mapPlaceholder) {
      mapIframe.addEventListener('load', () => {
        mapPlaceholder.style.opacity = '0';
        setTimeout(() => mapPlaceholder.style.display = 'none', 500);
      });
    }
  }

  // ── SECURE ADMIN ROUTING ENGINE ──
  function checkRoute() {
    const isAdmin = window.location.pathname === '/admin' || window.location.hash === '#admin';
    const mainNode = document.getElementById('main');
    const headerNode = document.getElementById('sticky-header');
    const topbarNode = document.querySelector('.topbar');
    const footerNode = document.querySelector('.footer');
    const waWidgetNode = document.getElementById('wa-widget-container') || document.querySelector('.wa-widget');
    const adminRootNode = document.getElementById('admin-dashboard-root');

    if (isAdmin) {
      // Hide standard legal marketing page layers
      if (mainNode) mainNode.style.display = 'none';
      if (headerNode) headerNode.style.display = 'none';
      if (topbarNode) topbarNode.style.display = 'none';
      if (footerNode) footerNode.style.display = 'none';
      if (waWidgetNode) waWidgetNode.style.display = 'none';

      // Show admin container
      if (adminRootNode) {
        adminRootNode.style.display = 'block';
        renderAdminRoot(adminRootNode);
      }
    } else {
      // Restore standard website layout
      if (mainNode) mainNode.style.display = '';
      if (headerNode) headerNode.style.display = '';
      if (topbarNode) topbarNode.style.display = '';
      if (footerNode) footerNode.style.display = '';
      if (waWidgetNode) waWidgetNode.style.display = '';
      if (adminRootNode) {
        adminRootNode.style.display = 'none';
        adminRootNode.innerHTML = '';
      }
    }
  }

  async function renderAdminRoot(container) {
    const token = sessionStorage.getItem('lc_admin_token');
    if (!token) {
      renderAdminLogin(container);
    } else {
      await renderAdminDashboard(container, token);
    }
  }

  function renderAdminLogin(container) {
    container.innerHTML = `
      <div class="admin-login-wrapper">
        <div class="admin-login-card animate-fade-in">
          <div class="admin-login-head">
            <div class="admin-logo-badge">LC</div>
            <h2>Legal Comfort N.V.</h2>
            <p>Administrative Chambers Portal · Secured Access</p>
          </div>
          <form class="admin-login-form">
            <div class="login-feedback" style="display: none;"></div>
            <div class="admin-form-group">
              <label for="admin_email">Administrator Correspondence Email</label>
              <input type="email" id="admin_email" required placeholder="levreeglobal@gmail.com" autocomplete="username">
            </div>
            <div class="admin-form-group">
              <label for="admin_password">Access Security Key (Password)</label>
              <input type="password" id="admin_password" required placeholder="Paramaribo2026!" autocomplete="current-password">
            </div>
            <button type="submit" class="admin-login-btn">
              <span>Authenticate and Open Suite</span>
            </button>
            <div class="admin-login-footer">
              <a href="/">← Return to Chamber Website</a>
            </div>
          </form>
        </div>
      </div>
    `;

    const form = container.querySelector('.admin-login-form');
    const feedback = container.querySelector('.login-feedback');
    const btn = container.querySelector('.admin-login-btn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      feedback.style.display = 'none';
      feedback.className = 'login-feedback';
      feedback.textContent = '';
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-ring"></span> Authenticating...`;

      const email = document.getElementById('admin_email').value;
      const password = document.getElementById('admin_password').value;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Invalid credential pair.');
        }

        sessionStorage.setItem('lc_admin_token', data.token);
        sessionStorage.setItem('lc_admin_user', data.user.email);
        
        // Re-render
        renderAdminRoot(container);
      } catch (err) {
        console.error('Login failure:', err);
        feedback.textContent = err.message || 'Verification rejected.';
        feedback.className = 'login-feedback error';
        feedback.style.display = 'block';
        btn.disabled = false;
        btn.innerHTML = `<span>Authenticate and Open Suite</span>`;
      }
    });
  }

  async function renderAdminDashboard(container, token) {
    container.innerHTML = `
      <div class="admin-dashboard-container animate-fade-in">
        <header class="admin-dash-header">
          <div class="admin-header-title">
            <span class="dash-badge">SECURE SUITE</span>
            <h1>Legal Comfort N.V. <span class="header-light">Chambers Panel</span></h1>
          </div>
          <div class="admin-header-nav">
            <span class="admin-user-tag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              ${sessionStorage.getItem('lc_admin_user') || 'Administrator'}
            </span>
            <button class="dash-btn-secondary" id="admin-home-btn">Website</button>
            <button class="dash-btn-primary" id="admin-logout-btn">Log Out</button>
          </div>
        </header>

        <!-- Stats Section -->
        <div class="admin-stats-grid">
          <div class="stat-dash-card">
            <div class="stat-desc">TOTAL INTAKE DOSSIERS</div>
            <div class="stat-num" id="stat-total">0</div>
          </div>
          <div class="stat-dash-card">
            <div class="stat-desc">NEW UNREVIEWED APPLICATIONS</div>
            <div class="stat-num color-alert" id="stat-new">0</div>
          </div>
          <div class="stat-dash-card">
            <div class="stat-desc">SCHEDULED APPOINTMENTS</div>
            <div class="stat-num color-green" id="stat-scheduled">0</div>
          </div>
          <div class="stat-dash-card">
            <div class="stat-desc">BLOCKED HOLIDAYS</div>
            <div class="stat-num" id="stat-blocked">0</div>
          </div>
        </div>

        <div class="admin-workspace-cols">
          <!-- Col 1: Dossiers Management -->
          <div class="dash-col main-workspace">
            <div class="workspace-card">
              <div class="workspace-card-header">
                <h2>Clinical Intake Files Registry</h2>
                <div class="filter-toolbar">
                  <input type="text" id="dash-search-input" placeholder="Search client name or case overview...">
                  <select id="dash-status-filter">
                    <option value="">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Closed">Closed</option>
                    <option value="Archived">Archived</option>
                  </select>
                  <select id="dash-category-filter">
                    <option value="">All Practices</option>
                    <option value="corporate">Corporate</option>
                    <option value="civil">Civil Advice</option>
                    <option value="employment">Employment</option>
                    <option value="family">Family Law</option>
                    <option value="criminal">Criminal Defense</option>
                  </select>
                </div>
              </div>

              <div class="bookings-list-scrollable" id="bookings-registry-target">
                <div class="dash-loading-spin">
                  <span class="spinner-ring"></span> Loading dossiers from chambers secure vault...
                </div>
              </div>
            </div>
          </div>

          <!-- Col 2: Calendar Operating Matrix -->
          <div class="dash-col side-workspace">
            <div class="workspace-card">
              <div class="workspace-card-header">
                <h2>Availability Planner</h2>
              </div>
              <div class="setting-block">
                <h3>Block Specific Calendar Date</h3>
                <p class="setting-tip">Add national holidays or closed office days (prevents customer slot choice).</p>
                <div class="calendar-blocker-row">
                  <input type="date" id="block-date-input">
                  <button class="dash-btn-primary" id="btn-block-date">Block Date</button>
                </div>
                <div id="block-date-feedback" style="display: none; padding-top: 8px; font-size: 0.8rem;"></div>
              </div>

              <div class="setting-block">
                <h3>Blocked Dates Matrix</h3>
                <div class="blocked-dates-tags" id="blocked-dates-list-target">
                  <!-- Blocked dates tags will render here -->
                </div>
              </div>
              
              <div class="setting-block" style="border-bottom: none;">
                <h3>Standard Intake Hours</h3>
                <div class="working-hours-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" style="margin-right: 6px;"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  09:00 - 14:00 (Suriname Local Time)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Logout and navigation bindings
    container.querySelector('#admin-logout-btn').addEventListener('click', () => {
      sessionStorage.removeItem('lc_admin_token');
      sessionStorage.removeItem('lc_admin_user');
      window.location.hash = '';
      window.location.pathname = '/';
    });

    container.querySelector('#admin-home-btn').addEventListener('click', () => {
      window.location.hash = '';
      window.location.pathname = '/';
    });

    // Load data
    let bookingsList = [];
    let availabilityVal = { blocked_dates: [] };

    const loadData = async () => {
      const target = container.querySelector('#bookings-registry-target');
      const statsTotal = container.querySelector('#stat-total');
      const statsNew = container.querySelector('#stat-new');
      const statsScheduled = container.querySelector('#stat-scheduled');
      const statsBlocked = container.querySelector('#stat-blocked');
      const blockedListTarget = container.querySelector('#blocked-dates-list-target');

      try {
        // Fetch bookings
        const bRes = await fetch('/api/admin/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!bRes.ok) throw new Error('Unauthorized or fetch failed');
        bookingsList = await bRes.json();

        // Fetch availability
        const aRes = await fetch('/api/admin/availability', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!aRes.ok) throw new Error('Failed to load availability');
        availabilityVal = await aRes.json();

        // Calculate and render stats
        statsTotal.textContent = bookingsList.length;
        statsNew.textContent = bookingsList.filter(b => b.status === 'New').length;
        statsScheduled.textContent = bookingsList.filter(b => b.status === 'Scheduled').length;
        statsBlocked.textContent = availabilityVal.blocked_dates.length;

        // Render blocked dates tags
        renderBlockedDates(blockedListTarget, availabilityVal.blocked_dates);

        // Populate listings
        filterAndRenderBookings();

      } catch (err) {
        console.error("Dashboard population failed:", err);
        target.innerHTML = `<div class="dash-error-panel">🚨 Secure sync failure. Authentication may have expired. Please log out and authenticate again.</div>`;
      }
    };

    const renderBlockedDates = (parent, dates) => {
      if (!dates || dates.length === 0) {
        parent.innerHTML = `<span class="empty-list-tag">No dates are currently blocked.</span>`;
        return;
      }
      
      parent.innerHTML = '';
      dates.forEach(d => {
        const tag = document.createElement('div');
        tag.className = 'blocked-tag';
        tag.innerHTML = `
          <span>${d}</span>
          <button class="unblock-btn-trigger" data-date="${d}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="10" height="10"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        `;
        
        tag.querySelector('.unblock-btn-trigger').addEventListener('click', async (e) => {
          const dt = tag.querySelector('.unblock-btn-trigger').getAttribute('data-date');
          tag.querySelector('.unblock-btn-trigger').disabled = true;
          tag.querySelector('.unblock-btn-trigger').innerHTML = '...';
          
          const newDates = dates.filter(fd => fd !== dt);
          try {
            const upRes = await fetch('/api/admin/availability', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                blocked_dates: newDates,
                working_hours: { start: "09:00", end: "14:00" }
              })
            });
            if (!upRes.ok) throw new Error('Unblock date write rejected.');
            await loadData();
          } catch (error) {
            alert(error.message);
          }
        });

        parent.appendChild(tag);
      });
    };

    const filterAndRenderBookings = () => {
      const target = container.querySelector('#bookings-registry-target');
      const searchQ = container.querySelector('#dash-search-input').value.toLowerCase().trim();
      const statusF = container.querySelector('#dash-status-filter').value;
      const categoryF = container.querySelector('#dash-category-filter').value;

      const filtered = bookingsList.filter(b => {
        const matchesSearch = b.client_name.toLowerCase().includes(searchQ) || 
                              b.client_email.toLowerCase().includes(searchQ) || 
                              b.message.toLowerCase().includes(searchQ);
        const matchesStatus = !statusF || b.status === statusF;
        const matchesCategory = !categoryF || b.jurisdiction === categoryF;
        return matchesSearch && matchesStatus && matchesCategory;
      });

      if (filtered.length === 0) {
        target.innerHTML = `<div class="dash-empty-bookings">No administrative folders match the current filter matrix.</div>`;
        return;
      }

      target.innerHTML = '';
      filtered.forEach(b => {
        const card = document.createElement('div');
        card.className = `booking-dash-card status-border-${b.status.toLowerCase()}`;
        
        card.innerHTML = `
          <div class="b-card-head">
            <div class="b-id-block">
              <span class="category-indicator">${b.jurisdiction.toUpperCase()}</span>
              <span class="ref-num">REF: ${b.id.substring(0, 15)}</span>
            </div>
            <div class="b-status-selector-row">
              <select class="status-patch-select" data-id="${b.id}">
                <option value="New" ${b.status === 'New' ? 'selected' : ''}>New</option>
                <option value="Reviewed" ${b.status === 'Reviewed' ? 'selected' : ''}>Reviewed</option>
                <option value="Contacted" ${b.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                <option value="Scheduled" ${b.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                <option value="Closed" ${b.status === 'Closed' ? 'selected' : ''}>Closed</option>
                <option value="Archived" ${b.status === 'Archived' ? 'selected' : ''}>Archived</option>
              </select>
              <button class="delete-booking-btn" data-id="${b.id}" title="Expunge Dossier Profile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          </div>

          <div class="b-client-row">
            <div class="b-client text-lead">${b.client_name}</div>
            <div class="b-slots-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>${b.preferred_date} · ${b.preferred_time}</span>
            </div>
          </div>

          <div class="b-client-media">
            <span>📞 <a href="tel:${b.client_phone}">${b.client_phone}</a></span>
            <span style="margin-left: 14px;">✉ <a href="mailto:${b.client_email}">${b.client_email}</a></span>
          </div>

          <div class="b-case-desc">
            <strong>Matter Narrative:</strong> "${b.message}"
          </div>

          <div class="b-notes-section">
            <label>Legal Counsel Notes (Private Case Log)</label>
            <textarea class="notes-patch-text" placeholder="Compile specific strategy, procedural status or statutory guidelines...">${b.notes || ''}</textarea>
            <div class="notes-row-actions">
              <button class="notes-save-btn" data-id="${b.id}">Save Notes</button>
              <span class="notes-status-saved" style="display: none;">✓ Notes Registered</span>
            </div>
          </div>
        `;

        // Bind delete action
        card.querySelector('.delete-booking-btn').addEventListener('click', async () => {
          if (confirm("Are you sure you want to permanently delete this legal file? This action is irreversible.")) {
            try {
              const dRes = await fetch(`/api/admin/bookings/${b.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (!dRes.ok) throw new Error('Failed to delete dossier.');
              await loadData();
            } catch (err) {
              alert(err.message);
            }
          }
        });

        // Bind status patch selector
        card.querySelector('.status-patch-select').addEventListener('change', async (e) => {
          const newStatus = e.target.value;
          try {
            const pRes = await fetch(`/api/admin/bookings/${b.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ status: newStatus })
            });
            if (!pRes.ok) throw new Error('Status alteration rejected.');
            await loadData();
          } catch (err) {
            alert(err.message);
          }
        });

        // Bind save notes button
        card.querySelector('.notes-save-btn').addEventListener('click', async (e) => {
          const notesText = card.querySelector('.notes-patch-text').value;
          const statusText = card.querySelector('.notes-status-saved');
          const saveBtn = e.target;

          saveBtn.disabled = true;
          saveBtn.textContent = 'Saving...';
          statusText.style.display = 'none';

          try {
            const pRes = await fetch(`/api/admin/bookings/${b.id}/notes`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ notes: notesText })
            });
            if (!pRes.ok) throw new Error('Notes storage failed.');
            
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Notes';
            statusText.style.display = 'inline';
            setTimeout(() => { statusText.style.display = 'none'; }, 2000);
          } catch (err) {
            alert(err.message);
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Notes';
          }
        });

        target.appendChild(card);
      });
    };

    // Filter toolbar inputs listeners
    container.querySelector('#dash-search-input').addEventListener('input', filterAndRenderBookings);
    container.querySelector('#dash-status-filter').addEventListener('change', filterAndRenderBookings);
    container.querySelector('#dash-category-filter').addEventListener('change', filterAndRenderBookings);

    // Block Date Listener
    container.querySelector('#btn-block-date').addEventListener('click', async () => {
      const dtInput = container.querySelector('#block-date-input');
      const feedbackEl = container.querySelector('#block-date-feedback');
      const dt = dtInput.value;

      if (!dt) {
        feedbackEl.style.display = 'block';
        feedbackEl.style.color = '#ff6b6b';
        feedbackEl.textContent = 'Please select a valid date first.';
        return;
      }

      if (availabilityVal.blocked_dates.includes(dt)) {
        feedbackEl.style.display = 'block';
        feedbackEl.style.color = '#ff6b6b';
        feedbackEl.textContent = 'This date is already blocked in scheduling matrix.';
        return;
      }

      const upBlocked = [...availabilityVal.blocked_dates, dt];
      feedbackEl.style.display = 'none';

      try {
        const upRes = await fetch('/api/admin/availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            blocked_dates: upBlocked,
            working_hours: { start: "09:00", end: "14:00" }
          })
        });
        if (!upRes.ok) throw new Error('Filing blocked scheduling date rejected.');
        
        dtInput.value = '';
        await loadData();
      } catch (err) {
        feedbackEl.style.display = 'block';
        feedbackEl.style.color = '#ff6b6b';
        feedbackEl.textContent = err.message || 'Block action failed.';
      }
    });

    // Populate initially
    await loadData();
  }

  // ── App Init Loader ──
  document.addEventListener('DOMContentLoaded', () => {
    const modules = [
      { name: 'StickyHeader', fn: initStickyHeader },
      { name: 'MobileNav', fn: initMobileNav },
      { name: 'LanguageSwitcher', fn: initLanguageSwitcher },
      { name: 'ScrollAnimation', fn: initScrollAnimation },
      { name: 'FormController', fn: initFormController },
      { name: 'WhatsAppWidget', fn: initWhatsAppWidget },
      { name: 'MapController', fn: initMapController }
    ];

    modules.forEach(m => {
      try {
        m.fn();
      } catch (err) {
        console.error(`Error initializing module: ${m.name}`, err);
      }
    });
    
    // Register routing event triggers
    try {
      window.addEventListener('hashchange', checkRoute);
      window.addEventListener('popstate', checkRoute);
      checkRoute();
    } catch (routeErr) {
      console.error("Error setting up router:", routeErr);
    }
  });

})();
