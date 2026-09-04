# ⚽ FPL AI Command Center

> An intelligent, interactive **Fantasy Premier League (FPL)** decision engine built on the analytical frameworks and heuristic models of premier FPL analysts (**FPL Harry**, **Tom Freeman / FPL Focal**, **Ben Crellin**, and **Algorithmic Analytics / FPL Review models**) combined with **live official press conference and injury intelligence**.

![FPL AI Command Center](https://img.shields.io/badge/FPL-2025%2F26-emerald?style=for-the-badge&logo=premierleague)
![React 19](https://img.shields.io/badge/React-19-cyan?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-purple?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-teal?style=for-the-badge&logo=tailwindcss)

---

## 🌟 Key Features

### 1. 🧠 Multi-Analyst Decision Engine
Toggle between distinct analyst modeling philosophies with live recalculations:
- **🎯 Consensus AI (Default):** Balanced weighted synthesis of top analytical methodologies.
- **⚡ FPL Harry Model:** Focuses on **90-minute security** ($xMins \ge 85$), aggressive backing of **penalty & set-piece talismans**, and rolling **3-GW fixture tickers**.
- **📊 Tom Freeman / FPL Focal Model:** Prioritizes **deep underlying metrics** ($xGI_{90}$, Non-Penalty $xG$, Big Chances Conceded by opponents) and **fixture swing radar**.
- **🛡️ Ben Crellin Schedule Model:** Focuses on a **5-GW runway**, DGW/BGW positioning (DGW25/34/37, BGW29), and **strict hit avoidance**.
- **🤖 Analytics Pro / FPL Review Model:** Pure probabilistic **Expected Points ($xPts$) horizon** with mathematical $-4$ hit thresholds.

---

### 2. 🎯 Ranked Transfer Hierarchy & Alternatives
- **Prioritized Sell Candidates:** Players to transfer out in preferential order with clear reasoning (injury, rotation risk, brutal fixture turn, form slump).
- **3 Curated Alternatives per Sell Candidate:**
  - **Top Direct Upgrade**
  - **Prime Fixture Run / Budget Enabler**
  - **Differential Gem**
- **-4 Hit Justification Meter:** Mathematically determines whether taking a $-4$ hit is justified over a 3-gameweek horizon ($\Delta xPts_{3GW} \ge 4.5$).
- **Underlying Stats HUD:** Form, $xGI/90$, Non-penalty $xG$, 3-GW FDR average, Minutes Security (`🛡️ 90m Nailed`), and Fixture Swing (`📈 +45% Swing`).

---

### 3. 🎙️ Live Press Conference & Intel Wire
- Real-time **Press Conference & Intel Wire** integrating official club briefings (`@Arsenal`, `@ManCity`, `@LFC`, `@ChelseaFC`, `@NUFC`, `@AVFCOfficial`, `@BrentfordFC`) and reputable handles (`@BenDinnery / Premier Injuries`, `@David_Ornstein`).
- Filter by **All Updates**, **🚨 Ruled Out**, and **✅ Confirmed Fit**.
- Cross-references transfer targets to guarantee no injured or benched players are recommended.

---

### 4. 🚀 Expert Chip Strategy Hub
- **Ben Crellin Classic Playbook:** *The BGW29 Free Hit & DGW34 Monster Boost (+48 pts).*
- **FPL Harry Aggressive Playbook:** *Early DGW25 Triple Captain & Aggressive WC31 (+44 pts).*
- **Tom Freeman / Focal Playbook:** *Dead-End GW29 & Post-Blank Wildcard 30 (+42 pts).*
- **Interactive "What-If" Chip Simulator:** Test activating any chip on any future gameweek for live point projections.
- **Master Gameweek 23–38 Radar:** Double Gameweek & Blank Gameweek schedule calendar.

---

### 5. ⚽ Tactical Pitch & Squad Lineup
- 3D interactive formation pitch with dynamic FDR fixture pills.
- Player armband management (Captain 👑 / Vice-Captain 🎖️).
- 1-Click position swapping and upgrade finder.
- Detailed player performance modals with underlying metrics HUD and press conference quotes.

---

### 6. 🔍 Live FPL Manager Lookup
- Fetch live squad picks for **any public FPL Manager ID** directly via the official FPL API.
- Instant preset switching (*Balaji XI*, *Top 10k Elite Template*).

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- `npm` or `yarn`

### Installation & Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/balajivx/fpl-ai-advisor.git
cd fpl-ai-advisor

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** TailwindCSS + Custom Glassmorphism System
- **Icons:** Lucide React
- **Animations & Effects:** Canvas Confetti

---

## 📄 License
MIT License. Feel free to use and contribute!
