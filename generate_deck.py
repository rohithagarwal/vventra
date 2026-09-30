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

    # Clean, quiet, high-contrast palette (zero noise)
    BG_COLOR = RGBColor(15, 23, 42)       # Slate 900
    CARD_BG = RGBColor(30, 41, 59)        # Slate 800
    CARD_BORDER = RGBColor(51, 65, 85)    # Slate 700
    TEXT_TITLE = RGBColor(255, 255, 255)  # Pure White
    TEXT_BODY = RGBColor(226, 232, 240)   # Slate 200
    TEXT_MUTED = RGBColor(148, 163, 184)  # Slate 400
    ACCENT_BLUE = RGBColor(56, 189, 248)  # Sky Blue
    ACCENT_GREEN = RGBColor(74, 222, 128) # Emerald Green

    blank_layout = prs.slide_layouts[6]

    def set_slide_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()
        return bg

    def add_header(slide, slide_num, title_text, subtitle_text=""):
        # Category label
        tb_num = slide.shapes.add_textbox(Inches(0.9), Inches(0.55), Inches(5.0), Inches(0.35))
        p_num = tb_num.text_frame.paragraphs[0]
        p_num.text = f"SLIDE {slide_num} · VVENTRA OVERVIEW"
        p_num.font.size = Pt(10)
        p_num.font.bold = True
        p_num.font.color.rgb = ACCENT_BLUE

        # Main Title
        tb_title = slide.shapes.add_textbox(Inches(0.9), Inches(0.85), Inches(11.5), Inches(0.65))
        p_title = tb_title.text_frame.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_TITLE

        # Subtitle
        if subtitle_text:
            tb_sub = slide.shapes.add_textbox(Inches(0.9), Inches(1.45), Inches(11.5), Inches(0.45))
            p_sub = tb_sub.text_frame.paragraphs[0]
            p_sub.text = subtitle_text
            p_sub.font.size = Pt(12)
            p_sub.font.color.rgb = TEXT_MUTED

    def add_card(slide, left, top, width, height, title, bullets, title_color=ACCENT_BLUE):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1.2)

        tb = slide.shapes.add_textbox(Inches(left + 0.3), Inches(top + 0.25), Inches(width - 0.6), Inches(height - 0.5))
        tf = tb.text_frame
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        p0.text = title
        p0.font.size = Pt(15)
        p0.font.bold = True
        p0.font.color.rgb = title_color

        for b in bullets:
            p = tf.add_paragraph()
            p.text = f"• {b}"
            p.font.size = Pt(11.5)
            p.font.color.rgb = TEXT_BODY
            p.space_before = Pt(8)

    # -------------------------------------------------------------
    # SLIDE 1: Title Slide (Simple & Clean)
    # -------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s1)

    card1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.5), Inches(11.333), Inches(4.5))
    card1.fill.solid()
    card1.fill.fore_color.rgb = CARD_BG
    card1.line.color.rgb = CARD_BORDER
    card1.line.width = Pt(1.5)

    tb1 = s1.shapes.add_textbox(Inches(1.5), Inches(2.1), Inches(10.3), Inches(3.3))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "vvEntra"
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = TEXT_TITLE

    p2 = tf1.add_paragraph()
    p2.text = "A Safe Marketplace to Buy & Sell Software Businesses"
    p2.font.size = Pt(20)
    p2.font.color.rgb = ACCENT_BLUE
    p2.space_before = Pt(8)

    p3 = tf1.add_paragraph()
    p3.text = "An institutional platform where developers and investors trade software, apps, and digital IP safely without getting scammed."
    p3.font.size = Pt(13)
    p3.font.color.rgb = TEXT_BODY
    p3.space_before = Pt(14)

    p4 = tf1.add_paragraph()
    p4.text = "Live Website: https://rohithagarwal.github.io/vventra/   |   Repository: github.com/rohithagarwal/vventra"
    p4.font.size = Pt(11)
    p4.font.color.rgb = ACCENT_GREEN
    p4.space_before = Pt(24)

    s1.notes_slide.notes_text_frame.text = (
        "Hello everyone. Today I'm presenting vvEntra. "
        "vvEntra is an online platform for buying and selling software businesses safely. "
        "I built the website with clean, pure code and zero external dependencies, "
        "and added an Atomic Handover Protocol so that neither the buyer nor the seller can get scammed."
    )

    # -------------------------------------------------------------
    # SLIDE 2: Core Idea & Problem Solved
    # -------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s2)
    add_header(s2, "01", "Core Idea, Problem Solved & Benefits", "Why software M&A is broken today and how vvEntra solves it.")

    add_card(s2, 0.9, 2.1, 3.6, 4.7, "The Problem", [
        "Expensive Middlemen: Traditional brokers charge 10% to 15% and take 6 to 12 months.",
        "Fake Screenshots: Public websites are full of fake revenue numbers and copied code.",
        "Settlement Fear: Buyers fear paying and getting ghosted; sellers fear handing over code without payment."
    ], title_color=RGBColor(251, 191, 36))

    add_card(s2, 4.86, 2.1, 3.6, 4.7, "Benefits for the User", [
        "For Buyers: Real earnings verified directly by Stripe, clean code audits, and money held safely in escrow.",
        "For Sellers: Low fees (3% to 7% saving $50k+), serious buyers, and code is never handed over until full funds are locked.",
        "Fast Timeline: Deals close in an average of 18 days instead of nearly a year."
    ], title_color=ACCENT_GREEN)

    add_card(s2, 8.83, 2.1, 3.6, 4.7, "Benefits for Us (Business)", [
        "Clean Revenue Model: We take a transparent fee on every sale (90% to seller / 10% to vvEntra).",
        "Extra Services: Revenue from technical code audits, escrow fees, and private deal room access.",
        "Market Data: We build a real database of what software companies actually sell for."
    ], title_color=ACCENT_BLUE)

    s2.notes_slide.notes_text_frame.text = (
        "Point 1: What is the core idea? Think of it like a trusted real estate service, but for software companies. "
        "It solves three problems: high broker fees, fake screenshots, and the fear of getting cheated. "
        "Buyers get verified numbers and escrow safety. Sellers save tens of thousands in fees and protect their code. "
        "And for our platform, we operate on a clean 90/10 split on successful sales."
    )

    # -------------------------------------------------------------
    # SLIDE 3: Major Features of the Website
    # -------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s3)
    add_header(s3, "02", "Each Major Functionality of the Website", "What users can actually see, click, and do on the platform.")

    add_card(s3, 0.9, 2.1, 3.6, 4.7, "Market Dashboard", [
        "Buyer / Seller Switch: One click changes the view to show what buyers care about (returns) or what sellers care about (valuations).",
        "2×2 Market Grid: Groups software into 4 simple buckets. Clicking any box filters the marketplace in real time.",
        "Supply & Demand Chart: Shows which categories (like AI or FinTech) have the highest buyer interest."
    ], title_color=ACCENT_BLUE)

    add_card(s3, 4.86, 2.1, 3.6, 4.7, "Valuation & Browse", [
        "Price Calculator: A tool for sellers. You enter your annual revenue, and it calculates your estimated selling price and chance of selling.",
        "Browse Marketplace: Search and filter companies by sector (AI, SaaS, FinTech, DevTools) with real monthly earnings, profit, and tech stack shown."
    ], title_color=ACCENT_GREEN)

    add_card(s3, 8.83, 2.1, 3.6, 4.7, "Diligence & Pricing", [
        "Virtual Data Room (VDR): A locked room where buyers can view private tax files and code stats after signing a digital NDA.",
        "Video Diligence Console: An embedded video player where the founder walks through the code architecture.",
        "Fee Calculator: A slider showing exact dollar savings compared to traditional 10%–15% brokers."
    ], title_color=RGBColor(251, 191, 36))

    s3.notes_slide.notes_text_frame.text = (
        "Point 2: Here are the main features of the website. "
        "First, a top switch that flips between Buyer and Seller mode. "
        "Second, a dashboard with an interactive 2x2 grid to filter companies and charts showing market demand. "
        "Third, a calculator that tells founders what their software is worth. "
        "Fourth, a clean marketplace to search apps. "
        "And fifth, a private data room to view sensitive business records safely."
    )

    # -------------------------------------------------------------
    # SLIDE 4: Technology Stack Used
    # -------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s4)
    add_header(s4, "03", "The Technology Stack Used", "Built with clean web standards, zero extra libraries, and AI-agent readiness.")

    add_card(s4, 0.9, 2.1, 5.7, 4.7, "Tech Stack Used in the Project", [
        "HTML5: Semantic, accessible page structure powering an 8-view Single Page Application (SPA).",
        "CSS3: Strict BEM architecture with native CSS custom properties for instant role and theme switching (no Tailwind/Bootstrap bloat).",
        "Vanilla JavaScript (ES6+): Pure JavaScript for client-side routing, state management, and mathematical SVG chart drawing. Zero npm packages, zero React, and zero build steps.",
        "Git & GitHub Pages: Version-controlled on GitHub and deployed globally with sub-120ms load speeds."
    ], title_color=ACCENT_BLUE)

    add_card(s4, 6.9, 2.1, 5.5, 4.7, "How AI Agents Can Be Added", [
        "Clean Data Layer (data.js): All listings and numbers live in one structured file. AI agents can easily add, audit, and update listings via APIs.",
        "No Hidden React Code: Because the HTML is clean and direct, AI browser tools can easily click buttons, search listings, and read text.",
        "AI Agents We Can Add Easily:",
        "  • Code Audit AI: Automatically scans GitHub repos and outputs a code safety score.",
        "  • Valuation AI: Checks recent sales and updates price estimates automatically.",
        "  • Q&A Chatbot AI: Answers buyers' questions inside the private data room."
    ], title_color=ACCENT_GREEN)

    s4.notes_slide.notes_text_frame.text = (
        "Point 3: For our tech stack, we kept it clean and direct: pure HTML5, CSS3, and Vanilla JavaScript with zero extra libraries. "
        "No React, no npm packages, and no build steps. "
        "Why is this helpful for adding AI agents? "
        "Because all data lives in a clean data file (data.js), and the web code is completely transparent without complex React layers. "
        "AI agents can easily connect to it to scan code, update valuations, or answer questions inside the data room."
    )

    # -------------------------------------------------------------
    # SLIDE 5: Core Innovation: Atomic Handover Protocol
    # -------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s5)
    add_header(s5, "04", "Our Innovation: The Atomic Handover Protocol™", "A safe 4-step escrow transfer that eliminates code theft and payment risk.")

    add_card(s5, 0.9, 2.1, 5.7, 4.7, "The Problem in the Original Website", [
        "Flashy Graphics Over Substance: Used heavy neon purple colors and glows that looked like a video game or crypto token.",
        "Buttons Did Not Work: Many cards and charts were just pictures that you could not click or interact with.",
        "No Safe Transfer Method: Only had a basic 'Buy' button, with no answer to how code or money is actually protected."
    ], title_color=RGBColor(251, 191, 36))

    add_card(s5, 6.9, 2.1, 5.5, 4.7, "Our Safe 4-Step Handover Protocol", [
        "Phase 01 · Escrow Deposit: Buyer deposits 100% of purchase funds ($380,000) into vvEntra escrow before any code moves.",
        "Phase 02 · Code & Cloud Lock: Seller safely transfers the GitHub code repository and AWS/cloud servers into safe custody.",
        "Phase 03 · Domain Migration: Website domain name and live traffic are moved to the buyer with zero downtime.",
        "Phase 04 · Testing & Payout: Buyer tests the app; once confirmed, seller receives 90% ($342,000) and vvEntra retains 10% ($38,000).",
        "Live Interactive Simulator: A live simulator on every listing lets users click and watch the 4 steps happen in real time."
    ], title_color=ACCENT_GREEN)

    s5.notes_slide.notes_text_frame.text = (
        "Point 4: What is our main innovation compared to the original site? "
        "The original site had flashy neon colors, but the buttons didn't work and there was no way to safely transfer apps. "
        "We built the Safe 4-Step Handover system: first, the buyer deposits 100% of the funds in escrow. "
        "Second, code and cloud servers are locked in custody. Third, the domain is moved. "
        "And fourth, once the buyer tests and confirms, the seller gets 90% and vvEntra retains 10%. "
        "We also built an interactive live simulator right on the page so anyone can test it."
    )

    # -------------------------------------------------------------
    # SLIDE 6: Conclusion & Key Learnings
    # -------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s6)
    add_header(s6, "05", "Conclusion & Key Learnings", "The three main lessons learned while building this platform.")

    add_card(s6, 0.9, 2.1, 3.6, 4.7, "1. Simple Code is Fast", [
        "We didn't need big frameworks like React to build an interactive multi-page website.",
        "Pure HTML, CSS, and Vanilla JavaScript loaded in under 120ms with zero extra installs.",
        "Fewer libraries mean fewer bugs, zero security warnings, and zero maintenance headaches."
    ], title_color=ACCENT_BLUE)

    add_card(s6, 4.86, 2.1, 3.6, 4.7, "2. Clear Info Builds Trust", [
        "In business and finance, people care about honest numbers, not glowing neon buttons.",
        "Clean tables, verified Stripe data, and clear fee breakdowns build real confidence with buyers and sellers.",
        "Simple, plain design looks far more serious and professional."
    ], title_color=ACCENT_GREEN)

    add_card(s6, 8.83, 2.1, 3.6, 4.7, "3. Safety is What Sells", [
        "Anyone can build a website that lists software for sale.",
        "The real commercial value is making sure nobody gets scammed when handing over code and money.",
        "Building the safe 4-step handover is what makes this platform genuinely useful and valuable."
    ], title_color=RGBColor(251, 191, 36))

    s6.notes_slide.notes_text_frame.text = (
        "Point 5: To wrap up, our three biggest learnings: "
        "First, simple code is faster and easier to maintain than heavy frameworks. "
        "Second, clean numbers and honest data build much more trust than flashy animations. "
        "And third, solving the safety problem of handing over code is what gives this platform real value. "
        "The website is live and ready to view. Thank you!"
    )

    output_path = r"C:\Users\rohit\.gemini\antigravity\scratch\vventra-remake\vventra_presentation.pptx"
    prs.save(output_path)
    print(f"Clean presentation saved to: {output_path}")

if __name__ == "__main__":
    create_deck()
