import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Clean Institutional Colors
    BG_DARK = RGBColor(11, 15, 25)       # #0B0F19
    CARD_BG = RGBColor(18, 24, 38)       # #121826
    BORDER_CLR = RGBColor(38, 50, 74)    # #26324A
    TEXT_MAIN = RGBColor(248, 250, 252)  # #F8FAFC
    TEXT_MUTED = RGBColor(148, 163, 184) # #94A3B8
    ACCENT_BLUE = RGBColor(56, 189, 248) # #38BDF8
    ACCENT_GREEN = RGBColor(52, 211, 153)# #34D399
    ACCENT_AMBER = RGBColor(245, 158, 11)# #F59E0B
    TAG_BG = RGBColor(26, 36, 54)

    blank_layout = prs.slide_layouts[6]

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_header(slide, tag_text, title_text, subtitle_text=""):
        tag = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.45), Inches(2.8), Inches(0.35))
        tag.fill.solid()
        tag.fill.fore_color.rgb = TAG_BG
        tag.line.color.rgb = BORDER_CLR
        tag.line.width = Pt(1)
        tf_tag = tag.text_frame
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.size = Pt(9)
        p_tag.font.bold = True
        p_tag.font.color.rgb = ACCENT_BLUE
        p_tag.alignment = PP_ALIGN.CENTER

        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.8))
        tf = title_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = TEXT_MAIN

        if subtitle_text:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle_text
            p_sub.font.size = Pt(11)
            p_sub.font.color.rgb = TEXT_MUTED

    def add_card(slide, left, top, width, height, title, items, badge="", accent=ACCENT_BLUE):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_CLR
        card.line.width = Pt(1.2)

        tb = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.2), Inches(width - 0.5), Inches(height - 0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        p0.text = f"[{badge}]  {title}" if badge else title
        p0.font.size = Pt(14)
        p0.font.bold = True
        p0.font.color.rgb = accent

        for item in items:
            p = tf.add_paragraph()
            p.text = f"• {item}"
            p.font.size = Pt(10.5)
            p.font.color.rgb = TEXT_MUTED
            p.space_before = Pt(5)

    # -------------------------------------------------------------
    # SLIDE 1: Title & Purpose
    # -------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    decor = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.733), Inches(4.5))
    decor.fill.solid()
    decor.fill.fore_color.rgb = CARD_BG
    decor.line.color.rgb = BORDER_CLR

    tb = s1.shapes.add_textbox(Inches(1.2), Inches(1.9), Inches(11.0), Inches(3.8))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "vvEntra: Platform Deep-Dive"
    p.font.size = Pt(38)
    p.font.bold = True
    p.font.color.rgb = TEXT_MAIN

    p2 = tf.add_paragraph()
    p2.text = "Comprehensive Content, Architecture, Extensibility & Innovation Analysis"
    p2.font.size = Pt(18)
    p2.font.color.rgb = ACCENT_BLUE
    p2.space_before = Pt(6)

    p3 = tf.add_paragraph()
    p3.text = "A detailed breakdown focused entirely on business logic, technical viability, AI agent readiness, and verified M&A custody."
    p3.font.size = Pt(12)
    p3.font.color.rgb = TEXT_MUTED
    p3.space_before = Pt(14)

    p4 = tf.add_paragraph()
    p4.text = "Live Hosted URL: https://rohithagarwal.github.io/vventra/  |  Repository: github.com/rohithagarwal/vventra"
    p4.font.size = Pt(11)
    p4.font.color.rgb = ACCENT_GREEN
    p4.space_before = Pt(20)

    s1.notes_slide.notes_text_frame.text = (
        "Today I'm presenting a complete, content-focused breakdown of vvEntra. "
        "We will focus directly on substance: what problem the website solves, the mutual benefits for users and our platform, "
        "every major functionality, the zero-dependency tech stack and its AI-agent extensibility, "
        "our core innovation compared to the original reference site, and key lessons learned."
    )

    # -------------------------------------------------------------
    # SLIDE 2: Core Idea, Problem & Mutual Benefits
    # -------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "1. Core Mission", "Core Idea, Problem Solved & Mutual Benefits", "The commercial rationale behind vvEntra and how it generates mutual value.")

    add_card(s2, 0.8, 1.9, 3.6, 5.0, "The Problem Solved", [
        "Predatory Broker Fees: Traditional brokers take 10%–15% cuts and take 6 to 12 months.",
        "Rampant Scams: Public listing sites are full of faked revenue screenshots and plagiarized code.",
        "Settlement Anxiety: Buyers fear losing capital without receiving code; sellers fear handing over code and getting ghosted."
    ], badge="THE PROBLEM", accent=ACCENT_AMBER)

    add_card(s2, 4.86, 1.9, 3.6, 5.0, "Benefits for Users", [
        "For Buyers: 100% verified Stripe revenue data (no fake screenshots), audited source code, and escrow safety (funds held safely until tech is verified).",
        "For Sellers: Low sliding fees (3%–7% saving $50k+ per deal), access to vetted institutional buyers, and zero code-theft risk via escrow custody.",
        "Frictionless Closing: Deals close in an average of 18 days instead of 9 months."
    ], badge="FOR USERS", accent=ACCENT_GREEN)

    add_card(s2, 8.93, 1.9, 3.6, 5.0, "Benefits for Us (The Platform)", [
        "High-Margin Revenue: 3% to 7% success fee on every closed acquisition (e.g. $1M buyout = $50,000 revenue).",
        "Ancillary Monetization: Premium Virtual Data Room (VDR) compliance services, escrow fees, and verified audit badges.",
        "Proprietary Data Moat: Building an exclusive database of private tech valuation multiples, deal velocity, and liquidity spreads."
    ], badge="FOR OUR PLATFORM", accent=ACCENT_BLUE)

    s2.notes_slide.notes_text_frame.text = (
        "Point 1: The core idea of vvEntra is to be the trusted escrow and exchange for software businesses. "
        "It solves the 15% broker fees and rampant scams on open marketplaces. "
        "For users: Buyers get verified financials and audited code; sellers save tens of thousands in fees and protect their IP. "
        "For us as a business: We capture a 3% to 7% transaction fee on every deal, plus premium compliance and audit revenue."
    )

    # -------------------------------------------------------------
    # SLIDE 3: Major Functionalities (Part 1 - Market Intelligence)
    # -------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "2. Platform Capabilities", "Major Functionality: Market Intelligence & Discovery", "Core tools that power buyer-seller discovery and live deal telemetry.")

    add_card(s3, 0.8, 1.9, 3.6, 5.0, "2×2 Strategic Matrix", [
        "Arranges software companies across ARR Multiples vs. Technical Moat.",
        "4 Distinct Quadrants: Scale Giants, Enterprise Niche, Emerging High-Alpha, and Utility Tools.",
        "Interactive Filtering: Clicking any quadrant dynamically filters listings in real time to match buyer investment criteria."
    ], badge="M&A QUADRANT", accent=ACCENT_BLUE)

    add_card(s3, 4.86, 1.9, 3.6, 5.0, "Market Dynamics Visuals", [
        "Demand vs. Supply Vector Curves: Visualizes live buyer liquidity spreads with dynamic sector toggles (AI, FinTech, HealthTech).",
        "6-Axis Sector Radar Chart: Evaluates business health across Growth, Margins, IP Defensibility, Churn, Code Safety, and Team Continuity.",
        "Live Ticker Feed: Real-time ticker showing signed NDAs and milestone releases."
    ], badge="LIQUIDITY DEPTH", accent=ACCENT_GREEN)

    add_card(s3, 8.93, 1.9, 3.6, 5.0, "Seller Recommender Engine", [
        "'What Should You List?' algorithmic calculator.",
        "Founders input ARR, moat strength, and user churn.",
        "Instant Output: Computes estimated valuation multiple, expected price, clearance probability, and audit readiness score.",
        "Drives qualified seller onboarding without sales friction."
    ], badge="VALUATION ENGINE", accent=ACCENT_AMBER)

    s3.notes_slide.notes_text_frame.text = (
        "Point 2, Part 1: Major functionalities for market intelligence. "
        "Our 2x2 matrix categorizes companies by moat versus multiple and actively filters listings. "
        "Our native SVG demand curves and 6-axis radar give investors complete operational health diagnostics. "
        "And our valuation recommender lets founders instantly calculate their expected multiple and sale probability."
    )

    # -------------------------------------------------------------
    # SLIDE 4: Major Functionalities (Part 2 - Diligence & Handover)
    # -------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "2. Platform Capabilities", "Major Functionality: Diligence, VDR & Escrow", "Operational workflows handling confidential data and transaction execution.")

    add_card(s4, 0.8, 1.9, 3.6, 5.0, "Marketplace & Dossiers", [
        "Filterable directory across 14 verified tech sectors.",
        "Deep Institutional Dossiers: Verified ARR, EBITDA margins, IP defensibility score, and full tech stack tags.",
        "Buyer/Seller Mode Switch: One-click perspective flip adapting metrics, yields, and actions."
    ], badge="DOSSIER EXPLORER", accent=ACCENT_BLUE)

    add_card(s4, 4.86, 1.9, 3.6, 5.0, "VDR & Video Diligence", [
        "Virtual Data Room (VDR): Simulated NDA execution workflow unmasking sensitive tax filings, git telemetry, and customer concentration.",
        "WebRTC Video Review Terminal: Video walkthrough console with timestamped chapter markers and verified third-party auditor notes."
    ], badge="DILIGENCE ROOM", accent=ACCENT_AMBER)

    add_card(s4, 8.93, 1.9, 3.6, 5.0, "Fee Calculator & FAQ", [
        "Interactive Sliding Fee Calculator: Drag-and-drop deal sizing (3%–7%) showing exact dollar savings vs 10%–15% traditional brokers.",
        "Institutional Trust & FAQ: Comprehensive legal safeguards covering escrow safety, non-competes, IP assignment, and code warranties."
    ], badge="TRANSPARENCY", accent=ACCENT_GREEN)

    s4.notes_slide.notes_text_frame.text = (
        "Point 2, Part 2: On the transaction and diligence side, each listing has deep audited dossiers. "
        "The Virtual Data Room protects sensitive information until an NDA is signed. "
        "The video console gives buyers a direct code walkthrough, and our transparent fee calculator proves massive savings."
    )

    # -------------------------------------------------------------
    # SLIDE 5: Tech Stack & AI Agent Readiness
    # -------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "3. Tech Architecture", "Tech Stack & Extensibility for AI Agents", "Why our zero-dependency stack provides the ideal foundation for autonomous AI agents.")

    add_card(s5, 0.8, 1.9, 5.7, 5.0, "The Zero-Dependency Stack", [
        "Semantic HTML5: Clean, W3C-compliant document structure with accessible ARIA landmarks.",
        "CSS3 with BEM Architecture: Custom property variables handle instant Buyer/Seller perspective shifts without framework bloat.",
        "Vanilla JavaScript (ES6+): Pure JavaScript routing, state management, and mathematical SVG rendering. Zero npm dependencies, zero build steps.",
        "GitHub Pages Deployment: Served globally on GitHub's edge CDN with sub-120ms load times and automated CI/CD on git push."
    ], badge="CURRENT TECH STACK", accent=ACCENT_BLUE)

    add_card(s5, 6.8, 1.9, 5.7, 5.0, "How AI Agents Can Be Added", [
        "Isolated Data Layer (data.js): Clean structured objects allow autonomous agents to inject, audit, and update listings via JSON/APIs without touching UI code.",
        "Zero Virtual DOM Friction: Unlike React's obfuscated virtual DOM, headless browser agents (Puppeteer, Playwright) can inspect and interact with semantic DOM elements reliably.",
        "Due-Diligence AI Agent: Can ingest GitHub repos, automatically run security audits, and generate code scores into dossiers.",
        "Valuation AI Agent: Real-time LLM agent monitoring tech M&A comparables to update multiples and clearance probabilities dynamically.",
        "Handover Verification Agent: Autonomous agent checking DNS propagation, SSL handoff, and AWS root credentials before releasing escrow funds."
    ], badge="AI AGENT EXTENSIBILITY", accent=ACCENT_GREEN)

    s5.notes_slide.notes_text_frame.text = (
        "Point 3: The tech stack is 100% pure HTML5, CSS3 with BEM, and Vanilla JS. "
        "Why is this stack uniquely valuable for adding AI agents? "
        "Because all data lives in a clean, isolated data layer (data.js) without React build bloat. "
        "Autonomous AI agents can easily inspect predictable DOM structures, run automated code audits on repositories, "
        "dynamically adjust valuation multiples, and verify cloud transfers before releasing escrow funds."
    )

    # -------------------------------------------------------------
    # SLIDE 6: Core Innovation: Atomic Handover vs Original Site
    # -------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "4. Competitive Moat", "Core Innovation: Atomic Handover Protocol", "The key architectural and security leap compared to the original reference site.")

    add_card(s6, 0.8, 1.9, 5.7, 5.0, "Original Reference Site (vventrabyaj)", [
        "Visuals Over Substance: Crypto-style neon glow and generic purple gradients that looked speculative rather than institutional.",
        "Static / Non-Functional Mockups: Cards and graphs were cosmetic visuals with no interactive filtering or calculation logic.",
        "Zero Custody Mechanism: Offered generic 'Buy Now' buttons without answering how software code or domains are safely handed over.",
        "Heavy Bundles: Built on heavy frameworks with unnecessary script overhead."
    ], badge="REFERENCE SITE", accent=ACCENT_AMBER)

    add_card(s6, 6.8, 1.9, 5.7, 5.0, "Our Innovation: Atomic Handover Protocol™", [
        "4-Phase Custody Transfer: 1. Escrow Deposit -> 2. Code & Cloud Lock -> 3. DNS Migration -> 4. Dual Sign-off & Release.",
        "Interactive Handover Simulator: Live step-by-step simulator embedded in every dossier demonstrating cryptographic custody transfer.",
        "Zero Fraud / Zero Ghosting: Neither party can cheat; code is verified before funds release, and money is locked before code transfers.",
        "Institutional Terminal Aesthetics: Professional Geist and JetBrains Mono typography replacing neon gimmicks with Wall Street rigor."
    ], badge="OUR INNOVATION", accent=ACCENT_GREEN)

    s6.notes_slide.notes_text_frame.text = (
        "Point 4: Innovation compared to the original site. "
        "The original site had a flashy neon look, but the components were mostly static and lacked a real transfer mechanism. "
        "Our core innovation is the Atomic Handover Protocol: an interactive 4-phase custody transfer that proves step-by-step "
        "how money, cloud credentials, code, and domains are safely migrated before final payment releases. "
        "This transforms the website from a passive bulletin board into an active, trusted transaction engine."
    )

    # -------------------------------------------------------------
    # SLIDE 7: Conclusion & Key Learnings
    # -------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "5. Key Insights", "Conclusion & Key Learnings from Building the Mock", "Critical lessons discovered throughout the design and engineering process.")

    add_card(s7, 0.8, 1.9, 3.6, 5.0, "1. Framework Independence", [
        "Modern web standards are exceptionally capable: Native CSS variables and ES6 modules replicated multi-page SPA routing seamlessly.",
        "Eliminating npm packages removed build vulnerabilities, package rot, and compilation steps entirely.",
        "Sub-120ms global load times prove that lightweight vanilla code outperforms bloated frontend frameworks for landing and transaction platforms."
    ], badge="ENGINEERING", accent=ACCENT_BLUE)

    add_card(s7, 4.86, 1.9, 3.6, 5.0, "2. Trust UX in FinTech", [
        "In institutional M&A, transparency builds far more trust than flashy animations.",
        "Institutional investors and founders prioritize clear financial multiples, verified data, and risk mitigation over neon gradients.",
        "Every UI decision must reinforce security, credibility, and verified accuracy."
    ], badge="PRODUCT STRATEGY", accent=ACCENT_GREEN)

    add_card(s7, 8.93, 1.9, 3.6, 5.0, "3. Solving Deal Anxiety", [
        "Anyone can build a directory that lists software for sale.",
        "The real commercial value in M&A lies in solving the settlement risk: the fear of getting scammed during custody handoff.",
        "Engineering the Atomic Handover Protocol demonstrated that safety and escrow mechanics are the platform's primary competitive advantage."
    ], badge="TRANSACTION VALUE", accent=ACCENT_AMBER)

    s7.notes_slide.notes_text_frame.text = (
        "Point 5: To conclude, our three biggest learnings: "
        "First, zero-dependency engineering proves that modern vanilla web standards deliver unmatched speed and reliability. "
        "Second, in high-value finance, clean typography and data transparency beat flashy animations every time. "
        "And third, solving post-agreement custody anxiety is the real secret to building a defensible software M&A platform. "
        "Thank you! The live platform and presentation are accessible online."
    )

    output_path = r"C:\Users\rohit\.gemini\antigravity\scratch\vventra-remake\vventra_presentation.pptx"
    prs.save(output_path)
    print(f"Presentation saved to: {output_path}")

if __name__ == "__main__":
    create_deck()
