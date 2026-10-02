/**
 * ===================================================================
 * vvEntra · Venture Intelligence & Opportunity Architecture Exchange
 * Core Data Layer (True Authentic Architecture)
 * ===================================================================
 * "The people who can see opportunities clearly are rarely the same
 *  people who can execute them at scale. We built the marketplace where
 *  that gap closes — privately, structurally, and with escrow custody."
 */

const VVENTRA_DATA = {
  platformStats: {
    liveOpportunities: 184,
    verifiedArchitects: 72,
    activePEBuyers: 118,
    medianUnlockRate: '$5,800',
    avgClearTimeDays: 14,
    totalEscrowCustodyVolume: '$42.8M',
    trustScore: 99.4
  },

  // 14 Sectors Tracked by vvEntra Sector Index
  sectors: [
    {
      id: 'sec-01',
      code: 'REGTECH',
      name: 'RegTech & Compliance',
      category: 'Enterprise Governance',
      growth7d: '+28.4%',
      buyerDemandIndex: 88,
      architectSupplyCount: 18,
      arbitrageGap: 70, // High demand, low supply = biggest gap
      quadrant: 'surge',
      avgUnlockPrice: '$6,200',
      avgClearDays: 12,
      sparkline: [40, 48, 55, 62, 70, 78, 88]
    },
    {
      id: 'sec-02',
      code: 'AI-WORKFLOW',
      name: 'Vertical AI Agents',
      category: 'Autonomous Workflows',
      growth7d: '+34.2%',
      buyerDemandIndex: 94,
      architectSupplyCount: 24,
      arbitrageGap: 70,
      quadrant: 'star',
      avgUnlockPrice: '$6,800',
      avgClearDays: 9,
      sparkline: [45, 52, 64, 72, 80, 89, 94]
    },
    {
      id: 'sec-03',
      code: 'SMB-LENDING',
      name: 'Tier-2 SMB Fintech',
      category: 'Credit Infrastructure',
      growth7d: '+19.6%',
      buyerDemandIndex: 82,
      architectSupplyCount: 21,
      arbitrageGap: 61,
      quadrant: 'star',
      avgUnlockPrice: '$7,500',
      avgClearDays: 14,
      sparkline: [50, 56, 62, 68, 72, 77, 82]
    },
    {
      id: 'sec-04',
      code: 'D2C-WELLNESS',
      name: 'Ayurveda & D2C Wellness',
      category: 'Consumer Brands',
      growth7d: '+16.8%',
      buyerDemandIndex: 79,
      architectSupplyCount: 26,
      arbitrageGap: 53,
      quadrant: 'cash_cow',
      avgUnlockPrice: '$5,400',
      avgClearDays: 16,
      sparkline: [55, 60, 64, 69, 72, 76, 79]
    },
    {
      id: 'sec-05',
      code: 'INDUSTRIAL-IOT',
      name: 'Heavy Industry Emissions',
      category: 'Climate & Hardware',
      growth7d: '+22.1%',
      buyerDemandIndex: 86,
      architectSupplyCount: 15,
      arbitrageGap: 71,
      quadrant: 'surge',
      avgUnlockPrice: '$8,200',
      avgClearDays: 11,
      sparkline: [42, 49, 58, 66, 74, 80, 86]
    },
    {
      id: 'sec-06',
      code: 'CREATOR-MKTP',
      name: 'Specialty Creator Marketplaces',
      category: 'Network Platforms',
      growth7d: '+12.5%',
      buyerDemandIndex: 68,
      architectSupplyCount: 30,
      arbitrageGap: 38,
      quadrant: 'cash_cow',
      avgUnlockPrice: '$4,200',
      avgClearDays: 19,
      sparkline: [52, 54, 58, 62, 64, 66, 68]
    },
    {
      id: 'sec-07',
      code: 'HEALTH-OPS',
      name: 'Outpatient Clinic OS',
      category: 'Healthcare Operations',
      growth7d: '+18.9%',
      buyerDemandIndex: 81,
      architectSupplyCount: 19,
      arbitrageGap: 62,
      quadrant: 'star',
      avgUnlockPrice: '$6,900',
      avgClearDays: 15,
      sparkline: [48, 54, 61, 67, 72, 76, 81]
    },
    {
      id: 'sec-08',
      code: 'AGRITECH',
      name: 'Post-Harvest Supply Chain',
      category: 'Agritech & Cold Chain',
      growth7d: '+9.4%',
      buyerDemandIndex: 62,
      architectSupplyCount: 28,
      arbitrageGap: 34,
      quadrant: 'out_of_favor',
      avgUnlockPrice: '$4,600',
      avgClearDays: 24,
      sparkline: [58, 59, 60, 61, 62, 61, 62]
    },
    {
      id: 'sec-09',
      code: 'LOGISTICS-INFRA',
      name: 'Micro-Warehousing Hubs',
      category: 'Hyperlocal Fulfillment',
      growth7d: '+14.1%',
      buyerDemandIndex: 73,
      architectSupplyCount: 25,
      arbitrageGap: 48,
      quadrant: 'cash_cow',
      avgUnlockPrice: '$5,800',
      avgClearDays: 18,
      sparkline: [50, 54, 60, 65, 68, 70, 73]
    },
    {
      id: 'sec-10',
      code: 'CYBER-AUDIT',
      name: 'Cloud Infrastructure Hardening',
      category: 'Security Architecture',
      growth7d: '+24.7%',
      buyerDemandIndex: 87,
      architectSupplyCount: 16,
      arbitrageGap: 71,
      quadrant: 'surge',
      avgUnlockPrice: '$7,800',
      avgClearDays: 13,
      sparkline: [44, 51, 60, 68, 76, 82, 87]
    },
    {
      id: 'sec-11',
      code: 'EDTECH-VOC',
      name: 'Blue-Collar Vocational Skills',
      category: 'Applied Workforce Training',
      growth7d: '+6.2%',
      buyerDemandIndex: 54,
      architectSupplyCount: 35,
      arbitrageGap: 19,
      quadrant: 'out_of_favor',
      avgUnlockPrice: '$3,400',
      avgClearDays: 28,
      sparkline: [56, 55, 54, 55, 54, 53, 54]
    },
    {
      id: 'sec-12',
      code: 'MARTECH-CDP',
      name: 'First-Party Consent Hubs',
      category: 'Privacy Infrastructure',
      growth7d: '+15.3%',
      buyerDemandIndex: 75,
      architectSupplyCount: 22,
      arbitrageGap: 53,
      quadrant: 'cash_cow',
      avgUnlockPrice: '$5,900',
      avgClearDays: 17,
      sparkline: [52, 56, 62, 67, 70, 72, 75]
    },
    {
      id: 'sec-13',
      code: 'ENERGY-BATTERY',
      name: 'Second-Life EV Battery Trading',
      category: 'Clean Energy Circularity',
      growth7d: '+29.8%',
      buyerDemandIndex: 90,
      architectSupplyCount: 12,
      arbitrageGap: 78,
      quadrant: 'surge',
      avgUnlockPrice: '$9,100',
      avgClearDays: 10,
      sparkline: [40, 50, 62, 72, 80, 86, 90]
    },
    {
      id: 'sec-14',
      code: 'GOVTECH',
      name: 'Municipal Procurement Workflows',
      category: 'Civic Infrastructure',
      growth7d: '+8.1%',
      buyerDemandIndex: 58,
      architectSupplyCount: 20,
      arbitrageGap: 38,
      quadrant: 'out_of_favor',
      avgUnlockPrice: '$5,100',
      avgClearDays: 25,
      sparkline: [52, 53, 55, 56, 57, 57, 58]
    }
  ],

  // The 6 Authentic Opportunity Dossiers
  opportunities: [
    {
      id: 'VVE-2440',
      code: 'AYUR-D2C',
      title: 'Indian D2C Ayurveda Category Build-Out',
      sector: 'Ayurveda & D2C Wellness',
      sectorId: 'sec-04',
      scale: '$1.2B TAM Runway',
      geography: 'India / Southeast Asia',
      unlockPrice: 5400,
      executionCapEst: '$85,000 - $140,000',
      targetHorizonMonths: 24,
      documentationDepth: {
        totalPages: 114,
        businessModelPages: 38,
        sopPages: 32,
        marketResearchPages: 26,
        financialModels: 3,
        riskMaps: 2
      },
      architect: {
        handle: 'arch-karnatak',
        title: 'Senior Operating Architect',
        verificationStatus: 'Govt ID + Bank Verified',
        experience: 'Ex-FMCG Category Lead · 2 Exits ($18M cumulative)',
        rating: 4.96,
        unlocksCompleted: 14,
        disputes: 0
      },
      publicPreviewThesis: 'A complete category execution playbook for an under-served clinical wellness vertical with a $1.2B TAM growth runway. Operator-grade execution plan with direct botanical sourcing contracts, brand positioning, formulation supply chain, and omnichannel distribution mapped.',
      gatedSummary: 'Includes detailed bill-of-materials for 6 initial SKUs, GMP manufacturing agreements with tier-1 certified labs in Kerala, clinical trial documentation outlines, customer acquisition cost benchmarks across 4 digital channels, and regulatory licensing pathway under AYUSH ministry.',
      demandSignals: [
        'Ayurveda category search intent up +42% YoY in Tier-1 & Tier-2 metros',
        'Traditional pharmacy channel retail margin benchmarked at 38%',
        'Customer repeat purchase rate modeled at 41% across cohort benchmarks'
      ],
      tierPricing: {
        tier0: 0,
        tier1: 0,
        tier2Deposit: 250,
        tier3Partial: 1620, // 30%
        tier4Full: 3780     // remaining 70%
      }
    },
    {
      id: 'VVE-2438',
      code: 'REGTECH-US',
      title: 'B2B SaaS for Vertical Compliance, US Mid-Market',
      sector: 'RegTech & Compliance',
      sectorId: 'sec-01',
      scale: '$420M SAM',
      geography: 'United States Mid-Market',
      unlockPrice: 4800,
      executionCapEst: '$120,000 - $180,000',
      targetHorizonMonths: 18,
      documentationDepth: {
        totalPages: 98,
        businessModelPages: 32,
        sopPages: 28,
        marketResearchPages: 22,
        financialModels: 2,
        riskMaps: 2
      },
      architect: {
        handle: 'arch-vanguard',
        title: 'Enterprise Software Architect',
        verificationStatus: 'Passport + Entity Verified',
        experience: 'Former VP Product at Tier-1 GRC Provider',
        rating: 4.92,
        unlocksCompleted: 11,
        disputes: 0
      },
      publicPreviewThesis: 'An execution-ready compliance automation play for US mid-market industrial manufacturers facing new EPA/OSHA audit mandates. Includes Ideal Customer Profile (ICP), federal regulatory map, land-and-expand GTM motion, and pricing architecture validated against 47 customer discovery signals.',
      gatedSummary: 'Contains 14 functional product wireframes, technical database schema for audit trail immutability, sales sequence scripts targeting VP of Health & Safety, contract templates with enterprise indemnity caps, and detailed unit economics showing a 9.2-month payback period.',
      demandSignals: [
        'Regulatory enforcement penalties increased 65% since federal guideline revisions',
        'Mid-market industrial compliance software churn benchmarked under 4.1% annually',
        'Average contract value validated between $18,000 and $36,000 ARR'
      ],
      tierPricing: {
        tier0: 0,
        tier1: 0,
        tier2Deposit: 250,
        tier3Partial: 1440,
        tier4Full: 3360
      }
    },
    {
      id: 'VVE-2436',
      code: 'AI-WORKFLOW',
      title: 'AI Workflow Agent for Vertical Legal Operations',
      sector: 'Vertical AI Agents',
      sectorId: 'sec-02',
      scale: '$680M TAM',
      geography: 'North America / UK',
      unlockPrice: 6200,
      executionCapEst: '$75,000 - $110,000',
      targetHorizonMonths: 12,
      documentationDepth: {
        totalPages: 128,
        businessModelPages: 42,
        sopPages: 36,
        marketResearchPages: 30,
        financialModels: 3,
        riskMaps: 3
      },
      architect: {
        handle: 'arch-vector',
        title: 'Principal Systems Architect',
        verificationStatus: 'Govt ID + Audit Verified',
        experience: 'Ex-Staff Engineer at Top Applied AI Research Lab',
        rating: 4.98,
        unlocksCompleted: 19,
        disputes: 0
      },
      publicPreviewThesis: 'Vertical-specific AI workflow agent targeting contract redlining and cross-jurisdictional compliance for mid-sized law firms. Includes prompt engineering library, agentic state-machine architecture, secure API integration spec, and a 24-month commercial rollout roadmap.',
      gatedSummary: 'Features complete benchmark dataset of 5,000 sanitized commercial contracts, LangGraph orchestration design, zero data retention privacy architecture required by bar associations, and pilot customer outreach sequence with 42% initial reply rate.',
      demandSignals: [
        'Corporate legal counsel spending on AI tooling up +140% YoY',
        'Manual contract review represents 28% of billable attorney overhead',
        'Law firm willingness to pay benchmarked at $1,200 per attorney seat / month'
      ],
      tierPricing: {
        tier0: 0,
        tier1: 0,
        tier2Deposit: 300,
        tier3Partial: 1860,
        tier4Full: 4340
      }
    },
    {
      id: 'VVE-2434',
      code: 'SMB-CREDIT',
      title: 'SMB Lending Infrastructure for Tier-2 Indian Cities',
      sector: 'Tier-2 SMB Fintech',
      sectorId: 'sec-03',
      scale: '$3.4B Credit Gap',
      geography: 'India (Tier-2 & Tier-3)',
      unlockPrice: 7500,
      executionCapEst: '$250,000 - $400,000',
      targetHorizonMonths: 36,
      documentationDepth: {
        totalPages: 142,
        businessModelPages: 46,
        sopPages: 44,
        marketResearchPages: 32,
        financialModels: 4,
        riskMaps: 3
      },
      architect: {
        handle: 'arch-deccan',
        title: 'Fintech Credit Architect',
        verificationStatus: 'Aadhaar + CA Letter Verified',
        experience: 'Former Chief Risk Officer at NBFC ($120M AUM)',
        rating: 4.94,
        unlocksCompleted: 8,
        disputes: 0
      },
      publicPreviewThesis: 'A regulatory-grade credit assessment and distribution architecture for under-banked manufacturing SMBs in non-metro hubs. Includes proprietary cash-flow underwriting algorithm, distributor-led origination playbook, and a 36-month capital partnership roadmap.',
      gatedSummary: 'Contains complete credit policy documentation, GST-based fraud detection rules, NBFC co-lending agreement templates, recovery workflow SOPs, and financial projections showing 19.4% portfolio IRR with sub-2.4% historical default assumptions.',
      demandSignals: [
        'Tier-2 manufacturing clusters face an estimated $3.4B formal credit deficit',
        'Digital GST invoicing penetration reached 82% among target merchants',
        'Institutional debt syndication partners willing to deploy capital at 11.5% cost of funds'
      ],
      tierPricing: {
        tier0: 0,
        tier1: 0,
        tier2Deposit: 400,
        tier3Partial: 2250,
        tier4Full: 5250
      }
    },
    {
      id: 'VVE-2432',
      code: 'EMISSIONS-IOT',
      title: 'Industrial Emissions Monitoring for Heavy Manufacturing',
      sector: 'Heavy Industry Emissions',
      sectorId: 'sec-05',
      scale: '$890M Regulatory Mandate',
      geography: 'Global / Emerging Markets',
      unlockPrice: 8200,
      executionCapEst: '$180,000 - $300,000',
      targetHorizonMonths: 24,
      documentationDepth: {
        totalPages: 106,
        businessModelPages: 36,
        sopPages: 30,
        marketResearchPages: 24,
        financialModels: 2,
        riskMaps: 2
      },
      architect: {
        handle: 'arch-helix',
        title: 'Industrial Systems Engineer',
        verificationStatus: 'Govt ID + Patent Verified',
        experience: 'Ex-Director of IoT Engineering at Global Conglomerate',
        rating: 4.89,
        unlocksCompleted: 7,
        disputes: 0
      },
      publicPreviewThesis: 'A combined sensor hardware and software telemetry stack for continuous emissions monitoring in steel and cement processing plants. Includes Bill-of-Materials (BOM), sensor calibration protocols, regulatory compliance certifications, and an enterprise conversion pilot model.',
      gatedSummary: 'Features complete hardware schematics using off-the-shelf optical sensors, edge telemetry firmware specifications, pollution board API integration workflows, and enterprise service contract templates with annual calibration SLA terms.',
      demandSignals: [
        'Mandatory continuous emissions telemetry enacted in 14 heavy industrial corridors',
        'Hardware payback period for plant operators modeled under 7 months',
        'Average pilot to enterprise contract conversion rate benchmarked at 72%'
      ],
      tierPricing: {
        tier0: 0,
        tier1: 0,
        tier2Deposit: 500,
        tier3Partial: 2460,
        tier4Full: 5740
      }
    },
    {
      id: 'VVE-2430',
      code: 'CREATOR-MKTP',
      title: 'Specialty Marketplace for Technical Hardware Designers',
      sector: 'Specialty Creator Marketplaces',
      sectorId: 'sec-06',
      scale: '$310M Niche TAM',
      geography: 'North America / EU',
      unlockPrice: 3900,
      executionCapEst: '$50,000 - $90,000',
      targetHorizonMonths: 14,
      documentationDepth: {
        totalPages: 92,
        businessModelPages: 30,
        sopPages: 28,
        marketResearchPages: 22,
        financialModels: 2,
        riskMaps: 1
      },
      architect: {
        handle: 'arch-cadence',
        title: 'Marketplace Operations Architect',
        verificationStatus: 'Passport + Stripe Verified',
        experience: 'Founder with 1 Prior Marketplace Exit ($4.2M)',
        rating: 4.95,
        unlocksCompleted: 15,
        disputes: 0
      },
      publicPreviewThesis: 'A two-sided vertical marketplace connecting open-hardware engineers and CAD designers with specialized PCB fabricators and rapid prototyping labs. Includes demand-side acquisition playbook, 14% take-rate unit economics, and supplier SLA standards.',
      gatedSummary: 'Contains cold-outreach templates for the top 500 electronics design creators, supplier quality scoring criteria, escrow deposit logic for hardware milestone verification, and 18-month financial roadmap to reach liquidity break-even.',
      demandSignals: [
        'Hardware prototype turnaround times currently average an inefficient 24 days',
        'Specialty creators report 68% dissatisfaction with generic freelancer platforms',
        'Take-rate model validated against 18 pilot fabrication contracts'
      ],
      tierPricing: {
        tier0: 0,
        tier1: 0,
        tier2Deposit: 200,
        tier3Partial: 1170,
        tier4Full: 2730
      }
    }
  ],

  // The 5 Layers of Structured Trust
  trustLayers: [
    {
      layer: 'Layer 01',
      title: 'Identity & Reputation Verification',
      headline: 'Real humans with public stakes. Zero anonymous accounts.',
      description: 'Every architect and buyer undergoes strict identity verification before publishing or unlocking. No bots, no burner accounts. Verification status is visibly staked to reputation.',
      checkpoints: [
        'Government ID verification (Aadhaar / Passport / Driver License)',
        'Bank account ownership verification via penny drop',
        'Phone & business email confirmation',
        'Buyer capital capacity verification (CA certificate / fund registration)',
        'Strict one-person-one-account policy'
      ]
    },
    {
      layer: 'Layer 02',
      title: 'Escrow Custody on Every Transaction',
      headline: 'Money never moves directly from buyer to architect.',
      description: 'Funds are held in neutral escrow before any proprietary documentation is unlocked. The architect knows the money is committed; the buyer knows their funds are safe until satisfied.',
      checkpoints: [
        'Buyer funds deposited into regulated vvEntra escrow',
        'Architect alerted to confirmed buyer capital commitment',
        'Documentation unlocks strictly against escrow collateral',
        'Mandatory 7-day inspection window opens upon unlock',
        'Payout releases only upon buyer signoff or inspection lapse'
      ]
    },
    {
      layer: 'Layer 03',
      title: 'Staged Reveal · Four Progressive Tiers',
      headline: 'Commitment scales with exposure. Mirroring real M&A.',
      description: 'Buyers do not pay full price for blind access. They progress through four structured tiers, unlocking deeper layers of substance for proportionally greater commitment.',
      checkpoints: [
        'Tier 0 · Public Preview: Free sector, scale, depth metrics, and architect credentials',
        'Tier 1 · Verified Access: Free full opportunity thesis & ability to ask structured questions',
        'Tier 2 · Interest Deposit ($100–500): Refundable deposit; architect approves buyer access',
        'Tier 3 · NDA + Partial Unlock (30%): Business model, research, and direct conversation enabled',
        'Tier 4 · Full Unlock (Remaining 70%): Complete IP, financial models, and ongoing partnership'
      ]
    },
    {
      layer: 'Layer 04',
      title: 'Dispute Resolution · Clear, Fast, Fair',
      headline: 'Documented refund criteria with a 5-day resolution SLA.',
      description: 'Refunds are granted for objective, verifiable failures—such as misrepresented depth, plagiarized text, or false credentials. Subjective buyer remorse is strictly rejected.',
      checkpoints: [
        'Documented refund criteria for material misrepresentation',
        'Strict 5-business-day resolution SLA by senior vvEntra moderators',
        'Frivolous claims penalized with reputation point deductions',
        'Architect given 48 hours to provide counter-evidence',
        'Bad actors permanently lose platform access'
      ]
    },
    {
      layer: 'Layer 05',
      title: 'Platform Guarantee · The Premium Layer',
      headline: 'vvEntra backs transactions above $10,000 directly.',
      description: 'On high-value deals, vvEntra absorbs the settlement risk. Architects receive guaranteed payout within 48 hours regardless of dispute status, while buyers receive priority mediation.',
      checkpoints: [
        'Guaranteed settlement within 48 hours for premium architects',
        'Platform absorbs dispute risk up to $50,000 coverage cap',
        'Priority dispute review conducted by founding moderators',
        'Premium verification badge displayed on buyer & architect profiles',
        'Available on all verified institutional listings'
      ]
    }
  ],

  // Staged Reveal Flow for Single Opportunity Detail
  getStagedRevealProtocol(opportunity) {
    if (!opportunity) return null;
    const price = opportunity.unlockPrice || 5000;
    const dep = opportunity.tierPricing?.tier2Deposit || 250;
    const partial = opportunity.tierPricing?.tier3Partial || Math.round(price * 0.30);
    const fullRem = opportunity.tierPricing?.tier4Full || (price - partial);
    const architectNet = Math.round(price * 0.90);
    const platformFee = price - architectNet;

    return {
      opportunityId: opportunity.id,
      title: opportunity.title,
      totalUnlockPrice: price,
      architectNet: architectNet,
      platformFee: platformFee,
      stages: [
        {
          tier: 'Tier 0',
          number: '00',
          title: 'Public Preview',
          cost: 'Free Access',
          status: 'Unlocked by Default',
          statusCode: 'verified',
          badgeClass: 'c-badge--success',
          icon: '👁',
          visibleSummary: 'Sector, TAM scale, geography, architect exit track record, and documentation depth metrics (pages, financial models, SOP count).',
          lockedDetails: 'Specific company thesis, proprietary frameworks, and contact info remain hidden.',
          checkpoints: [
            'Verified documentation depth metrics confirmed by moderation audit',
            'Architect identity and exit track record authenticated',
            'Public demand signals and arbitrage spread verified'
          ]
        },
        {
          tier: 'Tier 1',
          number: '01',
          title: 'Verified Access',
          cost: 'Free for KYC Members',
          status: 'Available to Verified Buyers',
          statusCode: 'ready',
          badgeClass: 'c-badge--neutral',
          icon: '📋',
          visibleSummary: 'Full opportunity title, 1-paragraph operational thesis, sub-category scope, estimated execution capital, and ability to submit structured questions.',
          lockedDetails: 'Full 90+ page operational blueprint, supplier names, and financial models remain vault-locked.',
          checkpoints: [
            'Buyer government KYC & investment capacity verified',
            'Full operational thesis unlocked',
            'Asynchronous Q&A messaging opened with the architect'
          ]
        },
        {
          tier: 'Tier 2',
          number: '02',
          title: 'Interest Deposit',
          cost: `$${dep} (Refundable Deposit)`,
          status: 'Architect Approval Gate',
          statusCode: 'ready',
          badgeClass: 'c-badge--neutral',
          icon: '💳',
          visibleSummary: 'Buyer deposits refundable intent capital into vvEntra escrow. Architect reviews the buyer’s investment profile and decides whether to accept or decline.',
          lockedDetails: 'If architect declines, deposit returns immediately. If approved, deposit applies toward Tier 3 partial unlock.',
          checkpoints: [
            `$${dep} intent deposit held in neutral vvEntra escrow`,
            'Architect reviews buyer reputation and thesis alignment',
            'Mutual clearance opens bilateral diligence pathway'
          ]
        },
        {
          tier: 'Tier 3',
          number: '03',
          title: 'NDA + Partial Unlock',
          cost: `$${partial} (30% Unlock Escrow)`,
          status: 'Confidential Diligence',
          statusCode: 'pending',
          badgeClass: 'c-badge--warning',
          icon: '✍',
          visibleSummary: 'Full business model document (35+ pages), market validation data, and 24-month roadmap unlocked. Direct live conversation enabled.',
          lockedDetails: 'Proprietary financial models, raw vendor contracts, and sensitive IP remain locked until Tier 4.',
          checkpoints: [
            'Bilateral Non-Disclosure Agreement digitally signed on-chain/escrow',
            `30% capital ($${partial}) locked in escrow`,
            'Direct scheduled voice/video consultation with architect unlocked'
          ]
        },
        {
          tier: 'Tier 4',
          number: '04',
          title: 'Full Unlock & Settlement',
          cost: `$${fullRem} (Remaining 70%)`,
          status: 'Full Asset Delivery',
          statusCode: 'pending',
          badgeClass: 'c-badge--warning',
          icon: '🔓',
          visibleSummary: `Complete 100% documentation package (${opportunity.documentationDepth.totalPages} pages), Excel financial models, SOPs, and ongoing execution engagement.`,
          lockedDetails: `7-day statutory inspection window begins. Payout ($${architectNet}) released to architect upon satisfaction. vvEntra retains 10% ($${platformFee}).`,
          checkpoints: [
            'Full operational blueprint and all financial models downloaded',
            '7-day inspection window activated for buyer due diligence',
            `Escrow wire ($${architectNet}) released to architect upon buyer approval or 7-day lapse`
          ]
        }
      ]
    };
  },

  // The 3 Engagement Paths after Unlock
  engagementPaths: [
    {
      id: 'path-full',
      title: 'Full Partnership',
      category: 'Hands-On Execution Co-Building',
      description: 'Architect joins as active execution partner. Weekly strategic check-ins, operational oversight, and milestone tracking during build-out.',
      pricingModel: '90% of full deal value. Unlock earnings plus ongoing milestone execution retainers.',
      idealFor: 'Investors and corporate operators who want the creator’s direct brains during the first 6–12 months of company launch.'
    },
    {
      id: 'path-advisory',
      title: 'Guidance + Advisory',
      category: 'Strategic Input & Mentorship',
      description: 'Architect advises but does not operate. Bi-weekly scheduled guidance calls, strategic roadmap reviews, and document clarifications.',
      pricingModel: 'Unlock fee + structured advisory retainer.',
      idealFor: 'Experienced operators with existing teams who only need strategic calibration from the architect.'
    },
    {
      id: 'path-docs',
      title: 'Documents Only',
      category: 'Clean IP Transfer & Independent Execution',
      description: 'Complete intellectual property and operational blueprint transfer. Exclusive execution rights. Architect involvement ends at delivery.',
      pricingModel: 'Flat unlock fee only. Zero ongoing commitments.',
      idealFor: 'Well-capitalized private equity funds and serial founders who execute entirely in-house.'
    }
  ],

  // The Playbook Chapters
  playbookChapters: [
    {
      id: 'ch-01',
      title: '01 · Mindset',
      summary: 'The mental models that separate the top 10% of buyers and architects from the rest.',
      takeaways: [
        'Conviction Over Curiosity: Do not unlock opportunities just to browse. Unlock because you have a defined thesis and capital capacity.',
        'Trust the Staged Reveal: The staged reveal exists because open-idea marketplaces die from IP theft. Exposure must scale with commitment.',
        'Architects are Operating Partners, Not Freelance Vendors: The highest-value transactions lead to long-term advisory or follow-on ventures.',
        'Time is the Real Investment: The $5,000 unlock is not the primary cost—the 9 months you saved researching the market is the real dividend.'
      ]
    },
    {
      id: 'ch-02',
      title: '02 · Preparation',
      summary: 'What serious buyers and architects do before ever spending or listing a single dollar.',
      takeaways: [
        'Pre-Screen Verification: Complete government KYC and proof of funds capacity before submitting access requests.',
        'Formulate Clear Sector Theses: Define your target geography, TAM threshold, and execution team capabilities upfront.',
        'Architects: Depth is the Moat: Listings with under 90 pages get rejected. Invest deeply in your first 3 submissions to earn Senior Architect tier.'
      ]
    },
    {
      id: 'ch-03',
      title: '03 · Execution',
      summary: 'The 5 stages of an effective unlock and delivery cycle.',
      takeaways: [
        'Stage 1: Submit structured questions at Tier 1 before depositing intent funds.',
        'Stage 2: Use Tier 2 deposit to audit the architect’s communication speed and clarity.',
        'Stage 3: Review the core 35-page business model at Tier 3 with your lead operator.',
        'Stage 4: Engage the 7-day inspection window at Tier 4 deliberately, testing assumptions.',
        'Stage 5: Select the right ongoing engagement path (Full Partnership vs Advisory vs Docs Only).'
      ]
    },
    {
      id: 'ch-04',
      title: '04 · Red Flags',
      summary: 'When to walk away: how experienced buyers avoid getting burned.',
      takeaways: [
        'Architect won’t answer Tier 1 technical questions: If they give vague marketing answers, operational depth is missing.',
        'Generic frameworks, zero proprietary insight: If it’s just SWOT and Porter’s Five Forces, you are paying for textbook fluff.',
        'Pricing way below sector average: If a FinTech opportunity is listed at $1,200 when sector median is $7,200, depth is almost certainly shallow.',
        'Pressure to skip inspection window: If an architect pushes to release funds early, stop the transaction immediately.'
      ]
    },
    {
      id: 'ch-05',
      title: '05 · Success Patterns',
      summary: 'What top architects do to build six-figure earnings on vvEntra.',
      takeaways: [
        'Publish Less, Charge More: Top architects publish only 3–5 opportunities per year, commanding 1.8x platform median pricing.',
        'Earn Post-Unlock: 62% of top architect revenue comes from ongoing execution partnerships, not the initial unlock.',
        'Selectivity Compounds Reputation: Senior architects decline 40–50% of Tier 2 buyer requests to protect their 5.0 rating.'
      ]
    },
    {
      id: 'ch-06',
      title: '06 · Common Mistakes',
      summary: 'The fatal traps that cause amateurs to fail on the exchange.',
      takeaways: [
        'Buying across 5 different sectors without a focus.',
        'Architects getting defensive when an investor asks technical questions.',
        'Negotiating outside the platform: Eliminates escrow, dispute SLAs, and legal protections.',
        'Letting opportunities sit on a hard drive for 6 months without executing.'
      ]
    }
  ],

  // Frequently Asked Questions
  faq: {
    investors: [
      {
        q: 'How does vvEntra protect my money before I see the full IP?',
        a: 'Through our 4-Tier Staged Reveal. You only commit a small refundable deposit ($100–$500) at Tier 2. At Tier 3, you pay 30% under a strict NDA to inspect the core 35-page business model. The remaining 70% is only committed at Tier 4, which opens a mandatory 7-day inspection window before escrow releases funds.'
      },
      {
        q: 'What happens if the opportunity is misrepresented or plagiarized?',
        a: 'You raise a dispute during the 7-day inspection window. Our moderation team reviews the documentation against our strict refund criteria (e.g. promised 110 pages but delivered 40, or plagiarized text). Legitimate claims receive a 100% refund within our 5-business-day resolution SLA.'
      },
      {
        q: 'Can the architect help my team build the business after unlock?',
        a: 'Yes. Upon Tier 4 unlock, you choose from three paths: Full Partnership (architect joins as hands-on co-builder), Guidance + Advisory (scheduled strategic calls), or Documents Only (independent execution).'
      },
      {
        q: 'What verification is required for buyers?',
        a: 'We verify government ID, confirm bank account ownership via penny-drop, and require proof of capital capacity (auditor certificate, recent statement, or company registration) to keep tire-kickers out of the exchange.'
      }
    ],
    architects: [
      {
        q: 'What is the minimum documentation required to list an opportunity?',
        a: 'Every listing requires a minimum of 90 pages of operational depth: Business Model Document (min 30 pages), Execution SOPs & Workflows (min 25 pages), Market Validation Signals (min 15 pages), at least 1 financial model, a risk mitigation map, and a 24-month roadmap.'
      },
      {
        q: 'How do I know a buyer won’t steal my idea during Tier 0 or Tier 1?',
        a: 'Tiers 0 and 1 only display public preview metrics (sector, scale, depth metrics, and high-level thesis). Your proprietary frameworks, vendor contracts, and actionable systems remain vault-encrypted until the buyer signs an NDA and deposits funds in escrow at Tier 3 and 4.'
      },
      {
        q: 'What is vvEntra’s fee and when do I get paid?',
        a: 'Listing is 100% free with zero monthly fees. vvEntra takes a flat 10% facility fee only upon successful deal clearance. You retain 90% of all gross transaction proceeds, paid out via bank wire or Stripe within 7 days of inspection completion.'
      },
      {
        q: 'Can I decline a buyer who requests access?',
        a: 'Yes. At Tier 2, you have the unilateral right to review the buyer’s profile and decline access without penalty. Senior architects regularly decline 40% of requests to ensure they only transact with aligned operators.'
      }
    ]
  }
};

// ===================================================================
// RUNTIME NORMALIZATION LAYER
// Ensures complete compatibility between authentic data schema and UI renderers
// ===================================================================
if (typeof VVENTRA_DATA !== 'undefined' && VVENTRA_DATA.sectors) {
  VVENTRA_DATA.sectors.forEach(s => {
    s.industry = s.industry || s.category || 'General Enterprise';
    s.availableListings = typeof s.availableListings !== 'undefined' ? s.availableListings : (s.architectSupplyCount || 0);
    s.marketGap = s.marketGap || (s.arbitrageGap ? '+' + s.arbitrageGap : '+45');
    s.trailing7dChange = s.trailing7dChange || s.growth7d || '+12.5%';
    s.medianUnlockValuation = s.medianUnlockValuation || s.avgUnlockPrice || '$5,000';
  });
}

if (typeof VVENTRA_DATA !== 'undefined' && VVENTRA_DATA.opportunities) {
  VVENTRA_DATA.opportunities.forEach(asset => {
    asset.industry = asset.industry || asset.sector || 'Enterprise Asset';
    asset.summary = asset.summary || asset.publicPreviewThesis || '';
    asset.status = asset.status || 'Verified Operational Asset';
    asset.trustRating = asset.trustRating || 99;
    asset.pageCount = asset.pageCount || (asset.documentationDepth ? asset.documentationDepth.totalPages : 95);
    asset.frameworkCount = asset.frameworkCount || (asset.documentationDepth ? asset.documentationDepth.sopPages : 24);
    asset.targetJurisdiction = asset.targetJurisdiction || asset.geography || 'Global';
    asset.valuation = asset.valuation || (asset.unlockPrice ? asset.unlockPrice * 10 : 50000);
    asset.escrowDeposit = asset.escrowDeposit || asset.unlockPrice || 5000;
    asset.capitalRequirement = asset.capitalRequirement || asset.executionCapEst || '$50,000 - $100,000';
    asset.implementationTimeline = asset.implementationTimeline || (asset.targetHorizonMonths ? asset.targetHorizonMonths + ' Months' : '18 Months');
    asset.commercialParameters = asset.commercialParameters || { addressableMarket: asset.scale || '$500M TAM' };
    asset.executiveAbstract = asset.executiveAbstract || asset.publicPreviewThesis || '';
    asset.operationalProblem = asset.operationalProblem || (asset.demandSignals && asset.demandSignals[0] ? asset.demandSignals[0] : 'Fragmented execution pathways with capital inefficiency.');
    asset.solutionArchitecture = asset.solutionArchitecture || (asset.demandSignals && asset.demandSignals[1] ? asset.demandSignals[1] : 'Full 90+ page operational blueprint with verified supply contracts.');
    asset.commercialModel = asset.commercialModel || (asset.demandSignals && asset.demandSignals[2] ? asset.demandSignals[2] : 'Validated commercial unit economics with positive margin structure.');
    asset.operator = asset.operator || {
      name: asset.architect ? asset.architect.handle : 'Verified Operator',
      title: asset.architect ? asset.architect.title : 'Principal Operating Architect',
      historicalTransactions: asset.architect ? asset.architect.experience : 'Verified'
    };
    asset.deliverablesPackage = asset.deliverablesPackage || [
      { title: 'Business Model Document', pages: (asset.documentationDepth ? asset.documentationDepth.businessModelPages : 35) + ' pgs', format: 'PDF + Notion' },
      { title: 'Execution SOPs & Schemas', pages: (asset.documentationDepth ? asset.documentationDepth.sopPages : 30) + ' pgs', format: 'Miro + Markdown' },
      { title: 'Financial Models & Risk Maps', pages: '3 workbooks', format: 'Excel (.xlsx)' }
    ];
    asset.tags = asset.tags || [asset.sector || '', asset.geography || '', asset.code || ''];
  });
}

// Global window and environment export
if (typeof window !== 'undefined') {
  window.VVENTRA_DATA = VVENTRA_DATA;
}
if (typeof globalThis !== 'undefined') {
  globalThis.VVENTRA_DATA = VVENTRA_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VVENTRA_DATA;
}
