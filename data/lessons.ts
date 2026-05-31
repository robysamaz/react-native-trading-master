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
    status: "completed",
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
    status: "in-progress",
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
    status: "available",
    aiMentorPrompt: mentorPrompt(
      "the two supply-zone patterns DBD (Drop-Base-Drop) and RBD (Rally-Base-Drop), and that supply zones are where you only look for shorts."
    ),
  },

  {
    id: "lsn-drawing-zones",
    trackId: "supply-demand-foundations",
    unitId: "sdf-zone-basics",
    order: 4,
    title: "Drawing a Zone: Base to Proximal & Distal",
    goal: "Draw a zone as a rectangle from its base — proximal line at the entry edge, distal line at the protective far edge.",
    keyTerms: [
      {
        term: "Base boundary",
        definition: "The cluster of small consolidation candles before the departure — its high and low frame the zone rectangle.",
      },
      {
        term: "Proximal line",
        definition: "The base edge nearest current price; the side price touches first and where you look to enter.",
      },
      {
        term: "Distal line",
        definition: "The far base edge; the stop sits just beyond it because a clean break there invalidates the zone.",
      },
      {
        term: "Wicks vs bodies",
        definition: "Draw demand from the lows and supply from the highs (wicks included) so the zone captures the full order cluster.",
      },
    ],
    examples: [
      {
        title: "Drawing a demand zone",
        scenario: "On MNQ, mark the base low (distal) and base high (proximal). Longs are sought near the proximal line; the stop rests below the distal line.",
      },
      {
        title: "Keep it a rectangle",
        scenario: "A zone is an area, not a line. Extend the rectangle to the right so you can see exactly where price re-enters it later.",
      },
    ],
    xp: 15,
    status: "locked",
    aiMentorPrompt: mentorPrompt(
      "how to draw a zone from its base as a rectangle — locating the proximal (entry) and distal (stop) lines and using wicks for demand lows and supply highs."
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

  {
    id: "lsn-fresh-vs-tested",
    trackId: "supply-demand-foundations",
    unitId: "sdf-grading",
    order: 2,
    title: "Fresh vs Tested Zones",
    goal: "Prefer fresh, untouched zones — each retest consumes resting orders and weakens the zone.",
    keyTerms: [
      {
        term: "Fresh zone",
        definition: "A zone price has not returned to since it formed; the unfilled institutional orders are still resting there.",
      },
      {
        term: "Tested zone",
        definition: "A zone price has already revisited; some orders are now filled, so the next reaction is less reliable.",
      },
      {
        term: "Zone depletion",
        definition: "Each touch consumes liquidity. After one or two tests a zone is usually spent — treat it as lower quality.",
      },
    ],
    examples: [
      {
        title: "First touch holds best",
        scenario: "MES rallies from a fresh demand zone on its first return — the cleanest reaction, because the resting orders are still intact.",
      },
      {
        title: "A depleted zone fails",
        scenario: "A demand zone already tested twice breaks on the third visit. Drained of orders, it no longer offers an edge — skip it.",
      },
    ],
    xp: 20,
    status: "locked",
    aiMentorPrompt: mentorPrompt(
      "freshness as a grading factor — why an untouched zone reacts most reliably and how each retest depletes resting orders and downgrades quality."
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

  {
    id: "lsn-stop-placement",
    trackId: "risk-position-sizing",
    unitId: "rps-sizing",
    order: 2,
    title: "Stop Placement Beyond the Distal Line",
    goal: "Place the protective stop just past the zone's distal line so normal noise does not stop you out, but a real invalidation does.",
    keyTerms: [
      {
        term: "Distal stop",
        definition: "The stop sits a small buffer beyond the distal line — close through it and the zone idea is wrong, so you are out.",
      },
      {
        term: "Buffer",
        definition: "A few ticks past the distal line to absorb spread and wick noise without widening risk unnecessarily.",
      },
      {
        term: "Invalidation",
        definition: "A clean break of the distal line means institutions did not defend the zone — exit, do not hope.",
      },
    ],
    examples: [
      {
        title: "Stop below demand",
        scenario: "On a long from an MGC demand zone, the stop goes a few ticks under the distal (base low). A wick into the zone is fine; a close below it is not.",
      },
      {
        title: "Why not tighter",
        scenario: "A stop inside the zone invites a stop-out on normal noise. The distal line is the structural level that actually invalidates the trade.",
      },
    ],
    xp: 20,
    status: "locked",
    aiMentorPrompt: mentorPrompt(
      "placing the protective stop just beyond the zone's distal line with a small buffer — distinguishing normal wick noise from a true invalidation."
    ),
  },
  {
    id: "lsn-target-placement",
    trackId: "risk-position-sizing",
    unitId: "rps-sizing",
    order: 3,
    title: "Setting Targets to Clear 3:1",
    goal: "Aim at the next opposing zone or resting liquidity, and only take the trade if that distance is at least 3:1 versus the stop.",
    keyTerms: [
      {
        term: "Opposing zone",
        definition: "The next supply zone above a long (or demand below a short) is a logical target where price may stall.",
      },
      {
        term: "Liquidity target",
        definition: "Prior highs/lows where stops rest often act as magnets, making sensible and reachable targets.",
      },
      {
        term: "R:R gate",
        definition: "Target distance ÷ stop distance. Below 3:1, the trade fails the floor — pass and wait for a better location.",
      },
    ],
    examples: [
      {
        title: "Target the next supply",
        scenario: "Long from MES demand with an 8-point stop. The next H4 supply sits ~28 points away → ~3.5:1, clearing the 3:1 floor.",
      },
      {
        title: "Too close to trade",
        scenario: "If the nearest opposing zone is only 2:1 away, the location is poor. Skip it rather than move the stop or invent a farther target.",
      },
    ],
    xp: 20,
    status: "locked",
    aiMentorPrompt: mentorPrompt(
      "placing targets at the next opposing zone or resting liquidity and enforcing the minimum 3:1 reward-to-risk floor before taking the trade."
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

  // ============================================================
  // Track: Reading Price Action
  // Unit: Structure & Liquidity
  // ============================================================
  {
    id: "lsn-market-structure",
    trackId: "reading-price-action",
    unitId: "rpa-structure-liquidity",
    order: 1,
    title: "Market Structure: BOS & CHoCH",
    goal: "Read trend through swing highs and lows — a Break of Structure continues it, a Change of Character warns it may be turning.",
    keyTerms: [
      {
        term: "Swing high / low",
        definition: "The pivots that define structure; higher highs and higher lows are an uptrend, lower highs and lower lows a downtrend.",
      },
      {
        term: "BOS (Break of Structure)",
        definition: "Price breaks the most recent swing in the trend direction, confirming continuation.",
      },
      {
        term: "CHoCH (Change of Character)",
        definition: "Price breaks a swing against the prevailing trend — the first hint that structure may be shifting.",
      },
    ],
    examples: [
      {
        title: "Bullish BOS",
        scenario: "MNQ in an uptrend breaks above its last swing high — a BOS confirming the trend, so fresh demand below stays in play for longs.",
      },
      {
        title: "Bearish CHoCH",
        scenario: "After higher highs, MES breaks a recent swing low. That CHoCH warns the up-leg may be ending — raise the bar before new longs.",
      },
    ],
    xp: 25,
    status: "locked",
    aiMentorPrompt: mentorPrompt(
      "reading market structure with swing highs and lows — distinguishing a Break of Structure (continuation) from a Change of Character (possible reversal)."
    ),
  },
  {
    id: "lsn-liquidity",
    trackId: "reading-price-action",
    unitId: "rpa-structure-liquidity",
    order: 2,
    title: "Liquidity & Stop Hunts",
    goal: "Spot where stops rest — above highs and below lows — and understand why price often sweeps that liquidity before moving to a zone.",
    keyTerms: [
      {
        term: "Liquidity pool",
        definition: "Clusters of stop orders resting just beyond obvious swing highs/lows and round numbers.",
      },
      {
        term: "Liquidity sweep",
        definition: "A quick spike through a high/low that triggers stops, giving institutions fills before the real move.",
      },
      {
        term: "Inducement",
        definition: "An obvious-looking level that lures entries whose stops then become the liquidity the real move runs to.",
      },
    ],
    examples: [
      {
        title: "Sweep then reverse",
        scenario: "MES wicks just below a prior low, triggering sell stops, then rallies from demand. The sweep filled buyers before the move up.",
      },
      {
        title: "Waiting for the sweep",
        scenario: "Rather than buy into a clean low, wait for the sweep into demand plus a structure shift — entries after the grab are higher quality.",
      },
    ],
    xp: 25,
    status: "locked",
    aiMentorPrompt: mentorPrompt(
      "identifying resting liquidity above highs and below lows, why price sweeps stops before reversing, and how inducement traps early entries."
    ),
  },
  {
    id: "lsn-imbalance-fvg",
    trackId: "reading-price-action",
    unitId: "rpa-structure-liquidity",
    order: 3,
    title: "Imbalance & Fair-Value Gaps",
    goal: "Recognize the fast, one-sided moves that leave imbalance (a fair-value gap) and know price often returns to rebalance it.",
    keyTerms: [
      {
        term: "Imbalance",
        definition: "A fast move where one side dominated and little trading occurred — visible as a gap between candle wicks.",
      },
      {
        term: "Fair-value gap (FVG)",
        definition: "The three-candle gap that marks the imbalance; price frequently revisits it to fill unmatched orders.",
      },
      {
        term: "Departure imbalance",
        definition: "The strong, imbalanced move out of a base is what makes a zone high quality — it confirms real institutional intent.",
      },
    ],
    examples: [
      {
        title: "Filling the gap",
        scenario: "MNQ rips up leaving an FVG. Price later dips back into that gap, rebalances, and continues — the FVG acted as support.",
      },
      {
        title: "Imbalance grades the zone",
        scenario: "A demand zone whose departure left a clear imbalance scores higher than one that crept away slowly — the gap is the footprint.",
      },
    ],
    xp: 25,
    status: "locked",
    aiMentorPrompt: mentorPrompt(
      "spotting imbalance and fair-value gaps from fast one-sided moves, why price returns to rebalance them, and how departure imbalance grades a zone's quality."
    ),
  },
  {
    id: "lsn-top-down-workflow",
    trackId: "reading-price-action",
    unitId: "rpa-structure-liquidity",
    order: 4,
    title: "The Top-Down Workflow (D1 → H4 → M15)",
    goal: "Build a trade idea top-down: bias and major zones on D1/H4, then drop to M15 to refine and confirm the entry.",
    keyTerms: [
      {
        term: "Top-down analysis",
        definition: "Start high (D1/H4) for bias and key zones, then descend to the entry timeframe — never the reverse.",
      },
      {
        term: "HTF zone of interest",
        definition: "The major D1/H4 supply or demand zone aligned with bias where you wait for price to arrive.",
      },
      {
        term: "Entry confirmation",
        definition: "On M15, wait for a structure shift, liquidity sweep, or rejection inside the HTF zone before committing.",
      },
    ],
    examples: [
      {
        title: "A full read",
        scenario: "D1 bias bullish → mark the fresh H4 demand zone → price taps it → M15 sweeps a low and breaks structure up → enter the refined demand behind the shift.",
      },
      {
        title: "Respecting bias",
        scenario: "If D1 is bearish, you ignore M15 long setups. The higher timeframe sets direction; the lower timeframe only times the entry.",
      },
    ],
    xp: 30,
    status: "locked",
    aiMentorPrompt: mentorPrompt(
      "the top-down workflow — setting bias and marking major zones on D1/H4, then refining and confirming entries on M15 with structure shifts, sweeps, and rejections."
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
