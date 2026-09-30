/**
 * vvEntra · Institutional Venture Asset Database
 * Structured registry of verified operational assets, sector transaction metrics, and diligence records.
 */

const VVENTRA_DATA = {
  // Sector demand indices and transaction spreads based on institutional buyer allocations
  sectors: [
    {
      id: 'sec-01',
      name: 'Automated Operations & Workflow Systems',
      industry: 'Enterprise Software',
      buyerDemandIndex: 94,
      availableListings: 28,
      marketGap: '+66 pts',
      trailing7dChange: '+24%',
      medianUnlockValuation: '$6,400',
      status: 'high-demand'
    },
    {
      id: 'sec-02',
      name: 'Regulatory Compliance Automation',
      industry: 'RegTech',
      buyerDemandIndex: 88,
      availableListings: 22,
      marketGap: '+66 pts',
      trailing7dChange: '+19%',
      medianUnlockValuation: '$7,200',
      status: 'high-demand'
    },
    {
      id: 'sec-03',
      name: 'Commercial Underwriting Infrastructure',
      industry: 'Fintech',
      buyerDemandIndex: 86,
      availableListings: 34,
      marketGap: '+52 pts',
      trailing7dChange: '+15%',
      medianUnlockValuation: '$5,800',
      status: 'active'
    },
    {
      id: 'sec-04',
      name: 'Industrial Telemetry & Environmental Auditing',
      industry: 'ClimateTech',
      buyerDemandIndex: 82,
      availableListings: 31,
      marketGap: '+51 pts',
      trailing7dChange: '+12%',
      medianUnlockValuation: '$8,500',
      status: 'active'
    },
    {
      id: 'sec-05',
      name: 'Clinical Health & Direct Sourcing Infrastructure',
      industry: 'Healthcare & Consumer',
      buyerDemandIndex: 79,
      availableListings: 42,
      marketGap: '+37 pts',
      trailing7dChange: '+8%',
      medianUnlockValuation: '$4,800',
      status: 'stable'
    },
    {
      id: 'sec-06',
      name: 'Multi-Modal Logistics Orchestration',
      industry: 'Logistics',
      buyerDemandIndex: 76,
      availableListings: 45,
      marketGap: '+31 pts',
      trailing7dChange: '+6%',
      medianUnlockValuation: '$6,900',
      status: 'stable'
    },
    {
      id: 'sec-07',
      name: 'Vertical ERP for Mid-Market Manufacturing',
      industry: 'Industrial Software',
      buyerDemandIndex: 84,
      availableListings: 55,
      marketGap: '+29 pts',
      trailing7dChange: '+9%',
      medianUnlockValuation: '$5,500',
      status: 'stable'
    },
    {
      id: 'sec-08',
      name: 'Digital Distribution & Paid Community Infrastructure',
      industry: 'Digital Commerce',
      buyerDemandIndex: 70,
      availableListings: 48,
      marketGap: '+22 pts',
      trailing7dChange: '+4%',
      medianUnlockValuation: '$4,200',
      status: 'stable'
    },
    {
      id: 'sec-09',
      name: 'Outpatient Clinic Operating Systems',
      industry: 'HealthTech',
      buyerDemandIndex: 68,
      availableListings: 50,
      marketGap: '+18 pts',
      trailing7dChange: '+2%',
      medianUnlockValuation: '$5,100',
      status: 'stable'
    },
    {
      id: 'sec-10',
      name: 'Agricultural Sensing Hardware & GIS',
      industry: 'AgriTech',
      buyerDemandIndex: 62,
      availableListings: 52,
      marketGap: '+10 pts',
      trailing7dChange: '-1%',
      medianUnlockValuation: '$4,500',
      status: 'balanced'
    },
    {
      id: 'sec-11',
      name: 'Distributed Network Access & Security',
      industry: 'Cybersecurity',
      buyerDemandIndex: 65,
      availableListings: 60,
      marketGap: '+5 pts',
      trailing7dChange: '-3%',
      medianUnlockValuation: '$7,000',
      status: 'balanced'
    },
    {
      id: 'sec-12',
      name: 'Automated Commercial Kitchen Equipment',
      industry: 'Food Equipment',
      buyerDemandIndex: 54,
      availableListings: 58,
      marketGap: '-4 pts',
      trailing7dChange: '-5%',
      medianUnlockValuation: '$6,200',
      status: 'oversupplied'
    },
    {
      id: 'sec-13',
      name: 'Consumer Subscription Management Systems',
      industry: 'Consumer Goods',
      buyerDemandIndex: 42,
      availableListings: 68,
      marketGap: '-26 pts',
      trailing7dChange: '-11%',
      medianUnlockValuation: '$3,200',
      status: 'oversupplied'
    },
    {
      id: 'sec-14',
      name: 'Outbound Prospecting & Lead Data Brokering',
      industry: 'Sales Operations',
      buyerDemandIndex: 38,
      availableListings: 74,
      marketGap: '-36 pts',
      trailing7dChange: '-16%',
      medianUnlockValuation: '$2,800',
      status: 'oversupplied'
    }
  ],

  // Audited Operational Asset Listings
  opportunities: [
    {
      id: 'VVE-2440',
      title: 'Automated Inventory QA & Vendor Routing System for E-Commerce',
      summary: 'A turnkey operational infrastructure engineered to automate catalogue QA, supplier handoffs, and inventory reconciliation for brands operating between $2M and $15M in annual GMV.',
      industry: 'Digital Commerce',
      tags: ['E-Commerce Operations', 'Inventory Automation', 'Supply Chain'],
      status: 'Audited & Active',
      targetJurisdiction: 'United States, United Kingdom, Australia',
      capitalRequirement: '$35,000 - $65,000',
      implementationTimeline: '60 - 90 Days',
      valuation: 28000,
      escrowDeposit: 2800,
      trustRating: 98,
      pageCount: 114,
      frameworkCount: 18,
      operator: {
        name: 'Amit Jain',
        title: 'Former Vice President of Operations, 2x Exited E-Commerce Operator',
        verifiedIdentity: true,
        historicalTransactions: '$18M & $7.4M Strategic Exits',
        peerReviewScore: 4.95,
        totalCompletedTransfers: 7
      },
      commercialParameters: {
        addressableMarket: '$4.2B Mid-Market E-Commerce Operations',
        targetMarginImprovement: '3.4x Operating Margin Expansion',
        paybackPeriod: '5.2 Months'
      },
      executiveAbstract: 'Mid-market consumer brands frequently face severe operational friction when scaling past $2M GMV due to manual intervention in product cataloging, supplier exception handling, and 3PL routing. This package provides the complete technical architecture, API integration specs, and SOP documentation required to transition operations to an autonomous 3-person team within 90 days.',
      operationalProblem: 'Inventory data and supplier communications are fragmented across unmonitored messaging threads and ad-hoc spreadsheets. Operational exceptions require executive intervention, which directly compresses gross margins and depresses valuation multiples during institutional acquisition diligence.',
      solutionArchitecture: 'A unified operational data pipeline integrating Shopify Plus, ERP systems (NetSuite/Cin7), and 3PL warehouse management systems with automated webhook error handling and decision trees.',
      commercialModel: 'Enterprise deployment model with setup fee ($30,000) and recurring monthly maintenance SLA ($3,500/month) delivering 82% gross operating margin.',
      riskFactors: 'Legacy ERP API rate limits, supplier onboarding cycle variance, and regional carrier protocol changes.',
      deliverablesPackage: [
        '114-Page Operational System Architecture & Specifications (PDF)',
        'Three-Statement Financial Pro-Forma & Working Capital Model (XLSX)',
        'Supplier Quality Assurance Protocol & Exception Decision Matrix (PDF)',
        'Webhook Integration Schematics & Automation Scripts (JSON / Repo Access)',
        'Post-Acquisition Operational Transition & Training Manual (PDF)'
      ]
    },
    {
      id: 'VVE-2438',
      title: 'Standardized Botanical Extraction & Regulatory GTM Framework',
      summary: 'A complete supply chain, clinical assay documentation, and regulatory compliance blueprint for clean-label herbal wellness brands entering premium export markets.',
      industry: 'Healthcare & Consumer',
      tags: ['Healthcare', 'Supply Chain', 'Regulatory Compliance'],
      status: 'Audited & Active',
      targetJurisdiction: 'India, United Arab Emirates, North America',
      capitalRequirement: '$50,000 - $120,000',
      implementationTimeline: '90 - 120 Days',
      valuation: 18500,
      escrowDeposit: 1850,
      trustRating: 96,
      pageCount: 98,
      frameworkCount: 14,
      operator: {
        name: 'Devika Sharma',
        title: 'Former Head of Consumer Product Strategy, Dabur Healthcare',
        verifiedIdentity: true,
        historicalTransactions: '12 Commercial Brand Launches in APAC',
        peerReviewScore: 4.92,
        totalCompletedTransfers: 4
      },
      commercialParameters: {
        addressableMarket: '$1.2B Standardized Herbal Formulations',
        targetMarginImprovement: '68% Blended Product Gross Margin',
        paybackPeriod: '8.4 Months'
      },
      executiveAbstract: 'Institutional buyers in the consumer health segment face persistent quality hurdles when attempting to scale botanical products internationally. This asset delivers verified GMP-certified supplier agreements, FDA/AYUSH regulatory filings, and standardized extraction protocols to ensure lab-verified consistency.',
      operationalProblem: 'Unstandardized agricultural raw material sourcing leads to heavy metal variability and failed batch certifications, resulting in regulatory import rejections and high customer return rates.',
      solutionArchitecture: 'Contracted agricultural co-operative supply network with pre-negotiated volume pricing, third-party laboratory verification workflows, and tamper-evident packaging specs.',
      commercialModel: 'Direct-to-consumer replenishment subscription paired with commercial pharmacy distribution partnerships.',
      riskFactors: 'Agricultural harvest yield seasonality and changing international heavy-metal threshold regulations.',
      deliverablesPackage: [
        'GMP Manufacturing Partner Contracts & Pre-Negotiated Terms (PDF)',
        'FDA & AYUSH Export Regulatory Dossiers & Filing Protocols (PDF)',
        'Standardized Batch-Testing Clinical Validation Schematics (PDF)',
        'Unit Economics, Inventory Turnover, and Cash-Flow Model (XLSX)'
      ]
    },
    {
      id: 'VVE-2436',
      title: 'Automated Regulatory Compliance Telemetry for Manufacturing Plants',
      summary: 'An autonomous compliance monitoring system that ingests plant telemetry and generates validated filings for OSHA, ISO 9001, and environmental emission thresholds.',
      industry: 'RegTech',
      tags: ['Industrial AI', 'RegTech', 'Manufacturing Operations'],
      status: 'Audited & Active',
      targetJurisdiction: 'United States (Midwest), Germany',
      capitalRequirement: '$40,000 - $80,000',
      implementationTimeline: '45 - 60 Days',
      valuation: 32000,
      escrowDeposit: 3200,
      trustRating: 99,
      pageCount: 132,
      frameworkCount: 22,
      operator: {
        name: 'Dr. Marcus Vance',
        title: 'Former Automation Systems Director, Siemens Industrial',
        verifiedIdentity: true,
        historicalTransactions: 'Co-Founder, Industrial Data Systems (Acquired 2023)',
        peerReviewScore: 4.98,
        totalCompletedTransfers: 9
      },
      commercialParameters: {
        addressableMarket: '$3.8B Industrial Compliance Software',
        targetMarginImprovement: '78% Audit Preparation Labor Reduction',
        paybackPeriod: '3.1 Months'
      },
      executiveAbstract: 'Mid-sized manufacturing facilities expend thousands of engineering hours manually cross-referencing sensor logs and safety reports for statutory audits. This software and systems package automates ingestion, validation, and regulatory filing with verified audit trails.',
      operationalProblem: 'Statutory non-compliance fines have increased by 40% year-over-year, yet mid-market plants cannot justify multimillion-dollar enterprise software implementations with multi-year rollout delays.',
      solutionArchitecture: 'Containerized edge ingestion pipeline connecting to standard SCADA/PLC controllers with air-gapped local processing and automated XML reporting.',
      commercialModel: 'Annual recurring license of $26,400 per facility with 94% retention rate and low ongoing support requirements.',
      riskFactors: 'Plant IT air-gap policies and legacy serial sensor interface conversion challenges.',
      deliverablesPackage: [
        'Complete Telemetry Ingestion Architecture & Data Pipeline Spec (PDF)',
        'ISO 9001 and OSHA Regulatory Rules Engine Codebase (GitHub Repo)',
        'Commercial Enterprise Pilot Master Services Agreement Template (DOCX)',
        'Security Architecture, Audit Logs & SOC2 Type II Readiness Blueprint (PDF)'
      ]
    },
    {
      id: 'VVE-2434',
      title: 'Cash-Flow Commercial Underwriting Protocol for Tier-2 Enterprises',
      summary: 'A credit scoring and underwriting engine utilizing real-time payment velocity and distributor invoices to evaluate uncollateralized working capital facilities.',
      industry: 'Fintech',
      tags: ['Credit Scoring', 'Commercial Lending', 'Underwriting'],
      status: 'Audited & Active',
      targetJurisdiction: 'India (Tier-2 Industrial Hubs)',
      capitalRequirement: '$100,000 - $250,000',
      implementationTimeline: '90 - 150 Days',
      valuation: 24000,
      escrowDeposit: 2400,
      trustRating: 95,
      pageCount: 108,
      frameworkCount: 16,
      operator: {
        name: 'Rohan Mehra',
        title: 'Former Chief Credit Risk Officer, Non-Bank Financial Intermediary',
        verifiedIdentity: true,
        historicalTransactions: '$120M Commercial Credit Book Supervised',
        peerReviewScore: 4.88,
        totalCompletedTransfers: 5
      },
      commercialParameters: {
        addressableMarket: '$28B SME Credit Deficit',
        targetMarginImprovement: '21.5% Net Portfolio IRR',
        paybackPeriod: '12 Months'
      },
      executiveAbstract: 'Traditional balance-sheet lending excludes cash-flow-rich informal businesses with limited tax records. This operational protocol pairs real-time digital payment reconciliation with anchor-distributor receivables tracking, holding defaults under 2.8%.',
      operationalProblem: 'Standard automated digital lenders rely on credit bureau histories that are non-existent for regional distributors, leading to adverse selection and unsustainable non-performing asset rates.',
      solutionArchitecture: 'Dual verification engine that ingests GST transactional records, bank statement data, and distributor confirmation APIs to establish dynamic credit limits.',
      commercialModel: 'Risk-based loan interest spread (18-22% APR) with partner bank balance sheet syndication fees.',
      riskFactors: 'Central bank statutory lending rule changes and seasonal inventory cycles.',
      deliverablesPackage: [
        'Proprietary Credit Risk Scoring Algorithm & Weighting Matrix (XLSX)',
        'Co-Lending Financial Institution Legal Master Agreement (DOCX)',
        'Anchor Distributor Onboarding & Collection Protocols (PDF)',
        'Regulatory Compliance Checklist & Borrower Rights Disclosures (PDF)'
      ]
    },
    {
      id: 'VVE-2432',
      title: 'Industrial Flue-Gas Spectrometry Appliance & Regulatory Reporting',
      summary: 'A hardware and software system providing continuous particulate and emissions tracking with automated export for statutory carbon tax authorities.',
      industry: 'ClimateTech',
      tags: ['Hardware Engineering', 'Emissions Compliance', 'SaaS'],
      status: 'Audited & Active',
      targetJurisdiction: 'European Union, North America',
      capitalRequirement: '$75,000 - $180,000',
      implementationTimeline: '120 - 180 Days',
      valuation: 26500,
      escrowDeposit: 2650,
      trustRating: 97,
      pageCount: 120,
      frameworkCount: 19,
      operator: {
        name: 'Soren Lindqvist',
        title: 'Former Principal Sensor Architect, ABB Industrial Automation',
        verifiedIdentity: true,
        historicalTransactions: '15 Awarded Patents in Gas Spectrometry',
        peerReviewScore: 4.96,
        totalCompletedTransfers: 6
      },
      commercialParameters: {
        addressableMarket: '$6.5B EU CBAM Regulatory Sector',
        targetMarginImprovement: '4.8x ROI vs Penalty Exposure',
        paybackPeriod: '6.5 Months'
      },
      executiveAbstract: 'The EU Carbon Border Adjustment Mechanism (CBAM) requires certified emissions tracking for industrial exporters. This package pairs an open-architecture optical sensor design with continuous compliance reporting software at a fraction of legacy CEMS cost.',
      operationalProblem: 'Legacy Continuous Emission Monitoring Systems cost upwards of $120,000 per stack, creating capital roadblocks for mid-tier foundries and chemical processors facing regulatory shutdown deadlines.',
      solutionArchitecture: 'Solid-state optical absorption hardware paired with an automated cloud ingestion hub generating verified XML records for national customs authorities.',
      commercialModel: 'Hardware unit procurement margin ($8,500/unit) plus recurring annual calibration and reporting subscription ($16,800/year).',
      riskFactors: 'Extreme thermal stack conditions requiring routine optical purging and extended national laboratory certification timelines.',
      deliverablesPackage: [
        'Complete Hardware Bill of Materials (BOM) & Electrical Schematics (CAD/PDF)',
        'CBAM / EPA Telemetry Compliance Ingestion Software (Source Code Repository)',
        'Anonymized Industrial Foundry Pilot Data & Calibration Reports (PDF)',
        'Component Supply Chain Roster & 10-Year Reliability Model (XLSX)'
      ]
    },
    {
      id: 'VVE-2430',
      title: 'High-AOV Commercial Infrastructure for Specialized Knowledge Assets',
      summary: 'A closed-ecosystem commerce and distribution framework designed for technical domain experts monetizing high-ticket ($500+) advisory cohorts and software assets.',
      industry: 'Digital Commerce',
      tags: ['Digital Products', 'Knowledge Infrastructure', 'Cohort Systems'],
      status: 'Audited & Active',
      targetJurisdiction: 'Global Remote',
      capitalRequirement: '$20,000 - $45,000',
      implementationTimeline: '30 - 60 Days',
      valuation: 16000,
      escrowDeposit: 1600,
      trustRating: 94,
      pageCount: 92,
      frameworkCount: 15,
      operator: {
        name: 'Elena Rostova',
        title: 'Commercial Director, 4x 7-Figure Digital Knowledge Platforms',
        verifiedIdentity: true,
        historicalTransactions: 'Scaled Technical Training Platform to $4.2M Run-Rate',
        peerReviewScore: 4.90,
        totalCompletedTransfers: 8
      },
      commercialParameters: {
        addressableMarket: '$1.8B High-Ticket Technical Education',
        targetMarginImprovement: '48% Net Operating Margin',
        paybackPeriod: '2.8 Months'
      },
      executiveAbstract: 'Specialized technical practitioners generate high organic demand but lack enterprise sales qualification and student lifecycle infrastructure. This operational package provides end-to-end qualification funnels, automated community workflows, and institutional licensing playbooks.',
      operationalProblem: 'Generic consumer course platforms have high churn rates and lack the legal protections, application gating, and billing infrastructure needed for enterprise-sponsored technical cohorts.',
      solutionArchitecture: 'Application-gated qualification funnels with integrated identity verification, automated student progress tracking, and enterprise seat management.',
      commercialModel: 'Direct student tuition alongside annual corporate licensing packages delivering 65% contribution margin.',
      riskFactors: 'Domain expert personnel reliance and curriculum update requirements.',
      deliverablesPackage: [
        'Enterprise Application Funnel Copy, Scripts & Qualification Rubric (DOCX)',
        'Student Lifecycle Operational Protocols & Automation Workflows (PDF)',
        'Corporate Licensing Agreement & Master Services Contract (PDF)',
        'Student Cohort Unit Economics & Retention Cohort Model (XLSX)'
      ]
    }
  ],

  // Frequently Asked Questions (Categorized by Buyer and Operator)
  faqs: {
    buyer: [
      {
        question: 'How is buyer capital protected during due diligence?',
        answer: 'All buyer funds are deposited directly into neutral, regulated banking escrow accounts. The operator cannot access these funds during your 7-day inspection window. If deliverables materially deviate from verified specifications, funds are refunded in full under our documented SLA.'
      },
      {
        question: 'What occurs during the technical diligence review session?',
        answer: 'Upon 10% escrow deposit confirmation, you receive direct calendar booking access to the operating principal. Under a binding bilateral Non-Disclosure Agreement (NDA), you conduct a 45-minute technical audit examining architecture schematics, accounting records, live integrations, and supplier contracts.'
      },
      {
        question: 'What are the specific criteria for receiving a 100% escrow refund?',
        answer: 'Refunds are automatically approved if: (1) deliverable documentation is materially less than stated (e.g. fewer than 90 pages or missing frameworks), (2) advertised financial models or vendor rosters are omitted, or (3) the operator fails to respond to technical inquiries within the 48-hour SLA window.'
      },
      {
        question: 'Can I purchase the intellectual property directly without ongoing operator involvement?',
        answer: 'Yes. At closing, buyers select from three transaction structures: Asset Transfer Only (direct clean IP buyout), Strategic Advisory (retaining the operator for weekly oversight), or Full Operating Partnership (90/10 milestone-based execution partnership).'
      }
    ],
    seller: [
      {
        question: 'How are proprietary operational blueprints protected prior to payment?',
        answer: 'Core operational IP—including source code repositories, vendor agreements, and financial cash-flow models—is never publicly exposed. Buyers only see sanitized executive abstracts until they complete identity verification, execute a mutual NDA, and place 10% cash deposit into regulated escrow.'
      },
      {
        question: 'What is the mandatory 90-page documentation threshold?',
        answer: 'vvEntra exclusively lists institutional-grade operational assets. Submissions must include complete procedural workflows (SOPs), technical data schemas, three-statement financial models, and risk mitigation registers. Abstract pitch decks without operational depth are systematically rejected.'
      },
      {
        question: 'What fees does vvEntra charge asset operators?',
        answer: 'Intake and technical audits are 100% free upfront. vvEntra retains a flat 10% facility commission strictly upon successful escrow clearance and buyer approval. Operating principals retain 90% of all gross deal proceeds.'
      },
      {
        question: 'How and when are seller transaction payouts settled?',
        answer: 'Payouts are cleared within 7 business days of buyer milestone approval or conclusion of the 7-day inspection window. Settlements are transferred directly to verified commercial bank accounts via FedWire, SWIFT, or domestic ACH rails.'
      }
    ]
  },

  // Institutional Compliance & Trust Safeguards
  complianceSafeguards: [
    {
      title: 'Identity Verification & Anti-Fraud',
      description: 'Government identity credentials, commercial registry documentation, and beneficial ownership records are audited prior to platform participation.'
    },
    {
      title: 'Regulated Escrow Custody',
      description: 'All financial commitments remain in licensed banking escrow accounts. Capital is released strictly upon milestone verification and inspection sign-off.'
    },
    {
      title: 'Multi-Tier Diligence Disclosure',
      description: 'Proprietary intellectual property is disclosed through staged legal checkpoints: Public Executive Summary → NDA-Gated Review → Virtual Data Room Access.'
    },
    {
      title: 'Five-Day Dispute Resolution SLA',
      description: 'Documented arbitration protocols govern misrepresentation or missing specifications. Disputes receive formal review with predetermined settlement schedules.'
    },
    {
      title: 'Statutory Guarantee Facility',
      description: 'High-value transactions qualify for platform escrow guarantees, ensuring settlement security while formal inspection periods are fulfilled.'
    },
    {
      title: 'Mandatory 90-Page Documentation Threshold',
      description: 'Submissions must include complete operational workflows, financial projections, and risk matrices. Conceptual proposals without operational depth are rejected.'
    }
  ],

  // The Atomic Handover Protocol Specifications
  getHandoverProtocol: function(asset) {
    if (!asset) return null;
    const val = asset.valuation || 25000;
    const sellerNet = Math.round(val * 0.90);
    const repoSlug = (asset.id || 'vve-core').toLowerCase();

    return {
      assetId: asset.id,
      title: 'The Atomic Handover Protocol',
      escrowGuarantee: '100% Protected by Regulated Neutral Custody',
      phases: [
        {
          id: 'phase-1',
          number: '01',
          title: 'Escrow Deposit',
          category: 'Buyer Deposits 100% Full Amount',
          status: `✓ 100% Full Amount Locked ($${val.toLocaleString()})`,
          statusCode: 'verified',
          badgeClass: 'c-badge--success',
          icon: '🔒',
          primaryMetric: `100% Full Purchase Amount: $${val.toLocaleString()}`,
          headline: `Buyer deposits 100% of the purchase funds ($${val.toLocaleString()}) into vvEntra escrow before seller transfers any code or assets.`,
          checkpoints: [
            `Buyer wires the full 100% purchase amount ($${val.toLocaleString()}) into vvEntra's secure escrow account`,
            `vvEntra verifies the full $${val.toLocaleString()} is locked; seller cannot withdraw it yet, buyer cannot cancel without agreement`,
            'Seller receives verified proof that 100% of the money is locked in vvEntra; transfer is safely authorized'
          ],
          technicalArtifact: `Escrow Lock TXID: 0x8a92f...7e1 · Full 100% ($${val.toLocaleString()}) Confirmed in Vault`
        },
        {
          id: 'phase-2',
          number: '02',
          title: 'Code & Cloud Custody Lock',
          category: 'Repository & Cloud Infrastructure',
          status: 'Ready for Custody',
          statusCode: 'ready',
          badgeClass: 'c-badge--neutral',
          icon: '📁',
          primaryMetric: 'Private GitHub Org + AWS/Cloud Root IAM',
          headline: 'Seller safely transfers source code, GitHub repository, and cloud servers into custody.',
          checkpoints: [
            `Private GitHub organization transfer (${repoSlug}-production-repo) secured in escrow`,
            'AWS / Google Cloud root organization credentials re-keyed and isolated',
            'Automated code audit confirms 0 backdoors, clean licenses, and complete commit history'
          ],
          technicalArtifact: `Git SHA: ${repoSlug.replace('-', '')}8f9a · 1,420 Commits · 0 Vulnerabilities`
        },
        {
          id: 'phase-3',
          number: '03',
          title: 'Domain & DNS Migration',
          category: 'Website Address & Live Traffic',
          status: 'Queued for Routing',
          statusCode: 'ready',
          badgeClass: 'c-badge--neutral',
          icon: '🌐',
          primaryMetric: 'Apex Domain Registrar + SSL Certificates',
          headline: 'Website domain name and server traffic are transferred directly to the buyer with zero downtime.',
          checkpoints: [
            'Domain registrar EPP authorization code transferred to buyer\'s registrar account',
            'Cloudflare / DNS routing and SSL certificates pointed to buyer\'s cloud server',
            'Live customer traffic and active web services verified active with zero downtime'
          ],
          technicalArtifact: 'EPP Domain Auth Verified · DNS Propagated · Zero Downtime SLA'
        },
        {
          id: 'phase-4',
          number: '04',
          title: 'Testing & Payout Release',
          category: 'Seller Receives 90% · vvEntra Fee 10%',
          status: `Seller: $${sellerNet.toLocaleString()} · Fee: $${Math.round(val * 0.10).toLocaleString()}`,
          statusCode: 'pending',
          badgeClass: 'c-badge--warning',
          icon: '✓',
          primaryMetric: `Seller Receives 90% ($${sellerNet.toLocaleString()}) + vvEntra 10% Fee ($${Math.round(val * 0.10).toLocaleString()})`,
          headline: `Buyer tests and confirms the live software. Both parties sign off: seller gets 90% ($${sellerNet.toLocaleString()}) and vvEntra retains 10% ($${Math.round(val * 0.10).toLocaleString()}).`,
          checkpoints: [
            'Buyer logs in, tests live software, and confirms full operational control',
            'Both buyer and seller submit digital sign-offs confirming transaction completion',
            `vvEntra escrow releases the 90% payout wire ($${sellerNet.toLocaleString()}) to seller, and retains the 10% platform fee ($${Math.round(val * 0.10).toLocaleString()})`
          ],
          technicalArtifact: `Settlement Complete: Seller Paid $${sellerNet.toLocaleString()} (90%) · Platform Fee $${Math.round(val * 0.10).toLocaleString()} (10%)`
        }
      ]
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = VVENTRA_DATA;
}
