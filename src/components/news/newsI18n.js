/**
 * newsI18n.js — Hebrew + RTL for the News tab (The Daily Signal).
 *
 * The sidebar language toggle sets document.documentElement.lang ('he' | 'en')
 * and fires a 'hear-lang' event (see Sidebar). useLang() subscribes to that so
 * every News component re-renders on switch. RTL is applied per-page (the News
 * container flips dir) — the app shell stays as-is.
 *
 * Article CONTENT is translated via ARTICLES_HE (keyed by id) + localizeArticle();
 * UI chrome via t(). Numbers/percentages stay in Latin digits (standard in he UI).
 */
import { useState, useEffect } from 'react'
import { ARTICLES } from './newsData.js'

export function currentLang() {
  if (typeof document === 'undefined') return 'en'
  return document.documentElement.lang === 'he' ? 'he' : 'en'
}

export function useLang() {
  const [lang, setLang] = useState(currentLang)
  useEffect(() => {
    const update = () => setLang(currentLang())
    const obs = new MutationObserver(update)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })
    window.addEventListener('hear-lang', update)
    update()
    return () => { obs.disconnect(); window.removeEventListener('hear-lang', update) }
  }, [])
  return lang
}

export const isRTL = (lang) => lang === 'he'

// ── UI chrome strings ─────────────────────────────────────────────────────────
const UI = {
  masthead_kicker:   { en: 'Conversation Intelligence', he: 'בינת שיחות' },
  masthead_title:    { en: 'The Daily Signal', he: 'הסיגנל היומי' },
  edition:           { en: 'Daily edition', he: 'מהדורה יומית' },
  dateline:          { en: 'Jul 2 · covers Jun 25 – Jul 2', he: '2 ביולי · מכסה 25 ביוני – 2 ביולי' },
  in_this_edition:   { en: 'In this edition', he: 'במהדורה זו' },
  top_stories:       { en: 'Top stories', he: 'הסיפורים המובילים' },
  daily_briefing:    { en: 'Daily briefing · at a glance', he: 'תדריך יומי · במבט מהיר' },
  caught_up:         { en: "You're all caught up.", he: 'הגעת לסוף. הכול מעודכן.' },
  filter_days:       { en: '📅 Last 7 days ▾', he: '📅 7 הימים האחרונים ▾' },
  filter_surface:    { en: 'Surface ▾', he: 'משטח ▾' },
  share:             { en: 'Share', he: 'שיתוף' },
  follow:            { en: '☆ Follow', he: '☆ מעקב' },
  page_title:        { en: 'News', he: 'חדשות' },
  crumb_inv:         { en: 'Demo inv', he: 'Demo inv' },
  badge_feed:        { en: 'feed · illustrative data', he: 'פיד · נתונים להמחשה' },
  featured:          { en: 'Featured', he: 'נבחר' },
  byline:            { en: 'By Hear Intelligence', he: 'מאת Hear Intelligence' },
  expand:            { en: 'Expand', he: 'הרחבה' },
  read:              { en: 'Expand', he: 'הרחבה' },
  open_in_data:      { en: 'Open in Data', he: 'פתיחה בנתונים' },
  why_seeing:        { en: 'Why you’re seeing this', he: 'למה זה מוצג לך' },
  basis:             { en: 'Basis', he: 'בסיס' },
  back_to_news:      { en: 'Back to News', he: 'חזרה לחדשות' },
  sources_hdr:       { en: 'Sources · calls behind this', he: 'מקורות · השיחות שמאחורי זה' },
  open_data_arrow:   { en: 'Open in Data →', he: 'פתיחה בנתונים →' },
  next_story:        { en: 'Next story ›', he: '‹ הסיפור הבא' },
  prev_story:        { en: '‹ Previous story', he: 'הסיפור הקודם ›' },
  risk_banner:       { en: 'Forward-looking risk — this flags a projected breach based on the current trend, not a past event.', he: 'סיכון צופה פני עתיד — זהו סימון לחריגה חזויה על סמך המגמה הנוכחית, לא אירוע שכבר קרה.' },
  recap_footnote:    { en: 'The full report and infographic open in Reports.', he: 'הדוח המלא והאינפוגרפיקה נפתחים במודול הדוחות.' },
  breaking_label:    { en: 'Just detected', he: 'זוהה כעת' },
  ask_placeholder:   { en: "What else can I dig into for you?", he: 'במה עוד לחפור עבורך?' },
  strong_signal:     { en: 'strong signal', he: 'סיגנל חזק' },
  moderate_signal:   { en: 'moderate signal', he: 'סיגנל בינוני' },
  for_watch:         { en: 'for your watch', he: 'למעקב' },
}
export function t(key, lang) {
  const e = UI[key]
  if (!e) return key
  return (lang === 'he' ? e.he : e.en) ?? e.en ?? key
}

// ── Kicker (event type) labels ────────────────────────────────────────────────
export const TYPE_HE = {
  spike: 'סיגנלים · זינוק', storm: 'ניטור · סופה', approval: 'משימות AI', compliance: 'ציות',
  anomaly: 'חריגה', emergent: 'סיגנלים · מתהווה', outlier: 'שיחה חריגה', volume: 'תמהיל נפח',
  benchmark: 'הערכת נציג', signal: 'סיגנלים', report: 'דוחות', cohort: 'לקוחות', workflow: 'תהליכים',
  risk: 'ניטור · סיכון', rootcause: 'שורש הבעיה', digest: 'תקציר שבועי', milestone: 'הערכת נציג · אבן דרך',
  sentiment: 'סנטימנט', resolution: 'פתרון',
}
export function typeLabel(type, enLabel, lang) {
  return lang === 'he' ? (TYPE_HE[type] || enLabel) : enLabel
}

// ── Section (surface) labels ──────────────────────────────────────────────────
export const SECTION_HE = {
  monitoring: 'ניטור והתראות', compliance: 'ציות', agents: 'ביצועי נציגים',
  customers: 'קול הלקוח', signals: 'סיגנלים ומגמות',
}
export function sectionLabel(key, enLabel, lang) {
  return lang === 'he' ? (SECTION_HE[key] || enLabel) : enLabel
}

// ── Breaking ticker ───────────────────────────────────────────────────────────
export const BREAKING_HE = [
  'כוונת ביטול מזנקת (+240%)',
  'זמן טיפול צוות B ‎+40%',
  'מוניטור «לקוח במצוקה» — הפעלה ראשונה',
  'סופת הונאות — פי 18 בשעתיים',
  'דנה עברה 90 באמפתיה',
  'זמני המתנה חורגים לעבר ה-SLA',
]

// ── Daily-briefing KPIs ───────────────────────────────────────────────────────
export const KPI_HE = [
  { label: 'שיחות שטופלו', delta: '↑ 12% מול ממוצע 7 ימים' },
  { label: 'סנטימנט ממוצע', delta: '↑ 3 נק׳' },
  { label: 'הסלמות', delta: '↓ 8%' },
  { label: 'CSAT נציג מוביל', delta: 'מרתה קלט' },
]

// ── Trust (why you're seeing this) ────────────────────────────────────────────
export const TRUST_HE = {
  spike:      { trigger: 'סומן כשינוי דרסטי מול התקופה הקודמת', method: 'השוואת מגמת סיגנל' },
  storm:      { trigger: 'המוניטור הופעל הרבה מעל הקצב היומי הרגיל', method: 'התראה · קצב הפעלה מול בסיס' },
  approval:   { trigger: 'תור הבדיקה חצה את סף הצבר', method: 'משימות AI · עומק התור' },
  compliance: { trigger: 'עמידה בקריטריון ירדה מתחת ליעד ה-QA', method: 'כרטיס ציות מול יעד' },
  anomaly:    { trigger: 'סטייה סטטיסטית מקו הבסיס האחרון', method: 'מדד מול בסיס (σ)' },
  emergent:   { trigger: 'נושא חדש שעלה ב-Discovery — עדיין ללא סיגנל', method: 'גילוי לא מפוקח' },
  outlier:    { trigger: 'שיחה בודדת שסומנה כחריגה לבדיקה', method: 'סימון של מסכם השיחות' },
  volume:     { trigger: 'תמהיל הנפח השתנה מול התקופה הקודמת', method: 'השוואת תקופות' },
  benchmark:  { trigger: 'הפער בהערכה בין הצוותים התרחב', method: 'השוואת הערכת נציגים' },
  signal:     { trigger: 'הצעת סיגנל מ-AI הממתינה לאישורך', method: 'הצעה מ-Discovery' },
  report:     { trigger: 'דוח מתוזמן הושלם בזמן', method: 'תזמון דוחות' },
  cohort:     { trigger: 'לקוחות שקובצו לפי דפוס פנייה חוזרת', method: 'קיבוץ לקוחות' },
  workflow:   { trigger: 'תנאי ההפעלה של התהליך התקיים', method: 'כלל תהליך' },
  risk:       { trigger: 'צפוי לחרוג מה-SLA אם המגמה תימשך', method: 'תחזית קדימה מול SLA' },
  rootcause:  { trigger: 'סיגנלים תורמים אותרו כבעלי שורש משותף', method: 'ניתוח סיבתי' },
  digest:     { trigger: 'ריכוז התנועות הקטנות של השבוע', method: 'צבירה שבועית' },
  milestone:  { trigger: 'ציון ההערכה חצה סף קטגוריה', method: 'הערכת נציגים' },
  sentiment:  { trigger: 'הסנטימנט השתנה מול התקופה הקודמת', method: 'השוואת מגמת סנטימנט' },
  resolution: { trigger: 'שיעור הפתרון השתפר מול התקופה הקודמת', method: 'השוואת תקופות' },
}

// ── "See N …" evidence noun ───────────────────────────────────────────────────
const NOUN_HE = { calls: 'שיחות', triggers: 'הפעלות', 'pending actions': 'פעולות ממתינות', 'flagged calls': 'שיחות שסומנו' }
export function evidenceLabel(evidence, lang) {
  if (lang !== 'he') return evidence && evidence.count ? `See ${evidence.count} ${evidence.noun || 'calls'}` : 'Open in Data'
  if (evidence && evidence.count) return `הצג ${evidence.count} ${NOUN_HE[evidence.noun] || evidence.noun || 'שיחות'}`
  return 'פתיחה בנתונים'
}

// ── Action button labels ─────────────────────────────────────────────────────
export const ACTION_HE = {
  'Edit signal': 'עריכת סיגנל', 'Open in Data': 'פתיחה בנתונים', 'Run report': 'הרצת דוח',
  'Open in Monitoring': 'פתיחה בניטור', 'Adjust triggers': 'כוונון טריגרים', 'Assign to ticket': 'שיוך לכרטיס',
  'Review in AI Tasks': 'בדיקה במשימות AI', 'Bulk approve': 'אישור גורף', 'View audit trail': 'צפייה ביומן הביקורת',
  'Assign workflow': 'שיוך תהליך', 'Open Agent Evaluation': 'פתיחת הערכת נציגים', 'Share': 'שיתוף',
  '+ Create Signal': '+ יצירת סיגנל', 'Create Signal': 'יצירת סיגנל', 'Open Compliance': 'פתיחת ציות',
  'Assign owner': 'שיוך אחראי', 'Open cohort': 'פתיחת הקבוצה', 'Export': 'ייצוא',
  'Review signal': 'בדיקת סיגנל', 'Edit': 'עריכה', 'Open report': 'פתיחת הדוח', 'View infographic': 'צפייה באינפוגרפיקה',
  'Create Alert': 'יצירת התראה', 'Open full report': 'פתיחת הדוח המלא', 'Export infographic': 'ייצוא אינפוגרפיקה',
  'Open Signals': 'פתיחת סיגנלים',
}
export function actionLabel(en, lang) { return lang === 'he' ? (ACTION_HE[en] || en) : en }

// ── Period / byline time phrases ──────────────────────────────────────────────
export const WHEN_HE = {
  'this week': 'השבוע', 'June': 'יוני', 'trailing 30 days': '30 הימים האחרונים',
  '1–30 June': '1–30 ביוני', 'trending since April': 'במגמה מאז אפריל', 'this afternoon': 'אחר הצהריים',
}
export function whenLabel(enLabel, lang) {
  return lang === 'he' ? (WHEN_HE[enLabel] || enLabel) : enLabel
}

// ── Story count / meta helpers ────────────────────────────────────────────────
export function storiesCount(n, lang) {
  return lang === 'he' ? `${n} סיפורים` : `${n} stories`
}
export function coversLine(n, lang) {
  return lang === 'he' ? `Demo inv · ${n} סיפורים` : `Demo inv · ${n} stories`
}

// ── Article content (he) — keyed by id; localizeArticle merges over English ────
export const ARTICLES_HE = {
  'cancellation-spike': {
    title: '«כוונת ביטול» מזנקת הרחק מעל קו הבסיס של 30 הימים',
    lede: 'שפת נטישה מחולצת מנתח הולך וגדל של שיחות — שיעור ההופעה של הסיגנל היה השבוע גבוה ב-240% מהממוצע ל-30 יום, בריכוז יום רביעי אחר הצהריים בצוותים B ו-C.',
    meta: ['312 שיחות', 'צוותים B, C', 'שיא יום ד׳ 14:00'],
    stats: [
      { label: 'סיגנל', value: 'כוונת ביטול' },
      { label: 'שיעור הופעה', value: '12% מהשיחות' },
      { label: 'מול ממוצע 30 יום', value: '↑ 240%' },
      { label: 'הפעלות השבוע', value: '2,540' },
      { label: 'פלח מוביל', value: 'צוותים B, C' },
      { label: 'דוח תואם', value: 'תקציר נטישה' },
    ],
    body: [
      'הסיגנל «כוונת ביטול» — שמחלץ שפה הקשורה בנטישה מכל שיחה מעובדת — מופיע בנתח הולך וגדל של שיחות. שיעור ההופעה שלו טיפס לכ-240% מהממוצע הנע ל-30 יום השבוע, כשהריכוז החד ביותר ביום רביעי אחר הצהריים.',
      'העלייה מרוכזת בצוותים B ו-C. הניסוח הנפוץ מפנה למדרגת התמחור החדשה ולקושי להגיע לתמיכה; חוט דק אך גובר מזכיר מתחרה בשמו — דפוס שאף סיגנל ייעודי עדיין אינו לוכד.',
      'מכיוון שזהו סיגנל חילוץ ולא מוניטור, הוא אינו מזמן אף אחד. קידומו להתראה, או חיבורו לדוח «תקציר נטישה», ינתב את השיחות הללו לתהליך אוטומטית.',
    ],
    sources: [
      { quote: '…אם המחיר עולה שוב אני רוצה לבטל את החשבון שלי היום.' },
      { quote: 'הייתי בהמתנה פעמיים השבוע, נמאס לי — איך סוגרים את זה?' },
      { quote: 'אצל המתחרים זול יותר, תנו לי סיבה אחת להישאר.' },
    ],
    widget: { peakLabel: 'יום ו׳ · שיא' },
  },
  'third-party-storm': {
    title: 'מוניטור «צד שלישי» הופעל 18 פעמים בשעתיים',
    lede: 'מוניטור «צד שלישי» הופעל שמונה-עשרה פעמים בחלון של שעתיים הבוקר — כפי שלוש מהממוצע היומי שלו — וניתב משימות המשך ל-Slack ולדוא״ל כששפת דפוסי הונאה התקבצה.',
    meta: ['09:00–11:00', 'חומרה גבוהה', '3 נציגים'],
    stats: [
      { label: 'מוניטור', value: 'צד שלישי' },
      { label: 'הופעל (24ש׳)', value: '47' },
      { label: 'מול ממוצע יומי', value: '↑ פי 3' },
      { label: 'ערוצים', value: 'Slack · דוא״ל' },
      { label: 'פעולה בהתראה', value: 'יצירת משימה' },
      { label: 'הופעל לאחרונה', value: 'לפני 12 דק׳' },
    ],
    body: [
      'מוניטור «צד שלישי» — כלל מבוסס-פרומפט שמאתר מעורבות של צד שלישי בשיחות מפוקחות — הופעל שמונה-עשרה פעמים בין 09:00 ל-11:00, כפי שלוש מהקצב היומי הרגיל.',
      'כל הפעלה יצרה משימת המשך והתריעה לערוץ התורן ב-Slack ובדוא״ל. ההתקבצות מרמזת על סיבה משותפת אחת ולא על אירועים מבודדים; בדיקת השיחות המפעילות יחד תהיה מהירה יותר מבדיקה אחת-אחת.',
    ],
    sources: [
      { quote: '…הברוקר שלי אמר לי להעביר את הכספים לפני הבדיקה.' },
      { quote: 'צד שלישי יטפל עבורי בניירת.' },
    ],
    legend: [{ label: 'צד שלישי' }, { label: 'הפרת מידע' }, { label: 'משפטי ורגולטורי' }],
  },
  'ai-tasks-backlog': {
    title: '393 פעולות שהוצעו ע״י AI ממתינות לאישורך',
    lede: 'תור הבדיקה גדל ל-393 פעולות שהציע ה-AI וממתינות לאישור אנושי, כשהוותיקה שבהן ממתינה שלושה ימים. פריטים בסיכון נמוך שאומתו אוטומטית ניתנים לאישור גורף.',
    meta: ['הוותיקה 3 ימים', 'אימות אוטומטי פעיל'],
    stats: [
      { label: 'ממתינות', value: '393' },
      { label: 'אושרו (שבוע)', value: '210' },
      { label: 'הושלמו', value: '176' },
      { label: 'נדחו', value: '24' },
      { label: 'הוותיקה', value: '3 ימים' },
      { label: 'אימות אוטומטי', value: 'פעיל' },
    ],
    body: [
      'תור משימות ה-AI הוא שער האדם-בתוך-הלולאה לפעולות שמציע ה-AI. הוא גדל ל-393 פריטים ממתינים, כשהוותיק שבהם ממתין שלושה ימים — מעבר לנקודה שבה ההצעות עדיין רלוונטיות.',
      'רוב הפריטים הממתינים הם בסיכון נמוך וכבר עברו אימות אוטומטי, כך שניתן לאשר אותם גורף ולא אחד-אחד. שיפורי מערכת בעלי השפעה גבוהה עדיין מצדיקים בדיקה פרטנית עם ניתוח ההשפעה שלהם.',
    ],
  },
  'handle-time-anomaly': {
    title: 'זמן הטיפול הממוצע בצוות B קפץ ב-40% אחר הצהריים',
    lede: 'זמן הטיפול הממוצע בצוות B עלה ל-6.4 דקות — 2.3σ מעל קו הבסיס — בריכוז בשעות הצהריים המוקדמות.',
    meta: ['סטייה 2.3σ', 'SLA 4.5׳'],
    body: [
      'זמן הטיפול הממוצע של צוות B טיפס ל-6.4 דקות אחר הצהריים, סטייה של 2.3σ מקו הבסיס האחרון והרבה מעבר ליעד של 4.5 דקות.',
      'הזינוק חופף לריכוז כוונת-הביטול באותו צוות — שיחות ארוכות וקשות יותר, ולא מחסור בכוח אדם.',
    ],
  },
  'dana-milestone': {
    title: 'הנציגה דנה חצתה 90 בקטגוריית האמפתיה — לראשונה',
    lede: 'ציון האמפתיה של דנה הגיע ל-90/100 השבוע, עלייה של שש נקודות, בפעם הראשונה שהיא חוצה את הסף.',
    meta: ['אמפתיה', '+6 נק׳'],
    stat: { caption: 'אמפתיה · הערכת נציגים' },
    body: [
      'הערכת הנציגים מנקדת כל שיחה לפי קטגוריות בסולם 0–100 ומצרפת לכל נציג. ממוצע האמפתיה של דנה הגיע ל-90 השבוע — עלייה של שש נקודות ושיא אישי.',
      'העלייה ניכרת בשני קודי הנציג של דנה, כך שהיא משקפת שינוי התנהגותי אמיתי ולא ארטיפקט של ניתוב.',
    ],
    widget: { label: 'אמפתיה', delta: '+6 נק׳' },
  },
  'fcr-resolution': {
    title: 'פתרון בפנייה ראשונה טיפס ל-72% בצוות A',
    lede: 'צוות A פתר 312 מתוך 433 שיחות בפנייה הראשונה השבוע — עלייה של חמש נקודות משבוע לשבוע.',
    meta: ['+5 נק׳', 'משבוע לשבוע'],
    body: [
      'פתרון בפנייה ראשונה בצוות A עלה ל-72% — 312 מתוך 433 שיחות נסגרו ללא שיחה חוזרת — השבוע הטוב ביותר בתקופה הנוכחית.',
      'השיפור עוקב אחר עדכון התסריט שהושק בשבוע שעבר, שקיצר את הדרך לפתרון בשאלות חיוב.',
    ],
    widget: { label: '312 מתוך 433', sub: 'נפתרו בפנייה ראשונה' },
  },
  'competitor-emergent': {
    title: 'לקוחות נוקבים בשם מתחרה — ואף סיגנל עדיין לא לוכד זאת',
    lede: 'נושא חדש לגמרי הופיע השבוע: 41 שיחות שבהן לקוחות נקבו בשם מתחרה ספציפי תוך כדי שיחת ביטול. אף סיגנל קיים אינו מחלץ אותו.',
    meta: ['41 שיחות', 'נצפה לראשונה השבוע'],
    body: [
      'לראשונה בתקופה זו, אשכול שיחות נוקב בשם מתחרה ספציפי — בדרך כלל תוך השוואת מחיר בשיחת ביטול.',
      'מכיוון שאף סיגנל אינו מחלץ זאת כיום, הדבר נסתר מדוחות וממוניטורים. יצירת סיגנל לאזכורי מתחרים תאפשר לעקוב ולתייג אותו במגמה מכאן והלאה.',
    ],
    sources: [{ quote: 'המתחרה מציע בדיוק אותו דבר בפחות.' }],
  },
  'top-agents-table': {
    title: 'הנציגים המובילים השבוע לפי CSAT ופתרון',
    lede: 'טבלת מובילים מהירה על פני קטגוריות ההערכה — מרתה מובילה ב-CSAT, דנה בשיפור האמפתיה.',
    meta: ['הערכת נציגים', '7 ימים אחרונים'],
    table: { cols: ['נציג', 'CSAT', 'FCR', 'אמפתיה', 'שיחות'] },
    body: [
      'בשבעת הימים האחרונים, מרתה קלט מובילה בשביעות רצון הלקוחות בעוד דנה רואיז מציגה את שיפור האמפתיה הגדול ביותר. מובילי זמן-הטיפול שונים ממובילי ה-CSAT — שווה מבט אימון על שיווי המשקל הזה.',
    ],
  },
  'team-benchmark': {
    title: 'צוות A מתקדם לפני B ו-C בזמן הטיפול',
    lede: 'לאורך 30 הימים האחרונים, צוות A הוריד את זמן הטיפול הממוצע ל-3.8 דקות בעוד B ו-C נותרו יציבים.',
    meta: ['הערכת נציגים', '30 ימים אחרונים'],
    body: [
      'זמן הטיפול הממוצע של צוות A ירד בהתמדה ל-3.8 דקות ב-30 הימים האחרונים, ופתח פער ברור מול צוותים B ‏(5.3׳) ו-C ‏(6.0׳).',
      'ההתפצלות טרייה ועקבית — מועמדת ללימוד: מה צוות A שינה, והאם זה ניתן להעברה.',
    ],
  },
  'cooling-off-compliance': {
    title: 'גילויי «תקופת צינון» ירדו ל-82% — שלושה נציגים מובילים את זה',
    lede: 'עמידה בגילוי «תקופת צינון» ירדה ל-82% השבוע, בהובלת שלושה נציגים. זה נותר הקריטריון החלש ביותר במעקב, ובמגמת ירידה.',
    meta: ['5 סימונים', 'סיכון גבוה'],
    stats: [
      { label: 'הקריטריון החלש', value: 'תקופת צינון' },
      { label: 'שיעור הקריטריון', value: '82%' },
      { label: 'סימונים השבוע', value: '5' },
      { label: 'נציגים', value: '3' },
      { label: 'סיכון כולל', value: 'גבוה' },
      { label: 'מגמת 30 יום', value: '↓ 4 נק׳' },
    ],
    body: [
      'הציות עוקב אחר עמידה בקריטריונים — KYC, תקופת צינון, גילוי סיכון, ייפוי כוח, עמלות וטיפול באוכלוסייה פגיעה. תקופת הצינון היא החלשה ביותר השבוע ב-82%, בירידה של ארבע נקודות ב-30 יום.',
      'חמישה סימונים מתרכזים בשלושה נציגים, מה שהופך זאת לבעיית אימון ממוקדת ולא מערכתית.',
    ],
    sources: [{ quote: 'אפשר לדלג על תקופת ההמתנה אם את בטוחה.' }],
  },
  'refund-silence-anomaly': {
    title: 'זמן השתיקה בשיחות החזרים עלה ל-10%',
    lede: 'השתיקה הממוצעת בשיחות החזרים טיפסה ל-10% — 1.8σ מעל הבסיס, מעבר ליעד של 6% — ומרמזת שנציגים מחפשים תשובות תוך כדי שיחה.',
    meta: ['סטייה 1.8σ', 'יעד 6%'],
    body: [
      'זמן השתיקה בשיחות החזרים עלה ל-10% השבוע, סטייה של 1.8σ והרבה מעל היעד של 6%. שתיקות ארוכות מעידות בדרך כלל על נציגים שמחפשים מידע, ולא על לקוחות מנותקים.',
      'פער במאגר הידע לגבי מדיניות ההחזרים הנוכחית הוא הסיבה הסבירה ביותר — שווה לבדוק מה הנציגים מחפשים בהפוגות הללו.',
    ],
  },
  'outlier-escalation': {
    title: 'הסלמה אחת בת 47 דקות ששווה לקרוא',
    lede: 'שיחה בודדת ארוכה במיוחד שמסכם השיחות סימן לבדיקה.',
    meta: ['שיחה בודדת', 'סנטימנט −0.7'],
    quote: { text: 'התקשרתי ארבע פעמים על אותו חיוב וכל אחד אומר לי משהו אחר. אני רק רוצה תשובה אחת שאפשר לסמוך עליה.', who: 'לקוח · הסלמה בת 47 דק׳ · 2 ביולי' },
    body: [
      'מסכם התמלולים סימן הסלמה בת 47 דקות עם סנטימנט שלילי חד. היא נקראת ככשל של פנייה חוזרת: ארבע שיחות קודמות, תשובות לא עקביות בכל פעם.',
      'כשלעצמה זו שיחה אחת, אבל זו דוגמה נקייה לדפוס שמאחורי קבוצת התלונות החוזרות — שווה להאזין לה לפני אימון על עקביות.',
    ],
    sources: [{ quote: 'כל אחד אומר לי משהו אחר.' }],
  },
  'repeat-cohort': {
    title: '12 לקוחות בעלי תלונות חוזרות עלו השבוע',
    lede: 'שנים-עשר לקוחות פנו לתמיכה שלוש פעמים או יותר על אותה בעיה לא פתורה — קבוצת מעקב-נטישה.',
    meta: ['3+ פניות', 'מעקב נטישה'],
    body: [
      'קיבוץ פניות לפי לקוח חשף שנים-עשר אנשים שפנו לתמיכה שלוש פעמים או יותר השבוע על אותה בעיה לא פתורה — הסיגנל החזק ביותר לנטישה בטווח הקרוב.',
      'ייצוא הקבוצה או פתיחתה במודול הלקוחות מאפשרים לנתב פנייה יזומה לפני שהם מבטלים.',
    ],
  },
  'tommy-signal': {
    title: 'טומי יצר סיגנל חדש: «סיכון להסלמת החזר»',
    lede: 'הצעת סיגנל שנוצרה ע״י AI ממתינה לבדיקה לפני שתעלה לאוויר.',
    meta: ['נוצר ע״י AI', 'בדיקה כדי להפעיל'],
    body: [
      'טומי הציע סיגנל חדש, «סיכון להסלמת החזר», לאחר שזיהה דפוס חוזר בשיחות החזרים שמקדים הסלמות.',
      'הוא אינו פעיל עד לבדיקה. הפעלתו תתחיל לחלץ את הדפוס בשיחות חדשות ותנגיש אותו למוניטורים ולדוחות.',
    ],
  },
  'trend-report-ran': {
    title: 'דוח המגמות השבועי הורץ — תלונות תמחור צוינו כמניע המוביל',
    lede: 'דוח המגמות השבועי המתוזמן הושלם ונשלח בדוא״ל לארבעה נמענים; תלונות התמחור הובילו את ממצאיו.',
    meta: ['מתוזמן', 'נשלח ל-4'],
    body: [
      'דוח המגמות השבועי הורץ כמתוכנן וסימן תלונות תמחור כמניע המוביל של סנטימנט שלילי השבוע — עקבי עם זינוק כוונת הביטול.',
      'גרסת האינפוגרפיקה ניתנת לשיתוף, והדוח ניתן להרצה מחדש לפי דרישה על השיחות העדכניות.',
    ],
  },
  'sentiment-drop': {
    title: 'שפת התסכול ירדה ב-9% אחרי עדכון התסריט',
    lede: 'סיגנלי הסנטימנט מראים ירידה של תשע נקודות בשפת תסכול משבוע לשבוע, בעקבות שינוי תסריט החיוב.',
    meta: ['−9% מול השבוע שעבר'],
    body: [
      'מאז עדכון תסריט החיוב, חילוץ הסנטימנט מראה ירידה של תשע נקודות בשפת תסכול משבוע לשבוע — התנועה החיובית הברורה ביותר של השבוע.',
      'היא מצטרפת לשיפור בפתרון בפנייה ראשונה בצוות A, ומרמזת ששינוי התסריט עושה עבודה אמיתית.',
    ],
  },
  'why-load-surge': {
    title: 'למה תיאום יזום זינק ב-167% — שלוש סיבות מצטברות',
    lede: 'זינוק התיאומים ומשבר זמני ההמתנה מתחקים לשרשרת אחת: דחיפת חיוג-חוזר יוצא שעקפה את קיבולת הסניפים ואת הקליטה הדיגיטלית.',
    meta: ['+167% תיאומים', 'קשור למשבר זמני ההמתנה'],
    body: [
      'התנועה הבולטת של יוני — תיאום יזום בעלייה של 167% — לא קרתה בבידוד. מעקב אחר הסיגנלים התורמים מראה שרשרת מצטברת אחת ולא שלושה סיפורים נפרדים.',
      'אסטרטגיית חיוג-חוזר יוצא מילאה בהצלחה את יומן הטיפולים, אך חלק מהלקוחות לא היו זמינים בניסיון הראשון, מה שיצר «בומרנג» של שיחות חוזרות נכנסות. אלה נחתו על סניפים שכבר בשיא העומס, כך שהלקוחות הסלימו למוקד הארצי. וכשנציגים נשענו על SMS לאיסוף פרטים, לקוחות מבוגרים לא הצליחו להשלים אותו — מה שהאריך שיחות והחזיר פניות ללולאה בתור.',
      'המשמעות המעשית: סיכון זמני ההמתנה אינו בעיית כוח אדם בפני עצמה — הוא במורד הזרם של קצב החיוג היוצא ופער הקליטה הדיגיטלית. תיקון כל אחת מהסיבות במעלה הזרם מקל על התור.',
    ],
    sources: [{ quote: 'שלחת לי קישור ב-SMS אבל אני לא מצליח לפתוח — אפשר פשוט לקחת את הכתובת שלי עכשיו?' }],
    widget: { steps: [
      { title: 'אסטרטגיה יוצאת', text: 'קמפיין חיוג-חוזר פעיל מילא את היומן אך יצר «בומרנג» של שיחות חוזרות מלקוחות שלא היו זמינים בפעם הראשונה.' },
      { title: 'קיבולת סניפים', text: 'הסניפים הגיעו לשיא עומס; חיכוך בקליטת רכבים דחף לקוחות להתקשר שוב למוקד הארצי — 838 שיחות, הסניף המוזכר ביותר.' },
      { title: 'חיכוך דיגיטלי', text: 'בקשות כתובת/פרטים ב-SMS נכשלו עבור לקוחות מבוגרים ופחות דיגיטליים — מה שהאריך שיחות והחזיר פניות לתור.' },
    ] },
  },
  'wait-time-risk': {
    title: 'זמני ההמתנה במגמה לעבר חריגת SLA',
    lede: '23.2% מהלקוחות כבר ממתינים יותר מ-60 שניות — עלייה חדה מאז אפריל. אם המגמה תימשך תחת מדיניות החיוג היוצא החדשה, כוח האדם לא יעמוד ב-SLA בחודש הבא.',
    meta: ['23.2% >60ש׳', '653 שיחות', 'חריגה חזויה'],
    body: [
      'נתח הלקוחות הממתינים יותר מ-60 שניות טיפס ל-23.2% — 653 שיחות בתקופה זו — עלייה חדה מהממוצע ההיסטורי, ובהאצה מחודש לחודש.',
      'זהו סימון צופה פני עתיד, לא רק דיווח על העבר: הקרנת השיפוע הנוכחי מול מדיניות החיוג היוצא החדשה מראה שכוח האדם הקיים יפגר אחרי ה-SLA של זמני ההמתנה בחודש הבא. המניעים במעלה הזרם זהים לאלה שמאחורי זינוק התיאומים (ראו ניתוח שורש הבעיה).',
    ],
    widget: { peakLabel: '23.2%' },
  },
  'june-recap': {
    title: 'דוח המגמות החודשי שלך ליוני מוכן',
    lede: 'סיכום מגמות מלא ליוני — תיאום יזום, חיכוך שירות, חומרת תקלות ושורשי הבעיה — מרוכז לדוח ולאינפוגרפיקה הניתנים לשיתוף.',
    meta: ['1–30 ביוני 2026', '2,812 שיחות נותחו'],
    recap: {
      headline: 'זינוק בתיאום יזום מול עומס תפעולי וחיכוך שירות',
      kpis: [['דומיננטיות Audi', '56.7%'], ['סנטימנט שלילי', '16.8%'], ['המתנה >60ש׳', '23.2%'], ['שיחות נותחו', '2,812']],
    },
    body: [
      'מהדורת יוני של דוח המגמות החודשי הופקה וזמינה. היא מאחדת את תנועות החודש — זינוק התיאומים של 167%, עלייה של 78% בסנטימנט השלילי, עלייה של 162% בחומרת התקלות, וניתוח שורש הבעיה שמאחוריהם — לדוח המלא ולאינפוגרפיקה הניתנת לשיתוף.',
      'הפיד הזה מציף את אותה בינה באופן רציף; הסיכום הוא הצלילה התקופתית והניתנת לייצוא עבור בעלי עניין שרוצים את התמונה כולה במקום אחד.',
    ],
  },
  'weekly-digest': {
    title: 'חמישה סיגנלים קטנים שזזו השבוע',
    lede: 'תנועות קטנות ששוות מבט, מדורגות לפי שינוי.',
    meta: ['תקציר שבועי'],
    digest: [
      { name: 'ביטול ונטישה', count: '312 שיחות', delta: '↑ 240%' },
      { name: 'תלונות תמחור', count: '128 שיחות', delta: '↑ 34%' },
      { name: 'סטטוס החזר', count: '140 שיחות', delta: '↑ 12%' },
      { name: 'עמלות כבודה', count: '88 שיחות', delta: '↑ 18%' },
      { name: 'אזכורי מתחרים', count: '41 שיחות', delta: 'חדש' },
    ],
    body: ['ריכוז תנועות סיגנל קטנות של השבוע, מדורג לפי שינוי. אף אחת אינה מגיעה כשלעצמה לכדי סיפור נבחר, אך יחד הן משרטטות לאן תשומת הלב נודדת.'],
  },
}

// Localize the provenance (trust) trigger/method by the article's type.
export function localizeTrust(trust, type, lang) {
  if (lang !== 'he' || !trust) return trust
  const he = TRUST_HE[type]
  return he ? { ...trust, trigger: he.trigger, method: he.method } : trust
}

// Localize a prev/next title (we only receive the English string, so map by match).
export function localizeTitle(enTitle, lang) {
  if (lang !== 'he' || !enTitle) return enTitle
  const a = ARTICLES.find(x => x.title === enTitle)
  return (a && ARTICLES_HE[a.id] && ARTICLES_HE[a.id].title) || enTitle
}

// Merge Hebrew fields over an English article when lang === 'he'.
export function localizeArticle(a, lang) {
  if (lang !== 'he') return a
  const he = ARTICLES_HE[a.id]
  if (!he) return a
  const out = { ...a }
  if (he.title) out.title = he.title
  if (he.lede) out.lede = he.lede
  if (he.body) out.body = he.body
  if (he.meta) out.meta = he.meta
  if (he.quote) out.quote = { ...a.quote, ...he.quote }
  if (he.stat) out.stat = { ...a.stat, ...he.stat }
  if (he.recap) out.recap = he.recap
  if (he.digest && a.digest) out.digest = a.digest.map((d, i) => ({ ...d, ...(he.digest[i] || {}) }))
  if (he.stats && a.stats) out.stats = a.stats.map((s, i) => ({ ...s, ...(he.stats[i] || {}) }))
  if (he.sources && a.sources) out.sources = a.sources.map((s, i) => ({ ...s, ...(he.sources[i] || {}) }))
  if (he.legend && a.legend) out.legend = a.legend.map((l, i) => ({ ...l, ...(he.legend[i] || {}) }))
  if (he.table && a.table) out.table = { ...a.table, ...he.table }
  if (he.widget && a.widget) {
    const props = { ...a.widget.props }
    for (const k of Object.keys(he.widget)) props[k] = he.widget[k]
    out.widget = { ...a.widget, props }
  }
  return out
}
