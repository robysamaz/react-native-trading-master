/**
 * Lessons — the teachable concepts inside each unit.
 *
 * Content is grounded in the Samupindi supply & demand methodology:
 *   - Demand zones: RBR, DBR.  Supply zones: DBD, RBD.
 *   - Zone grading: A+ / B / C (freshness, departure strength, structure break, HTF alignment).
 *   - Multi-timeframe: HTF (H4/D1) for bias, ETF (M5–M15) for entries.
 *   - Risk: max 2% risk/trade, 3% daily drawdown, min 3:1 R:R, stop after 2 losses, max 3 trades/session.
 *   - Instruments: MES, MNQ, MYM, MCL, MGC (Micro Gold), M6E (Micro EUR/USD).
 *
 * Do not author rules that contradict the methodology above.
 */
import type { Lesson } from "@/types/learning";

/**
 * Builds the system prompt for a lesson's AI mentor. The mentor stays a calm,
 * disciplined trading coach scoped to THIS lesson only — it teaches the
 * concept, never gives live trade signals or financial advice, and always
 * reinforces risk discipline.
 */
const mentorPrompt = (focus: string): string =>
  [
    "You are a calm, disciplined institutional supply & demand trading mentor.",
    `For this lesson, teach only: ${focus}`,
    "Stay strictly inside the lesson's goal, key terms, and examples. If the learner asks about anything outside this lesson, gently redirect them back to it.",
    "Never give live trade signals, specific entry/exit prices to act on now, or personalized financial advice — you teach concepts, you do not call trades.",
    "Always reinforce risk discipline: capital protection first, max 2% risk per trade, minimum 3:1 reward-to-risk, and patience for fresh, high-quality zones.",
    "Be concise, encouraging, and unemotional. Use plain English, define jargon, and ground every point in a concrete example.",
  ].join(" ");

export const lessons: Lesson[] = [
  // ============================================================
  // Track: Supply & Demand Foundations
  // Unit: What Is a Zone?
  // ============================================================
  {
    id: "lsn-what-is-a-zone",
    trackId: "supply-demand-foundations",
    unitId: "sdf-zone-basics",
    order: 1,
    title: "What Is a Supply & Demand Zone?",
    goal: "Understand that a zone is a price area where institutions left unfilled orders, marked by a base followed by a strong departure.",
    keyTerms: [
      {
        term: "Zone",
        definition: "A price area (a rectangle, not a single line) where a strong move began, signalling unfilled institutional orders.",
      },
      {
        term: "Base",
        definition: "A small cluster of consolidation candles where institutions accumulated positions before the move.",
      },
      {
        term: "Departure",
        definition: "The strong, fast move away from the base — the proof that real buying or selling pressure was present.",
      },
      {
        term: "Proximal / distal line",
        definition: "Proximal = the zone edge nearest current price (entry side); distal = the far edge (stop side).",
      },
    ],
    examples: [
      {
        title: "A demand zone forms",
        scenario: "On MES, price stalls in a tight 3-candle base, then rips up 30+ points. That base becomes a demand zone — note the proximal (top) and distal (bottom) lines.",
      },
      {
        title: "Why price returns",
        scenario: "Institutions couldn't fill every order in the base. When price drifts back to that zone later, the leftover orders can push price away again.",
      },
    ],
    xp: 10,
    status: "available",
    aiMentorPrompt: mentorPrompt(
      "what a supply & demand zone is — base + departure, proximal/distal lines, and why price revisits zones to fill institutional orders."
    ),
  },
  {
    id: "lsn-demand-zones",
    trackId: "supply-demand-foundations",
    unitId: "sdf-zone-basics",
    order: 2,
    title: "Demand Zones: RBR & DBR",
    goal: "Identify the two bullish zone patterns — Rally-Base-Rally and Drop-Base-Rally — and know they mark areas to look for longs.",
    keyTerms: [
      {
        term: "RBR (Rally-Base-Rally)",
        definition: "A continuation demand pattern: price rallies, pauses in a base, then rallies again. The base is the demand zone.",
      },
      {
        term: "DBR (Drop-Base-Rally)",
        definition: "A reversal demand pattern: price drops, pauses in a base, then rallies. The base is the demand zone.",
      },
      {
        term: "Demand zone",
        definition: "A zone below price where buyers stepped in strongly — you look for longs, never shorts, here.",
      },
    ],
    examples: [
      {
        title: "RBR on MNQ",
        scenario: "MNQ rallies, consolidates for a few candles, then continues higher. The consolidation base is an RBR demand zone for a future pullback long.",
      },
      {
        title: "DBR turn",
        scenario: "MGC (Micro Gold) sells off into a base, then reverses sharply upward. That base is a DBR demand zone marking a potential reversal long.",
      },
    ],
    xp: 15,
    status: "locked",
    aiMentorPrompt: mentorPrompt(
      "the two demand-zone patterns RBR (Rally-Base-Rally) and DBR (Drop-Base-Rally), and that demand zones are where you only look for longs."
    ),
  },
  {
    id: "lsn-supply-zones",
    trackId: "supply-demand-foundations",
    unitId: "sdf-zone-basics",
    order: 3,
    title: "Supply Zones: DBD & RBD",
    goal: "Identify the two bearish zone patterns — Drop-Base-Drop and Rally-Base-Drop — and know they mark areas to look for shorts.",
    keyTerms: [
      {
        term: "DBD (Drop-Base-Drop)",
        definition: "A continuation supply pattern: price drops, pauses in a base, then drops again. The base is the supply zone.",
      },
      {
        term: "RBD (Rally-Base-Drop)",
        definition: "A reversal supply pattern: price rallies, pauses in a base, then drops. The base is the supply zone.",
      },
      {
        term: "Supply zone",
        definition: "A zone above price where sellers stepped in strongly — you look for shorts, never longs, here.",
      },
    ],
    examples: [
      {
        title: "RBD on MES",
        scenario: "MES rallies into a base then drops hard. The base is an RBD supply zone — a level to watch for a short on a return to price.",
      },
      {
        title: "DBD continuation",
        scenario: "MCL (Micro Crude) is falling, pauses briefly, then continues lower. That pause is a DBD supply zone in line with the downtrend.",
      },
    ],
    xp: 15,
    status: "locked",
    aiMentorPrompt: mentorPrompt(
      "the two supply-zone patterns DBD (Drop-Base-Drop) and RBD (Rally-Base-Drop), and that supply zones are where you only look for shorts."
    ),
  },

  // ============================================================
  // Track: Supply & Demand Foundations
  // Unit: Grading Zone Quality
  // ============================================================
  {
    id: "lsn-zone-grading",
    trackId: "supply-demand-foundations",
    unitId: "sdf-grading",
    order: 1,
    title: "Grading Zones: A+, B, C",
    goal: "Score a zone using freshness, departure strength, structure break, and HTF alignment so you trade only A+ and B zones.",
    keyTerms: [
      {
        term: "Freshness",
        definition: "An untested zone price has not yet returned to. Fresh zones hold best; each retest weakens them.",
      },
      {
        term: "Departure strength",
        definition: "How explosively price left the base. A+ zones show a 2:1+ departure (big imbalance) within about 3 candles.",
      },
      {
        term: "Structure break (BOS)",
        definition: "A break of a prior swing high/low confirming the move out of the zone shifted market structure.",
      },
      {
        term: "HTF alignment",
        definition: "The zone agrees with the higher-timeframe (H4/D1) bias — a demand zone in an uptrend, supply in a downtrend.",
      },
    ],
    examples: [
      {
        title: "An A+ zone",
        scenario: "Fresh demand zone, 2:1 departure in 3 candles, a clean break of structure, and it sits with the H4 uptrend. All four boxes ticked → A+.",
      },
      {
        title: "A C zone to skip",
        scenario: "A messy base, weak slow departure, no structure break, and it fights the HTF trend. That is a C zone — avoid it entirely.",
      },
    ],
    xp: 20,
    status: "locked",
    aiMentorPrompt: mentorPrompt(
      "grading zone quality with the four checks — freshness, departure strength, structure break, and HTF alignment — and trading only A+ and B zones while avoiding C zones."
    ),
  },

  // ============================================================
  // Track: Risk & Position Sizing
  // Unit: Protecting Capital
  // ============================================================
  {
    id: "lsn-two-percent-rule",
    trackId: "risk-position-sizing",
    unitId: "rps-protect-capital",
    order: 1,
    title: "The 2% Risk Rule",
    goal: "Risk no more than 2% of the account on any single trade so one loss never threatens the account.",
    keyTerms: [
      {
        term: "Risk per trade",
        definition: "The dollar amount lost if the stop is hit. Capped at 2% of the account balance — non-negotiable.",
      },
      {
        term: "Account risk vs trade risk",
        definition: "Account risk is your balance; trade risk is the small slice (≤2%) you expose on one idea.",
      },
    ],
    examples: [
      {
        title: "2% on a $6,000 account",
        scenario: "2% of $6,000 is $120. No matter how good the setup looks, the most you let this trade lose is $120.",
      },
      {
        title: "Conviction never raises risk",
        scenario: "An A+ zone still risks ≤2%. A better setup means a better trade, not a bigger gamble.",
      },
    ],
    xp: 15,
    status: "locked",
    aiMentorPrompt: mentorPrompt(
      "the 2% maximum risk-per-trade rule — how to compute the dollar risk and why conviction never justifies risking more."
    ),
  },
  {
    id: "lsn-drawdown-loss-limits",
    trackId: "risk-position-sizing",
    unitId: "rps-protect-capital",
    order: 2,
    title: "Daily Limits: Drawdown & Loss Streaks",
    goal: "Stop trading for the day at a 3% drawdown, after 2 consecutive losses, or once 3 trades are taken.",
    keyTerms: [
      {
        term: "Daily drawdown limit",
        definition: "A hard 3% account stop for the day. Hit it and you are done — no exceptions.",
      },
      {
        term: "2-loss rule",
        definition: "Two losing trades in a row ends the session; it protects you from tilt and revenge trading.",
      },
      {
        term: "Max trades per session",
        definition: "A cap of 3 trades per session keeps you selective and prevents overtrading.",
      },
    ],
    examples: [
      {
        title: "Loss streak stop",
        scenario: "You lose two trades back-to-back. Even with hours left in the session, you close the platform — the 2-loss rule says stop.",
      },
      {
        title: "Hitting the daily cap",
        scenario: "On a $6,000 account, a 3% drawdown is $180. Once total daily loss reaches $180, trading ends for the day.",
      },
    ],
    xp: 20,
    status: "locked",
    aiMentorPrompt: mentorPrompt(
      "the daily protective limits — 3% max daily drawdown, stop after 2 consecutive losses, and a maximum of 3 trades per session — and why they prevent tilt and overtrading."
    ),
  },
  {
    id: "lsn-reward-to-risk",
    trackId: "risk-position-sizing",
    unitId: "rps-protect-capital",
    order: 3,
    title: "The 3:1 Reward-to-Risk Floor",
    goal: "Take only trades offering at least 3:1 reward-to-risk so a modest win rate stays profitable.",
    keyTerms: [
      {
        term: "Reward-to-risk (R:R)",
        definition: "Potential profit divided by amount risked. The minimum acceptable is 3:1.",
      },
      {
        term: "1R",
        definition: "One unit of risk — the distance from entry to stop. A 3R target is three times that distance.",
      },
      {
        term: "Expectancy",
        definition: "With 3:1 R:R you can lose more often than you win and still grow the account over time.",
      },
    ],
    examples: [
      {
        title: "Measuring R:R",
        scenario: "Entry to stop is 10 points (1R). The target is 30+ points away (3R). The trade clears the 3:1 floor — it qualifies.",
      },
      {
        title: "Rejecting a 2:1",
        scenario: "A setup only offers 2:1 to the next zone. Below the 3:1 floor, you pass and wait for a better-located entry.",
      },
    ],
    xp: 20,
    status: "locked",
    aiMentorPrompt: mentorPrompt(
      "the minimum 3:1 reward-to-risk floor — defining 1R, measuring R:R from entry/stop/target, and why a high R:R keeps you profitable at a modest win rate."
    ),
  },

  // ============================================================
  // Track: Risk & Position Sizing
  // Unit: Sizing the Trade
  // ============================================================
  {
    id: "lsn-position-sizing-micros",
    trackId: "risk-position-sizing",
    unitId: "rps-sizing",
    order: 1,
    title: "Position Sizing on Micro Futures",
    goal: "Convert a stop distance and a 2% risk budget into a contract count on micro futures.",
    keyTerms: [
      {
        term: "Tick / point value",
        definition: "The dollar move per tick or point per contract — e.g. MES is $1.25/tick ($5/point); MGC is $1/tick ($10/point).",
      },
      {
        term: "Stop distance",
        definition: "Points/ticks from entry to the stop (placed beyond the zone's distal line).",
      },
      {
        term: "Contracts",
        definition: "Risk budget ÷ (stop distance × point value), rounded DOWN so you never exceed 2%.",
      },
    ],
    examples: [
      {
        title: "Sizing MES",
        scenario: "Risk budget $120, stop 8 points on MES ($5/point) → 8 × $5 = $40 risk per contract → 3 contracts ($120). Round down if it isn't even.",
      },
      {
        title: "Micros let you fit risk",
        scenario: "Micro contracts (MES, MNQ, MYM, MCL, MGC, M6E) are small enough to size precisely on a small account instead of being forced oversized.",
      },
    ],
    xp: 25,
    status: "locked",
    aiMentorPrompt: mentorPrompt(
      "position sizing on micro futures — using point/tick values and stop distance to convert a 2% risk budget into a contract count, always rounding down."
    ),
  },

  // ============================================================
  // Track: Reading Price Action
  // Unit: Multi-Timeframe Workflow
  // ============================================================
  {
    id: "lsn-htf-bias",
    trackId: "reading-price-action",
    unitId: "rpa-multi-timeframe",
    order: 1,
    title: "Higher-Timeframe Bias (H4 / D1)",
    goal: "Set a directional bias from the H4/D1 charts and only hunt zones aligned with that bias.",
    keyTerms: [
      {
        term: "HTF (Higher Timeframe)",
        definition: "The H4 and D1 charts used to read the broader trend and locate major zones.",
      },
      {
        term: "Bias",
        definition: "Your directional lean — bullish, bearish, or neutral — derived from HTF structure.",
      },
      {
        term: "HTF zone",
        definition: "A major supply/demand zone on H4/D1 where the highest-quality reactions tend to occur.",
      },
    ],
    examples: [
      {
        title: "Bullish bias",
        scenario: "D1 prints higher highs and higher lows. Bias is bullish, so you only look for longs from fresh H4 demand zones.",
      },
      {
        title: "Standing aside",
        scenario: "HTF is choppy with no clear structure. Bias is neutral — the disciplined move is to wait, not force a trade.",
      },
    ],
    xp: 20,
    status: "locked",
    aiMentorPrompt: mentorPrompt(
      "reading higher-timeframe bias from H4/D1 structure and only seeking zones that align with that bias — including standing aside when the HTF is unclear."
    ),
  },
  {
    id: "lsn-etf-entries",
    trackId: "reading-price-action",
    unitId: "rpa-multi-timeframe",
    order: 2,
    title: "Entry-Timeframe Execution (M5 / M15)",
    goal: "Use the M5–M15 charts to refine entries inside an HTF zone once price arrives in bias.",
    keyTerms: [
      {
        term: "ETF (Entry Timeframe)",
        definition: "The M5–M15 charts used to time and refine entries once price reaches an HTF zone.",
      },
      {
        term: "Confirmation entry",
        definition: "Wait for a lower-timeframe signal (zone removal, BOS, momentum break, or rejection) before entering.",
      },
      {
        term: "Refined zone",
        definition: "A smaller, more precise ETF zone found inside the larger HTF zone — it tightens the stop and lifts R:R.",
      },
    ],
    examples: [
      {
        title: "Confirmation on M5",
        scenario: "Price taps an H4 demand zone in a bullish bias. On M5 you wait for a break of structure up, then enter the refined demand zone behind it.",
      },
      {
        title: "Tighter stop, bigger R:R",
        scenario: "Refining the entry on M15 shrinks the stop distance, so the same target now offers 4:1 instead of 3:1.",
      },
    ],
    xp: 25,
    status: "locked",
    aiMentorPrompt: mentorPrompt(
      "refining entries on the M5–M15 timeframe inside an HTF zone — confirmation entries (zone removal, BOS, momentum break, rejection) and how a refined zone tightens the stop and improves R:R."
    ),
  },
];

/** Lessons belonging to a track, in unit-then-lesson order. */
export const getLessonsForTrack = (trackId: string): Lesson[] =>
  lessons.filter((lesson) => lesson.trackId === trackId);

/** Lessons belonging to a unit, in display order. */
export const getLessonsForUnit = (unitId: string): Lesson[] =>
  lessons
    .filter((lesson) => lesson.unitId === unitId)
    .sort((a, b) => a.order - b.order);

/** Look up a single lesson by id. */
export const getLessonById = (id: string): Lesson | undefined =>
  lessons.find((lesson) => lesson.id === id);
