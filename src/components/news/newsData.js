/**
 * newsData.js — single source of truth for the News V2 feed.
 *
 * Both the feed (NewsV2Page) and the full-page detail (ArticlePage) read from
 * ARTICLES, so prev/next and detail stay in sync. Every event is grounded in a
 * real platform surface; field/metric NAMES are real, values are ILLUSTRATIVE.
 *
 * Article shape:
 *   { id, template, type, day, time, dateline, title, lede,
 *     meta[], featured?, widget?, stats?, table?, quote?, body[], sources[], actions[] }
 * - template: 'feature' | 'standard' | 'brief' | 'table' | 'stat' | 'quote' | 'digest'
 * - type: key into TYPE (kicker label + tone)
 * - widget: { kind, props } spec rendered by renderWidget() in newsShared
 * - body: paragraphs for the full article view; sources: calls behind the event
 */

// Event type → { kicker label (names the platform surface), tone }
export const TYPE = {
  spike:      { label: 'Signals · Spike',    tone: 'attention' },
  storm:      { label: 'Monitoring · Storm', tone: 'attention' },
  approval:   { label: 'AI Tasks',           tone: 'attention' },
  compliance: { label: 'Compliance',         tone: 'attention' },
  anomaly:    { label: 'Anomaly',            tone: 'neutral' },
  emergent:   { label: 'Signals · Emerging', tone: 'neutral' },
  outlier:    { label: 'Outlier Call',       tone: 'neutral' },
  volume:     { label: 'Volume Mix',         tone: 'neutral' },
  benchmark:  { label: 'Agent Eval',         tone: 'neutral' },
  signal:     { label: 'Signals',            tone: 'neutral' },
  report:     { label: 'Reports',            tone: 'neutral' },
  cohort:     { label: 'Customers',          tone: 'neutral' },
  workflow:   { label: 'Workflows',          tone: 'neutral' },
  risk:       { label: 'Monitoring · Risk',  tone: 'attention' },
  rootcause:  { label: 'Root Cause',         tone: 'neutral' },
  digest:     { label: 'Weekly Digest',      tone: 'neutral' },
  milestone:  { label: 'Agent Eval · Milestone', tone: 'positive' },
  sentiment:  { label: 'Sentiment',          tone: 'positive' },
  resolution: { label: 'Resolution',         tone: 'positive' },
}

export const TONE_COLOR = { attention: 'var(--c100)', positive: 'var(--g100)', neutral: 'var(--n40)' }

// "Easy find" section blocks, by platform surface. `accent` tints the header rule.
export const SECTIONS = [
  { key: 'monitoring', label: 'Monitoring & Alerts', accent: 'var(--c100)' },
  { key: 'compliance', label: 'Compliance',          accent: 'var(--red100)' },
  { key: 'agents',     label: 'Agent Performance',   accent: 'var(--g100)' },
  { key: 'customers',  label: 'Customer Voice',      accent: 'var(--h100)' },
  { key: 'signals',    label: 'Signals & Trends',    accent: 'var(--l100)' },
]

// type → default section (overridable per article via `section`).
const TYPE_SECTION = {
  spike: 'signals', storm: 'monitoring', approval: 'monitoring', compliance: 'compliance',
  anomaly: 'monitoring', emergent: 'customers', outlier: 'customers', volume: 'signals',
  benchmark: 'agents', signal: 'signals', report: 'signals', cohort: 'customers',
  workflow: 'monitoring', digest: 'signals', milestone: 'agents', sentiment: 'customers',
  resolution: 'agents', risk: 'monitoring', rootcause: 'signals',
}
export function sectionOf(a) { return a.section || TYPE_SECTION[a.type] || 'signals' }

// ── Honest temporal model (per the platform's trend-report semantics) ────────
// Trend/insight items are PERIOD-aggregated (cover a window) — they have no
// minute-level moment. Only individual calls (created_at) and alerts
// (triggered_at) are genuine moments and may carry a clock time.
const MOMENT_IDS = new Set(['third-party-storm', 'outlier-escalation'])
const PERIOD_LABEL = {
  'june-recap': '1–30 June',
  'team-benchmark': 'trailing 30 days',
  'why-load-surge': 'June',
  'wait-time-risk': 'trending since April',
  'handle-time-anomaly': 'this afternoon',
}
export function articleWhen(a) {
  const dayShort = (a.day || '').split('·').pop().trim()
  // Moments (calls/alerts) → real clock time. Trends → the edition day they
  // surfaced (honest via Insight.created_at); byline keeps the window phrase.
  if (MOMENT_IDS.has(a.id)) return { kind: 'moment', label: `${dayShort} · ${a.time}`, short: a.time }
  const full = PERIOD_LABEL[a.id] || 'this week'
  return { kind: 'period', label: full, short: dayShort }
}

// ── Trust: why you're seeing this (provenance) + evidence (drill-through) ─────
// Honest to the platform's data model: trend magnitude is stored QUALITATIVELY
// (drastic_change + compare_result), so trend triggers stay qualitative — no
// invented numeric thresholds. Alerts, compliance scorecards and evaluations DO
// carry real configured thresholds/targets. `strength` is illustrative.
const TRUST_BY_TYPE = {
  spike:      { trigger: 'Flagged as a drastic change vs the prior period', method: 'Signal trend comparison', strength: 'strong' },
  storm:      { trigger: 'Monitor fired far above its normal daily rate',   method: 'Alert · trigger rate vs baseline', strength: 'strong' },
  approval:   { trigger: 'Review queue passed its backlog threshold',       method: 'AI Tasks · queue depth', strength: 'watch' },
  compliance: { trigger: 'Criterion adherence fell below its QA target',    method: 'Compliance scorecard vs target', strength: 'strong' },
  anomaly:    { trigger: 'Statistical deviation from the recent baseline',  method: 'Metric vs baseline (σ)', strength: 'moderate' },
  emergent:   { trigger: 'New theme surfaced by Discovery — no signal tracks it yet', method: 'Unsupervised discovery', strength: 'watch' },
  outlier:    { trigger: 'Single call flagged as an outlier for review',    method: 'Per-call summarizer flag', strength: 'watch' },
  volume:     { trigger: 'Volume mix shifted vs the prior period',          method: 'Period comparison', strength: 'moderate' },
  benchmark:  { trigger: 'Evaluation gap widened across teams',             method: 'Agent Evaluation comparison', strength: 'moderate' },
  signal:     { trigger: 'AI-proposed signal awaiting your review',         method: 'Discovery proposal', strength: 'watch' },
  report:     { trigger: 'Scheduled report completed on time',              method: 'Report schedule', strength: 'watch' },
  cohort:     { trigger: 'Customers grouped by repeat-contact pattern',     method: 'Customer grouping', strength: 'moderate' },
  workflow:   { trigger: 'Workflow trigger condition met',                  method: 'Workflow rule', strength: 'watch' },
  risk:       { trigger: 'Projected to breach SLA if the trend holds',      method: 'Forward projection vs SLA', strength: 'strong' },
  rootcause:  { trigger: 'Contributing signals traced to a common cause',   method: 'Causal analysis', strength: 'moderate' },
  digest:     { trigger: 'Roundup of the week’s smaller movements',         method: 'Weekly aggregation', strength: 'watch' },
  milestone:  { trigger: 'Evaluation score crossed a category threshold',   method: 'Agent Evaluation', strength: 'strong' },
  sentiment:  { trigger: 'Sentiment shifted vs the prior period',           method: 'Sentiment trend comparison', strength: 'moderate' },
  resolution: { trigger: 'Resolution rate improved vs the prior period',    method: 'Period comparison', strength: 'moderate' },
}
// Per-type provenance, overridable per article via `a.trust`.
export function trustOf(a) {
  return { ...(TRUST_BY_TYPE[a.type] || TRUST_BY_TYPE.signal), ...(a.trust || {}) }
}
// "See N …" drill-through target: explicit a.evidence, else the first call count
// parsed from meta, else a generic Data drill-in.
export function evidenceOf(a) {
  if (a.evidence && a.evidence.count) return a.evidence
  const m = (a.meta || []).map(String).find(x => /\d[\d,]*\s*calls?/i.test(x))
  if (m) { const num = m.match(/[\d,]+/); if (num) return { count: num[0], noun: 'calls' } }
  return { count: null, noun: 'calls' }
}

// Breaking / just-detected ticker — the newest events, compact.
export const BREAKING = [
  { time: '4:12pm', label: 'Cancellation intent spiking (+240%)', tone: 'attention' },
  { time: '2:30pm', label: 'Team B handle time +40%', tone: 'neutral' },
  { time: '11:20am', label: '“Distressed Client” monitor first trigger', tone: 'attention' },
  { time: '10:20am', label: 'Fraud storm — 18× in 2h', tone: 'attention' },
  { time: '9:15am', label: 'Dana crosses 90 on empathy', tone: 'positive' },
  { time: '8:30am', label: 'Wait times trending past SLA', tone: 'attention' },
]

const N = (children) => children // (numbers are plain strings here; N styling applied in JSX)

export const ARTICLES = [
  // ─────────────── TOP STORIES (featured) ───────────────
  {
    id: 'cancellation-spike', template: 'feature', type: 'spike', featured: true,
    day: 'Thursday · Jul 2', time: '4:12pm', dateline: 'Jul 2 · 4:12pm',
    title: '“Cancellation intent” is surging past its 30-day baseline',
    lede: "Churn-intent language is being extracted from a fast-growing share of calls — the signal's hit rate ran 240% above its 30-day average this week, concentrated Wednesday afternoon across Teams B and C.",
    meta: ['312 calls', 'Teams B, C', 'peak Wed 2pm'],
    widget: { kind: 'trend', props: { peakLabel: 'Fri · peak', data: [30, 32, 28, 40, 44, 96, 74, 66, 80], labels: ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'], peakIndex: 5, baseline: 40 } },
    stats: [
      { label: 'Signal', value: 'Cancellation intent' },
      { label: 'Hit rate', value: '12% of calls', tone: 'up' },
      { label: 'vs 30-day avg', value: '↑ 240%', tone: 'up' },
      { label: 'Runs this week', value: '2,540' },
      { label: 'Top segment', value: 'Teams B, C' },
      { label: 'Matching report', value: 'Churn brief' },
    ],
    body: [
      "The “Cancellation intent” signal — which extracts churn-related language from every processed call — is firing on a rapidly growing share of conversations. Its hit rate climbed to roughly 240% of the trailing 30-day average this week, with the sharpest cluster on Wednesday afternoon.",
      "The lift is concentrated in Teams B and C. The most common phrasing references the new pricing tier and difficulty reaching support; a smaller but growing thread names a competitor directly — a pattern no dedicated signal captures yet.",
      "Because this is an extraction signal rather than a monitor, it isn't paging anyone. Promoting it to an alert, or attaching it to the Churn brief report, would route these calls to a workflow automatically.",
    ],
    sources: [
      { who: 'call · agent 214', quote: '…if the price is going up again I want to cancel my account today.' },
      { who: 'call · agent 118', quote: "I've been on hold twice this week, I'm done — how do I close this?" },
      { who: 'call · agent 073', quote: 'Competitor is cheaper, give me one reason to stay.' },
    ],
    actions: ['Edit signal', 'Open in Data', 'Run report'],
  },
  {
    id: 'third-party-storm', template: 'feature', type: 'storm', featured: true,
    day: 'Tuesday · Jun 30', time: '10:20am', dateline: 'Jun 30 · 10:20am',
    title: '“Third Party” monitor triggered 18× in two hours',
    lede: "The ‘Third Party’ monitor fired eighteen times in a two-hour window this morning — about three times its daily average — routing follow-up tasks to Slack and email as fraud-pattern language clustered.",
    meta: ['9–11am', 'high severity', '3 agents'],
    evidence: { count: '47', noun: 'triggers' },
    widget: { kind: 'stackedBars', props: {} },
    legend: [{ color: 'var(--c80)', label: 'Third Party' }, { color: 'var(--h100)', label: 'Info Violation' }, { color: 'var(--t100)', label: 'Legal & Regulatory' }],
    stats: [
      { label: 'Monitor', value: 'Third Party' },
      { label: 'Triggered (24h)', value: '47', tone: 'up' },
      { label: 'vs daily avg', value: '↑ 3×', tone: 'up' },
      { label: 'Channels', value: 'Slack · Email' },
      { label: 'On-alert action', value: 'Create task' },
      { label: 'Last fired', value: '12m ago' },
    ],
    body: [
      "The ‘Third Party’ monitor — a prompt-based rule watching for third-party involvement in regulated conversations — fired eighteen times between 9 and 11am, roughly three times its normal daily rate.",
      "Each trigger created a follow-up task and notified the on-call channel via Slack and email. The clustering suggests a single upstream cause rather than isolated incidents; reviewing the triggering calls together will be faster than one-by-one.",
    ],
    sources: [
      { who: 'call · agent 041', quote: '…my broker told me to move the funds before the review.' },
      { who: 'call · agent 077', quote: 'a third party will handle the paperwork for me.' },
    ],
    actions: ['Open in Monitoring', 'Adjust triggers', 'Assign to ticket'],
  },
  {
    id: 'ai-tasks-backlog', template: 'feature', type: 'approval', featured: true,
    day: 'Thursday · Jul 2', time: '8:00am', dateline: 'Jul 2',
    title: '393 AI-suggested actions are awaiting your approval',
    lede: 'The review queue has grown to 393 AI-suggested actions awaiting human sign-off, the oldest pending three days. Low-risk, auto-verified items can be cleared in bulk.',
    meta: ['oldest 3 days', 'auto-verify on'],
    evidence: { count: '393', noun: 'pending actions' },
    widget: { kind: 'statusBar', props: {} },
    stats: [
      { label: 'Awaiting', value: '393', tone: 'up' },
      { label: 'Approved (wk)', value: '210' },
      { label: 'Completed', value: '176' },
      { label: 'Rejected', value: '24' },
      { label: 'Oldest pending', value: '3 days' },
      { label: 'Auto-verify', value: 'On' },
    ],
    body: [
      "The AI Tasks queue is the human-in-the-loop gate for AI-suggested operations. It has grown to 393 pending items, with the oldest waiting three days — past the point where suggestions stay relevant.",
      "Most pending items are low-risk and already auto-verified, which means they can be cleared in bulk rather than one at a time. Higher-impact system improvements still warrant individual review with their impact analysis.",
    ],
    sources: [],
    actions: ['Review in AI Tasks', 'Bulk approve', 'View audit trail'],
  },

  // ─────────────── FEED (chronological, mixed templates) ───────────────
  {
    id: 'handle-time-anomaly', template: 'standard', type: 'anomaly',
    day: 'Thursday · Jul 2', time: '2:30pm', dateline: 'Jul 2 · 2:30pm',
    title: 'Team B average handle time jumped 40% this afternoon',
    lede: 'Average handle time on Team B rose to 6.4 minutes — 2.3σ above its baseline — clustered in the early afternoon.',
    meta: ['deviation 2.3σ', 'SLA 4.5′'],
    widget: { kind: 'bullet', props: {} },
    body: [
      "Team B's average handle time climbed to 6.4 minutes this afternoon, a 2.3σ deviation from its recent baseline and well past the 4.5-minute target.",
      "The spike overlaps with the cancellation-intent cluster on the same team — longer, harder conversations rather than a staffing gap.",
    ],
    sources: [],
    actions: ['Open in Data', 'Assign workflow'],
  },
  {
    id: 'dana-milestone', template: 'stat', type: 'milestone',
    day: 'Thursday · Jul 2', time: '9:15am', dateline: 'Jul 2 · 9:15am',
    title: 'Agent Dana crossed 90 on the Empathy evaluation category — a first',
    lede: "Dana's Empathy score reached 90/100 this week, up six points, the first time crossing the threshold.",
    meta: ['Empathy', '+6 pts'],
    stat: { value: '90', unit: '/100', delta: '+6 pts', deltaTone: 'positive', caption: 'Empathy · Agent Evaluation' },
    widget: { kind: 'gauge', props: { value: 90, label: 'Empathy', delta: '+6 pts' } },
    body: [
      "Agent Evaluation scores each conversation across categories on a 0–100 scale and aggregates them per agent. Dana's Empathy average reached 90 this week — up six points and a personal first.",
      "The lift is visible across both of Dana's agent codes, so it reflects a genuine behavior change rather than a routing artifact.",
    ],
    sources: [],
    actions: ['Open Agent Evaluation', 'Share'],
  },
  {
    id: 'fcr-resolution', template: 'standard', type: 'resolution',
    day: 'Wednesday · Jul 1', time: '1:10pm', dateline: 'Jul 1 · 1:10pm',
    title: 'First-contact resolution climbed to 72% on Team A',
    lede: 'Team A resolved 312 of 433 conversations on first contact this week — up five points week over week.',
    meta: ['+5 pts', 'week over week'],
    widget: { kind: 'donut', props: { value: 72, label: '312 of 433', sub: 'resolved first-contact', color: 'var(--g100)' } },
    body: [
      "First-contact resolution on Team A rose to 72% — 312 of 433 conversations closed without a callback — its best week in the current period.",
      "The gain tracks with the script update rolled out last week, which shortened the path to a resolution on billing questions.",
    ],
    sources: [],
    actions: ['Open in Data', 'Run report'],
  },
  {
    id: 'competitor-emergent', template: 'brief', type: 'emergent',
    day: 'Wednesday · Jul 1', time: '3:40pm', dateline: 'Jul 1 · 3:40pm',
    title: 'Customers are naming a competitor by name — no signal captures it yet',
    lede: 'A brand-new theme appeared this week: 41 calls in which customers name a specific competitor while discussing cancellation. No existing signal extracts it.',
    meta: ['41 calls', 'first seen this week'],
    body: [
      "For the first time this period, a cluster of calls names a specific competitor by name — usually while comparing price during a cancellation conversation.",
      "Because no signal extracts this today, it's invisible to reports and monitors. Creating a signal for competitor mentions would let it be tracked and trended going forward.",
    ],
    sources: [
      { who: 'call · agent 214', quote: 'competitor is offering the same thing for less.' },
    ],
    actions: ['+ Create Signal', 'Share'],
  },
  {
    id: 'top-agents-table', template: 'table', type: 'benchmark',
    day: 'Wednesday · Jul 1', time: '11:40am', dateline: 'Jul 1 · 11:40am',
    title: 'Top agents this week by CSAT and resolution',
    lede: 'A quick leaderboard across the tracked evaluation categories — Martha leads on CSAT, Dana on empathy gains.',
    meta: ['Agent Evaluation', 'trailing 7 days'],
    table: {
      cols: ['Agent', 'CSAT', 'FCR', 'Empathy', 'Calls'],
      rows: [
        ['Martha Kellett', '94%', '78%', '88', '412'],
        ['Dana Ruiz', '91%', '74%', '90', '388'],
        ['Tom Okafor', '89%', '71%', '85', '356'],
        ['Priya Nair', '87%', '69%', '83', '401'],
      ],
    },
    body: [
      "Across the trailing seven days, Martha Kellett leads on customer satisfaction while Dana Ruiz posts the largest empathy gain. Handle-time leaders differ from CSAT leaders — worth a coaching look at the trade-off.",
    ],
    sources: [],
    actions: ['Open Agent Evaluation'],
  },
  {
    id: 'team-benchmark', template: 'standard', type: 'benchmark',
    day: 'Monday · Jun 29', time: '11:20am', dateline: 'Jun 29 · 11:20am',
    title: 'Team A is pulling ahead of B and C on handle time',
    lede: 'Over the trailing 30 days, Team A has cut average handle time to 3.8 minutes while B and C hold steady.',
    meta: ['Agent Evaluation', 'trailing 30 days'],
    widget: { kind: 'compareLines', props: {} },
    body: [
      "Team A's average handle time has fallen steadily to 3.8 minutes over the last thirty days, opening a clear gap over Teams B (5.3′) and C (6.0′).",
      "The divergence is recent and consistent — a candidate to study for what Team A changed and whether it transfers.",
    ],
    sources: [],
    actions: ['Open Agent Evaluation', 'Share'],
  },
  {
    id: 'cooling-off-compliance', template: 'standard', type: 'compliance',
    day: 'Monday · Jun 29', time: '5:02pm', dateline: 'Jun 29 · 5:02pm',
    title: 'Cooling-off disclosures slipped to 82% — three agents driving it',
    lede: 'Cooling-off disclosure adherence fell to 82% this week, driven by three agents. It remains the weakest of the tracked criteria and is trending down.',
    meta: ['5 flags', 'high risk'],
    evidence: { count: '5', noun: 'flagged calls' },
    widget: { kind: 'passRateBars', props: {} },
    stats: [
      { label: 'Worst criterion', value: 'Cooling-off' },
      { label: 'Criterion rate', value: '82%', tone: 'up' },
      { label: 'Flags this week', value: '5', tone: 'up' },
      { label: 'Agents', value: '3' },
      { label: 'Overall risk', value: 'High', tone: 'up' },
      { label: '30-day trend', value: '↓ 4 pts', tone: 'up' },
    ],
    body: [
      "Compliance tracks adherence across criteria — KYC, cooling-off, risk disclosure, mandate, fees, and vulnerable-population handling. Cooling-off is the weakest this week at 82%, down four points over thirty days.",
      "Five flags concentrate in three agents, which makes this a targeted coaching problem rather than a systemic one.",
    ],
    sources: [
      { who: 'call · agent 118', quote: "we can skip the waiting period if you're sure." },
    ],
    actions: ['Open Compliance', 'Assign owner', 'Assign workflow'],
  },
  {
    id: 'refund-silence-anomaly', template: 'brief', type: 'anomaly',
    day: 'Monday · Jun 29', time: '9:00am', dateline: 'Jun 29 · 9:00am',
    title: 'Silence time on Refunds calls rose to 10%',
    lede: 'Average silence on Refunds conversations climbed to 10% — 1.8σ above baseline, past the 6% target — suggesting agents are searching for answers mid-call.',
    meta: ['deviation 1.8σ', 'target 6%'],
    body: [
      "Silence time on Refunds calls rose to 10% this week, a 1.8σ deviation and well above the 6% target. Long silences usually mean agents are hunting for information rather than disengaged customers.",
      "A knowledge-base gap on the current refund policy is the likeliest cause — worth checking what agents are searching for during those pauses.",
    ],
    sources: [],
    actions: ['Open in Data'],
  },
  {
    id: 'outlier-escalation', template: 'quote', type: 'outlier',
    day: 'Thursday · Jul 2', time: '11:05am', dateline: 'Jul 2 · 11:05am',
    title: 'One 47-minute escalation worth reading',
    lede: 'A single unusually long call the summarizer flagged for review.',
    meta: ['single call', 'sentiment −0.7'],
    quote: { text: "I've called four times about the same charge and every person tells me something different. I just want one answer I can trust.", who: 'customer · 47-min escalation · Jul 2' },
    body: [
      "The transcript summarizer flagged a 47-minute escalation with sharply negative sentiment. It reads as a repeat-contact failure: four prior calls, inconsistent answers each time.",
      "Individually it's one call, but it's a clean example of the pattern behind the repeat-complaint cohort — worth listening to before coaching on consistency.",
    ],
    sources: [
      { who: 'call · 47-min escalation', quote: 'every person tells me something different.' },
    ],
    actions: ['Open in Data', 'Assign workflow'],
  },
  {
    id: 'repeat-cohort', template: 'brief', type: 'cohort',
    day: 'Tuesday · Jun 30', time: '10:40am', dateline: 'Jun 30 · 10:40am',
    title: '12 repeat-complaint customers surfaced this week',
    lede: 'Twelve customers contacted support three or more times about the same unresolved issue — a churn-watch cohort.',
    meta: ['3+ interactions', 'churn watch'],
    body: [
      "Grouping interactions by customer surfaced twelve people who contacted support three or more times this week about the same unresolved issue — the strongest near-term churn signal available.",
      "Exporting the cohort or opening it in Customers lets you route proactive outreach before they cancel.",
    ],
    sources: [],
    actions: ['Open cohort', 'Export'],
  },
  {
    id: 'tommy-signal', template: 'brief', type: 'signal',
    day: 'Wednesday · Jul 1', time: '3:40pm', dateline: 'Jul 1 · 3:40pm',
    title: 'Tommy generated a new signal: “Refund escalation risk”',
    lede: 'An AI-generated signal proposal is waiting for review before it goes live.',
    meta: ['AI-generated', 'review to activate'],
    body: [
      "Tommy proposed a new signal, “Refund escalation risk,” after noticing a recurring pattern in refund conversations that precede escalations.",
      "It's inactive until reviewed. Activating it would start extracting the pattern on new calls and make it available to monitors and reports.",
    ],
    sources: [],
    actions: ['Review signal', 'Edit'],
  },
  {
    id: 'trend-report-ran', template: 'brief', type: 'report',
    day: 'Wednesday · Jul 1', time: '9:15am', dateline: 'Jul 1 · 9:15am',
    title: 'Weekly Trend Report ran — pricing complaints called out as top driver',
    lede: 'The scheduled Weekly Trend Report completed and was emailed to four recipients; pricing complaints led its findings.',
    meta: ['scheduled', 'emailed to 4'],
    body: [
      "The Weekly Trend Report ran on schedule and flagged pricing complaints as the week's top driver of negative sentiment — consistent with the cancellation-intent spike.",
      "The infographic version is shareable, and the report can be re-run on demand against the latest calls.",
    ],
    sources: [],
    actions: ['Open report', 'View infographic'],
  },
  {
    id: 'sentiment-drop', template: 'brief', type: 'sentiment',
    day: 'Tuesday · Jun 30', time: '2:05pm', dateline: 'Jun 30 · 2:05pm',
    title: 'Frustration language dropped 9% after the script update',
    lede: 'Sentiment signals show a nine-point drop in frustration language week over week, following the billing-script change.',
    meta: ['−9% vs last week'],
    body: [
      "Since the billing-script update, sentiment extraction shows frustration language down nine points week over week — the clearest positive movement of the week.",
      "It pairs with the first-contact-resolution gain on Team A, suggesting the script change is doing real work.",
    ],
    sources: [],
    actions: ['Open in Data'],
  },
  {
    id: 'why-load-surge', template: 'rootCause', type: 'rootcause',
    day: 'Tuesday · Jun 30', time: '3:00pm', dateline: 'Jun 30 · 3:00pm',
    title: 'Why proactive scheduling surged 167% — three compounding causes',
    lede: 'The scheduling spike and the wait-time crisis trace to one chain: an outbound recall push that outran branch capacity and digital intake.',
    widget: { kind: 'causalChain', props: { steps: [
      { n: 1, title: 'Outbound strategy', text: 'An active recall campaign filled the calendar but created a “boomerang” of return calls from customers who weren\'t reachable first time.' },
      { n: 2, title: 'Branch capacity', text: 'Branches hit peak load; vehicle-intake friction pushed customers to re-call the national center — 838 calls, the most-mentioned branch.' },
      { n: 3, title: 'Digital friction', text: 'SMS address/detail requests failed for older, less-digital customers — extending calls and looping inquiries back into the queue.' },
    ] } },
    meta: ['+167% scheduling', 'links to wait-time crisis'],
    body: [
      'June\'s standout movement — proactive scheduling up 167% — didn\'t happen in isolation. Tracing the contributing signals shows a single compounding chain rather than three separate stories.',
      'An outbound recall strategy successfully filled the treatment calendar, but a share of those customers weren\'t reachable on the first attempt, generating a “boomerang” of inbound return calls. Those landed on branches already at peak capacity, so customers escalated to the national center. And where agents fell back on SMS to collect details, older customers couldn\'t complete it — lengthening calls and looping inquiries back into the queue.',
      'The practical implication: the wait-time risk isn\'t a staffing problem in isolation — it\'s downstream of the outbound cadence and the digital-intake gap. Fixing either upstream cause relieves the queue.',
    ],
    sources: [
      { who: 'call · agent 041', quote: 'you texted me a link but I can\'t open it — can you just take my address now?' },
    ],
    actions: ['Open in Data', 'Create Signal'],
  },
  {
    id: 'wait-time-risk', template: 'riskAlert', type: 'risk',
    day: 'Monday · Jun 29', time: '8:30am', dateline: 'Jun 29 · 8:30am',
    title: 'Wait times are trending toward an SLA breach',
    lede: '23.2% of customers already wait more than 60 seconds — up sharply since April. If the trend holds under the new outbound policy, staffing won\'t meet SLA next month.',
    widget: { kind: 'trend', props: { data: [8, 9, 11, 14, 18, 21, 23], labels: ['Apr', '', '', 'May', '', 'Jun', ''], peakIndex: 6, baseline: 12, peakLabel: '23.2%' } },
    meta: ['23.2% >60s', '653 calls', 'projected breach'],
    body: [
      'The share of customers waiting more than 60 seconds has climbed to 23.2% — 653 calls this period — a steep rise from the historical average and accelerating month over month.',
      'This is a forward-looking flag, not just a report of the past: projecting the current slope against the new outbound recall policy, existing staffing will fall short of the wait-time SLA next month. The upstream drivers are the same ones behind the scheduling surge (see root-cause analysis).',
    ],
    sources: [],
    actions: ['Open in Monitoring', 'Create Alert', 'Assign workflow'],
  },
  {
    id: 'june-recap', template: 'recap', type: 'report',
    day: 'Wednesday · Jul 1', time: '7:00am', dateline: 'Jul 1 · 7:00am',
    title: 'Your June Monthly Trends Report is ready',
    lede: 'A full trends summary for June — proactive scheduling, service friction, fault severity, and root causes — compiled into the shareable report and infographic.',
    meta: ['1–30 June 2026', '2,812 calls analyzed'],
    recap: {
      headline: 'Surge in proactive scheduling vs operational load & service friction',
      kpis: [['Audi dominance', '56.7%'], ['Negative sentiment', '16.8%'], ['Wait >60s', '23.2%'], ['Calls analyzed', '2,812']],
    },
    body: [
      'The June edition of the Monthly Trends Report is generated and available. It consolidates the month\'s movements — the 167% scheduling surge, the 78% rise in negative sentiment, the 162% increase in fault severity, and the root-cause analysis behind them — into the full report and its shareable infographic.',
      'This feed surfaces the same intelligence continuously; the recap is the periodic, exportable deep-dive for stakeholders who want the whole picture in one place.',
    ],
    sources: [],
    actions: ['Open full report', 'Export infographic', 'Share'],
  },
  {
    id: 'weekly-digest', template: 'digest', type: 'digest',
    day: 'Sunday · Jun 28', time: '6:00pm', dateline: 'Jun 28',
    title: 'Five smaller signals that moved this week',
    lede: 'Minor movements worth a glance, ranked by change.',
    meta: ['weekly digest'],
    digest: [
      { name: 'Cancellation & churn', count: '312 calls', delta: '↑ 240%', tone: 'attention' },
      { name: 'Pricing complaints', count: '128 calls', delta: '↑ 34%', tone: 'attention' },
      { name: 'Refund status', count: '140 calls', delta: '↑ 12%', tone: 'neutral' },
      { name: 'Baggage fees', count: '88 calls', delta: '↑ 18%', tone: 'neutral' },
      { name: 'Competitor mentions', count: '41 calls', delta: 'new', tone: 'attention' },
    ],
    body: [
      "A roundup of smaller signal movements this week, ranked by change. None individually rises to a featured story, but together they sketch where attention is drifting.",
    ],
    sources: [],
    actions: ['Open Signals'],
  },
]

// Day order for grouping the feed / rail (newest first).
export const DAY_ORDER = [
  'Thursday · Jul 2',
  'Wednesday · Jul 1',
  'Tuesday · Jun 30',
  'Monday · Jun 29',
  'Sunday · Jun 28',
]

export function anchorId(id) { return `article-${id}` }
