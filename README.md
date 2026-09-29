# vvEntra — Institutional Tech & IP Diligence Marketplace

A venture intelligence and commercial software M&A platform connecting verified engineering assets with institutional capital. Engineered with pure semantic **HTML5**, **CSS3 (BEM architecture)**, and **Vanilla JavaScript** with **zero external dependencies**.

---

## ⚡ Core Platform Capabilities

1. **Venture Intelligence Terminal (`#dashboard`)**
   - **Role-Aware Dual Perspective**: Global toggle between **Institutional Buyer** and **Asset Seller / Operator** that updates telemetry KPIs, call-to-actions, and theme accents site-wide.
   - **6 Metric Telemetry Cards**: Live Listings, Active Now, New This Week, Architects Online, Avg Unlock Valuation, and Deals Closed.
   - **30-Day Demand vs. Supply Area SVG Chart**: Pure responsive SVG liquidity trajectory with interactive toggle controls (`Aggregate`, `Demand`, `Supply`) visualizing the +34% demand gap.
   - **Sector Demand Radar (Spider Chart)**: Multi-axis SVG comparing buyer demand against active supply across 8 key technology categories.
   - **Top Opportunity Gaps Leaderboard**: Ranked sectors where institutional acquisition demand outstrips active listings.
   - **"What Should You List or Acquire?" Recommender**: Interactive constraint engine matching Capital Depth, Liquidity Velocity, and Domain Advantage to optimal asset archetypes.
   - **Capital Deployed Weekly Bar Chart**: Weekly volume tracker ($42.6M total).
   - **Sector Pricing Benchmarks Matrix**: Category diligence valuation clearance with inline SVG sparklines.

2. **The Atomic Handover Protocol (Sequential 4-Phase Escrow Transfer)**
   - **Phase 01: Code & IP Ownership**: Private GitHub repo transfer, commit history audit, and signed IP copyright deed.
   - **Phase 02: Cloud Infrastructure & Apex DNS**: Domain registrar auth-code release, Cloudflare zero-downtime routing, and AWS root IAM transfer.
   - **Phase 03: Customer Billing Custody**: Seamless migration of active Stripe customer tokens with zero subscriber card re-entry.
   - **Phase 04: Neutral Escrow Release**: Dual-signoff automated 90% wire payout only after Phases 1–3 are verified.
   - **Live Handover Simulator**: Test and animate the sequence live on any listing dossier.

3. **Strategic Positioning Quadrant (2×2 Matrix)**
   - Mapped on `#overview`: Categorizes sectors into **Stars**, **Rising**, **Cash Cows**, and **Saturated** based on Demand Growth Rate (X-axis) and Market Activity Volume (Y-axis).

4. **Virtual Data Room (VDR) & NDA Redaction (`#listing`)**
   - Interactive NDA disclosure toggle simulating how proprietary P&L data, customer retention, and cap tables remain blurred (`filter: blur(...)`) until bilateral NDA execution.
   - Request for Information (RFI) ticketing system.

5. **Neutral Escrow Settlement Calculator (`#pricing`)**
   - Dual-slider financial model calculating the 10% buyer diligence deposit, the 90% seller net wire, and platform fees in real time.

6. **Trust, Safeguards & Institutional FAQ (`#trust` & `#faq`)**
   - Standalone pages documenting the 3-pillar audit rules, FDIC dual-custody escrow, non-circumvention covenants, and categorized Buyer vs. Seller Q&As.

7. **Technical Architecture Review Room (`#purchase`)**
   - Live video review terminal UI with camera/mic mute controls, screen share button, operator avatar, and 45-minute inspection countdown ready for WebRTC streaming APIs.

---

## 🛠️ Codebase Structure

```text
vventra-remake/
├── index.html       # Semantic single-page application structure across all 8 hash views
├── style.css        # BEM component styling with CSS variables (Light/Dark themes)
├── data.js          # 14 sectors, audited asset opportunities, and handover protocols
├── app.js           # Reactive controllers, LocalStorage state, calculators, and simulators
├── .gitignore       # Standard git ignore rules
└── README.md        # Architecture documentation and deployment guide
```

---

## 🚀 How to Run Locally

Because the project is built with **zero external dependencies** and pure native web standards:

### Option A: Python Built-in Server
```bash
python -m http.server 4173
```
Then open [http://localhost:4173](http://localhost:4173) in your browser.

### Option B: Node.js static server
```bash
npx serve .
```

### Option C: Direct Browser
Open `index.html` directly in any modern web browser.

---

## 🌐 Deploy to GitHub Pages

1. Create a repository on GitHub (e.g. `vventra`).
2. Push this directory:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: vvEntra Institutional Tech M&A Platform"
   git branch -M main
   git remote add origin https://github.com/<your-username>/vventra.git
   git push -u origin main
   ```
3. In your GitHub repository:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Branch**, select `main` and root `/`.
   - Click **Save**.
4. Your website will be live at `https://<your-username>.github.io/vventra/` in under 1 minute!
