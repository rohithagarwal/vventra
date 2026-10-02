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
    const html = assets.map(a => `
      <div class="c-ticker__item">
        <strong>${a.id}</strong>
        <span>${a.title.slice(0, 36)}…</span>
        <span class="c-ticker__tag">${formatCurrency(a.escrowDeposit)} deposit</span>
        <span>• Audit Score: ${a.trustRating}%</span>
      </div>
    `).join('');
    track.innerHTML = html + html;
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

  function renderDashboard() {
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
          <td><span style="font-family: var(--font-family-mono); font-weight: 600; color: ${isPositive ? 'var(--color-success)' : 'var(--color-danger)'};">${change}</span></td>
          <td><strong>${val}</strong></td>
        </tr>
      `;
    }).join('');
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
  // 8. ASSET INTAKE & COMPOSER
  // ===================================================================
  function setupAssetComposer() {
    const form = DOM.get('#composer-form');
    const sanitizeBtn = DOM.get('#composer-sanitize-btn');

    if (sanitizeBtn) {
      sanitizeBtn.addEventListener('click', () => {
        const title = DOM.get('#comp-title').value.trim() || 'Untitled Asset Dossier';
        const thesis = DOM.get('#comp-thesis').value.trim();
        const price = Number(DOM.get('#comp-price').value) || 20000;

        if (!thesis) {
          showNotification('Enter operational specifications before generating an executive abstract.');
          return;
        }

        const previewWords = thesis.split(/\s+/).slice(0, 24).join(' ') + '…';
        const deposit = Math.round(price * 0.10);

        DOM.get('#comp-preview-box').style.display = 'block';
        DOM.get('#comp-prev-title').textContent = title;
        DOM.get('#comp-prev-lead').textContent = `Sanitized Executive Abstract: "${previewWords}"`;
        DOM.get('#comp-prev-unlock').textContent = `Institutional Diligence Escrow: ${formatCurrency(deposit)} (10%)`;
        showNotification('Sanitized Executive Summary generated with proprietary terms redacted.');
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = DOM.get('#comp-title').value.trim();
        const thesis = DOM.get('#comp-thesis').value.trim();
        const price = Number(DOM.get('#comp-price').value) || 20000;
        const industry = DOM.get('#comp-industry').value || 'Enterprise Software';

        if (!title || !thesis) {
          showNotification('Complete all mandatory asset documentation fields.');
          return;
        }

        const newId = `VVE-${Math.floor(1000 + Math.random() * 9000)}`;
        const newAsset = {
          id: newId,
          title: title,
          summary: thesis.slice(0, 110) + '…',
          industry: industry,
          tags: [industry, 'Direct Intake'],
          status: 'Audited & Active',
          targetJurisdiction: 'North America / EU',
          capitalRequirement: '$30,000 - $70,000',
          implementationTimeline: '60 - 90 Days',
          valuation: price,
          escrowDeposit: Math.round(price * 0.10),
          trustRating: 96,
          pageCount: 104,
          frameworkCount: 16,
          operator: {
            name: 'Operator Entity (Verified)',
            title: 'Licensed Asset Principal',
            verifiedIdentity: true,
            historicalTransactions: 'Audited Registry Record',
            peerReviewScore: 5.0,
            totalCompletedTransfers: 1
          },
          commercialParameters: {
            addressableMarket: '$2.5B Market Sector',
            targetMarginImprovement: '3.5x Operating Expansion',
            paybackPeriod: '6 Months'
          },
          executiveAbstract: thesis,
          operationalProblem: 'Operational workflows systematized to eliminate executive management bottlenecks.',
          solutionArchitecture: 'Documented procedural matrix and integration architecture ready for team handover.',
          commercialModel: 'Enterprise licensing agreements and operational transfer milestones.',
          riskFactors: 'Operational change-management variance and deployment timeline dependencies.',
          deliverablesPackage: [
            'Operational Systems Architecture 90+ Page Specification (PDF)',
            'Three-Statement Financial Pro-Forma & Cashflow Model (XLSX)',
            'Operational Master Services & Transition Agreement (DOCX)'
          ]
        };

        State.customAssets.unshift(newAsset);
        StorageService.set('custom_assets', State.customAssets);
        showNotification(`Asset ${newId} registered successfully in the transaction repository.`);
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
    const viewName = route.replace('#', '') || 'overview';

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
