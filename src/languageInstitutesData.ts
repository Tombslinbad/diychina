export interface LanguageInstitute {
  id: string;
  name: string;
  tuitionRmb: number;   // estimated per-semester or short-term fee in RMB
  location: "Guangzhou" | "Yiwu" | "Shanghai" | "Beijing" | "Shenzhen" | "Hangzhou" | "Chengdu" | "Nanjing" | "Wuhan" | "Xiamen" | "Dongguan" | "Foshan" | "Zhoushan" | "Jinhua" | "Ningbo" | "Wenzhou" | "Shaoguan" | "Meizhou" | "Zhanjiang" | "Chaozhou" | "Zhaoqing" | "Huizhou" | "Maoming";
  startDates: string[];
  applicationLink: string;
  highlights: string[];
  description: string;
}

export const LANGUAGE_INSTITUTES: LanguageInstitute[] = [
  // YIWU - Wholesale & Sourcing Hub (5)
  {
    id: "inst-yw-001",
    name: "Yiwu Industrial & Commercial College (YWICC) - International Trade Center",
    tuitionRmb: 6800,
    location: "Yiwu",
    startDates: ["September 2026", "October 2026", "March 2027", "May 2027"],
    applicationLink: "https://ywicc.edu.cn/intl/admissions",
    highlights: ["Located literal minutes from Yiwu Futian Commodity Market", "Taught by active trade specialists", "Hands-on wholesale negotiation simulations"],
    description: "The absolute premier learning center for global merchants. YWICC teaches practical commercial Mandarin alongside direct wholesale operations, cargo logistics, and container shipping pathways."
  },
  {
    id: "inst-yw-002",
    name: "Zhejiang University of Technology (Yiwu Extension Campus) - Commodity Logistics Academy",
    tuitionRmb: 7500,
    location: "Yiwu",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "http://www.zjut.edu.cn",
    highlights: ["Focuses on supply chain vocabulary", "Weekly factory tours in Jinhua manufacturing zone", "Direct connections with shipping agents"],
    description: "An intensive training program focused on supply chain, freight forwarding, and import-export licensing language. Perfect for shipping logistics business managers."
  },
  {
    id: "inst-yw-003",
    name: "Yiwu Commercial Language Center - Elite Bargaining Boot Camp",
    tuitionRmb: 5800,
    location: "Yiwu",
    startDates: ["Every Monday in 2026/2027"],
    applicationLink: "https://ywicc.edu.cn",
    highlights: ["Intensive 1-on-1 marketplace training", "Bargaining scripts for 10 major industry sub-sectors", "Flexible short-term durations from 2 to 8 weeks"],
    description: "A private vocational accelerator designed for merchants who need to learn survival trade Mandarin fast to buy stock directly from factory stalls."
  },
  {
    id: "inst-yw-004",
    name: "Yiwu Global Sourcing Institute - E-Commerce Mandarin Course",
    tuitionRmb: 8000,
    location: "Yiwu",
    startDates: ["September 2026", "December 2026", "March 2027"],
    applicationLink: "https://ywicc.edu.cn/intl/admissions",
    highlights: ["Integrates Taobao/1688 app navigation", "Live-streaming sales Mandarin scripts", "Payment gateway setup discussions"],
    description: "Ideal for drop-shippers and digital agents seeking to source goods from 1688 and communicate directly with suppliers online."
  },
  {
    id: "inst-yw-005",
    name: "Yiwu Foreign Trade Academy - Customs & Cargo Logistics School",
    tuitionRmb: 7200,
    location: "Yiwu",
    startDates: ["October 2026", "April 2027"],
    applicationLink: "http://www.zjut.edu.cn",
    highlights: ["Customs clearance vocabulary", "Proline negotiation for container splitting", "Freight bill of lading drafting guides"],
    description: "Focuses strictly on the legal, administrative, and logistical paperwork language required to import and export through Ningbo-Zhoushan port."
  },

  // GUANGZHOU - Canton Fair & Trade Pipelines (10)
  {
    id: "inst-gz-001",
    name: "South China Normal University (SCNU) - Business Mandarin Hub",
    tuitionRmb: 8500,
    location: "Guangzhou",
    startDates: ["September 2026", "November 2026", "March 2027", "June 2027"],
    applicationLink: "https://cice.scnu.edu.cn",
    highlights: ["Canton Fair sourcing field trips embedded in syllabus", "Proximity to Shahe and Baiming clothing markets", "Comprehensive Guangzhou container terminal logistics mapping"],
    description: "Designed for importers, sourcing agents, and supply chain managers in Canton. SCNU's short-term tracks bypass academic overhead and focus 100% on price bargaining."
  },
  {
    id: "inst-gz-002",
    name: "Guangdong University of Foreign Studies (GDUFS) - Canton Import/Export School",
    tuitionRmb: 8800,
    location: "Guangzhou",
    startDates: ["September 2026", "October 2026", "January 2027", "March 2027"],
    applicationLink: "https://gdufs.edu.cn/admissions",
    highlights: ["Intensive 3-month high-pressure trader vocabulary track", "Direct legal business registration consultation lectures", "Located in the historical heart of global trading channels"],
    description: "Rigorous conversational academy. Sourcing agents develop functional verbal fluencies in just 12 weeks to negotiate prices directly and audit suppliers."
  },
  {
    id: "inst-gz-003",
    name: "Sun Yat-sen University (SYSU) - Executive Commercial Chinese Department",
    tuitionRmb: 12000,
    location: "Guangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "http://iso.sysu.edu.cn",
    highlights: ["Top-tier prestigious academic setting", "Advanced business contract clause analysis", "VIP Canton business network mixers"],
    description: "High-level professional program targeting managers and executives. Substantial focus on legal frameworks, joint ventures, and wholesale contract drafting terms."
  },
  {
    id: "inst-gz-004",
    name: "Jinan University (JNU) - College of Chinese Language & Sourcing Immersion",
    tuitionRmb: 9500,
    location: "Guangzhou",
    startDates: ["September 2026", "November 2026", "March 2027"],
    applicationLink: "https://yx.jnu.edu.cn",
    highlights: ["Pioneering experiential language teaching", "Field practice in Shunde home appliance market", "Logistics agent partnership networking"],
    description: "Extremely popular for international traders. JNU mixes classroom teaching with guided market visits to electronics, textiles, and building materials hubs."
  },
  {
    id: "inst-gz-005",
    name: "Guangzhou University (GU) - South China Sourcing & Procurement Office",
    tuitionRmb: 7800,
    location: "Guangzhou",
    startDates: ["October 2026", "March 2027"],
    applicationLink: "http://english.gzhu.edu.cn",
    highlights: ["Local supplier factory visitation program", "B2B negotiation drills", "Lagos & Abuja shipping container coordination study"],
    description: "A practical program that pairs students with local freight agents to understand South China shipping pipelines, warehouse management, and commercial terms."
  },
  {
    id: "inst-gz-006",
    name: "South China University of Technology (SCUT) - Industrial Trade Academy",
    tuitionRmb: 9800,
    location: "Guangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "http://www.scut.edu.cn",
    highlights: ["Heavy machinery and hardware vocabulary", "OEM/ODM product design drafting terminology", "Factory production line inspection logs"],
    description: "Specifically structured for industrial importers sourcing hardware, custom molding, raw metals, and factory machinery."
  },
  {
    id: "inst-gz-007",
    name: "Guangdong University of Technology (GDUT) - Shenzhen-Canton Electronics Sourcing Institute",
    tuitionRmb: 8200,
    location: "Guangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://www.gdut.edu.cn",
    highlights: ["PCB & Microprocessor procurement language", "Quality control and defect negotiation metrics", "Access to electronics test labs"],
    description: "An intensive course focusing on electronics manufacturing, component specifications, and global logistics communication."
  },
  {
    id: "inst-gz-008",
    name: "Canton Fair Business Language School - Rapid Sourcing Immersion",
    tuitionRmb: 6500,
    location: "Guangzhou",
    startDates: ["April 2026", "October 2026", "April 2027", "October 2027"],
    applicationLink: "https://gdufs.edu.cn/admissions",
    highlights: ["Runs alongside real Canton Fair dates", "Instant marketplace communication scripts", "Booth negotiation simulation workshops"],
    description: "Crucial short-term bootcamp which preps international traders with vocabulary cards, phone pitch templates, and price sheet calculations."
  },
  {
    id: "inst-gz-009",
    name: "Guangdong University of Finance - Financial Trade & Banking Mandarin",
    tuitionRmb: 8700,
    location: "Guangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://www.gduf.edu.cn",
    highlights: ["Letters of Credit and bank wire terminology", "Telegraphic Transfer (TT) secure payment scripts", "Chinese business tax and VAT refund modules"],
    description: "Best for finance controllers, trade lawyers, and agency CEOs wanting to navigate Chinese business accounts and banking regulations."
  },
  {
    id: "inst-gz-010",
    name: "Panyu Poly-Technic Trade School - Footwear & Leather Procurement Academy",
    tuitionRmb: 6000,
    location: "Guangzhou",
    startDates: ["October 2026", "April 2027"],
    applicationLink: "https://cice.scnu.edu.cn",
    highlights: ["Sourcing trips to Panyu Shiling Leather Market", "Footwear material and shoe sole mold vocabulary", "Mass production error margin negotiating"],
    description: "Extremely practical niche language track specializing in footwear and leather merchandise sourcing."
  },

  // SHANGHAI - Premium Finance & Luxury Trade (10)
  {
    id: "inst-sh-001",
    name: "Donghua University (DHU) - Textile & Apparel Trade Academy",
    tuitionRmb: 11200,
    location: "Shanghai",
    startDates: ["September 2026", "October 2026", "March 2027", "April 2027"],
    applicationLink: "https://ices.dhu.edu.cn",
    highlights: ["Famous focus on fashion, fabrics, and manufacturing procurement", "Advanced business conversation courses", "Located in downtown Shanghai with direct access to shipping HQs"],
    description: "Premium institution focusing on apparel, textile manufacturing, and luxury retail procurement language. Ideal for brand owners."
  },
  {
    id: "inst-sh-002",
    name: "Fudan University - International Trade and Corporate Chinese Academy",
    tuitionRmb: 14500,
    location: "Shanghai",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://ices.fudan.edu.cn",
    highlights: ["Prestigious ivy-league class environment", "Corporate strategy and joint-venture negotiations", "Excellent alumni association of trade consultants"],
    description: "Top-tier business school. High-intensity curriculum for executives wanting fluency in legal terms, trade agreements, and large-scale asset purchase Mandarin."
  },
  {
    id: "inst-sh-003",
    name: "Shanghai Jiao Tong University (SJTU) - School of Global Sourcing Leadership",
    tuitionRmb: 15000,
    location: "Shanghai",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://isc.sjtu.edu.cn",
    highlights: ["Executive networking workshops", "Automotive and technology supply chain Mandarin", "Case studies based in Shanghai Free Trade Zone"],
    description: "Highly technical, premium commercial track. Ideal for foreign company branch managers, tech procurement leads, and shipping directors."
  },
  {
    id: "inst-sh-004",
    name: "East China Normal University (ECNU) - Intensive Business Communications",
    tuitionRmb: 10500,
    location: "Shanghai",
    startDates: ["September 2026", "November 2026", "March 2027"],
    applicationLink: "https://lxs.ecnu.edu.cn",
    highlights: ["Focuses on high-speed presentation skills", "Cross-cultural bargaining psychology workshops", "Interactive multimedia class sizes restricted to 10 students"],
    description: "A highly acclaimed spoken-language school. Students practice active corporate negotiations, supplier audits, and wholesale contracts pitch decks."
  },
  {
    id: "inst-sh-005",
    name: "Shanghai University of International Business and Economics (SUIBE) - Global Sales and Shipping Institute",
    tuitionRmb: 9000,
    location: "Shanghai",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "http://www.suibe.edu.cn",
    highlights: ["Maritime freight and shipping terminal logistics terms", "Customs declaration documentation language", "Sourcing trips to Shanghai Yangshan Deepwater Port"],
    description: "A trade expert training school offering deep legal, tax, port logistics, and container shipping vocabulary."
  },
  {
    id: "inst-sh-006",
    name: "Shanghai University (SHU) - Yangtze Delta Trade Program",
    tuitionRmb: 9200,
    location: "Shanghai",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://apply.shu.edu.cn",
    highlights: ["Factory tours in Ningbo & Shaoxing textile zones", "Active supply chain forecasting terms", "Interviews with shipping brokers"],
    description: "Designed to help students establish supply chain channels directly with manufacturers in the wealthy Yangtze River Delta region."
  },
  {
    id: "inst-sh-007",
    name: "Tongji University - Construction & Hardware Sourcing School",
    tuitionRmb: 11500,
    location: "Shanghai",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://study.tongji.edu.cn",
    highlights: ["Architectural and engineering trade vocabulary", "Building material specification checks", "Steel, glass, and concrete wholesale negotiation sheets"],
    description: "An exceptional language track for developers, contractors, and building material importers sourcing from China."
  },
  {
    id: "inst-sh-008",
    name: "Shanghai Customs College - Custom Union & Sourcing Compliance Track",
    tuitionRmb: 9800,
    location: "Shanghai",
    startDates: ["October 2026", "March 2027"],
    applicationLink: "https://ices.fudan.edu.cn",
    highlights: ["Official customs inspectors as lecturers", "Anti-dumping and tariff compliance terms", "HS Code assignment vocabulary"],
    description: "Highly specialized course focused on export compliance, customs tariff, tax rebates, and bonded warehouse guidelines."
  },
  {
    id: "inst-sh-009",
    name: "Shanghai Finance & Trade Institute - Venture Capital & Sourcing School",
    tuitionRmb: 10000,
    location: "Shanghai",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://ices.dhu.edu.cn",
    highlights: ["Escrow and digital currency payment formats", "Alipay Business and WeChat Pay trading pipelines", "Venture capital round-table phrases"],
    description: "Perfect for tech-savvy founders wanting to establish tech ventures or process cross-border payments with Chinese suppliers."
  },
  {
    id: "inst-sh-010",
    name: "Yangtze River Shipping Academy - Bulk Cargo Sourcing Terminology",
    tuitionRmb: 8500,
    location: "Shanghai",
    startDates: ["September 2026", "April 2027"],
    applicationLink: "https://lxs.ecnu.edu.cn",
    highlights: ["Coal, petroleum, and bulk grain trade words", "Charter party cargo vessel leasing phrases", "Port demurrage cost negotiation templates"],
    description: "A tailored, high-value program for bulk commodity shippers operating on the Yangtze River shipping corridors."
  },

  // BEIJING - HSK & Policy Regulatory (10)
  {
    id: "inst-bj-001",
    name: "Beijing Language and Culture University (BLCU) - Pre-eminent Mandarin Training Center",
    tuitionRmb: 11500,
    location: "Beijing",
    startDates: ["September 2026", "October 2026", "January 2027", "March 2027"],
    applicationLink: "http://isao.blcu.edu.cn",
    highlights: ["The world's absolute capital of Chinese as a Second Language", "Unrivaled textbook authoring pedigree", "Elite standard Putonghua pronunciation certification"],
    description: "BLCU has trained over 200,000 global speakers. Its business and standard HSK courses are internationally accredited and set the planetary gold standard."
  },
  {
    id: "inst-bj-002",
    name: "University of International Business and Economics (UIBE) - Policy & Tariff Academy",
    tuitionRmb: 10800,
    location: "Beijing",
    startDates: ["September 2026", "November 2026", "March 2027"],
    applicationLink: "http://sie.uibe.edu.cn",
    highlights: ["Heavy focus on WTO agreements and bilateral trade rules", "Direct study of anti-dumping policies", "Excellent regulatory contact network"],
    description: "The ideal academy to understand geopolitical trade policies, customs tariffs, bilateral agreements, and state-owned supplier procurement protocols."
  },
  {
    id: "inst-bj-003",
    name: "Peking University (PKU) - School of Business Mandarin Leadership",
    tuitionRmb: 18000,
    location: "Beijing",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "http://isd.pku.edu.cn",
    highlights: ["China's #1 ranked university", "Bespoke executive corporate modules", "Direct contact with Chinese economic policy advisors"],
    description: "Highly prestigious, fast-paced corporate leadership track. Bypasses standard grammar and focuses strictly on macroeconomic negotiations."
  },
  {
    id: "inst-bj-004",
    name: "Tsinghua University - Technological Enterprise & Industrial Trade Academy",
    tuitionRmb: 17500,
    location: "Beijing",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "http://is.tsinghua.edu.cn",
    highlights: ["Unparalleled engineering and science reputation", "IP protection, patent licensing, and technology transfer vocabulary", "Direct startup investor networking"],
    description: "Designed for hardware creators, factory investors, and tech company executives needing professional fluency to lead technical supplier operations."
  },
  {
    id: "inst-bj-005",
    name: "Beijing Foreign Studies University (BFSU) - Diplomatic & Commercial Chinese Department",
    tuitionRmb: 11000,
    location: "Beijing",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://ojc.bfsu.edu.cn",
    highlights: ["Focuses on treaty translation and diplomatic precision", "Advanced arbitration and dispute resolution negotiations", "High diplomatic-level language training"],
    description: "Excellent training center for trade representatives, consultants, and legal attorneys managing cross-border commercial claims."
  },
  {
    id: "inst-bj-006",
    name: "Capital University of Economics and Business (CUEB) - Northern China Freight Academy",
    tuitionRmb: 8500,
    location: "Beijing",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "http://english.cueb.edu.cn",
    highlights: ["Northern logistics terminal network analysis", "B2B platform procurement vocabulary", "Warehousing compliance modules"],
    description: "A highly practical course focusing on commodity distribution, consumer supply chains, and freight contracts."
  },
  {
    id: "inst-bj-007",
    name: "Beijing Technology and Business University (BTBU) - Sourcing & Commodity Language Center",
    tuitionRmb: 8800,
    location: "Beijing",
    startDates: ["October 2026", "March 2027"],
    applicationLink: "https://www.btbu.edu.cn",
    highlights: ["Grain, food, and agricultural import standards", "FMCG supply chain contract phrases", "Product safety regulation analysis"],
    description: "Tailored for food, agriculture, and daily consumer goods traders sourcing raw stock from Northern China."
  },
  {
    id: "inst-bj-008",
    name: "Remin University of China - Corporate Governance & Trade Regulations",
    tuitionRmb: 12500,
    location: "Beijing",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "http://iso.ruc.edu.cn",
    highlights: ["Commercial litigation and local arbitration terms", "Trademark and brand registration procedures", "State-owned enterprise negotiation simulation"],
    description: "A solid academy for trademark registry, contract compliance, and sovereign corporate trading regulations."
  },
  {
    id: "inst-bj-009",
    name: "Beijing Institute of Technology (BIT) - Modern Manufacturing & Trade Program",
    tuitionRmb: 9800,
    location: "Beijing",
    startDates: ["September 2026", "April 2027"],
    applicationLink: "https://www.bit.edu.cn",
    highlights: ["Automation, robotics, and smart factory terms", "Equipment supply agreements language", "Inspection certificate verification training"],
    description: "Best for machinery developers, smart home system installers, and technical procurement specialists."
  },
  {
    id: "inst-bj-010",
    name: "Beijing Union University - Northern Commodity Marketplace Immersion",
    tuitionRmb: 7500,
    location: "Beijing",
    startDates: ["September 2026", "December 2026", "March 2027"],
    applicationLink: "http://isao.blcu.edu.cn",
    highlights: ["Tours of local Beijing consumer wholesale portals", "Interactive supplier negotiation exercises", "Basic wholesale trader vocabulary guides"],
    description: "Designed strictly for entry-level importers looking to pick up essential wholesale market phrases quickly."
  },

  // SHENZHEN / HANGZHOU - E-Commerce & Hardware Prototyping (10)
  {
    id: "inst-sz-001",
    name: "Shenzhen University (SZU) - Silicon Valley of Hardware Sourcing School",
    tuitionRmb: 9500,
    location: "Shenzhen",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://lxs.szu.edu.cn",
    highlights: ["Located literal blocks from Huaqiangbei Electronics Market", "Syllabus includes chip and mold sourcing projects", "Direct interaction with independent PCB assembly workshops"],
    description: "The dream destination for tech creators. SZU's intensive language tracts focus purely on printed circuit boards, mold injection, and rapid hardware prototyping language."
  },
  {
    id: "inst-hz-001",
    name: "Zhejiang University (ZJU) - Silicon Valley of E-Commerce Mandarin",
    tuitionRmb: 12000,
    location: "Hangzhou",
    startDates: ["September 2026", "October 2026", "March 2027"],
    applicationLink: "http://iczu.zju.edu.cn",
    highlights: ["Direct visits to Alibaba Group Xixi Campus", "Focuses on Taobao, AliExpress, and 1688 API trading terms", "Taught by e-commerce industry practitioners"],
    description: "The top-tier digital trade course in China's tech capital. ZJU teaches advanced e-commerce analytics, dropshipping operations, and automated marketplace translation strategies."
  },
  {
    id: "inst-sz-002",
    name: "Peking University - Shenzhen Graduate Sourcing & Finance Institute",
    tuitionRmb: 15500,
    location: "Shenzhen",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://lxs.szu.edu.cn",
    highlights: ["VIP Venture Capital & Manufacturing connections", "Comprehensive Shenzhen Port logistics analysis", "Advanced tech-procurement negotiations"],
    description: "Designed for founders and procurement partners who want to master hardware supply chains, OEM contract logic, and industrial supplier negotiation."
  },
  {
    id: "inst-sz-003",
    name: "Shenzhen Commercial Languages - Huaqiangbei Sourcing Rapid Prep",
    tuitionRmb: 6000,
    location: "Shenzhen",
    startDates: ["Every Monday"],
    applicationLink: "https://lxs.szu.edu.cn",
    highlights: ["1-week ultra-intensive electronic procurement vocabulary", "On-site mock negotiations at SEG Electronics Market", "Supplier WeChat communication scripts"],
    description: "Very focus-driven class setup targeting tech resellers and makers who are checking out components on-site."
  },
  {
    id: "inst-sz-004",
    name: "Harbin Institute of Technology (Shenzhen) - Advanced Robotics & Hardware English-Mandarin",
    tuitionRmb: 11000,
    location: "Shenzhen",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "http://www.hit.edu.cn",
    highlights: ["Laser engraving and 3D printing equipment terms", "Quality assurance test report check vocabulary", "Factory line assembly communication plans"],
    description: "Suited for engineers and manufacturers who require complex structural formulas, product compliance, and precision hardware terms."
  },
  {
    id: "inst-sz-005",
    name: "Tsinghua Shenzhen International Graduate School - Tech-Transfer & Trade Academy",
    tuitionRmb: 16500,
    location: "Shenzhen",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://lxs.szu.edu.cn",
    highlights: ["Patent and product filing terminology", "Shenzhen manufacturing tax rebate classes", "Advanced product distribution legal phrases"],
    description: "An elite technical-mandarin hub for entrepreneurs establishing long-term manufacturer supply lines in the Pearl River Delta."
  },
  {
    id: "inst-hz-002",
    name: "Hangzhou Dianzi University (HDU) - Digital Sourcing & AI-Trade School",
    tuitionRmb: 8500,
    location: "Hangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://www.hdu.edu.cn",
    highlights: ["Internet business models and digital supply chains", "API and EDI logistics connection scripts", "E-commerce customer service templates"],
    description: "Focuses on high-growth cross-border retail, Shopify-to-factory integration, and supplier relationship management language."
  },
  {
    id: "inst-hz-003",
    name: "Zhejiang Gongshang University - International Retail Sourcing Academy",
    tuitionRmb: 8800,
    location: "Hangzhou",
    startDates: ["September 2026", "November 2026", "March 2027"],
    applicationLink: "http://lxs.zjgsu.edu.cn",
    highlights: ["FMCG supplier negotiation simulations", "Global brand shipping and customs rules", "Sourcing trips to Hangzhou clothing wholesale centers"],
    description: "Ideal for clothing brand owners and retail store buyers wanting to source apparel from Yiwu/Keqiao warehouses."
  },
  {
    id: "inst-hz-004",
    name: "Zhejiang Sci-Tech University (ZSTU) - Textile Sourcing & Silk Trade Academy",
    tuitionRmb: 9000,
    location: "Hangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "http://www.zstu.edu.cn",
    highlights: ["Fabric GSM and weave specification terms", "Textile chemical compliance and certificate checks", "Bespoke pattern print order tracking terms"],
    description: "World-class textile language academy. Perfect for apparel merchants establishing direct orders with Zhejiang silk and cotton mills."
  },
  {
    id: "inst-hz-005",
    name: "Yuhang E-Commerce Vocational Center - Live-Stream Commerce Language School",
    tuitionRmb: 6000,
    location: "Hangzhou",
    startDates: ["October 2026", "January 2027", "March 2027"],
    applicationLink: "http://iczu.zju.edu.cn",
    highlights: ["TikTok and Douyin sales vocabulary", "Product pitch scripts and dynamic video text", "Influencer agency contract management terms"],
    description: "Highly unique vocational program specializing in online brand marketing, live demonstration speech, and viral marketing vocabulary."
  },

  // CHENGDU / NANJING / WUHAN / XIAMEN - Industrial & Regional Trade Centers (5)
  {
    id: "inst-cd-001",
    name: "Sichuan University (SCU) - Western China Resource Sourcing Hub",
    tuitionRmb: 9500,
    location: "Chengdu",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "http://oas.scu.edu.cn",
    highlights: ["Western China railway freight corridor (Belt & Road)", "Agricultural and raw mineral cargo shipping terms", "Western factory direct procurement networks study"],
    description: "Perfect for students targeting the high-growth Chengdu-Chongqing economic circle. Focuses on rail freight trade corridors connecting to Europe and West Africa."
  },
  {
    id: "inst-nj-001",
    name: "Nanjing University (NJU) - Yangtze River Sourcing & Logistics School",
    tuitionRmb: 11000,
    location: "Nanjing",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://stue.nju.edu.cn",
    highlights: ["Deepwater river port cargo boarding terms", "Nanjing chemical and hardware industrial vocabulary", "Heavy logistics broker interaction logs"],
    description: "Top-tier university focusing on chemical manufacturing, bulk mineral terminal forwarding, and industrial supply lines in East China."
  },
  {
    id: "inst-wh-001",
    name: "Wuhan University (WHU) - Central China Trade & High-Speed Logistics Group",
    tuitionRmb: 10000,
    location: "Wuhan",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "http://admission.whu.edu.cn",
    highlights: ["Inland waterways logistics and multi-modal container transport", "Wuhan automotive manufacturing industrial vocab", "Bargaining with heavy industrial parts mills"],
    description: "Focuses on central China logistical networks, automotive manufacturing sourcing pipelines, and massive dry-dock shipping container vocabulary."
  },
  {
    id: "inst-xm-001",
    name: "Xiamen University (XMU) - Coastal Sourcing & Shipping Trade Program",
    tuitionRmb: 10500,
    location: "Xiamen",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "http://admissions.xmu.edu.cn",
    highlights: ["Southeastern maritime trade agreements study", "Direct connection with Fujian stone & ceramic factories", "Electronic hardware export supply chain study"],
    description: "Xiamen University offers a premium maritime-focused trade mandarin program ideal for ceramic, solar, and building material merchants."
  },
  {
    id: "inst-nj-002",
    name: "Nanjing University of Science and Technology (NJUST) - Mechanical Sourcing Language Track",
    tuitionRmb: 9200,
    location: "Nanjing",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "http://www.njust.edu.cn",
    highlights: ["Industrial hardware specification files check", "Bargain tactics for metal forging and castings", "Third-party product quality testing files terminology"],
    description: "Technical, industrial sourcing language program for machinery, hardware components, and industrial fittings importers."
  },
  {
    id: "inst-added-001",
    name: "New Concept Mandarin",
    tuitionRmb: 3500,
    location: "Guangzhou",
    startDates: ["Dynamic Enrollment", "Every Month"],
    applicationLink: "https://newconceptmandarin.com",
    highlights: ["Corporate training", "Custom trade vocabulary", "Flexible module schedules"],
    description: "Corporate training and custom trade vocational language center in Tianhe District, Guangzhou. Fast-track vocabulary modules starting at ¥3,500."
  },
  {
    id: "inst-added-002",
    name: "That's Mandarin Institute",
    tuitionRmb: 4800,
    location: "Guangzhou",
    startDates: ["Continuous Enrollment"],
    applicationLink: "https://thatsmandarin.com",
    highlights: ["Intensive Business 1-on-1 focus", "HSK Preparation", "Online hybrid learning options"],
    description: "Flexible business and conversational packages in Guangzhou and online. High-frequency communication coaching with active 1-on-1 tutoring starting at ¥120 – ¥220/hour."
  },
  {
    id: "inst-added-003",
    name: "Chinese Language Institute (CLI) - Sourcing Immersion Center",
    tuitionRmb: 2500,
    location: "Guangzhou",
    startDates: ["Weekly intakes in 2026", "March 2027"],
    applicationLink: "https://studychineseinchina.com",
    highlights: ["Business Mandarin tracks", "Canton trade immersion hubs", "Guilin-Guangzhou logistic network tours"],
    description: "World-renowned regional hub. Tailors active business language programs and Canton trade supplier auditing immersion guides (from $350 – $1,200/course)."
  },
  {
    id: "inst-added-004",
    name: "Lingoinn Teacher Homestay",
    tuitionRmb: 8000,
    location: "Guangzhou",
    startDates: ["Every Sunday"],
    applicationLink: "https://lingoinn.com",
    highlights: ["24/7 total business immersion", "Private sourcing coaching", "Full homestay accommodation included"],
    description: "Total customized home-school immersion environment in Guangzhou. Study 1-on-1 while navigating active market sourcing and factory negotiation guides (¥8,000 – ¥15,000/week)."
  },
  {
    id: "inst-added-005",
    name: "Yiwu Sourcing & Language Hub",
    tuitionRmb: 3000,
    location: "Yiwu",
    startDates: ["Dynamic Weekly Intake"],
    applicationLink: "https://yiwuguide.com",
    highlights: ["Wholesale market trade phrases", "Bargaining simulations", "Direct sourcing agent escort"],
    description: "Located near Yiwu's market districts. Focuses on light-industrial cargo logistics and wholesale bargaining terms (¥3,000 – ¥6,500/month)."
  },
  {
    id: "inst-added-006",
    name: "Mandarin House China - Guangzhou Center",
    tuitionRmb: 4500,
    location: "Guangzhou",
    startDates: ["September 2026", "November 2026", "March 2027"],
    applicationLink: "https://mandarinhouse.com",
    highlights: ["Professional business protocols", "Executive verbal fluency modules", "Canton network placement"],
    description: "Award-winning language institute centered in Guangzhou. Offers elite business tracks, high-end commercial communication tools, and supply chain negotiation practices."
  },
  {
    id: "inst-added-007",
    name: "Canton Mandarin School",
    tuitionRmb: 3800,
    location: "Guangzhou",
    startDates: ["Every Monday"],
    applicationLink: "https://cantonmandarin.com",
    highlights: ["Daily sourcing vocabulary", "Logistics & Cargo definitions", "Shipping terms integration"],
    description: "Yuexiu District school providing survival language modules. Teaches freight paperwork, shipping protocols, and marketplace contract bargaining."
  },
  {
    id: "inst-added-008",
    name: "ImmerseChina Language Center",
    tuitionRmb: 5000,
    location: "Shenzhen",
    startDates: ["October 2026", "January 2027", "March 2027"],
    applicationLink: "https://immersechina.com",
    highlights: ["Tech and hardware sourcing tracks", "E-commerce platform tools", "Factory negotiation scripts"],
    description: "Shenzhen-based center near commercial zones. Integrates micro-electronics, wholesale device component specifications, and digital e-commerce vocabulary."
  },
  {
    id: "inst-added-009",
    name: "Yiwu International Language Academy",
    tuitionRmb: 4000,
    location: "Yiwu",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://yiwuila.org",
    highlights: ["Cross-border e-commerce layouts", "Multi-language trade logistics files", "Chouzhou Road location"],
    description: "Trade academy specialized in platform distribution networks, seller operations, and supply chain cargo management phrases."
  },
  {
    id: "inst-added-010",
    name: "Guangzhou Business Language Training (GZBLT)",
    tuitionRmb: 6000,
    location: "Guangzhou",
    startDates: ["Every Month"],
    applicationLink: "https://gzblt.cn",
    highlights: ["Factory tour simulation drills", "Contract negotiation workshops", "Fast-track corporate sessions"],
    description: "Panyu District center designed for international bulk procurement officers. Core focuses include quality control terms, supplier audits, and wholesale liability clauses."
  },
  {
    id: "inst-added-011",
    name: "Guangdong University of Foreign Studies",
    tuitionRmb: 8500,
    location: "Guangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://gdufs.edu.cn",
    highlights: ["Comprehensive Business Chinese tracks", "Official university certification", "X1/X2 visa sponsorship"],
    description: "Baiyun District hub offering long-term structure to master commerce vocab, government-sponsored waiver prep, and multi-tier business logistics paths."
  },
  {
    id: "inst-added-012",
    name: "South China University of Technology",
    tuitionRmb: 8500,
    location: "Guangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://sie.scut.edu.cn",
    highlights: ["Intensive technical & trade programs", "Industrial engineering focus", "Vibrant science community"],
    description: "Wushan Campus program. Prepares students with technical terminology for hardware engineering, logistics, and major light industrial manufacturing."
  },
  {
    id: "inst-added-013",
    name: "Guangzhou University",
    tuitionRmb: 8000,
    location: "Guangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://gzhu.edu.cn",
    highlights: ["Year-long comprehensive curriculum", "South China culture integration", "State of the art campus"],
    description: "Located in the Higher Education Mega Center. Provides full non-degree language tracks focusing on South China trade rules, local commerce, and HSK (estimated at ¥16,000/year)."
  },
  {
    id: "inst-added-014",
    name: "Jinan University",
    tuitionRmb: 8800,
    location: "Guangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://hwxy.jnu.edu.cn",
    highlights: ["College of Chinese Language & Culture track", "Tianhe District campus", "Elite business language modules"],
    description: "Prestigious university path. Highly recognized certification in business correspondence, intermediate trade, and international trade relations."
  },
  {
    id: "inst-added-015",
    name: "Sun Yat-sen University",
    tuitionRmb: 10500,
    location: "Guangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://iso.sysu.edu.cn",
    highlights: ["Elite business & commerce Chinese", "Haizhu principal campus", "Top tier academic prestige"],
    description: "Premier academic hub. Offers high-level global corporate strategy, intermediate trade law, and contract analysis for executive merchants."
  },
  {
    id: "inst-added-016",
    name: "South China Normal University",
    tuitionRmb: 8000,
    location: "Guangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://cicgz.scnu.edu.cn",
    highlights: ["Practical spoken modules", "Business report writing tools", "Canton Trade corridor networking"],
    description: "Tianhe Campus center connecting student groups directly with commercial sourcing databases, trade writing, and marketplace speaking skills."
  },
  {
    id: "inst-added-017",
    name: "Guangzhou Institute of Science & Tech",
    tuitionRmb: 15900,
    location: "Guangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://gzist.edu.cn",
    highlights: ["Foundation language programs", "Maritime culture integration workshops", "State-of-the-art facilities"],
    description: "Baiyun District institute centered on technical communications, logistics structures, and corporate administration pathways (estimated at ¥31,800/year)."
  },
  {
    id: "inst-added-018",
    name: "Guangdong University of Technology",
    tuitionRmb: 7500,
    location: "Guangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://oec.gdut.edu.cn",
    highlights: ["Engineering and Industrial Logistics focus", "Supply chain structures", "Factory visit program"],
    description: "Panyu Campus. Ideal for tech buyers searching to master industrial engineering, logistics networks, and hardware shipping streams."
  },
  {
    id: "inst-added-019",
    name: "Guangzhou Medical University",
    tuitionRmb: 9000,
    location: "Guangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://gzhmu.edu.cn",
    highlights: ["Functional Medical & Pharma vocab", "Device procurement terms", "Import-export compliance specs"],
    description: "Panyu-based specialist track designed to instruct on medical commerce, safety testing standards, and pharmaceutical sourcing vocabulary."
  },
  {
    id: "inst-added-020",
    name: "Zhongkai University of Agriculture",
    tuitionRmb: 7000,
    location: "Guangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://zhku.edu.cn",
    highlights: ["Agricultural trade phrasing", "Eco-commerce logistics details", "Green supply chains terminology"],
    description: "Haizhu Campus. Focused on environmental regulations, food cargo certification, and agricultural commodity trade."
  },
  {
    id: "inst-added-021",
    name: "Guangdong Polytech Normal University",
    tuitionRmb: 7500,
    location: "Guangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://gpnu.edu.cn",
    highlights: ["Vocational trade practices", "B2B platform operations", "Tianhe District classrooms"],
    description: "Practical vocational curriculum focused on custom declarations, import bookkeeping, and bulk supply chain coordination."
  },
  {
    id: "inst-added-022",
    name: "Guangdong University of Finance",
    tuitionRmb: 8200,
    location: "Guangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://gduf.edu.cn",
    highlights: ["Financial markets, banking, and fintech Chinese", "Ledger drafting training", "Tianhe campus center"],
    description: "Financial hub. Specialized language modules covering international wires, lines of credit, tax compliance, and trade accounting."
  },
  {
    id: "inst-added-023",
    name: "Yiwu Industrial & Commercial College",
    tuitionRmb: 8500,
    location: "Yiwu",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://ywicc.edu.cn",
    highlights: ["Direct market sourcing integration", "Commodity trade focus", "Located in downtown Yiwu"],
    description: "The absolute epicenter of wholesale commodity research. Direct pathways into active trade hubs and physical supply chains."
  },
  {
    id: "inst-added-024",
    name: "Zhejiang University",
    tuitionRmb: 9500,
    location: "Hangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://iczu.zju.edu.cn",
    highlights: ["Premium Executive business Chinese track", "Close strategic hub status to Yiwu markets", "High profile tech network"],
    description: "Located in nearby Hangzhou. Top tier executive business curriculum focusing on enterprise commerce, investments, and advanced trade."
  },
  {
    id: "inst-added-025",
    name: "Zhejiang University of Technology",
    tuitionRmb: 7800,
    location: "Hangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://ie.zjut.edu.cn",
    highlights: ["Technical trade terminology", "Imports & Exports operation logic", "Industrial compliance modules"],
    description: "Provides strong technical vocabulary for managing heavy logistics, custom rules, factory checks, and trade documentation."
  },
  {
    id: "inst-added-026",
    name: "Zhejiang Normal University",
    tuitionRmb: 7000,
    location: "Jinhua",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://iso.zjnu.edu.cn",
    highlights: ["Global trade and logistics structures", "Cultural exchange workshops", "Bordering Yiwu logistics zones"],
    description: "Strategic Jinhua location. Connects foreign merchants directly with regional freight brokers, distribution centers, and HSK paths."
  },
  {
    id: "inst-added-027",
    name: "Ningbo University",
    tuitionRmb: 7500,
    location: "Ningbo",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://nbu.edu.cn",
    highlights: ["Maritime logistics focus", "Shipping and port trade terms", "Strategic ocean harbor hub"],
    description: "Located in vital Ningbo port region. Instructs on oceanic bills of lading, freight forwarding, customs clearance, and container split agreements."
  },
  {
    id: "inst-added-028",
    name: "Zhejiang Sci-Tech University",
    tuitionRmb: 8000,
    location: "Hangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://zstu.edu.cn",
    highlights: ["Textile trade concepts", "Apparel & Fashion business specs", "Close to Keqiao textile hub"],
    description: "World-class textile language modules. Perfect for fabric sourcing supervisors, apparel boutique owners, and merchandise quality inspectors."
  },
  {
    id: "inst-added-029",
    name: "Zhejiang Gongshang University",
    tuitionRmb: 8500,
    location: "Hangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://gsu.edu.cn",
    highlights: ["Advanced E-Commerce systems", "Business Strategy formulations", "Strategic tech cluster focus"],
    description: "Excellent business-focused program. Specifically guides on digital marketing, international pricing lists, online platforms, and digital supply paths."
  },
  {
    id: "inst-added-030",
    name: "Wenzhou University",
    tuitionRmb: 6500,
    location: "Wenzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://wzu.edu.cn",
    highlights: ["Manufacturing sourcing logistics", "Industrial commerce practices", "Direct private factory lines sync"],
    description: "Wenzhou center. Prepares students with shoe, leather, pump, valve and hardware vocabulary to tap Wenzhou's private manufacturing sectors."
  },
  {
    id: "inst-added-031",
    name: "Dongguan University of Technology",
    tuitionRmb: 6800,
    location: "Dongguan",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://dgut.edu.cn",
    highlights: ["Hardware manufacturing sourcing vocab", "OEM specification charts review", "Factory floor interactive scripts"],
    description: "Suburban Guangzhou hub. Trains procurement teams on circuit board, component moldings, and robotic assembly term compliance."
  },
  {
    id: "inst-added-032",
    name: "Foshan University",
    tuitionRmb: 7000,
    location: "Foshan",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://fosu.edu.cn",
    highlights: ["Ceramics, furniture sourcing vocab", "Supplier negotiation templates", "Foshan wholesale market tours"],
    description: "Foshan hub. Practical trade course specializing on furniture assembly instructions, ceramic firing norms, and building supplies procurement."
  },
  {
    id: "inst-added-033",
    name: "Shenzhen University",
    tuitionRmb: 9000,
    location: "Shenzhen",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://cie.szu.edu.cn",
    highlights: ["Tech Venture Capital strategies", "High-Tech sourcing terminology", "Huaqiangbei marketplace drills"],
    description: "Shenzhen's major campus. Best for tech founders checking components, hardware manufacturing systems, and patent compliance."
  },
  {
    id: "inst-added-034",
    name: "Zhejiang Ocean University",
    tuitionRmb: 6500,
    location: "Zhoushan",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://zjou.edu.cn",
    highlights: ["Marine Cargo structures", "Shipping and Logistics Tracking", "Oceanic port communications"],
    description: "Zhoushan center. Teaches ship handling, raw chemical freight, maritime logistics contracts, and terminal logistics definitions."
  },
  {
    id: "inst-added-035",
    name: "Zhejiang Shuren University",
    tuitionRmb: 7500,
    location: "Hangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://zsr.edu.cn",
    highlights: ["Intermediate Retail systems", "Micro-Enterprise operations", "Fast-track retail bookkeeping"],
    description: "Hangzhou campus. Practical merchant focus teaching supply chain scheduling, distributor negotiations, and small business operations."
  },
  {
    id: "inst-added-036",
    name: "Hangzhou Dianzi University",
    tuitionRmb: 8000,
    location: "Hangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://hdu.edu.cn",
    highlights: ["Cross-Border software integrations", "E-Commerce App & ERP tools", "Digital billing templates"],
    description: "Engineering-centered program. Ideal for digital marketers coordinating warehouse API scripts and automated database logistics phrases."
  },
  {
    id: "inst-added-037",
    name: "Zhejiang University of Finance & Econ",
    tuitionRmb: 8200,
    location: "Hangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://zufe.edu.cn",
    highlights: ["Accounting record compliance", "Audit record translation", "Customs reporting documentation"],
    description: "Offers high proficiency in financial audits, tax registration, invoice (Fapiao) procedures, and corporate taxation compliance."
  },
  {
    id: "inst-added-038",
    name: "Guangdong University of Petrochemical",
    tuitionRmb: 6500,
    location: "Maoming",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://gdupt.edu.cn",
    highlights: ["Chemical product vocabulary", "Plastics and Raw Materials trade specs", "Environmental safety indicators"],
    description: "Maoming campus. Focused on high-volume chemical cargo, plastics molding, bulk supplier lists, and quality checks."
  },
  {
    id: "inst-added-039",
    name: "Shaoguan University",
    tuitionRmb: 6000,
    location: "Shaoguan",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://sgu.edu.cn",
    highlights: ["Regional freight structures", "Supply chain base communications", "Subsidized regional paths"],
    description: "Northern Guangdong school focusing on railway hubs, warehouse management, freight distribution networks, and regional sourcing paths."
  },
  {
    id: "inst-added-040",
    name: "Jiaying University",
    tuitionRmb: 6000,
    location: "Meizhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://jyu.edu.cn",
    highlights: ["General Business modules", "Import-Export document operations", "Affordable local pathways"],
    description: "Meizhou school teaching customs declarations, commercial invoice translation, shipping paperwork, and trade contract formulations."
  },
  {
    id: "inst-added-041",
    name: "Zhejiang Wanli University",
    tuitionRmb: 7500,
    location: "Ningbo",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://zwu.edu.cn",
    highlights: ["International Commercial Law", "Trade Rules compliance", "Vibrant Ningbo port networks"],
    description: "Focuses on commercial legalities, contract liability parameters, maritime shipping litigation, and international arbitration procedures."
  },
  {
    id: "inst-added-042",
    name: "Ningbo Tech University",
    tuitionRmb: 8000,
    location: "Ningbo",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://nit.zju.edu.cn",
    highlights: ["Supply Chain automation vocab", "Warehouse control structures", "Active automated system tours"],
    description: "Advanced technological track focusing on smart warehouse systems, barcodes, robotic logistics, and inventory database communication terms."
  },
  {
    id: "inst-added-043",
    name: "Guangdong Medical University",
    tuitionRmb: 7500,
    location: "Zhanjiang",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://gdmu.edu.cn",
    highlights: ["Medical Equipment specifications", "Device Sourcing vocabulary", "Zhanjiang research campus"],
    description: "Focused on global health compliance files, hospital device specifications, custom parts sourcing, and quality checks."
  },
  {
    id: "inst-added-044",
    name: "Hanshan Normal University",
    tuitionRmb: 6200,
    location: "Chaozhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://hstc.edu.cn",
    highlights: ["Supply Chain Management practices", "Ceramics & dailywares trade", "Historical Chaozhou campus"],
    description: "Specialized focus on tableware, pottery, ceramic crafts, high-volume shipping, and wholesale market bargaining scripts."
  },
  {
    id: "inst-added-045",
    name: "Lingnan Normal University",
    tuitionRmb: 6000,
    location: "Zhanjiang",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://lingnan.edu.cn",
    highlights: ["General Sourcing foundations", "Basic HSK preparation", "Highly budget-friendly tracks"],
    description: "Provides solid foundations in daily spoken Chinese, introductory business pricing lists, and supplier contact structures."
  },
  {
    id: "inst-added-046",
    name: "Zhaoqing University",
    tuitionRmb: 6300,
    location: "Zhaoqing",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://zqu.edu.cn",
    highlights: ["Light Industrial Machinery sourcing", "Hardware specification sheets", "Affordable tuition levels"],
    description: "Teaches vocabulary for mechanical components, customized factory molding, steel parts fabrication, and quality compliance forms."
  },
  {
    id: "inst-added-047",
    name: "Huizhou University",
    tuitionRmb: 6500,
    location: "Huizhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://hzu.edu.cn",
    highlights: ["Electronics Sourcing details", "Apparel & Footwear specs", "Huizhou production clusters connectivity"],
    description: "Ideally situated near consumer manufacturing hubs. Translates quality checks, battery specifications, textile standards, and wholesale logistics files."
  },
  {
    id: "inst-added-048",
    name: "Wenzhou Business College",
    tuitionRmb: 8000,
    location: "Wenzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://wzbc.edu.cn",
    highlights: ["Private Enterprise operations", "Wholesale distribution tactics", "Intensive buyer seminars"],
    description: "Practical trading program. Teaches price negotiations, B2B digital sales, container splitting contracts, and bulk distribution management."
  },
  {
    id: "inst-added-049",
    name: "Guangdong Peizheng College",
    tuitionRmb: 8500,
    location: "Guangzhou",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://peizheng.edu.cn",
    highlights: ["Retail distribution systems", "Customs declaration procedures", "Guangzhou campus hubs"],
    description: "Sourcing program covering retail supply chains, cargo warehousing, customs compliance documents, and retail tax calculations."
  },
  {
    id: "inst-added-050",
    name: "Guangdong University of Science & Technology",
    tuitionRmb: 7800,
    location: "Dongguan",
    startDates: ["September 2026", "March 2027"],
    applicationLink: "https://gdst.cc",
    highlights: ["Advanced E-Commerce architectures", "ERP and custom API connections", "Smart city logistics studies"],
    description: "High-tech training center in Dongguan. Guides foreign buyer agencies on digital sales networks, automated logistics hubs, and cross-border platforms."
  }
];
