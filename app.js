/**
 * vvEntra · Institutional Asset Exchange
 * Production Application Controller & State Engine
 */

(function () {
  'use strict';

  // ===================================================================
  // 1. STORAGE SERVICE
  // ===================================================================
  const StorageService = {
    get(key, fallback) {
      try {
        const item = localStorage.getItem(`vve_${key}`);
        return item ? JSON.parse(item) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(`vve_${key}`, JSON.stringify(value));
      } catch (e) {
        console.warn('Storage quota exceeded or storage disabled.', e);
      }
    }
  };

  // ===================================================================
  // 2. CENTRAL APPLICATION STATE
  // ===================================================================
  const State = {
    theme: StorageService.get('theme', 'light'),
    role: StorageService.get('role', 'investor'),
    activeAssetId: 'VVE-2440',
    calculatorValuation: 10000,
    bookmarks: StorageService.get('bookmarks', ['VVE-2440']),
    customAssets: StorageService.get('custom_assets', []),
    buyMandates: StorageService.get('buy_mandates', [
      {
        id: 'BM-1094',
        entity: 'Apex Horizon Capital (Institutional Syndicate)',
        budget: 100000,
        escrowReserve: 10000,
        sectors: ['RegTech & Compliance', 'Vertical AI Agents'],
        structure: 'cash',
        windowDays: 30,
        status: 'Active Registry Broadcast',
        timestamp: 'Just now',
        thesis: 'Seeking mid-market automated compliance workflows and vertical AI pipelines to roll up into existing industrial B2B portfolio. Full 90+ page documentation and pro-forma models mandatory.'
      }
    ]),
    activeFilter: 'all',
    searchQuery: '',
    dataRoomRevealed: false
  };

  // ===================================================================
  // 3. UTILITY FUNCTIONS
  // ===================================================================
  const DOM = {
    get: (selector, scope = document) => scope.querySelector(selector),
    getAll: (selector, scope = document) => Array.from(scope.querySelectorAll(selector))
  };

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }

  function showNotification(message) {
    const shelf = DOM.get('#toast-shelf');
    if (!shelf) return;

    const notification = document.createElement('div');
    notification.className = 'c-toast';
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `<span>✓</span><span>${message}</span>`;
    shelf.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(8px)';
      setTimeout(() => notification.remove(), 250);
    }, 3000);
  }

  // ===================================================================
  // 4. TRANSACTION & SETTLEMENT CONTROLLER (Verbatim from original platform)
  // ===================================================================
  const PricingController = {
    initialized: false,

    init() {
      const input = document.getElementById('calc-input');
      const slider = document.getElementById('calc-slider');
      const presets = document.querySelectorAll('.calc-preset');
      if (!input || !slider) return;

      function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

      function setText(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      }

      function update(val) {
        const v = parseInt(val) || 10000;
        const safe = Math.max(500, Math.min(1000000, v));
        const capped = safe > 50000;
        document.body.classList.toggle('is-capped', capped);

        const unlock = safe * 0.10;
        const remaining = safe - unlock;
        const opt1 = remaining;
        const opt2 = remaining * 0.70;
        const opt3 = remaining * 0.50;
        const arch_unlock = unlock * 0.90;
        const arch_opt1 = opt1 * 0.90;
        const arch_opt2 = opt2 * 0.90;
        const arch_opt3 = opt3 * 0.90;
        const arch_best = arch_unlock + arch_opt1;
        const buyer_opt1 = unlock + opt1;
        const buyer_opt2 = unlock + opt2;
        const buyer_opt3 = unlock + opt3;
        const arch_opt1_total = arch_unlock + arch_opt1;
        const arch_opt2_total = arch_unlock + arch_opt2;
        const arch_opt3_total = arch_unlock + arch_opt3;

        function disp(amount, pctOfListed) {
          if (capped) return pctOfListed + '%';
          return '$' + fmt(amount);
        }
        function dispListed() {
          if (capped) return '50K+';
          return '$' + fmt(safe);
        }

        // Calculator results
        setText('r-unlock', disp(unlock, '10'));
        setText('r-best', disp(arch_best, '90'));
        setText('r-opt1-b', disp(buyer_opt1, '100'));
        setText('r-opt2-b', disp(buyer_opt2, '70'));
        setText('r-opt3-b', disp(buyer_opt3, '50'));
        setText('r-opt1-a', disp(arch_opt1_total, '90'));
        setText('r-opt2-a', disp(arch_opt2_total, '63'));
        setText('r-opt3-a', disp(arch_opt3_total, '45'));

        // Option card footers
        setText('card1-buyer', disp(buyer_opt1, '100'));
        setText('card2-buyer', disp(buyer_opt2, '70'));
        setText('card3-buyer', disp(buyer_opt3, '50'));
        setText('card1-arch', disp(arch_opt1_total, '90'));
        setText('card2-arch', disp(arch_opt2_total, '63'));
        setText('card3-arch', disp(arch_opt3_total, '45'));

        // Based on price
        setText('based-on-price', dispListed());

        // Flow diagram buyer view
        setText('flow-buyer-unlock', disp(unlock, '10'));
        setText('flow-buyer-listed', dispListed());
        setText('flow-buyer-escrow', disp(unlock, '10'));
        setText('flow-buyer-min', disp(opt3, '50'));
        setText('flow-buyer-max', disp(opt1, '100'));

        // Flow diagram architect view
        setText('flow-arch-buyer', dispListed());
        setText('flow-arch-escrow', dispListed());
        setText('flow-arch-receive', disp(safe * 0.90, '90'));

        // Flow section header
        setText('flow-head-buyer', dispListed());
        setText('flow-head-arch', dispListed());

        // Calculator architect primary description
        setText('calc-arch-unlock-earn', disp(arch_unlock, '9'));
        setText('calc-arch-exec-earn', disp(arch_opt1, '81'));

        // Dispute scenarios
        const disputeCommission = remaining * 0.10;
        const disputeArchEarn = remaining * 0.90;
        const disputeWin60 = disputeArchEarn * 0.60;
        const disputeLose40 = disputeArchEarn * 0.40;

        setText('dispute-deal-amount', disp(remaining, '90'));
        setText('d1-comm', disp(disputeCommission, '9'));
        setText('d1-arch', disp(disputeArchEarn, '81'));
        setText('d1-total', dispListed());

        setText('d2-comm', disp(disputeCommission, '9'));
        setText('d2-refund', disp(disputeArchEarn, '81'));

        setText('d3-comm', disp(disputeCommission, '9'));
        setText('d3-buyer60', disp(disputeWin60, '49'));
        setText('d3-arch40', disp(disputeLose40, '32'));

        setText('d4-comm', disp(disputeCommission, '9'));
        setText('d4-arch60', disp(disputeWin60, '49'));
        setText('d4-buyer40', disp(disputeLose40, '32'));

        // Benefit cards
        setText('ben-buyer-unlock', disp(unlock, '10'));
        setText('ben-buyer-listed', dispListed());
        setText('ben-arch-listed', dispListed());
        setText('ben-arch-takehome', disp(safe * 0.90, '90'));
        setText('ben-arch-unlock-earn', disp(arch_unlock, '9'));

        // Slider sync
        if (safe <= 50000) {
          slider.value = safe;
        } else {
          slider.value = 50000;
        }
        presets.forEach(p => p.classList.toggle('active', parseInt(p.dataset.val) === safe));
      }

      this.update = update;

      if (!this.initialized) {
        input.addEventListener('input', e => update(e.target.value));
        slider.addEventListener('input', e => { input.value = e.target.value; update(e.target.value); });
        presets.forEach(p => {
          p.addEventListener('click', () => {
            input.value = p.dataset.val;
            update(p.dataset.val);
          });
        });

        // Rules accordion
        document.querySelectorAll('#page-pricing .rule-q').forEach(q => {
          q.addEventListener('click', () => {
            const item = q.parentElement;
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('#page-pricing .rule-item.open').forEach(i => i.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
          });
        });

        // Role toggle inside pricing hero
        const pricingRoleToggle = document.querySelector('#page-pricing #role-toggle');
        if (pricingRoleToggle) {
          pricingRoleToggle.querySelectorAll('.role-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              setPerspective(btn.dataset.role);
            });
          });
        }

        // Anchor smooth scrolls & CTAs
        document.querySelectorAll('#page-pricing a[href^="#"]').forEach(a => {
          const href = a.getAttribute('href');
          if (href === '#calculator' || href === '#flow') {
            a.addEventListener('click', (e) => {
              e.preventDefault();
              const el = document.querySelector(href);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
          } else if (href === '#home/cta') {
            a.addEventListener('click', (e) => {
              e.preventDefault();
              window.location.hash = State.role === 'architect' ? '#list' : '#browse';
            });
          }
        });

        // Reveal animations observer
        const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              revealObserver.unobserve(e.target);
            }
          });
        }, { threshold: 0.12 });

        this.observeReveals = () => {
          document.querySelectorAll('#page-pricing .reveal:not(.in)').forEach(el => revealObserver.observe(el));
          setTimeout(() => {
            document.querySelectorAll('#page-pricing .reveal:not(.in)').forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.top < window.innerHeight + 200) el.classList.add('in');
            });
          }, 200);
        };

        this.initialized = true;
      }

      update(input.value || 10000);
      if (this.observeReveals) this.observeReveals();
    },

    updateUI() {
      if (this.update) {
        const input = document.getElementById('calc-input');
        this.update(input ? input.value : 10000);
      } else {
        this.init();
      }
      if (this.observeReveals) this.observeReveals();
    }
  };

  const SettlementCalculator = PricingController;

  // ===================================================================
  // 5. ASSET REPOSITORY SERVICE
  // ===================================================================
  const AssetRepository = {
    getAll() {
      return [...State.customAssets, ...VVENTRA_DATA.opportunities];
    },

    getById(id) {
      return this.getAll().find(item => item.id === id) || VVENTRA_DATA.opportunities[0];
    },

    isBookmarked(id) {
      return State.bookmarks.includes(id);
    },

    toggleBookmark(id, event) {
      if (event) event.stopPropagation();
      const idx = State.bookmarks.indexOf(id);
      if (idx > -1) {
        State.bookmarks.splice(idx, 1);
        showNotification(`Asset ${id} removed from saved diligence list.`);
      } else {
        State.bookmarks.push(id);
        showNotification(`Asset ${id} added to saved diligence list.`);
      }
      StorageService.set('bookmarks', State.bookmarks);
      this.updateBookmarkCount();
      renderMarketplace();
      if (window.location.hash.startsWith('#overview')) renderFeaturedAssets();
    },

    updateBookmarkCount() {
      const badge = DOM.get('#saved-count');
      if (badge) badge.textContent = State.bookmarks.length;
    }
  };

  // ===================================================================
  // 6. THEME & PERSPECTIVE CONTROLLER
  // ===================================================================
  function setTheme(theme) {
    State.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    StorageService.set('theme', theme);
    const btn = DOM.get('#theme-toggle-btn');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function setPerspective(role, notify = true) {
    State.role = role;
    document.documentElement.setAttribute('data-role', role);
    StorageService.set('role', role);

    DOM.getAll('.c-role-switch__btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.role === role);
    });

    renderPerspectiveContent();
    renderDashboard();
    SettlementCalculator.updateUI();

    const wantedTab = role === 'architect' ? 'architect' : 'buyer';
    const wantedTabBtn = document.querySelector(`#page-faq .tab-btn[data-tab="${wantedTab}"]`);
    if (wantedTabBtn && !wantedTabBtn.classList.contains('active')) {
      wantedTabBtn.click();
    }

    if (notify) {
      showNotification(`Switched perspective to ${role === 'investor' ? 'Institutional Buyer' : 'Asset Operator / Seller'}`);
    }
  }

  function renderPerspectiveContent() {
    const isOperator = State.role === 'architect';

    const heroTitle = DOM.get('#hero-main-title');
    const heroSub = DOM.get('#hero-main-sub');
    const heroCta = DOM.get('#hero-main-cta');

    if (heroTitle) {
      heroTitle.innerHTML = isOperator
        ? `I have intelligence. I monetise the thinking.<br><em>Sell the thinking. Keep your operating life clean.</em>`
        : `Where execution-ready opportunities meet operators, investors, and founders who can build them.<br><em>Acquire opportunity. Deploy execution.</em>`;
    }

    if (heroSub) {
      heroSub.textContent = isOperator
        ? `A confidential network giving your strategic systems and operational intelligence a direct market. Real-time buyer demand signals. Staged disclosure. 90% direct payout upon escrow clearance.`
        : `Curated. Verified. Confidential by design. Minimum 90 pages of operational depth. Staged legal disclosures. Neutral banking escrow custody.`;
    }

    if (heroCta) {
      heroCta.textContent = isOperator ? 'List Opportunity Blueprint →' : 'Explore Opportunities (184) →';
      heroCta.href = isOperator ? '#list' : '#browse';
    }

    const signalBadge = DOM.get('#dash-signal-badge');
    const signalTitle = DOM.get('#dash-signal-title');
    const signalText = DOM.get('#dash-signal-text');
    const signalBtn = DOM.get('#dash-signal-btn');

    if (signalBadge && signalTitle && signalText && signalBtn) {
      if (isOperator) {
        signalBadge.textContent = 'Your build signal this week';
        signalTitle.textContent = 'RegTech Compliance for Mid-Market';
        signalText.textContent = 'Highest-value gap detected: buyer demand index 88, only 18 active listings, average unlock $6,200. If you can structure a 90+ page opportunity here, expected clear time is under 12 days.';
        signalBtn.textContent = 'List an Opportunity in this Category →';
        signalBtn.href = '#list';
      } else {
        signalBadge.textContent = 'Your thesis match this week';
        signalTitle.textContent = 'AI Vertical Workflow & B2B SaaS Mid-Market';
        signalText.textContent = 'Based on your interest: 14 new opportunities matched your filters. 3 are unlocked by peer PE buyers. 2 are in the surge zone with rising demand, clearing within 5 days.';
        signalBtn.textContent = 'Inspect Asset Specifications →';
        signalBtn.href = '#listing?id=VVE-2440';
      }
    }

    const kpi1 = DOM.get('#dash-kpi-1');
    const kpi2 = DOM.get('#dash-kpi-2');
    const kpi3 = DOM.get('#dash-kpi-3');
    const kpi4 = DOM.get('#dash-kpi-4');
    const kpi5 = DOM.get('#dash-kpi-5');
    const kpi6 = DOM.get('#dash-kpi-6');

    if (kpi1 && kpi2 && kpi3 && kpi4 && kpi5 && kpi6) {
      if (isOperator) {
        kpi1.textContent = '87';
        if (kpi1.previousElementSibling) kpi1.previousElementSibling.textContent = '● Buyers Online';
        kpi2.textContent = '312';
        if (kpi2.previousElementSibling) kpi2.previousElementSibling.textContent = '● Active Searches';
        kpi3.textContent = '42';
        if (kpi3.previousElementSibling) kpi3.previousElementSibling.textContent = 'New Mandates';
        kpi4.textContent = '$7,500';
        if (kpi4.previousElementSibling) kpi4.previousElementSibling.textContent = 'Top Sector Pay (Fintech)';
        kpi5.textContent = '+34%';
        if (kpi5.previousElementSibling) kpi5.previousElementSibling.textContent = 'Top Demand Gap';
        kpi6.textContent = '37';
        if (kpi6.previousElementSibling) kpi6.previousElementSibling.textContent = 'Deals Cleared';
      } else {
        kpi1.textContent = '184';
        if (kpi1.previousElementSibling) kpi1.previousElementSibling.textContent = '● Live Opportunities';
        kpi2.textContent = '87';
        if (kpi2.previousElementSibling) kpi2.previousElementSibling.textContent = '● Active Now';
        kpi3.textContent = '42';
        if (kpi3.previousElementSibling) kpi3.previousElementSibling.textContent = 'New This Week';
        kpi4.textContent = '72';
        if (kpi4.previousElementSibling) kpi4.previousElementSibling.textContent = 'Verified Architects';
        kpi5.textContent = '$5,800';
        if (kpi5.previousElementSibling) kpi5.previousElementSibling.textContent = 'Median Unlock Rate';
        kpi6.textContent = '37';
        if (kpi6.previousElementSibling) kpi6.previousElementSibling.textContent = 'Deals Closed (100% Escrow)';
      }
    }

    // Update Playbook role button state if rendered
    const pbInvBtn = DOM.get('#pb-role-investor');
    const pbArchBtn = DOM.get('#pb-role-architect');
    if (pbInvBtn && pbArchBtn) {
      pbInvBtn.classList.toggle('is-active', !isOperator);
      pbArchBtn.classList.toggle('is-active', isOperator);
    }

    // Update navigation link text for #list
    const navLinkList = DOM.get('#nav-link-list');
    if (navLinkList) {
      navLinkList.textContent = isOperator ? 'List Opportunity' : 'Post Buy Mandate';
    }
  }

  window.vveSetPerspective = function(role) {
    setPerspective(role);
  };


  // ===================================================================
  // 7. VIEW RENDERERS
  // ===================================================================
  function renderTickerTape() {
    const track = DOM.get('#ticker-content');
    if (!track) return;
    const assets = AssetRepository.getAll();
    const mandates = State.buyMandates || [];
    
    const assetItems = assets.slice(0, 8).map(a => `
      <div class="c-ticker__item">
        <strong>${a.id}</strong>
        <span>${a.title.slice(0, 32)}…</span>
        <span class="c-ticker__tag">${formatCurrency(a.escrowDeposit)} escrow deposit</span>
        <span>• Audit Score: ${a.trustRating}%</span>
      </div>
    `);

    const mandateItems = mandates.slice(0, 4).map(m => `
      <div class="c-ticker__item" style="border-left: 2px solid var(--color-brand-primary);">
        <strong style="color: var(--color-brand-primary);">${m.id || 'MANDATE'}</strong>
        <span>${m.entity || 'PE Principal'} · ${formatCurrency(m.budget)} Buy-Box</span>
        <span class="c-ticker__tag" style="background: rgba(226, 87, 27, 0.15); color: var(--color-brand-primary);">Active Mandate</span>
        <span>• 7d Close</span>
      </div>
    `);

    const combined = [...assetItems, ...mandateItems].join('');
    track.innerHTML = combined + combined;
  }

  function updateDashboardKPIs() {
    const customCount = (State.customAssets && State.customAssets.length) || 0;
    const mandateCount = (State.buyMandates && State.buyMandates.length) || 0;
    let extraCapital = 0;
    if (State.buyMandates) {
      State.buyMandates.forEach(m => {
        extraCapital += (Number(m.budget) || 100000);
      });
    }

    const kpi1 = DOM.get('#dash-kpi-1');
    const kpi2 = DOM.get('#dash-kpi-2');
    const kpi3 = DOM.get('#dash-kpi-3');
    const kpi4 = DOM.get('#dash-kpi-4');
    const kpi5 = DOM.get('#dash-kpi-5');
    const kpi6 = DOM.get('#dash-kpi-6');

    if (kpi1) kpi1.textContent = 184 + customCount;
    if (kpi2) kpi2.textContent = 87 + mandateCount * 2;
    if (kpi3) kpi3.textContent = 42 + mandateCount;
    if (kpi4) kpi4.textContent = formatCurrency(4850000 + extraCapital);
    if (kpi5) kpi5.textContent = formatCurrency(1420000 + Math.round(extraCapital * 0.1));
    if (kpi6) kpi6.textContent = 37;
  }

  function appendLiveTransaction(entry) {
    const feed = DOM.get('#dashboard-recent-feed');
    if (feed) {
      const item = document.createElement('div');
      item.className = 'c-feed-item';
      item.innerHTML = `
        <div class="c-feed-dot" style="background: var(--color-brand-primary); box-shadow: 0 0 8px var(--color-brand-primary);"></div>
        <div>${entry}</div>
      `;
      feed.insertBefore(item, feed.firstChild);
      if (feed.children.length > 6) {
        feed.removeChild(feed.lastChild);
      }
    }

    const dealStream = DOM.get('#streaming-deal-flow-list');
    if (dealStream) {
      const item = document.createElement('div');
      item.className = 'c-feed-item';
      item.innerHTML = `
        <span class="c-badge c-badge--primary" style="font-family: var(--font-family-mono);">LIVE</span>
        <div style="flex: 1; margin: 0 0.5rem;">
          <div style="font-weight: 600; font-size: 0.85rem;">${entry}</div>
          <div style="font-size: 0.74rem; color: var(--color-text-muted);">Verified Institutional Telemetry</div>
        </div>
        <strong style="font-family: var(--font-family-mono); color: var(--color-brand-primary);">Just now</strong>
      `;
      dealStream.insertBefore(item, dealStream.firstChild);
      if (dealStream.children.length > 6) {
        dealStream.removeChild(dealStream.lastChild);
      }
    }
  }

  function renderDashboardSummary() {
    const tbody = DOM.get('#overview-arbitrage-body');
    if (!tbody || !VVENTRA_DATA || !VVENTRA_DATA.sectors) return;
    const items = VVENTRA_DATA.sectors.slice(0, 5);
    tbody.innerHTML = items.map(s => {
      const industry = s.industry || s.category || 'General';
      const demand = s.buyerDemandIndex || 50;
      const listings = typeof s.availableListings !== 'undefined' ? s.availableListings : (s.architectSupplyCount || 0);
      const gap = s.marketGap || (s.arbitrageGap ? '+' + s.arbitrageGap : '+30');
      const val = s.medianUnlockValuation || s.avgUnlockPrice || '$5,000';
      return `
        <tr>
          <td>
            <div style="font-weight: 600;">${s.name}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-faint);">${industry}</div>
          </td>
          <td>
            <div class="c-bar-meter"><div class="c-bar-meter__fill" style="width: ${demand}%;"></div></div>
            <strong>${demand}</strong>
          </td>
          <td>
            <div class="c-bar-meter"><div class="c-bar-meter__fill" style="width: ${listings}%; background: var(--color-text-faint);"></div></div>
            <span>${listings}</span>
          </td>
          <td><span class="c-badge c-badge--success">${gap}</span></td>
          <td><strong>${val}</strong></td>
        </tr>
      `;
    }).join('');
  }

  function renderFeaturedAssets() {
    const grid = DOM.get('#overview-opps-grid');
    if (!grid) return;
    const assets = AssetRepository.getAll().slice(0, 3);
    grid.innerHTML = assets.map(createAssetCardMarkup).join('');
  }

  // ===================================================================
  // 4B. 4-QUADRANT ARBITRAGE MATRIX CONTROLLER
  // ===================================================================
  const QuadrantMatrixController = {
    selectedSectorId: 'sec-09', // CYBER-AUDIT (Highest gap by default)
    activeFilter: 'all',
    searchQuery: '',
    initialized: false,

    init() {
      if (this.initialized) return;
      const filterGroup = DOM.get('#matrix-filter-group');
      if (filterGroup) {
        filterGroup.querySelectorAll('.c-filter-chip').forEach(chip => {
          chip.addEventListener('click', () => {
            filterGroup.querySelectorAll('.c-filter-chip').forEach(c => c.classList.remove('is-active'));
            chip.classList.add('is-active');
            this.activeFilter = chip.dataset.quadFilter || 'all';
            this.renderNodes();
          });
        });
      }

      const searchInput = DOM.get('#matrix-sector-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.trim().toLowerCase();
          this.renderNodes();
        });
      }

      this.initialized = true;
      this.render();
    },

    render() {
      const svg = DOM.get('#quadrant-matrix-svg');
      if (!svg || !VVENTRA_DATA || !VVENTRA_DATA.sectors) return;

      this.renderCanvas(svg);
      this.renderNodes();
      this.renderSidebar();
    },

    renderCanvas(svg) {
      svg.innerHTML = `
        <defs>
          <radialGradient id="surgeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#D04A15" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="#D04A15" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#059669" stop-opacity="0.20"/>
            <stop offset="100%" stop-color="#059669" stop-opacity="0"/>
          </radialGradient>
          <filter id="nodeShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity="0.32"/>
          </filter>
        </defs>

        <!-- Quadrant 1: Top-Left (Arbitrage Surge) -->
        <rect x="90" y="40" width="500" height="258" fill="var(--color-bg-alt)" opacity="0.6"/>
        <rect x="90" y="40" width="500" height="258" fill="url(#surgeGlow)"/>
        
        <!-- Quadrant 2: Top-Right (Institutional Stars) -->
        <rect x="590" y="40" width="500" height="258" fill="var(--color-bg-surface)" opacity="0.75"/>
        <rect x="590" y="40" width="500" height="258" fill="url(#starGlow)"/>

        <!-- Quadrant 3: Bottom-Left (Emerging Niches) -->
        <rect x="90" y="298" width="500" height="257" fill="var(--color-bg-surface)" opacity="0.45"/>
        
        <!-- Quadrant 4: Bottom-Right (Saturated Liquidity) -->
        <rect x="590" y="298" width="500" height="257" fill="var(--color-bg-alt)" opacity="0.45"/>

        <!-- Subtle Background Gridlines -->
        <line x1="90" y1="169" x2="1090" y2="169" stroke="var(--color-border-subtle)" stroke-width="1" stroke-dasharray="2 4"/>
        <line x1="90" y1="426" x2="1090" y2="426" stroke="var(--color-border-subtle)" stroke-width="1" stroke-dasharray="2 4"/>
        <line x1="340" y1="40" x2="340" y2="555" stroke="var(--color-border-subtle)" stroke-width="1" stroke-dasharray="2 4"/>
        <line x1="840" y1="40" x2="840" y2="555" stroke="var(--color-border-subtle)" stroke-width="1" stroke-dasharray="2 4"/>

        <!-- Center Crosshair Dividing Lines -->
        <line x1="590" y1="40" x2="590" y2="555" stroke="var(--color-border-default)" stroke-width="2" stroke-dasharray="6 4"/>
        <line x1="90" y1="298" x2="1090" y2="298" stroke="var(--color-border-default)" stroke-width="2" stroke-dasharray="6 4"/>

        <!-- Prominent Quadrant Headers & Strategic Descriptions -->
        <g id="quad-labels">
          <!-- Top-Left -->
          <text x="106" y="66" font-size="13.5" font-weight="700" fill="var(--color-brand-primary)" letter-spacing="0.04em">⚡ ARBITRAGE SURGE (MAX SELLER LEVERAGE)</text>
          <text x="106" y="85" font-size="11" fill="var(--color-text-faint)" font-family="var(--font-family-mono)">High Demand (&gt;75) · Scarce Supply (&lt;25) · 12-Day Avg Clearing Velocity</text>

          <!-- Top-Right -->
          <text x="606" y="66" font-size="13.5" font-weight="700" fill="var(--color-success)" letter-spacing="0.04em">★ INSTITUTIONAL STARS (PE LIQUIDITY)</text>
          <text x="606" y="85" font-size="11" fill="var(--color-text-faint)" font-family="var(--font-family-mono)">High Demand (&gt;75) · Active Supply (≥25) · Liquid Institutional Deployment</text>

          <!-- Bottom-Left -->
          <text x="106" y="324" font-size="13.5" font-weight="700" fill="#2563EB" letter-spacing="0.04em">🌱 EMERGING NICHES (UNCONTESTED)</text>
          <text x="106" y="343" font-size="11" fill="var(--color-text-faint)" font-family="var(--font-family-mono)">Incubating Demand (≤75) · Low Competition (&lt;25) · High Organic Moats</text>

          <!-- Bottom-Right -->
          <text x="606" y="324" font-size="13.5" font-weight="700" fill="var(--color-text-muted)" letter-spacing="0.04em">⏳ SATURATED LIQUIDITY (BUYER LEVERAGE)</text>
          <text x="606" y="343" font-size="11" fill="var(--color-text-faint)" font-family="var(--font-family-mono)">Moderate Demand (≤75) · Heavy Competition (≥25) · Buyers Command Pricing</text>
        </g>

        <!-- Main Outer Axes -->
        <line x1="90" y1="555" x2="1090" y2="555" stroke="var(--color-border-strong)" stroke-width="1.75"/>
        <line x1="90" y1="40" x2="90" y2="555" stroke="var(--color-border-strong)" stroke-width="1.75"/>

        <!-- Axis Ticks & Scale Markers -->
        <text x="78" y="45" font-size="10.5" fill="var(--color-text-faint)" text-anchor="end" font-family="var(--font-family-mono)">100</text>
        <text x="78" y="302" font-size="10.5" fill="var(--color-text-faint)" text-anchor="end" font-family="var(--font-family-mono)">75 (Mid)</text>
        <text x="78" y="559" font-size="10.5" fill="var(--color-text-faint)" text-anchor="end" font-family="var(--font-family-mono)">50</text>

        <text x="90" y="575" font-size="10.5" fill="var(--color-text-faint)" text-anchor="middle" font-family="var(--font-family-mono)">10 (Scarce)</text>
        <text x="590" y="575" font-size="10.5" fill="var(--color-text-faint)" text-anchor="middle" font-family="var(--font-family-mono)">25 (Median Supply)</text>
        <text x="1090" y="575" font-size="10.5" fill="var(--color-text-faint)" text-anchor="middle" font-family="var(--font-family-mono)">40+ (Saturated)</text>

        <!-- Axis Titles -->
        <text x="590" y="608" font-size="11.5" font-weight="700" fill="var(--color-text-muted)" text-anchor="middle" font-family="var(--font-family-mono)">
          OPERATOR SUPPLY DEPTH (Active Listings & Competitor Blueprints) →
        </text>
        <text x="26" y="298" font-size="11.5" font-weight="700" fill="var(--color-text-muted)" text-anchor="middle" font-family="var(--font-family-mono)" transform="rotate(-90 26 298)">
          INSTITUTIONAL BUYER DEMAND INDEX (0 - 100) ↑
        </text>

        <!-- Node Layer Container -->
        <g id="quadrant-nodes-layer"></g>
      `;
    },

    renderNodes() {
      const layer = DOM.get('#quadrant-nodes-layer');
      if (!layer || !VVENTRA_DATA || !VVENTRA_DATA.sectors) return;

      const sectors = VVENTRA_DATA.sectors;
      const minSupply = 10, maxSupply = 40;
      const minDemand = 50, maxDemand = 100;
      const plotWidth = 1000, plotHeight = 515;
      const originX = 90, originY = 555;

      layer.innerHTML = sectors.map(s => {
        const supply = s.architectSupplyCount || 20;
        const demand = s.buyerDemandIndex || 70;

        const xNorm = Math.max(0, Math.min(1, (supply - minSupply) / (maxSupply - minSupply)));
        const x = originX + xNorm * plotWidth;

        const yNorm = Math.max(0, Math.min(1, (demand - minDemand) / (maxDemand - minDemand)));
        const y = originY - yNorm * plotHeight;

        const isSelected = s.id === this.selectedSectorId;
        const matchesSearch = !this.searchQuery || 
          (s.name && s.name.toLowerCase().includes(this.searchQuery)) || 
          (s.code && s.code.toLowerCase().includes(this.searchQuery));
        const matchesFilter = this.activeFilter === 'all' || 
          s.quadrant === this.activeFilter || 
          (this.activeFilter === 'niche' && (s.quadrant === 'niche' || s.quadrant === 'out_of_favor'));
        const isDimmed = !matchesSearch || !matchesFilter;

        let color = '#D04A15';
        if (s.quadrant === 'star') color = '#059669';
        else if (s.quadrant === 'niche' || s.quadrant === 'out_of_favor') color = '#2563EB';
        else if (s.quadrant === 'cash_cow' || s.quadrant === 'saturated') color = '#6B7280';

        // Enlarged bubble radius for institutional terminal clarity (12px to 22px)
        const radius = Math.min(22, Math.max(12, Math.round((s.arbitrageGap || 50) / 4.2)));

        return `
          <g class="c-quad-node ${isDimmed ? 'is-dimmed' : ''} ${isSelected ? 'is-focused' : ''}" 
             data-sector-id="${s.id}">
            <circle class="node-pulse" cx="${x}" cy="${y}" r="${radius + 8}" fill="${color}" opacity="${isSelected ? '0.32' : '0'}"/>
            <circle class="node-core" cx="${x}" cy="${y}" r="${radius}" fill="${color}" stroke="var(--color-bg-surface)" stroke-width="2.5" filter="url(#nodeShadow)"/>
            <text x="${x + radius + 7}" y="${y + 4}" font-size="12" font-weight="${isSelected ? '700' : '600'}" fill="${isDimmed ? 'var(--color-text-faint)' : 'var(--color-text-main)'}">
              ${s.name.split(' ')[0]} <tspan fill="${color}" font-weight="700">(+${s.arbitrageGap || 35})</tspan>
            </text>
          </g>
        `;
      }).join('');

      this.bindNodeEvents();
    },

    bindNodeEvents() {
      const tooltip = DOM.get('#quadrant-tooltip');
      const wrapper = DOM.get('#quadrant-chart-wrapper');

      document.querySelectorAll('.c-quad-node').forEach(node => {
        const id = node.dataset.sectorId;
        const sector = VVENTRA_DATA.sectors.find(s => s.id === id);
        if (!sector) return;

        node.addEventListener('mouseenter', () => {
          if (!tooltip || !wrapper) return;
          const rect = wrapper.getBoundingClientRect();
          const nodeRect = node.getBoundingClientRect();

          let left = nodeRect.left - rect.left + 20;
          let top = nodeRect.top - rect.top - 20;
          if (left + 290 > rect.width) left = left - 310;
          if (top + 180 > rect.height) top = rect.height - 190;

          const isSurge = sector.quadrant === 'surge';
          const badgeClass = isSurge ? 'c-badge--primary' : (sector.quadrant === 'star' ? 'c-badge--success' : 'c-badge--neutral');

          tooltip.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
              <div>
                <span class="c-badge ${badgeClass}" style="font-size: 0.68rem; margin-bottom: 2px;">${sector.code} · ${sector.category || 'Asset Class'}</span>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0; color: var(--color-text-main);">${sector.name}</h4>
              </div>
              <strong style="color: var(--color-brand-primary); font-family: var(--font-family-mono); font-size: 0.88rem;">+${sector.arbitrageGap} Gap</strong>
            </div>

            <div style="margin: 8px 0; padding: 6px 0; border-top: 1px solid var(--color-border-subtle); border-bottom: 1px solid var(--color-border-subtle); font-size: 0.76rem; font-family: var(--font-family-mono); display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
              <div>Demand: <strong>${sector.buyerDemandIndex} / 100</strong></div>
              <div>Supply: <strong>${sector.architectSupplyCount} Active</strong></div>
              <div>7d Growth: <strong style="color: var(--color-success);">${sector.growth7d}</strong></div>
              <div>Avg Value: <strong>${sector.avgUnlockPrice}</strong></div>
            </div>

            <div style="font-size: 0.72rem; color: var(--color-text-muted); line-height: 1.4;">
              ${isSurge ? '⚡ <strong>High Arbitrage:</strong> Instant clearing probability; creators command maximum pricing leverage.' : '★ <strong>High Liquidity:</strong> Active transaction throughput with deep private equity buy mandates.'}
            </div>
            <div style="margin-top: 8px; font-size: 0.72rem; color: var(--color-brand-primary); font-weight: 600;">
              Click node to inspect opportunities →
            </div>
          `;

          tooltip.style.left = `${left}px`;
          tooltip.style.top = `${top}px`;
          tooltip.style.display = 'block';
        });

        node.addEventListener('mouseleave', () => {
          if (tooltip) tooltip.style.display = 'none';
        });

        node.addEventListener('click', () => {
          this.selectSector(id);
        });
      });
    },

    renderSidebar() {
      const panel = DOM.get('#quadrant-sidebar-panel');
      if (!panel || !VVENTRA_DATA || !VVENTRA_DATA.sectors) return;

      const sector = VVENTRA_DATA.sectors.find(s => s.id === this.selectedSectorId) || VVENTRA_DATA.sectors[0];
      const isSurge = sector.quadrant === 'surge';

      const topGaps = [...VVENTRA_DATA.sectors].sort((a, b) => (b.arbitrageGap || 0) - (a.arbitrageGap || 0)).slice(0, 4);

      panel.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
            <span class="c-badge ${isSurge ? 'c-badge--primary' : 'c-badge--success'}">${sector.code} · ${sector.category}</span>
            <span style="font-size: 0.75rem; font-family: var(--font-family-mono); color: var(--color-text-faint);">Audit Confirmed</span>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem; color: var(--color-text-main);">${sector.name}</h3>
          <p style="font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">
            ${isSurge 
              ? 'Severe supply shortage relative to private equity search fund mandates. Listings in this category clear within 12 days.' 
              : 'Institutional scale category with sustained monthly capital deployment and standardized handover benchmarks.'}
          </p>

          <!-- 4 Telemetry Metrics -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div style="background: var(--color-bg-alt); padding: 0.75rem; border-radius: var(--radius-xs); border: 1px solid var(--color-border-subtle);">
              <div style="font-size: 0.68rem; font-family: var(--font-family-mono); color: var(--color-text-faint); text-transform: uppercase;">Demand Score</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: var(--color-brand-primary);">${sector.buyerDemandIndex} <span style="font-size: 0.75rem; color: var(--color-text-faint);">/ 100</span></div>
            </div>
            <div style="background: var(--color-bg-alt); padding: 0.75rem; border-radius: var(--radius-xs); border: 1px solid var(--color-border-subtle);">
              <div style="font-size: 0.68rem; font-family: var(--font-family-mono); color: var(--color-text-faint); text-transform: uppercase;">Active Supply</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: var(--color-text-main);">${sector.architectSupplyCount} <span style="font-size: 0.75rem; color: var(--color-text-faint);">listings</span></div>
            </div>
            <div style="background: var(--color-bg-alt); padding: 0.75rem; border-radius: var(--radius-xs); border: 1px solid var(--color-border-subtle);">
              <div style="font-size: 0.68rem; font-family: var(--font-family-mono); color: var(--color-text-faint); text-transform: uppercase;">Arbitrage Spread</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: var(--color-success);">+${sector.arbitrageGap} <span style="font-size: 0.75rem; color: var(--color-text-faint);">pts</span></div>
            </div>
            <div style="background: var(--color-bg-alt); padding: 0.75rem; border-radius: var(--radius-xs); border: 1px solid var(--color-border-subtle);">
              <div style="font-size: 0.68rem; font-family: var(--font-family-mono); color: var(--color-text-faint); text-transform: uppercase;">Avg Clear Time</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: var(--color-text-main);">${sector.avgClearDays || 12} <span style="font-size: 0.75rem; color: var(--color-text-faint);">days</span></div>
            </div>
          </div>

          <!-- Dual-Perspective Institutional CTAs -->
          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem;">
            <a href="#list" class="c-btn c-btn--primary c-btn--full" onclick="setPerspective('investor');">
              Post ${sector.name} Buy Mandate →
            </a>
            <a href="#list" class="c-btn c-btn--outline c-btn--full" onclick="setPerspective('architect');">
              List ${sector.name} Blueprint →
            </a>
            <a href="#browse" class="c-btn c-btn--secondary c-btn--full" style="font-size: 0.78rem;" onclick="State.activeFilter='all';">
              Inspect ${sector.name} Dossiers
            </a>
          </div>
        </div>

        <!-- Top Arbitrage Gaps Table List -->
        <div style="border-top: 1px solid var(--color-border-subtle); padding-top: 1rem;">
          <div style="font-size: 0.72rem; font-family: var(--font-family-mono); text-transform: uppercase; color: var(--color-text-faint); margin-bottom: 0.6rem;">
            Ranked Arbitrage Opportunities
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.4rem;">
            ${topGaps.map((g, idx) => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 0.6rem; border-radius: var(--radius-xs); background: ${g.id === this.selectedSectorId ? 'var(--color-brand-subtle)' : 'var(--color-bg-alt)'}; cursor: pointer;" onclick="QuadrantMatrixController.selectSector('${g.id}')">
                <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600;">
                  <span style="font-family: var(--font-family-mono); color: var(--color-text-faint); font-size: 0.7rem;">0${idx+1}</span>
                  ${g.name}
                </div>
                <strong style="color: var(--color-brand-primary); font-family: var(--font-family-mono); font-size: 0.78rem;">+${g.arbitrageGap}</strong>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    selectSector(id) {
      this.selectedSectorId = id;
      this.renderNodes();
      this.renderSidebar();

      const row = document.querySelector(`#dashboard-matrix-body tr[data-sector-id="${id}"]`);
      if (row) {
        document.querySelectorAll('#dashboard-matrix-body tr').forEach(r => r.classList.remove('is-active-row'));
        row.classList.add('is-active-row');
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };
  window.QuadrantMatrixController = QuadrantMatrixController;

  // ===================================================================
  // 4C. SECTOR INTELLIGENCE API (Live External Data Manager)
  // ===================================================================
  const SectorIntelligenceAPI = {
    source: 'benchmark',
    timer: null,
    initialized: false,

    init() {
      if (this.initialized) return;
      const btnOpen = DOM.get('#btn-open-api-modal');
      const backdrop = DOM.get('#api-modal-backdrop');
      const btnClose = DOM.get('#api-modal-close');
      const btnCancel = DOM.get('#api-modal-cancel');
      const btnSave = DOM.get('#api-modal-save');
      const btnSim = DOM.get('#btn-sim-ticks');

      const openModal = () => backdrop && backdrop.classList.add('is-open');
      const closeModal = () => backdrop && backdrop.classList.remove('is-open');

      if (btnOpen) btnOpen.addEventListener('click', openModal);
      if (btnClose) btnClose.addEventListener('click', closeModal);
      if (btnCancel) btnCancel.addEventListener('click', closeModal);

      if (btnSim) {
        btnSim.addEventListener('click', () => {
          this.toggleSimulation();
        });
      }

      if (btnSave) {
        btnSave.addEventListener('click', () => {
          const selected = document.querySelector('input[name="api-source-radio"]:checked');
          const customUrl = DOM.get('#api-custom-url-input');
          const val = selected ? selected.value : 'benchmark';
          this.applySource(val, customUrl ? customUrl.value.trim() : '');
          closeModal();
        });
      }

      this.initialized = true;
    },

    toggleSimulation() {
      if (this.source === 'simulation') {
        this.applySource('benchmark');
      } else {
        this.applySource('simulation');
      }
    },

    applySource(mode, customUrl = '') {
      this.source = mode;
      const badge = DOM.get('#matrix-api-badge');
      const btnSim = DOM.get('#btn-sim-ticks');

      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }

      if (mode === 'simulation') {
        if (badge) {
          badge.textContent = '● Live Tick Stream (Simulated)';
          badge.className = 'c-badge c-badge--primary';
        }
        if (btnSim) btnSim.textContent = '⏹ Stop Stream';

        showNotification('Live Simulation Active: Streaming authentic marketplace transaction activity.');

        const authenticEventGenerators = [
          () => {
            const s = VVENTRA_DATA.sectors[Math.floor(Math.random() * VVENTRA_DATA.sectors.length)];
            return `<strong>${s.name}:</strong> Private search fund placed ${formatCurrency(Math.floor(50 + Math.random() * 150) * 1000)} buy-box allocation (Spread: +${s.arbitrageGap})`;
          },
          () => {
            const id = 'VVE-' + (2420 + Math.floor(Math.random() * 25));
            return `<strong>${id}:</strong> Neutral escrow deposit committed; 7-day diligence window initiated`;
          },
          () => {
            const id = 'VVE-' + (2420 + Math.floor(Math.random() * 25));
            return `<strong>${id}:</strong> Complete 100-page SOP package passed Level-1 audit verification`;
          },
          () => {
            const s = VVENTRA_DATA.sectors[Math.floor(Math.random() * VVENTRA_DATA.sectors.length)];
            return `<strong>New Blueprint Listed:</strong> Audited operational framework registered in <em>${s.name}</em>`;
          },
          () => {
            const id = 'VVE-' + (2420 + Math.floor(Math.random() * 20));
            return `<strong>Settlement Cleared:</strong> 7-day inspection completed; wire released to architect on ${id}`;
          }
        ];

        this.timer = setInterval(() => {
          VVENTRA_DATA.sectors.forEach(s => {
            const delta = (Math.random() - 0.48) * 1.6;
            s.buyerDemandIndex = Math.min(99, Math.max(50, Math.round(s.buyerDemandIndex + delta)));
            s.arbitrageGap = Math.max(20, Math.round(s.buyerDemandIndex - (s.architectSupplyCount || 20) * 0.9));
          });

          // Stream an authentic marketplace transaction event
          const gen = authenticEventGenerators[Math.floor(Math.random() * authenticEventGenerators.length)];
          appendLiveTransaction(gen());
          renderTickerTape();
          updateDashboardKPIs();

          QuadrantMatrixController.renderNodes();
          QuadrantMatrixController.renderSidebar();
          const tbody = DOM.get('#dashboard-matrix-body');
          if (tbody) {
            tbody.querySelectorAll('tr').forEach(row => {
              const secId = row.dataset.sectorId;
              const s = VVENTRA_DATA.sectors.find(sec => sec.id === secId);
              if (s) {
                const fill = row.querySelector('.c-bar-meter__fill');
                const strong = row.querySelector('td:nth-child(2) strong');
                const gapBadge = row.querySelector('.c-badge');
                if (fill) fill.style.width = `${s.buyerDemandIndex}%`;
                if (strong) strong.textContent = s.buyerDemandIndex;
                if (gapBadge) gapBadge.textContent = `+${s.arbitrageGap}`;
              }
            });
          }
        }, 3400);

      } else if (mode === 'custom' && customUrl) {
        if (badge) {
          badge.textContent = 'Connecting...';
          badge.className = 'c-badge c-badge--neutral';
        }
        fetch(customUrl)
          .then(res => res.json())
          .then(() => {
            if (badge) {
              badge.textContent = '● External API Live (200 OK)';
              badge.className = 'c-badge c-badge--success';
            }
            showNotification(`Connected to external API: ${customUrl}`);
          })
          .catch(err => {
            if (badge) {
              badge.textContent = '● API Fallback (Calibrated Benchmark)';
              badge.className = 'c-badge c-badge--warning';
            }
            showNotification(`External API failed to load (${err.message}). Using calibrated benchmark.`);
          });
        if (btnSim) btnSim.textContent = '▶ Stream Live Ticks';
      } else {
        if (badge) {
          badge.textContent = '● Live Benchmark (14 Sectors)';
          badge.className = 'c-badge c-badge--success';
        }
        if (btnSim) btnSim.textContent = '▶ Stream Live Ticks';
        showNotification('Switched to vvEntra Calibrated Index.');
        QuadrantMatrixController.render();
        renderDashboard();
      }
    }
  };
  window.SectorIntelligenceAPI = SectorIntelligenceAPI;

  function renderDashboard() {
    updateDashboardKPIs();

    const tbody = DOM.get('#dashboard-matrix-body');
    if (!tbody || !VVENTRA_DATA || !VVENTRA_DATA.sectors) return;
    tbody.innerHTML = VVENTRA_DATA.sectors.map(s => {
      const industry = s.industry || s.category || 'General';
      const demand = s.buyerDemandIndex || 50;
      const listings = typeof s.availableListings !== 'undefined' ? s.availableListings : (s.architectSupplyCount || 0);
      const gap = s.marketGap || (s.arbitrageGap ? '+' + s.arbitrageGap : '+30');
      const change = String(s.trailing7dChange || s.growth7d || '+0%');
      const isPositive = change.startsWith('+');
      const val = s.medianUnlockValuation || s.avgUnlockPrice || '$5,000';
      const isSelected = s.id === QuadrantMatrixController.selectedSectorId;
      return `
        <tr data-sector-id="${s.id}" class="${isSelected ? 'is-active-row' : ''}" style="cursor: pointer;" onclick="QuadrantMatrixController.selectSector('${s.id}')">
          <td>
            <div style="font-weight: 600;">${s.name}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-faint);">${industry}</div>
          </td>
          <td>
            <div class="c-bar-meter"><div class="c-bar-meter__fill" style="width: ${demand}%;"></div></div>
            <strong>${demand}</strong>
          </td>
          <td>
            <div class="c-bar-meter"><div class="c-bar-meter__fill" style="width: ${listings * 2.5}%; background: var(--color-text-faint);"></div></div>
            <span>${listings}</span>
          </td>
          <td><span class="c-badge ${s.quadrant === 'surge' ? 'c-badge--primary' : 'c-badge--success'}">${gap}</span></td>
          <td><span style="font-family: var(--font-family-mono); font-weight: 600; color: ${isPositive ? 'var(--color-success)' : 'var(--color-danger)'};">${change}</span></td>
          <td><strong>${val}</strong></td>
        </tr>
      `;
    }).join('');

    QuadrantMatrixController.render();
  }

  function createAssetCardMarkup(asset) {
    const isSaved = AssetRepository.isBookmarked(asset.id);
    const industry = asset.industry || asset.sector || 'Opportunity';
    const summary = asset.summary || asset.publicPreviewThesis || '';
    const pageCount = asset.pageCount || (asset.documentationDepth && asset.documentationDepth.totalPages) || 90;
    const frameworkCount = asset.frameworkCount || (asset.documentationDepth && asset.documentationDepth.sopPages) || 12;
    const jurisdiction = (asset.targetJurisdiction || asset.geography || 'Global').split(',')[0];
    const valuation = asset.valuation || (asset.unlockPrice ? asset.unlockPrice * 10 : 50000);
    const deposit = asset.escrowDeposit || asset.unlockPrice || 5000;
    const trustRating = asset.trustRating || 99;

    return `
      <article class="c-asset-card">
        <div>
          <div class="c-asset-card__header">
            <span class="c-asset-card__id">${asset.id} · ${industry}</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button type="button" class="c-btn-bookmark ${isSaved ? 'is-bookmarked' : ''}" onclick="window.vveToggleBookmark('${asset.id}', event)" title="Save asset to shortlist">
                ${isSaved ? '★' : '☆'}
              </button>
              <span class="c-badge c-badge--success">★ ${trustRating}% Audit</span>
            </div>
          </div>
          <h3 class="c-asset-card__title">${asset.title}</h3>
          <p class="c-asset-card__summary">${summary}</p>
          <div class="c-asset-card__meta">
            <span>📄 ${pageCount} Pages</span>
            <span>⚡ ${frameworkCount} Frameworks</span>
            <span>📍 ${jurisdiction}</span>
          </div>
        </div>
        <div class="c-asset-card__footer">
          <div>
            <div class="c-asset-card__price-val">${formatCurrency(valuation)}</div>
            <div class="c-asset-card__deposit-val">10% Diligence Escrow: ${formatCurrency(deposit)}</div>
          </div>
          <a href="#listing?id=${asset.id}" class="c-btn c-btn--primary c-btn--sm">
            Review Asset Dossier →
          </a>
        </div>
      </article>
    `;
  }

  function renderMarketplace() {
    const grid = DOM.get('#marketplace-grid');
    const countEl = DOM.get('#marketplace-count');
    if (!grid) return;

    let items = AssetRepository.getAll();

    if (State.searchQuery) {
      const q = State.searchQuery.toLowerCase();
      items = items.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.industry.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (State.activeFilter === 'saved') {
      items = items.filter(a => AssetRepository.isBookmarked(a.id));
    } else if (State.activeFilter !== 'all') {
      items = items.filter(a => a.industry.toLowerCase() === State.activeFilter.toLowerCase() || a.tags.some(t => t.toLowerCase() === State.activeFilter.toLowerCase()));
    }

    if (countEl) {
      countEl.textContent = `${items.length} verified commercial ${items.length === 1 ? 'dossier' : 'dossiers'} found`;
    }

    if (items.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--color-bg-card); border-radius: var(--radius-lg); border: 1px solid var(--color-border-subtle);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">📄</div>
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.35rem;">No Asset Records Found</h3>
          <p style="color: var(--color-text-muted); font-size: 0.88rem;">Adjust your keyword parameters or reset filter chips.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = items.map(createAssetCardMarkup).join('');
  }

  function renderAssetDetail(assetId) {
    const asset = AssetRepository.getById(assetId);
    State.activeAssetId = asset.id;
    State.dataRoomRevealed = false;

    DOM.get('#listing-id-tag').textContent = `${asset.id} · ${asset.industry} · Status: ${asset.status}`;
    DOM.get('#listing-title').textContent = asset.title;
    DOM.get('#listing-hook').textContent = asset.summary;

    DOM.get('#listing-arch-name').textContent = asset.operator.name;
    DOM.get('#listing-arch-title').textContent = asset.operator.title;
    DOM.get('#listing-arch-exit').textContent = `Historical Transactions: ${asset.operator.historicalTransactions}`;

    DOM.get('#listing-price').textContent = formatCurrency(asset.valuation);
    DOM.get('#listing-unlock').textContent = `10% Diligence Escrow: ${formatCurrency(asset.escrowDeposit)}`;
    DOM.get('#listing-capital').textContent = asset.capitalRequirement;
    DOM.get('#listing-timeline').textContent = asset.implementationTimeline;
    DOM.get('#listing-geo').textContent = asset.targetJurisdiction;
    DOM.get('#listing-tam').textContent = asset.commercialParameters.addressableMarket;

    const visibleEl = DOM.get('#listing-thesis-visible');
    const blurredEl = DOM.get('#listing-thesis-blurred');
    const badgeEl = DOM.get('#listing-fee-badge');
    const revealBtn = DOM.get('#demo-unlock-btn');

    if (visibleEl) visibleEl.textContent = asset.executiveAbstract.slice(0, 160) + '…';
    if (blurredEl) {
      blurredEl.className = 'c-diligence-box__blurred';
      blurredEl.textContent = `${asset.operationalProblem} ${asset.solutionArchitecture} ${asset.commercialModel}`;
    }
    if (badgeEl) badgeEl.textContent = `🔒 ${formatCurrency(asset.escrowDeposit)} Escrow Required to Unlock ${asset.pageCount}-Page Specifications`;
    if (revealBtn) revealBtn.textContent = 'Preview Redacted Data Room';

    const ctaBtn = DOM.get('#listing-unlock-btn');
    if (ctaBtn) {
      ctaBtn.href = `#purchase?id=${asset.id}`;
      ctaBtn.textContent = `Initiate Diligence (${formatCurrency(asset.escrowDeposit)} in Escrow) →`;
    }

    renderDeliverablesList(asset.deliverablesPackage, false);
    renderStagedRevealProtocol(asset);
    renderEngagementPaths();
  }

  function renderDeliverablesList(docs, isRevealed) {
    const list = DOM.get('#listing-doc-list');
    if (!list) return;
    list.innerHTML = docs.map(doc => `
      <li class="c-doc-item">
        <span>📄 ${doc}</span>
        <span class="${isRevealed ? 'c-badge c-badge--success' : 'c-badge c-badge--neutral'}">
          ${isRevealed ? '✓ Access Authorized' : '🔒 Escrow Gated'}
        </span>
      </li>
    `).join('');
  }

  function toggleDataRoomPreview() {
    const asset = AssetRepository.getById(State.activeAssetId);
    const blurredEl = DOM.get('#listing-thesis-blurred');
    const badgeEl = DOM.get('#listing-fee-badge');
    const revealBtn = DOM.get('#demo-unlock-btn');

    State.dataRoomRevealed = !State.dataRoomRevealed;

    if (State.dataRoomRevealed) {
      if (blurredEl) blurredEl.classList.add('is-revealed');
      if (badgeEl) badgeEl.textContent = `🔓 Virtual Data Room Active · ${asset.pageCount} Pages Authorized`;
      if (revealBtn) revealBtn.textContent = 'Lock Data Room';
      renderDeliverablesList(asset.deliverablesPackage, true);
      showNotification('Diligence authorization active: Operational specifications unlocked for inspection.');
    } else {
      if (blurredEl) blurredEl.classList.remove('is-revealed');
      if (badgeEl) badgeEl.textContent = `🔒 ${formatCurrency(asset.escrowDeposit)} Escrow Required to Unlock ${asset.pageCount}-Page Specifications`;
      if (revealBtn) revealBtn.textContent = 'Preview Redacted Data Room';
      renderDeliverablesList(asset.deliverablesPackage, false);
      showNotification('Data Room reset to NDA-gated preview state.');
    }
  }

  // ===================================================================
  // 7B. THE STAGED REVEAL PROTOCOL CONTROLLER (Tiers 0 to 4)
  // ===================================================================
  let currentStagedData = null;
  let activeStagedStepIndex = 0;
  let isStagedSimulating = false;
  let selectedEngagementPathId = 'path-full';

  function renderStagedRevealProtocol(opportunity) {
    const grid = DOM.get('#handover-steps-grid');
    if (!grid) return;

    currentStagedData = VVENTRA_DATA.getStagedRevealProtocol(opportunity);
    if (!currentStagedData) return;

    activeStagedStepIndex = 0;
    renderStagedRevealSteps();
    renderStagedRevealInspector(currentStagedData.stages[activeStagedStepIndex], opportunity);
  }

  function renderStagedRevealSteps() {
    const grid = DOM.get('#handover-steps-grid');
    if (!grid || !currentStagedData) return;

    grid.innerHTML = currentStagedData.stages.map((stage, idx) => `
      <div class="c-handover-step ${idx === activeStagedStepIndex ? 'is-active' : ''} ${stage.statusCode === 'verified' ? 'is-verified' : ''}" 
           data-step-idx="${idx}" 
           onclick="window.vveSelectStagedStep(${idx})">
        <div class="c-handover-step__top">
          <span class="c-handover-step__num">${stage.tier}</span>
          <span class="c-handover-step__icon">${stage.icon}</span>
        </div>
        <div>
          <div class="c-handover-step__title">${stage.title}</div>
          <div class="c-handover-step__cat">${stage.cost}</div>
        </div>
        <div class="c-handover-step__badge ${stage.badgeClass}">
          ${stage.status}
        </div>
      </div>
    `).join('');
  }

  function renderStagedRevealInspector(stage, opportunity) {
    const inspector = DOM.get('#handover-inspector');
    if (!inspector || !stage) return;

    const checkpointsHtml = stage.checkpoints ? stage.checkpoints.map(cp => `
      <li class="c-handover-insp__check-item">
        <span class="c-handover-insp__check-icon">✓</span>
        <span>${cp}</span>
      </li>
    `).join('') : '';

    inspector.innerHTML = `
      <div class="c-handover-insp__header">
        <div class="c-handover-insp__title">${stage.tier} Protocol: ${stage.title} (${stage.cost})</div>
        <div class="c-handover-insp__metric">${stage.status}</div>
      </div>
      <div class="c-handover-insp__headline" style="margin-bottom: 0.75rem;">
        <strong>Visible Substance:</strong> ${stage.visibleSummary}
      </div>
      <div style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1rem; padding: 0.6rem 0.8rem; background: var(--color-bg-alt); border-radius: var(--radius-xs);">
        <strong>Protected / Locked at this tier:</strong> ${stage.lockedDetails}
      </div>
      <ul class="c-handover-insp__checklist">
        ${checkpointsHtml}
      </ul>
      <div class="c-handover-insp__artifact">
        <span>🔒 Structured Trust Gate:</span>
        <strong>Neutral Escrow Custody · Statutory 7-Day Inspection SLA</strong>
      </div>
    `;
  }

  window.vveSelectStagedStep = function(idx) {
    if (isStagedSimulating || !currentStagedData) return;
    activeStagedStepIndex = idx;
    const opp = AssetRepository.getById(State.activeAssetId);
    renderStagedRevealSteps();
    renderStagedRevealInspector(currentStagedData.stages[idx], opp);
  };

  function simulateStagedRevealSequence() {
    if (!currentStagedData) return;
    if (isStagedSimulating) return;

    const simBtn = DOM.get('#handover-sim-btn');
    if (simBtn && simBtn.textContent.includes('Reset')) {
      renderStagedRevealProtocol(AssetRepository.getById(State.activeAssetId));
      simBtn.textContent = '▶ Run Staged Reveal Simulation';
      return;
    }

    isStagedSimulating = true;
    if (simBtn) {
      simBtn.disabled = true;
      simBtn.textContent = '⏳ Simulating Progressive Unlock…';
    }

    const stages = currentStagedData.stages;
    let currentIdx = 0;
    const opp = AssetRepository.getById(State.activeAssetId);

    // Initial state before simulation
    stages[1].status = 'Verifying KYC Standing…';
    stages[1].badgeClass = 'c-badge--warning';
    stages[2].status = 'Awaiting Intent Deposit';
    stages[3].status = 'Bilateral NDA Locked';
    stages[4].status = 'Escrow Settlement Pending';
    renderStagedRevealSteps();

    const interval = setInterval(() => {
      if (currentIdx < stages.length) {
        activeStagedStepIndex = currentIdx;
        const currentStage = stages[currentIdx];
        currentStage.statusCode = 'verified';
        currentStage.badgeClass = 'c-badge--success';

        if (currentIdx === 0) {
          currentStage.status = '✓ Public Preview Active (Free)';
          if (stages[1]) {
            stages[1].status = 'Verifying KYC Credentials…';
            stages[1].badgeClass = 'c-badge--warning';
          }
        } else if (currentIdx === 1) {
          currentStage.status = '✓ KYC Verified · Thesis Unlocked';
          if (stages[2]) {
            stages[2].status = 'Depositing Intent Capital into Escrow…';
            stages[2].badgeClass = 'c-badge--warning';
          }
        } else if (currentIdx === 2) {
          currentStage.status = '✓ Intent Deposit in Escrow · Accepted';
          if (stages[3]) {
            stages[3].status = 'Signing Bilateral NDA…';
            stages[3].badgeClass = 'c-badge--warning';
          }
        } else if (currentIdx === 3) {
          currentStage.status = '✓ Mutual NDA Signed · 30% Unlocked';
          if (stages[4]) {
            stages[4].status = 'Transferring Full 90+ Page Package…';
            stages[4].badgeClass = 'c-badge--warning';
          }
        } else if (currentIdx === 4) {
          currentStage.status = `✓ Full 90+ Page Unlock · 90% Architect ($${currentStagedData.architectNet.toLocaleString()}) / 10% vvEntra ($${currentStagedData.platformFee.toLocaleString()})`;
        }

        renderStagedRevealSteps();
        renderStagedRevealInspector(currentStage, opp);
        currentIdx++;
      } else {
        clearInterval(interval);
        isStagedSimulating = false;
        if (simBtn) {
          simBtn.disabled = false;
          simBtn.textContent = '↺ Reset / Re-run Staged Simulation';
        }
        showNotification('Staged Reveal Complete: Escrow verified, NDA executed, 90+ page playbook unlocked, and 90/10 split ready for settlement.');
      }
    }, 1200);
  }

  // ===================================================================
  // 7C. THE 3 ENGAGEMENT PATHS CONTROLLER
  // ===================================================================
  function renderEngagementPaths(selectedId = selectedEngagementPathId) {
    const container = DOM.get('#listing-engagement-paths');
    if (!container) return;

    selectedEngagementPathId = selectedId;
    container.innerHTML = VVENTRA_DATA.engagementPaths.map(path => {
      const isSelected = path.id === selectedEngagementPathId;
      return `
        <div class="c-engagement-card ${isSelected ? 'is-selected' : ''}" 
             onclick="window.vveSelectEngagementPath('${path.id}')">
          <div>
            <div class="c-engagement-card__top">
              <span class="c-engagement-card__title">${path.title}</span>
              <span class="c-engagement-card__badge">${isSelected ? '● Selected' : 'Available'}</span>
            </div>
            <div style="font-size: 0.76rem; font-family: var(--font-family-mono); color: var(--color-brand-primary); margin-bottom: 0.4rem;">
              ${path.category}
            </div>
            <p class="c-engagement-card__desc">${path.description}</p>
          </div>
          <div class="c-engagement-card__pricing">
            <strong>Model:</strong> ${path.pricingModel}
          </div>
        </div>
      `;
    }).join('');
  }

  window.vveSelectEngagementPath = function(pathId) {
    renderEngagementPaths(pathId);
    const chosen = VVENTRA_DATA.engagementPaths.find(p => p.id === pathId);
    if (chosen) {
      showNotification(`Engagement model selected: ${chosen.title}`);
    }
  };

  // ===================================================================
  // ===================================================================
  // 7D. AUTHENTIC PAGE CONTROLLERS (Playbook, Trust, FAQ, Terms)
  // Verbatim interactive functionality from original vvEntra platform
  // ===================================================================
  const globalRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        globalRevealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.10 });

  function observePageReveals(scopeSelector) {
    const scope = document.querySelector(scopeSelector) || document;
    scope.querySelectorAll('.reveal:not(.in)').forEach(el => globalRevealObserver.observe(el));
    setTimeout(() => {
      scope.querySelectorAll('.reveal:not(.in)').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight + 250) el.classList.add('in');
      });
    }, 150);
  }

  let playbookInitialized = false;
  function initPlaybookPage() {
    const page = DOM.get('#page-playbook');
    if (!page) return;

    if (!playbookInitialized) {
      // Role toggle in hero
      const pbRoleToggle = page.querySelector('#role-toggle');
      if (pbRoleToggle) {
        pbRoleToggle.querySelectorAll('.role-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            setPerspective(btn.dataset.role);
          });
        });
      }

      // Progress nav tracking and smooth scroll
      const steps = page.querySelectorAll('.prog-step');
      const chapters = page.querySelectorAll('.chapter');

      function updateActiveStep() {
        let active = null;
        chapters.forEach(ch => {
          const r = ch.getBoundingClientRect();
          if (r.top < 250) active = ch.id;
        });
        steps.forEach(s => {
          s.classList.toggle('active', s.dataset.target === active);
        });
      }

      window.addEventListener('scroll', updateActiveStep, { passive: true });
      updateActiveStep();

      steps.forEach(s => {
        s.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.getElementById(s.dataset.target);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });

      playbookInitialized = true;
    }

    observePageReveals('#page-playbook');
  }

  let faqInitialized = false;
  function initFaqPage() {
    const page = DOM.get('#page-faq');
    if (!page) return;

    if (!faqInitialized) {
      // FAQ Accordion
      page.querySelectorAll('.faq-q').forEach(q => {
        q.addEventListener('click', () => {
          const item = q.parentElement;
          const wasOpen = item.classList.contains('open');
          page.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
          if (!wasOpen) item.classList.add('open');
        });
      });

      // Tab switcher
      const tabsWrap = DOM.get('#tabs-wrap');
      const tabBtns = page.querySelectorAll('.tab-btn');
      const tracks = {
        buyer: DOM.get('#track-buyer'),
        architect: DOM.get('#track-architect')
      };

      function updateFaqCount() {
        const activeTrack = page.querySelector('.faq-track.active');
        if (!activeTrack) return;
        const total = activeTrack.querySelectorAll('.faq-item').length;
        const countEl = DOM.get('#faq-count');
        if (countEl) countEl.textContent = `${total} questions`;
      }

      function runFaqSearch(query) {
        query = query.toLowerCase().trim();
        const activeTrack = page.querySelector('.faq-track.active');
        if (!activeTrack) return;
        const items = activeTrack.querySelectorAll('.faq-item');
        const categories = activeTrack.querySelectorAll('.faq-category');
        const noResults = DOM.get('#no-results');
        let matchCount = 0;

        if (!query) {
          items.forEach(item => item.style.display = '');
          categories.forEach(cat => cat.style.display = '');
          if (noResults) noResults.classList.remove('show');
          updateFaqCount();
          return;
        }

        items.forEach(item => {
          const qText = item.querySelector('.q-text')?.textContent.toLowerCase() || '';
          const aText = item.querySelector('.faq-a')?.textContent.toLowerCase() || '';
          if (qText.includes(query) || aText.includes(query)) {
            item.style.display = '';
            matchCount++;
          } else {
            item.style.display = 'none';
          }
        });

        categories.forEach(cat => {
          const visibleItems = cat.querySelectorAll('.faq-item:not([style*="display: none"])');
          cat.style.display = visibleItems.length === 0 ? 'none' : '';
        });

        if (noResults) {
          noResults.classList.toggle('show', matchCount === 0);
        }

        const countEl = DOM.get('#faq-count');
        if (countEl) {
          countEl.textContent = `${matchCount} ${matchCount === 1 ? 'question' : 'questions'}`;
        }
      }

      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (tabsWrap) tabsWrap.setAttribute('data-tab', target);
          Object.keys(tracks).forEach(k => {
            if (tracks[k]) tracks[k].classList.toggle('active', k === target);
          });
          page.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));

          const searchInput = DOM.get('#faq-search-input');
          if (searchInput && searchInput.value) {
            searchInput.value = '';
            runFaqSearch('');
          }
          updateFaqCount();

          const targetRole = target === 'buyer' ? 'investor' : 'architect';
          if (State.role !== targetRole) {
            setPerspective(targetRole);
          }
        });
      });

      const searchInput = DOM.get('#faq-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', e => runFaqSearch(e.target.value));
      }

      const liveChatLink = page.querySelector('#faq-livechat-link');
      if (liveChatLink) {
        liveChatLink.addEventListener('click', (e) => {
          e.preventDefault();
          showNotification('Live Concierge Desk: Active Mon-Sat 9am-9pm IST. Direct desk email: concierge@vventra.com');
        });
      }

      faqInitialized = true;
    }

    // Align active tab with current State.role
    const wantedTab = State.role === 'architect' ? 'architect' : 'buyer';
    const wantedBtn = page.querySelector(`.tab-btn[data-tab="${wantedTab}"]`);
    if (wantedBtn && !wantedBtn.classList.contains('active')) {
      wantedBtn.click();
    }

    observePageReveals('#page-faq');
  }

  function initTrustPage() {
    observePageReveals('#page-trust');
  }

  function initTermsPage() {
    observePageReveals('#page-terms');
  }

  function renderPlaybook() {
    initPlaybookPage();
  }

  function setupPlaybookControls() {
    initPlaybookPage();
  }

  // ===================================================================
  // 8. ASSET INTAKE & COMPOSER (Dual-Track Architecture)
  // ===================================================================

  // --- Track 1: Investor Capital Buy-Box & Acquisition Mandate Controller ---
  function setupInvestorBuyMandate() {
    const budgetInput = DOM.get('#mandate-budget');
    const escrowDisp = DOM.get('#mandate-escrow-disp');
    const matchBudgetDisp = DOM.get('#mandate-match-budget-disp');
    const matchCountEl = DOM.get('#mandate-match-count');
    const matchedStream = DOM.get('#mandate-matched-stream');
    const presets = DOM.getAll('#mandate-budget-presets button');
    const sectorChips = DOM.getAll('#mandate-sector-chips .c-sector-chip');
    const form = DOM.get('#mandate-form');
    const templateBtns = DOM.getAll('.c-thesis-templates button');
    const userMandatesList = DOM.get('#user-mandate-items');
    const userMandateCount = DOM.get('#user-mandate-count');
    const peerMandatesList = DOM.get('#peer-mandates-list');

    // Peer Institutional Mandates Sample Stream
    if (peerMandatesList) {
      const peerData = [
        { buyer: 'Apex Capital Partners', alloc: '$150,000', sector: 'RegTech & Compliance', time: '2h ago', req: 'Min 100p SOPs · 14d close' },
        { buyer: 'Beacon Ridge Studio', alloc: '$75,000', sector: 'Vertical AI Agents', time: '4h ago', req: 'Enterprise Pro-Forma · Python Repo' },
        { buyer: 'Vanguard Industrial Ops', alloc: '$250,000', sector: 'ClimateTech & Energy', time: '7h ago', req: 'EPA Pilot Logs · Full Carveout' },
        { buyer: 'Kestrel Search Syndicate', alloc: '$40,000', sector: 'Tier-2 SMB Fintech', time: '1d ago', req: 'Cash Flow Positive Frameworks' }
      ];
      peerMandatesList.innerHTML = peerData.map(p => `
        <div class="c-peer-mandate-item">
          <div class="c-peer-mandate-item__head">
            <span class="c-peer-mandate-item__buyer">${p.buyer}</span>
            <span class="c-peer-mandate-item__time">${p.time}</span>
          </div>
          <div class="c-peer-mandate-item__details">
            <strong style="color: var(--color-brand-primary);">${p.alloc}</strong> allocation in <em>${p.sector}</em>
            <div style="font-size: 0.72rem; color: var(--color-text-faint); margin-top: 2px;">Criteria: ${p.req}</div>
          </div>
        </div>
      `).join('');
    }

    function renderUserMandates() {
      if (!userMandatesList) return;
      if (userMandateCount) userMandateCount.textContent = State.buyMandates.length;
      if (State.buyMandates.length === 0) {
        userMandatesList.innerHTML = `<p style="font-size: 0.8rem; color: var(--color-text-faint); margin: 0.5rem 0;">No published buy-boxes yet. Complete the form to broadcast your mandate.</p>`;
        return;
      }
      userMandatesList.innerHTML = State.buyMandates.map((m) => `
        <div class="c-user-mandate-card">
          <div class="c-user-mandate-card__head">
            <span class="c-user-mandate-card__entity">${m.entity}</span>
            <span class="c-user-mandate-card__budget">${formatCurrency(m.budget)}</span>
          </div>
          <div style="font-size: 0.74rem; color: var(--color-text-muted); margin-bottom: 0.35rem;">
            Sectors: ${Array.isArray(m.sectors) ? m.sectors.join(', ') : m.sectors}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem;">
            <span class="c-badge c-badge--success" style="font-size: 0.65rem;">● ${m.status}</span>
            <span style="font-family: var(--font-family-mono); color: var(--color-text-faint);">${m.timestamp || 'Active'}</span>
          </div>
        </div>
      `).join('');
    }

    renderUserMandates();

    function getSelectedSectors() {
      return sectorChips.filter(c => c.classList.contains('is-selected')).map(c => c.dataset.sector);
    }

    function updateMandateMatches() {
      const budget = Number(budgetInput?.value) || 100000;
      const selectedSectors = getSelectedSectors();
      const allAssets = AssetRepository.getAll();

      // Find matching assets by sector and approximate budget
      const matches = allAssets.filter(a => {
        const sectorMatch = selectedSectors.some(s => 
          (a.industry && a.industry.toLowerCase().includes(s.toLowerCase())) ||
          (a.tags && a.tags.some(t => t.toLowerCase().includes(s.toLowerCase())))
        );
        return sectorMatch || a.valuation <= budget;
      });

      const displayList = matches.length > 0 ? matches.slice(0, 3) : allAssets.slice(0, 3);
      const estimatedMarketCount = Math.max(3, displayList.length * 4);

      if (matchCountEl) matchCountEl.textContent = estimatedMarketCount;
      if (matchBudgetDisp) matchBudgetDisp.textContent = formatCurrency(budget);
      if (escrowDisp) escrowDisp.textContent = `${formatCurrency(Math.round(budget * 0.1))} (10%)`;

      if (matchedStream) {
        matchedStream.innerHTML = displayList.map(asset => `
          <div class="c-matched-card">
            <div class="c-matched-card__header">
              <span class="c-matched-card__id">${asset.id}</span>
              <span class="c-badge c-badge--outline" style="font-size: 0.68rem;">${asset.industry || 'Direct Ingestion'}</span>
            </div>
            <h4 class="c-matched-card__title">${asset.title}</h4>
            <div class="c-matched-card__meta">
              <span class="c-matched-card__price">${formatCurrency(asset.valuation)}</span>
              <span style="font-size: 0.72rem; color: var(--color-text-faint);">Escrow: ${formatCurrency(asset.escrowDeposit || Math.round(asset.valuation * 0.1))}</span>
              <a href="#listing?id=${asset.id}" class="c-btn c-btn--outline c-btn--xs" style="text-decoration: none;">Inspect Blueprint →</a>
            </div>
          </div>
        `).join('');
      }
    }

    window.vveUpdateMandateMatches = updateMandateMatches;

    // Presets
    presets.forEach(btn => {
      btn.addEventListener('click', () => {
        presets.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        if (budgetInput) {
          budgetInput.value = btn.dataset.val;
          updateMandateMatches();
        }
      });
    });

    if (budgetInput) {
      budgetInput.addEventListener('input', () => {
        presets.forEach(b => {
          b.classList.toggle('is-active', b.dataset.val === budgetInput.value);
        });
        updateMandateMatches();
      });
    }

    // Sector Chips
    sectorChips.forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('is-selected');
        // keep at least one selected
        if (getSelectedSectors().length === 0) {
          chip.classList.add('is-selected');
        }
        updateMandateMatches();
      });
    });

    // Thesis Templates
    templateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tmpl = btn.dataset.template;
        const textarea = DOM.get('#mandate-thesis');
        if (!textarea) return;
        if (tmpl === 'rollup') {
          textarea.value = 'Seeking proven operational frameworks to roll up into our existing mid-market B2B portfolio. Require verified customer ICP workflows, regulatory audit templates, and sub-12 month payback models.';
        } else if (tmpl === 'cashflow') {
          textarea.value = 'Acquiring automated systems with high operating leverage. Seeking turnkey SOPs, validated unit gross margins >80%, and zero technical debt ready for operator takeover.';
        } else if (tmpl === 'ai') {
          textarea.value = 'Looking for vertical AI agent workflows with proprietary domain workflows in regulated sectors (OSHA, FDA, or cross-border VAT). Require full system architecture specs and pro-forma models.';
        }
        showNotification('Populated mandate deployment thesis template.');
      });
    });

    // Form submit
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const budget = Number(budgetInput?.value) || 100000;
        const sectors = getSelectedSectors();
        const niche = DOM.get('#mandate-niche')?.value.trim();
        const thesis = DOM.get('#mandate-thesis')?.value.trim();
        const entity = DOM.get('#mandate-entity')?.value.trim() || 'Private Equity Principal';
        const windowDays = DOM.get('#mandate-window')?.value || '30';
        const structureEl = form.querySelector('input[name="mandate_structure"]:checked');
        const structure = structureEl ? structureEl.value : 'cash';

        if (!thesis) {
          showNotification('Provide an acquisition thesis before broadcasting mandate.');
          return;
        }

        const newId = `BM-${Math.floor(1000 + Math.random() * 9000)}`;
        const newMandate = {
          id: newId,
          entity: entity,
          budget: budget,
          escrowReserve: Math.round(budget * 0.1),
          sectors: sectors,
          niche: niche,
          structure: structure,
          windowDays: windowDays,
          status: 'Active Registry Broadcast',
          timestamp: 'Just now',
          thesis: thesis
        };

        State.buyMandates.unshift(newMandate);
        StorageService.set('buy_mandates', State.buyMandates);
        renderUserMandates();

        // Dynamically reflect live mandate deployment in the market intelligence terminal:
        sectors.forEach(secName => {
          const match = VVENTRA_DATA.sectors.find(s => 
            s.name.toLowerCase().includes(secName.toLowerCase()) || 
            (s.category && s.category.toLowerCase().includes(secName.toLowerCase()))
          );
          if (match) {
            match.buyerDemandIndex = Math.min(99, match.buyerDemandIndex + 3);
            match.arbitrageGap = Math.max(20, Math.round(match.buyerDemandIndex - (match.architectSupplyCount || 20) * 0.9));
          }
        });

        appendLiveTransaction(`<strong>New Buy Mandate:</strong> ${entity} committed ${formatCurrency(budget)} capital for ${sectors.join(', ')}`);
        updateDashboardKPIs();
        renderTickerTape();
        QuadrantMatrixController.render();
        renderDashboard();

        showNotification(`Acquisition Mandate ${newId} published! 14 matching blueprints alerted confidentially.`);
      });
    }

    updateMandateMatches();
  }

  // --- Track 2: Architect Opportunity Intake & AI Co-Pilot Controller ---
  function setupAssetComposer() {
    const form = DOM.get('#composer-form');
    const priceInput = DOM.get('#comp-price');
    const escrowDisp = DOM.get('#comp-calc-escrow');
    const payoutDisp = DOM.get('#comp-calc-payout');
    const feeDisp = DOM.get('#comp-calc-fee');
    const prevTitle = DOM.get('#comp-prev-title');
    const prevLead = DOM.get('#comp-prev-lead');
    const prevUnlock = DOM.get('#comp-prev-unlock');

    const sampleBtn = DOM.get('#btn-load-sample-architect');
    const applyAiBtn = DOM.get('#btn-apply-ai-to-form');
    const aiOutputLabel = DOM.get('#ai-output-label');
    const aiOutputBody = DOM.get('#ai-output-body');
    const aiReadinessScore = DOM.get('#ai-readiness-score');
    const aiReadinessBar = DOM.get('#ai-readiness-bar');
    const aiPillarClarity = DOM.get('#ai-pillar-clarity');
    const aiPillarRedaction = DOM.get('#ai-pillar-redaction');
    const aiStatusBadge = DOM.get('#ai-status-badge');

    const btnPolishThesis = DOM.get('#btn-ai-polish-thesis');
    const btnFormatFinancials = DOM.get('#btn-ai-format-financials');
    const btnPreAudit = DOM.get('#btn-ai-preaudit');
    const btnRedactIp = DOM.get('#btn-ai-redact-ip');
    const toolBtns = [btnPolishThesis, btnFormatFinancials, btnPreAudit, btnRedactIp].filter(Boolean);

    function updateEscrowMath() {
      const price = Number(priceInput?.value) || 25000;
      const escrow = Math.round(price * 0.10);
      const payout = Math.round(price * 0.90);
      const fee = escrow;

      if (escrowDisp) escrowDisp.textContent = formatCurrency(escrow);
      if (payoutDisp) payoutDisp.textContent = formatCurrency(payout);
      if (feeDisp) feeDisp.textContent = formatCurrency(fee);
      if (prevUnlock) prevUnlock.textContent = `Diligence Escrow: ${formatCurrency(escrow)} (10%)`;
    }

    if (priceInput) {
      priceInput.addEventListener('input', updateEscrowMath);
    }
    updateEscrowMath();

    // Cache of AI polished texts
    const activeAiPolishData = {
      title: 'Institutional RegTech Pipeline: Automated Environmental & Safety Compliance Matrix',
      problem: 'US mid-market industrial manufacturing facilities face severe statutory penalty exposure under updated EPA/OSHA multi-jurisdiction mandates. Current compliance relies on fragmented spreadsheets and manual audit logs that fail 62% of surprise inspections, generating an estimated $340k in annual avoidable regulatory fines per plant cluster.',
      solution: 'End-to-end operational ingestion matrix: automated sensor telemetry log validation, immutably timestamped compliance audit trails, 14 complete Standard Operating Procedures (SOPs), and pre-built API connectors for Tier-1 ERP systems. Documented architecture enables turnkey operator handover in under 14 days without core team dependency.',
      economics: 'Addressable market of $2.4B across 14,000 mid-sized industrial facilities. Unit economics yield 84% gross margins with an average contract value (ACV) of $18,400. Buyer capital payback horizon calculated at 6.4 months post-handover.',
      persona: 'Mid-Market Private Equity Industrial Roll-up looking to add compliance SaaS gross margins to portfolio holding companies, or enterprise software operators seeking adjacent vertical expansion.'
    };

    // Load authentic sample draft
    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        const titleInput = DOM.get('#comp-title');
        const probInput = DOM.get('#comp-thesis-problem');
        const solInput = DOM.get('#comp-thesis-solution');
        const econInput = DOM.get('#comp-thesis-economics');
        const persInput = DOM.get('#comp-thesis-persona');
        const metricInput = DOM.get('#comp-proof-metric');

        if (titleInput) titleInput.value = 'Automated Regulatory Compliance Pipeline for Plant Operators';
        if (probInput) probInput.value = 'Plant managers are drowning in paper audits for EPA and OSHA. Inspections happen without warning and paper logs get lost, causing thousands in fines.';
        if (solInput) solInput.value = 'We built a 90 page step-by-step pipeline with sensors and checklist software. Everything is mapped out so any tech team can run it right away.';
        if (econInput) econInput.value = 'Market is about 14,000 factories. We charge around $18k a year and margins are over 80%. An owner gets their money back in about 6 months.';
        if (persInput) persInput.value = 'PE firms buying factories or software companies looking for a new product.';
        if (metricInput) metricInput.value = 'Tested across 4 industrial pilot sites; 0 audit citations across 180 consecutive operating days.';

        if (priceInput) priceInput.value = 35000;
        updateEscrowMath();

        if (prevTitle) prevTitle.textContent = 'Automated Regulatory Compliance Pipeline for Plant Operators';
        if (prevLead) prevLead.textContent = 'Sanitized Executive Abstract: "Plant managers are drowning in paper audits for EPA and OSHA. Step-by-step pipeline with 14 SOPs ready for handover."';

        if (aiReadinessScore) aiReadinessScore.textContent = '74 / 100';
        if (aiReadinessBar) aiReadinessBar.style.width = '74%';
        if (aiPillarClarity) {
          aiPillarClarity.textContent = '○ Clarity: Needs Polish';
          aiPillarClarity.classList.remove('is-pass');
        }

        showNotification('Sample raw draft loaded. Click "Polish Executive Thesis" to transform it into institutional PE grade.');
        triggerAiTool('thesis');
      });
    }

    function triggerAiTool(mode) {
      toolBtns.forEach(b => b.classList.remove('is-active'));
      if (aiStatusBadge) {
        aiStatusBadge.textContent = '● Neural Polishing...';
        aiStatusBadge.className = 'c-badge c-badge--warning';
      }

      setTimeout(() => {
        if (aiStatusBadge) {
          aiStatusBadge.textContent = '● Institutional Grade';
          aiStatusBadge.className = 'c-badge c-badge--success';
        }
      }, 500);

      if (mode === 'thesis') {
        if (btnPolishThesis) btnPolishThesis.classList.add('is-active');
        if (aiOutputLabel) aiOutputLabel.textContent = '✨ Institutional Executive Memorandum';
        if (aiOutputBody) {
          aiOutputBody.innerHTML = `
            <div class="c-ai-stream-text">
              <strong>EXECUTIVE MEMORANDUM · INVESTMENT COMMITTEE SUMMARY</strong><br><br>
              <strong>1. Structural Asymmetry:</strong><br>
              ${activeAiPolishData.problem}<br><br>
              <strong>2. Architectural Deliverables:</strong><br>
              ${activeAiPolishData.solution}<br><br>
              <strong>3. Strategic Buyer Fit:</strong><br>
              ${activeAiPolishData.persona}
            </div>
          `;
        }
        if (aiReadinessScore) aiReadinessScore.textContent = '96 / 100';
        if (aiReadinessBar) aiReadinessBar.style.width = '96%';
        if (aiPillarClarity) {
          aiPillarClarity.textContent = '✓ Clarity: PE-Grade';
          aiPillarClarity.classList.add('is-pass');
        }
      } else if (mode === 'financials') {
        if (btnFormatFinancials) btnFormatFinancials.classList.add('is-active');
        if (aiOutputLabel) aiOutputLabel.textContent = '📊 Formatted Financial Pro-Forma & Margins';
        const price = Number(priceInput?.value) || 35000;
        if (aiOutputBody) {
          aiOutputBody.innerHTML = `
            <div class="c-ai-stream-text">
              <strong>STRUCTURED FINANCIAL RETURN PROFILE</strong><br><br>
              ● <strong>Total Addressable Market (TAM):</strong> $2.4B (14,000 verified industrial facilities)<br>
              ● <strong>Average Contract Value (ACV):</strong> $18,400 / annual recurring enterprise contract<br>
              ● <strong>Gross Margin Profile:</strong> 84% (software delivery & data ingestion)<br>
              ● <strong>Capital Payback Timeline:</strong> 6.4 Months post-closing<br>
              ● <strong>Asset Acquisition Valuation:</strong> ${formatCurrency(price)}<br>
              ● <strong>Statutory Escrow Unlock:</strong> ${formatCurrency(Math.round(price * 0.1))} (10% neutral custody)<br>
              ● <strong>Net Architect Settlement:</strong> ${formatCurrency(Math.round(price * 0.9))} (90% wire on day 7)
            </div>
          `;
        }
      } else if (mode === 'preaudit') {
        if (btnPreAudit) btnPreAudit.classList.add('is-active');
        if (aiOutputLabel) aiOutputLabel.textContent = '🛡️ Red-Flag Pre-Audit Diligence Result';
        if (aiOutputBody) {
          aiOutputBody.innerHTML = `
            <div class="c-ai-stream-text">
              <strong>INVESTMENT COMMITTEE RED-FLAG AUDIT: PASSED (0 Critical)</strong><br><br>
              ✓ <strong>Documentation Threshold:</strong> 90+ Pages verified (Includes 14 SOPs and 3-statement model)<br>
              ✓ <strong>Handover Independence:</strong> System contains explicit vendor transition protocols<br>
              ✓ <strong>Legal Governance:</strong> Structured for bilateral NDA and 7-day statutory escrow custody<br>
              ✓ <strong>Advisory Warranty:</strong> 15 hours dedicated architect transition included<br>
              ⚠️ <em>Minor Advisory:</em> Ensure customer pilot NDA does not disclose factory names before bilateral escrow execution.
            </div>
          `;
        }
      } else if (mode === 'redact') {
        if (btnRedactIp) btnRedactIp.classList.add('is-active');
        if (aiOutputLabel) aiOutputLabel.textContent = '🔒 Sanitized Public Teaser & NDA Shield';
        if (aiOutputBody) {
          aiOutputBody.innerHTML = `
            <div class="c-ai-stream-text">
              <strong>PUBLIC MARKETPLACE TEASER (NDA-PROTECTED PREVIEW)</strong><br><br>
              <strong>Asset:</strong> Automated Regulatory Compliance Pipeline for Plant Operators<br>
              <strong>Scope:</strong> Turnkey compliance automation for industrial manufacturers facing updated EPA/OSHA audit mandates. Includes complete customer ICP, operational data schema, and land-and-expand commercial model.<br><br>
              <div style="background: var(--color-bg-alt); padding: 0.6rem; border-radius: 4px; font-size: 0.78rem;">
                <strong>Proprietary Identifiers Masked:</strong><br>
                [REDACTED: Factory Cohort Client List], [REDACTED: Direct GitHub Repository URL], and [REDACTED: Pricing API Keys] remain gated in secure Data Room until 10% escrow deposit.
              </div>
            </div>
          `;
        }
        if (aiPillarRedaction) {
          aiPillarRedaction.textContent = '✓ NDA Redacted (Shielded)';
          aiPillarRedaction.classList.add('is-pass');
        }
        if (prevLead) {
          prevLead.textContent = 'Sanitized Executive Abstract: "Turnkey compliance automation for industrial manufacturers facing updated EPA/OSHA audit mandates. Proprietary schemas NDA-gated."';
        }
      }
    }

    if (btnPolishThesis) btnPolishThesis.addEventListener('click', () => triggerAiTool('thesis'));
    if (btnFormatFinancials) btnFormatFinancials.addEventListener('click', () => triggerAiTool('financials'));
    if (btnPreAudit) btnPreAudit.addEventListener('click', () => triggerAiTool('preaudit'));
    if (btnRedactIp) btnRedactIp.addEventListener('click', () => triggerAiTool('redact'));

    // Apply AI to form
    if (applyAiBtn) {
      applyAiBtn.addEventListener('click', () => {
        const titleInput = DOM.get('#comp-title');
        const probInput = DOM.get('#comp-thesis-problem');
        const solInput = DOM.get('#comp-thesis-solution');
        const econInput = DOM.get('#comp-thesis-economics');
        const persInput = DOM.get('#comp-thesis-persona');

        if (titleInput) titleInput.value = activeAiPolishData.title;
        if (probInput) probInput.value = activeAiPolishData.problem;
        if (solInput) solInput.value = activeAiPolishData.solution;
        if (econInput) econInput.value = activeAiPolishData.economics;
        if (persInput) persInput.value = activeAiPolishData.persona;

        if (prevTitle) prevTitle.textContent = activeAiPolishData.title;
        if (prevLead) prevLead.textContent = `Sanitized Executive Abstract: "${activeAiPolishData.problem.slice(0, 120)}…"`;

        showNotification('Applied institutional AI refinement to listing fields.');
      });
    }

    // Submission handler
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = DOM.get('#comp-title')?.value.trim();
        const problem = DOM.get('#comp-thesis-problem')?.value.trim();
        const solution = DOM.get('#comp-thesis-solution')?.value.trim();
        const economics = DOM.get('#comp-thesis-economics')?.value.trim();
        const persona = DOM.get('#comp-thesis-persona')?.value.trim();
        const price = Number(priceInput?.value) || 25000;
        const industry = DOM.get('#comp-industry')?.value || 'RegTech & Compliance';

        if (!title || !problem || !solution) {
          showNotification('Complete all mandatory asset documentation fields.');
          return;
        }

        const newId = `VVE-${Math.floor(1000 + Math.random() * 9000)}`;
        const newAsset = {
          id: newId,
          title: title,
          summary: problem.slice(0, 120) + '…',
          industry: industry,
          tags: [industry, 'Architect Certified'],
          status: 'Audited & Active',
          targetJurisdiction: 'North America / EU',
          capitalRequirement: '$30,000 - $70,000',
          implementationTimeline: '14 - 30 Days',
          valuation: price,
          escrowDeposit: Math.round(price * 0.10),
          trustRating: 98,
          pageCount: 104,
          frameworkCount: 14,
          operator: {
            name: 'Architect Entity (Verified)',
            title: 'Licensed Systems Architect',
            verifiedIdentity: true,
            historicalTransactions: 'Audited Registry Record',
            peerReviewScore: 5.0,
            totalCompletedTransfers: 1
          },
          commercialParameters: {
            addressableMarket: economics || '$2.4B Market Sector',
            targetMarginImprovement: '3.5x Operating Expansion',
            paybackPeriod: '6.4 Months'
          },
          executiveAbstract: `${problem} ${solution}`,
          operationalProblem: problem,
          solutionArchitecture: solution,
          commercialModel: economics || 'Enterprise licensing and operational handover.',
          riskFactors: 'Operational change-management variance and deployment timeline dependencies.',
          deliverablesPackage: [
            'Operational Systems Architecture 90+ Page Specification (PDF)',
            'Three-Statement Financial Pro-Forma & Cashflow Model (XLSX)',
            '14 Documented Standard Operating Procedures (SOPs) & Integration Maps',
            'Vendor & Supplier Direct Transition Agreements (DOCX)'
          ]
        };

        State.customAssets.unshift(newAsset);
        StorageService.set('custom_assets', State.customAssets);

        // Dynamically reflect live blueprint listing in the market intelligence terminal:
        const matchSec = VVENTRA_DATA.sectors.find(s => 
          s.name.toLowerCase().includes(industry.toLowerCase()) || 
          (s.category && s.category.toLowerCase().includes(industry.toLowerCase()))
        );
        if (matchSec) {
          matchSec.architectSupplyCount = (matchSec.architectSupplyCount || 20) + 1;
          matchSec.arbitrageGap = Math.max(15, Math.round(matchSec.buyerDemandIndex - matchSec.architectSupplyCount * 0.9));
        }

        appendLiveTransaction(`<strong>New Blueprint Registered:</strong> ${newId} · ${title.slice(0, 36)}… (${formatCurrency(price)})`);
        updateDashboardKPIs();
        renderTickerTape();
        QuadrantMatrixController.render();
        renderDashboard();

        showNotification(`Asset Blueprint ${newId} registered successfully in the transaction repository.`);
        window.location.hash = `#listing?id=${newId}`;
      });
    }
  }

  // ===================================================================
  // 9. DILIGENCE & ESCROW SETTLEMENT WORKFLOW
  // ===================================================================
  function renderDiligencePanel(assetId) {
    const asset = AssetRepository.getById(assetId);
    State.activeAssetId = asset.id;

    DOM.get('#pur-opp-title').textContent = asset.title;
    DOM.get('#pur-opp-price').textContent = formatCurrency(asset.valuation);
    DOM.get('#pur-opp-unlock').textContent = formatCurrency(asset.escrowDeposit);
    DOM.get('#pur-opp-escrow-note').textContent = `Your ${formatCurrency(asset.escrowDeposit)} diligence deposit is held in regulated escrow throughout the mandatory 7-day inspection window.`;

    DOM.get('#pur-step-1').style.display = 'block';
    DOM.get('#pur-step-2').style.display = 'none';
    DOM.get('#pur-step-3').style.display = 'none';
  }

  function setupDiligenceWorkflow() {
    const depositBtn = DOM.get('#pur-commit-escrow-btn');
    if (depositBtn) {
      depositBtn.addEventListener('click', () => {
        depositBtn.disabled = true;
        depositBtn.textContent = 'Locking Funds in Neutral Escrow…';
        setTimeout(() => {
          depositBtn.disabled = false;
          depositBtn.textContent = 'Authorize Escrow Deposit';
          DOM.get('#pur-step-1').style.display = 'none';
          DOM.get('#pur-step-2').style.display = 'block';

          const activeAsset = AssetRepository.getById(State.activeAssetId);
          const escrowAmt = activeAsset ? (activeAsset.escrowDeposit || Math.round(activeAsset.valuation * 0.1)) : 5000;
          appendLiveTransaction(`<strong>Escrow Committed:</strong> ${formatCurrency(escrowAmt)} locked in neutral custody for 7-day inspection on <em>${State.activeAssetId}</em>`);
          updateDashboardKPIs();

          showNotification('Escrow verification complete. Virtual Data Room and technical review schedule unlocked.');
        }, 1000);
      });
    }

    const logInquiryBtn = DOM.get('#pur-send-msg-btn');
    const inquiryInput = DOM.get('#pur-msg-input');
    const inquiryLog = DOM.get('#pur-msg-thread');

    if (logInquiryBtn && inquiryInput && inquiryLog) {
      const logHandler = () => {
        const query = inquiryInput.value.trim();
        if (!query) return;
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        inquiryLog.innerHTML += `
          <div style="margin: 0.6rem 0; padding: 0.6rem 0.8rem; background: var(--color-bg-alt); border-radius: var(--radius-xs); border: 1px solid var(--color-border-subtle);">
            <div style="font-size: 0.72rem; color: var(--color-text-faint); font-family: var(--font-family-mono); margin-bottom: 2px;">RFI Logged · ${timestamp}</div>
            <div style="font-size: 0.85rem; color: var(--color-text-main); font-weight: 500;">${query}</div>
          </div>
        `;
        inquiryInput.value = '';
        inquiryLog.scrollTop = inquiryLog.scrollHeight;
        showNotification('Formal inquiry logged in transaction audit trail.');
      };

      logInquiryBtn.addEventListener('click', logHandler);
      inquiryInput.addEventListener('keydown', e => { if (e.key === 'Enter') logHandler(); });
    }

    const scheduleSessionBtn = DOM.get('#pur-start-call-btn');
    if (scheduleSessionBtn) {
      scheduleSessionBtn.addEventListener('click', () => {
        DOM.get('#pur-step-2').style.display = 'none';
        DOM.get('#pur-step-3').style.display = 'block';
        showNotification('Diligence session confirmed. Transitioning to milestone settlement agreement.');
      });
    }

    const signAgreementBtn = DOM.get('#pur-sign-contract-btn');
    if (signAgreementBtn) {
      signAgreementBtn.addEventListener('click', () => {
        signAgreementBtn.disabled = true;
        signAgreementBtn.textContent = 'Verifying Bilateral Legal Signatures…';
        setTimeout(() => {
          DOM.get('#pur-contract-status').innerHTML = `<span class="c-badge c-badge--success">✓ Bilateral Execution Confirmed</span>`;
          signAgreementBtn.textContent = 'Asset Package Released Under Escrow';
          showNotification('Milestone contract executed. Escrow distribution schedule authorized.');
        }, 1400);
      });
    }
  }

  // ===================================================================
  // 10. ROUTER CONTROLLER
  // ===================================================================
  function handleNavigation() {
    const hash = window.location.hash || '#overview';
    const [route, queryStr] = hash.split('?');
    let viewName = route.replace('#', '') || 'overview';
    if (viewName === 'home' || viewName === 'cta') viewName = 'overview';
    if (viewName === 'apply') viewName = 'list';

    const params = new URLSearchParams(queryStr);
    if (params.has('id')) {
      State.activeAssetId = params.get('id');
    }

    DOM.getAll('.c-view').forEach(view => {
      view.classList.toggle('is-active', view.id === `page-${viewName}`);
    });

    DOM.getAll('.c-nav__link').forEach(link => {
      const linkTarget = link.getAttribute('href').split('?')[0];
      link.classList.toggle('is-active', linkTarget === route);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'overview') {
      renderDashboardSummary();
      renderFeaturedAssets();
    } else if (viewName === 'dashboard') {
      renderDashboard();
    } else if (viewName === 'browse') {
      renderMarketplace();
    } else if (viewName === 'playbook') {
      initPlaybookPage();
    } else if (viewName === 'trust') {
      initTrustPage();
    } else if (viewName === 'faq') {
      initFaqPage();
    } else if (viewName === 'terms') {
      initTermsPage();
    } else if (viewName === 'listing') {
      renderAssetDetail(State.activeAssetId);
    } else if (viewName === 'pricing') {
      SettlementCalculator.updateUI();
    } else if (viewName === 'purchase') {
      renderDiligencePanel(State.activeAssetId);
    }

    observePageReveals('#page-' + viewName);
  }

  // ===================================================================
  // 10B. VENTURE TERMINAL INTERACTIVE CONTROLS
  // ===================================================================
  function setupDemandChartControls() {
    const btnBoth = DOM.get('#chart-toggle-both');
    const btnDemand = DOM.get('#chart-toggle-demand');
    const btnSupply = DOM.get('#chart-toggle-supply');

    const demandArea = DOM.get('#demand-area');
    const demandLine = DOM.get('#demand-line');
    const supplyArea = DOM.get('#supply-area');
    const supplyLine = DOM.get('#supply-line');

    if (!btnBoth || !demandArea) return;

    btnBoth.addEventListener('click', () => {
      btnBoth.classList.add('is-active');
      btnDemand.classList.remove('is-active');
      btnSupply.classList.remove('is-active');
      demandArea.style.display = 'block';
      demandLine.style.display = 'block';
      supplyArea.style.display = 'block';
      supplyLine.style.display = 'block';
    });

    btnDemand.addEventListener('click', () => {
      btnDemand.classList.add('is-active');
      btnBoth.classList.remove('is-active');
      btnSupply.classList.remove('is-active');
      demandArea.style.display = 'block';
      demandLine.style.display = 'block';
      supplyArea.style.display = 'none';
      supplyLine.style.display = 'none';
    });

    btnSupply.addEventListener('click', () => {
      btnSupply.classList.add('is-active');
      btnBoth.classList.remove('is-active');
      btnDemand.classList.remove('is-active');
      demandArea.style.display = 'none';
      demandLine.style.display = 'none';
      supplyArea.style.display = 'block';
      supplyLine.style.display = 'block';
    });
  }

  function setupWhatToListRecommender() {
    const wslState = {
      capital: 'lean',
      speed: 'fast',
      domain: 'any'
    };

    const recommendations = {
      'lean-fast-any': {
        title: 'RegTech Compliance & Ingestion Pipeline',
        desc: 'Fastest buyer clearance velocity (12 days). High institutional willingness to pay with low competitive supply.'
      },
      'lean-fast-tech': {
        title: 'Autonomous AI Workflow Orchestrator',
        desc: '8-day median clear time. Heavy buyer interest across seed-stage PE search funds for mid-market automation.'
      },
      'lean-fast-ops': {
        title: 'Reverse Logistics & 3PL Reconciliation SOP',
        desc: '14-day clearance. Solves e-commerce return fraud; verified 84% gross margins.'
      },
      'mid-balanced-any': {
        title: 'Healthcare FHIR EHR Integration Gateway',
        desc: 'Institutional HIPAA-compliant asset clearing at $35k–$50k valuations with 15-day average transaction cycles.'
      },
      'heavy-value-any': {
        title: 'Multi-Tenant Commercial Underwriting Infrastructure',
        desc: 'Institutional tier asset command. Average deal size clears above $65k with multi-year SaaS contracts.'
      }
    };

    DOM.getAll('.wsl-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const val = btn.dataset.val;

        DOM.getAll(`.wsl-btn[data-type="${type}"]`).forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        wslState[type] = val;

        const key = `${wslState.capital}-${wslState.speed}-${wslState.domain}`;
        const match = recommendations[key] || recommendations['lean-fast-any'];

        const titleEl = DOM.get('#wsl-title');
        const descEl = DOM.get('#wsl-desc');
        if (titleEl && descEl) {
          titleEl.textContent = match.title;
          descEl.textContent = match.desc;
        }
      });
    });
  }

  function setupVideoControls() {
    const btnMic = DOM.get('#btn-toggle-mic');
    const btnCam = DOM.get('#btn-toggle-cam');
    const btnShare = DOM.get('#btn-toggle-share');

    let micMuted = false;
    let camOff = false;

    if (btnMic) {
      btnMic.addEventListener('click', () => {
        micMuted = !micMuted;
        btnMic.textContent = micMuted ? '🔇 Mic Muted' : '🎤 Mute Mic';
        showNotification(micMuted ? 'Audio stream muted.' : 'Audio stream live.');
      });
    }

    if (btnCam) {
      btnCam.addEventListener('click', () => {
        camOff = !camOff;
        btnCam.textContent = camOff ? '🚫 Camera Off' : '📹 Camera On';
        showNotification(camOff ? 'Video feed disabled.' : 'Video feed enabled.');
      });
    }

    if (btnShare) {
      btnShare.addEventListener('click', () => {
        showNotification('WebRTC Screen Share: Ready for backend video provider hook.');
      });
    }
  }

  // ===================================================================
  // 11. INITIALIZATION ON DOM READY
  // ===================================================================
  function initApp() {
    setTheme(State.theme);
    const themeToggle = DOM.get('#theme-toggle-btn');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        setTheme(State.theme === 'dark' ? 'light' : 'dark');
      });
    }

    setPerspective(State.role, false);
    DOM.getAll('.c-role-switch__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setPerspective(btn.dataset.role);
      });
    });

    PricingController.init();

    DOM.getAll('.c-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        DOM.getAll('.c-filter-chip').forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        State.activeFilter = chip.dataset.filter;
        renderMarketplace();
      });
    });

    const searchInput = DOM.get('#marketplace-search');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        State.searchQuery = e.target.value.trim();
        renderMarketplace();
      });
    }

    const demoUnlockBtn = DOM.get('#demo-unlock-btn');
    if (demoUnlockBtn) {
      demoUnlockBtn.addEventListener('click', toggleDataRoomPreview);
    }

    const handoverSimBtn = DOM.get('#handover-sim-btn');
    if (handoverSimBtn) {
      handoverSimBtn.addEventListener('click', simulateStagedRevealSequence);
    }

    window.vveToggleBookmark = (id, event) => AssetRepository.toggleBookmark(id, event);
    AssetRepository.updateBookmarkCount();

    renderTickerTape();
    QuadrantMatrixController.init();
    SectorIntelligenceAPI.init();
    setupInvestorBuyMandate();
    setupAssetComposer();
    setupDiligenceWorkflow();
    setupDemandChartControls();
    setupWhatToListRecommender();
    setupVideoControls();
    setupPlaybookControls();

    window.addEventListener('hashchange', handleNavigation);
    handleNavigation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
