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
  // 4. TRANSACTION & SETTLEMENT CALCULATOR
  // ===================================================================
  const SettlementCalculator = {
    calculate(valuation) {
      const numericVal = Math.max(3000, Math.min(100000, Number(valuation) || 10000));
      const escrowDeposit = Math.round(numericVal * 0.10);
      const sellerNetProceeds = Math.round(numericVal * 0.90);
      const facilityCommission = Math.round(numericVal * 0.10);

      return {
        valuation: numericVal,
        escrowDeposit,
        sellerNetProceeds,
        facilityCommission,
        disputeArbitration: {
          standardRelease: sellerNetProceeds,
          buyerRefund: sellerNetProceeds,
          apportionedSplit: {
            majorityParty: Math.round(sellerNetProceeds * 0.60),
            minorityParty: Math.round(sellerNetProceeds * 0.40)
          }
        }
      };
    },

    updateUI() {
      const slider = DOM.get('#calc-deal-slider');
      const inputDisplay = DOM.get('#calc-input-val');
      if (!slider) return;

      const calc = this.calculate(slider.value || State.calculatorValuation);
      State.calculatorValuation = calc.valuation;

      if (inputDisplay) inputDisplay.textContent = formatCurrency(calc.valuation);

      const depositEl = DOM.get('#calc-unlock-fee');
      const sellerNetEl = DOM.get('#calc-arch-net');
      const facilityEl = DOM.get('#calc-platform-cut');

      if (depositEl) depositEl.textContent = formatCurrency(calc.escrowDeposit);
      if (sellerNetEl) sellerNetEl.textContent = formatCurrency(calc.sellerNetProceeds);
      if (facilityEl) facilityEl.textContent = formatCurrency(calc.facilityCommission);

      const dClean = DOM.get('#disp-scenario-clean');
      const dGhost = DOM.get('#disp-scenario-ghost');
      const dSplit = DOM.get('#disp-scenario-6040');

      if (dClean) dClean.textContent = `Seller receives ${formatCurrency(calc.sellerNetProceeds)} (90%) · vvEntra fee ${formatCurrency(calc.facilityCommission)}`;
      if (dGhost) dGhost.textContent = `Buyer receives ${formatCurrency(calc.sellerNetProceeds)} full refund · Escrow released`;
      if (dSplit) dSplit.textContent = `Primary: ${formatCurrency(calc.disputeArbitration.apportionedSplit.majorityParty)} · Counterparty: ${formatCurrency(calc.disputeArbitration.apportionedSplit.minorityParty)}`;
    }
  };

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

  function setPerspective(role) {
    State.role = role;
    document.documentElement.setAttribute('data-role', role);
    StorageService.set('role', role);

    DOM.getAll('.c-role-switch__btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.role === role);
    });

    renderPerspectiveContent();
    renderDashboard();
    SettlementCalculator.updateUI();
    showNotification(`Switched perspective to ${role === 'investor' ? 'Institutional Buyer' : 'Asset Operator / Seller'}`);
  }

  function renderPerspectiveContent() {
    const isOperator = State.role === 'architect';

    const heroTitle = DOM.get('#hero-main-title');
    const heroSub = DOM.get('#hero-main-sub');
    const heroCta = DOM.get('#hero-main-cta');

    if (heroTitle) {
      heroTitle.innerHTML = isOperator
        ? `Monetize verified operational assets.<br><em>Without ongoing management overhead.</em>`
        : `Acquire audited commercial assets.<br><em>Deploy execution capital with escrow security.</em>`;
    }

    if (heroSub) {
      heroSub.textContent = isOperator
        ? `A confidential exchange where enterprise operators package verified operational assets and systems specifications, accessing institutional capital with 90% direct payout settlement.`
        : `A private transaction network connecting qualified capital with verified commercial assets. Minimum 90-page documentation threshold. Staged legal disclosures. Neutral banking escrow.`;
    }

    if (heroCta) {
      heroCta.textContent = isOperator ? 'Submit Operational Asset Listing →' : 'Review Institutional Assets →';
      heroCta.href = isOperator ? '#list' : '#browse';
    }

    const signalBadge = DOM.get('#dash-signal-badge');
    const signalTitle = DOM.get('#dash-signal-title');
    const signalText = DOM.get('#dash-signal-text');
    const signalBtn = DOM.get('#dash-signal-btn');

    if (signalBadge && signalTitle && signalText && signalBtn) {
      if (isOperator) {
        signalBadge.textContent = 'Intake Priority · RegTech Sector';
        signalTitle.textContent = 'Compliance Automation Gap';
        signalText.textContent = 'High institutional buyer demand (88) vs. 22 active audited listings. Average deal clearing time is under 14 days with $7,200 diligence deposit thresholds.';
        signalBtn.textContent = 'Submit Assets in this Category →';
        signalBtn.href = '#list';
      } else {
        signalBadge.textContent = 'Mandate Match · Priority';
        signalTitle.textContent = 'Enterprise Software & E-Com';
        signalText.textContent = 'Asset VVE-2440 matches standard private equity search criteria. Operations package includes verified Shopify Plus & ERP integration specifications with audited financial returns.';
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
        kpi4.textContent = '$7,200';
        if (kpi4.previousElementSibling) kpi4.previousElementSibling.textContent = 'Top Sector Pay (Fintech)';
        kpi5.textContent = '+34%';
        if (kpi5.previousElementSibling) kpi5.previousElementSibling.textContent = 'Top 5 Demand Gap';
        kpi6.textContent = '37';
        if (kpi6.previousElementSibling) kpi6.previousElementSibling.textContent = 'Listings Cleared';
      } else {
        kpi1.textContent = '184';
        if (kpi1.previousElementSibling) kpi1.previousElementSibling.textContent = '● Live Listings';
        kpi2.textContent = '87';
        if (kpi2.previousElementSibling) kpi2.previousElementSibling.textContent = '● Active Now';
        kpi3.textContent = '42';
        if (kpi3.previousElementSibling) kpi3.previousElementSibling.textContent = 'New This Week';
        kpi4.textContent = '247';
        if (kpi4.previousElementSibling) kpi4.previousElementSibling.textContent = 'Architects Online';
        kpi5.textContent = '$4,300';
        if (kpi5.previousElementSibling) kpi5.previousElementSibling.textContent = 'Avg Unlock Valuation';
        kpi6.textContent = '37';
        if (kpi6.previousElementSibling) kpi6.previousElementSibling.textContent = 'Deals Closed';
      }
    }
  }

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
    if (!tbody) return;
    const items = VVENTRA_DATA.sectors.slice(0, 5);
    tbody.innerHTML = items.map(s => `
      <tr>
        <td>
          <div style="font-weight: 600;">${s.name}</div>
          <div style="font-size: 0.75rem; color: var(--color-text-faint);">${s.industry}</div>
        </td>
        <td>
          <div class="c-bar-meter"><div class="c-bar-meter__fill" style="width: ${s.buyerDemandIndex}%;"></div></div>
          <strong>${s.buyerDemandIndex}</strong>
        </td>
        <td>
          <div class="c-bar-meter"><div class="c-bar-meter__fill" style="width: ${s.availableListings}%; background: var(--color-text-faint);"></div></div>
          <span>${s.availableListings}</span>
        </td>
        <td><span class="c-badge c-badge--success">${s.marketGap}</span></td>
        <td><strong>${s.medianUnlockValuation}</strong></td>
      </tr>
    `).join('');
  }

  function renderFeaturedAssets() {
    const grid = DOM.get('#overview-opps-grid');
    if (!grid) return;
    const assets = AssetRepository.getAll().slice(0, 3);
    grid.innerHTML = assets.map(createAssetCardMarkup).join('');
  }

  function renderDashboard() {
    const tbody = DOM.get('#dashboard-matrix-body');
    if (!tbody) return;
    tbody.innerHTML = VVENTRA_DATA.sectors.map(s => `
      <tr>
        <td>
          <div style="font-weight: 600;">${s.name}</div>
          <div style="font-size: 0.75rem; color: var(--color-text-faint);">${s.industry}</div>
        </td>
        <td>
          <div class="c-bar-meter"><div class="c-bar-meter__fill" style="width: ${s.buyerDemandIndex}%;"></div></div>
          <strong>${s.buyerDemandIndex}</strong>
        </td>
        <td>
          <div class="c-bar-meter"><div class="c-bar-meter__fill" style="width: ${s.availableListings}%; background: var(--color-text-faint);"></div></div>
          <span>${s.availableListings}</span>
        </td>
        <td><span class="c-badge c-badge--success">${s.marketGap}</span></td>
        <td><span style="font-family: var(--font-family-mono); font-weight: 600; color: ${s.trailing7dChange.startsWith('+') ? 'var(--color-success)' : 'var(--color-danger)'};">${s.trailing7dChange}</span></td>
        <td><strong>${s.medianUnlockValuation}</strong></td>
      </tr>
    `).join('');
  }

  function createAssetCardMarkup(asset) {
    const isSaved = AssetRepository.isBookmarked(asset.id);
    return `
      <article class="c-asset-card">
        <div>
          <div class="c-asset-card__header">
            <span class="c-asset-card__id">${asset.id} · ${asset.industry}</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button type="button" class="c-btn-bookmark ${isSaved ? 'is-bookmarked' : ''}" onclick="window.vveToggleBookmark('${asset.id}', event)" title="Save asset to shortlist">
                ${isSaved ? '★' : '☆'}
              </button>
              <span class="c-badge c-badge--success">★ ${asset.trustRating}% Audit</span>
            </div>
          </div>
          <h3 class="c-asset-card__title">${asset.title}</h3>
          <p class="c-asset-card__summary">${asset.summary}</p>
          <div class="c-asset-card__meta">
            <span>📄 ${asset.pageCount} Pages</span>
            <span>⚡ ${asset.frameworkCount} Frameworks</span>
            <span>📍 ${asset.targetJurisdiction.split(',')[0]}</span>
          </div>
        </div>
        <div class="c-asset-card__footer">
          <div>
            <div class="c-asset-card__price-val">${formatCurrency(asset.valuation)}</div>
            <div class="c-asset-card__deposit-val">10% Diligence Escrow: ${formatCurrency(asset.escrowDeposit)}</div>
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
    renderHandoverProtocol(asset);
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
  // 7B. THE ATOMIC HANDOVER PROTOCOL CONTROLLER
  // ===================================================================
  let currentHandoverData = null;
  let activeHandoverStepIndex = 0;
  let isHandoverSimulating = false;

  function renderHandoverProtocol(asset) {
    const grid = DOM.get('#handover-steps-grid');
    if (!grid) return;

    currentHandoverData = VVENTRA_DATA.getHandoverProtocol(asset);
    if (!currentHandoverData) return;

    activeHandoverStepIndex = 0;
    renderHandoverSteps();
    renderHandoverInspector(currentHandoverData.phases[activeHandoverStepIndex], asset);
  }

  function renderHandoverSteps() {
    const grid = DOM.get('#handover-steps-grid');
    if (!grid || !currentHandoverData) return;

    grid.innerHTML = currentHandoverData.phases.map((phase, idx) => `
      <div class="c-handover-step ${idx === activeHandoverStepIndex ? 'is-active' : ''} ${phase.statusCode === 'verified' ? 'is-verified' : ''}" 
           data-step-idx="${idx}" 
           onclick="window.vveSelectHandoverStep(${idx})">
        <div class="c-handover-step__top">
          <span class="c-handover-step__num">PHASE ${phase.number}</span>
          <span class="c-handover-step__icon">${phase.icon}</span>
        </div>
        <div>
          <div class="c-handover-step__title">${phase.title}</div>
          <div class="c-handover-step__cat">${phase.category}</div>
        </div>
        <div class="c-handover-step__badge ${phase.badgeClass}">
          ${phase.status}
        </div>
      </div>
    `).join('');
  }

  function renderHandoverInspector(phase, asset) {
    const inspector = DOM.get('#handover-inspector');
    if (!inspector || !phase) return;

    const checkpointsHtml = phase.checkpoints ? phase.checkpoints.map(cp => `
      <li class="c-handover-insp__check-item">
        <span class="c-handover-insp__check-icon">✓</span>
        <span>${cp}</span>
      </li>
    `).join('') : '';

    inspector.innerHTML = `
      <div class="c-handover-insp__header">
        <div class="c-handover-insp__title">Phase ${phase.number} Custody Verification: ${phase.title}</div>
        <div class="c-handover-insp__metric">${phase.primaryMetric}</div>
      </div>
      <div class="c-handover-insp__headline">${phase.headline}</div>
      <ul class="c-handover-insp__checklist">
        ${checkpointsHtml}
      </ul>
      <div class="c-handover-insp__artifact">
        <span>🔒 Technical Verification Artifact:</span>
        <strong>${phase.technicalArtifact}</strong>
      </div>
    `;
  }

  window.vveSelectHandoverStep = function(idx) {
    if (isHandoverSimulating || !currentHandoverData) return;
    activeHandoverStepIndex = idx;
    const asset = AssetRepository.getById(State.activeAssetId);
    renderHandoverSteps();
    renderHandoverInspector(currentHandoverData.phases[idx], asset);
  };

  function simulateHandoverSequence() {
    if (isHandoverSimulating || !currentHandoverData) return;
    isHandoverSimulating = true;
    const simBtn = DOM.get('#handover-sim-btn');
    if (simBtn) {
      simBtn.disabled = true;
      simBtn.textContent = 'Simulating Handover in Progress...';
    }

    const phases = currentHandoverData.phases;
    let currentIdx = 0;

    phases[0].status = 'Verifying Repo & IP...';
    phases[0].badgeClass = 'c-badge--warning';
    phases[1].status = 'Queued';
    phases[2].status = 'Queued';
    phases[3].status = 'Awaiting Signoffs';
    renderHandoverSteps();

    const interval = setInterval(() => {
      if (currentIdx < phases.length) {
        activeHandoverStepIndex = currentIdx;
        const currentPhase = phases[currentIdx];
        currentPhase.statusCode = 'verified';
        currentPhase.badgeClass = 'c-badge--success';

        if (currentIdx === 0) {
          currentPhase.status = '✓ Code Custody Transferred';
          if (phases[1]) {
            phases[1].status = 'Re-keying DNS & Cloud IAM...';
            phases[1].badgeClass = 'c-badge--warning';
          }
        } else if (currentIdx === 1) {
          currentPhase.status = '✓ DNS & Root Cloud Re-keyed';
          if (phases[2]) {
            phases[2].status = 'Migrating Merchant Tokens...';
            phases[2].badgeClass = 'c-badge--warning';
          }
        } else if (currentIdx === 2) {
          currentPhase.status = '✓ Customer Billing Tokens Mapped';
          if (phases[3]) {
            phases[3].status = 'Verifying 3/3 Mutual Approvals...';
            phases[3].badgeClass = 'c-badge--warning';
          }
        } else if (currentIdx === 3) {
          const sellerNet = Math.round((AssetRepository.getById(State.activeAssetId).valuation || 25000) * 0.90);
          currentPhase.status = `✓ Escrow Wire Disbursed ($${sellerNet.toLocaleString()})`;
        }

        renderHandoverSteps();
        renderHandoverInspector(currentPhase, AssetRepository.getById(State.activeAssetId));
        currentIdx++;
      } else {
        clearInterval(interval);
        isHandoverSimulating = false;
        if (simBtn) {
          simBtn.disabled = false;
          simBtn.textContent = 'Reset / Run Simulation Again ↻';
        }
        showNotification('Atomic Handover Verified: All 4 custody phases confirmed by neutral escrow. 90% payout settled.');
      }
    }, 1100);
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
    } else if (viewName === 'listing') {
      renderAssetDetail(State.activeAssetId);
    } else if (viewName === 'pricing') {
      SettlementCalculator.updateUI();
    } else if (viewName === 'purchase') {
      renderDiligencePanel(State.activeAssetId);
    }
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
  document.addEventListener('DOMContentLoaded', () => {
    setTheme(State.theme);
    const themeToggle = DOM.get('#theme-toggle-btn');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        setTheme(State.theme === 'dark' ? 'light' : 'dark');
      });
    }

    setPerspective(State.role);
    DOM.getAll('.c-role-switch__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setPerspective(btn.dataset.role);
      });
    });

    const calcSlider = DOM.get('#calc-deal-slider');
    if (calcSlider) {
      calcSlider.addEventListener('input', () => SettlementCalculator.updateUI());
    }
    DOM.getAll('.calc-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (calcSlider) {
          calcSlider.value = btn.dataset.val;
          SettlementCalculator.updateUI();
        }
      });
    });

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
      handoverSimBtn.addEventListener('click', simulateHandoverSequence);
    }

    window.vveToggleBookmark = (id, event) => AssetRepository.toggleBookmark(id, event);
    AssetRepository.updateBookmarkCount();

    renderTickerTape();
    setupAssetComposer();
    setupDiligenceWorkflow();
    setupDemandChartControls();
    setupWhatToListRecommender();
    setupVideoControls();

    window.addEventListener('hashchange', handleNavigation);
    handleNavigation();
  });

})();
