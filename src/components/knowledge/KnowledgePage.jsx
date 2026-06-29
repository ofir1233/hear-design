import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import PageHeader from '../PageHeader.jsx'

// ── Mock data ─────────────────────────────────────────────────────────────────

const CONTENT = {

'Babcom_Script.txt': `BABCOM CUSTOMER SERVICE — AGENT CALL SCRIPT v4.2
Last updated: March 2026 | Owner: QA & Training Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[SECTION 1 — OPENING]

Agent: "Thank you for calling Babcom support. My name is [Agent Name], and I'm here to help you today. May I have your name and account number, please?"

Verification Protocol:
Confirm the caller's identity using at least two verification points before proceeding with any account-sensitive information. Required identifiers:
  • Full legal name on account
  • Account number (10-digit)
  • Secondary: registered email address OR last 4 digits of phone number

If the customer cannot verify — do not proceed with account changes. Transfer to Tier 2 Security queue.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[SECTION 2 — ISSUE IDENTIFICATION]

1. Listen actively without interrupting. Hold silence for at least 2 seconds after the customer finishes speaking before responding.
2. Confirm the issue: "Just to make sure I understand, you're calling about [repeat issue]?"
3. Empathize: "I completely understand how frustrating that must be. Let me help you resolve this."
4. Set expectations: "I'm going to look into this for you right away. This should only take a moment."

Listening guidelines:
Never minimize the customer's concern or rush to a resolution before fully understanding the issue. Use active listening cues such as "I see," "Of course," and "Understood" to keep the customer engaged. Avoid filler phrases like "no problem" — use "absolutely" or "of course" instead.

Common issue categories:
  • Billing discrepancies
  • Service outages / connectivity issues
  • Account access & password resets
  • Product feature questions
  • Contract or plan changes
  • Refund or credit requests

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[SECTION 3 — RESOLUTION FLOW]

5. Investigate the account using the CRM system. Pull the full interaction history before proposing a solution.
6. Provide a clear, step-by-step solution. Use simple language — avoid internal jargon.
7. Confirm: "Does that resolve your issue, or is there anything else I can help you with?"

Resolution SLA targets:
  • Billing: resolved or escalated within 8 minutes
  • Technical: resolved or ticket created within 10 minutes
  • General inquiry: resolved within 5 minutes

If the issue cannot be resolved in one call, provide a case number and an expected follow-up timeline. Never leave a case open without a documented next step and owner assigned in CRM.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[SECTION 4 — ESCALATION CRITERIA]

Escalate immediately when:
  • Billing dispute exceeds $500
  • Customer makes a legal threat or mentions a lawyer
  • Repeat contact 3 or more times for the same issue within 30 days
  • System failure is confirmed affecting the customer's account
  • Customer requests to speak with a manager

Escalation procedure:
8. Inform the customer: "I'm going to connect you with a specialist who can better assist with this. Please hold for just a moment."
9. Never leave the customer on hold for more than 3 minutes without an update. If still waiting, return and provide an ETA.
10. Document escalation reason clearly in CRM before transferring.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[SECTION 5 — COMPLIANCE & PRIVACY]

11. Never share customer data with third parties without documented consent.
12. All calls are recorded for quality assurance — if the customer asks, confirm this and offer to share the policy URL.
13. Adhere to GDPR/CCPA guidelines at all times. When in doubt, consult the Privacy Handbook (see Knowledge > Compliance > Privacy_Handbook.pdf).
14. Do not access accounts that are not party to the current call without documented authorization.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[SECTION 6 — CLOSING]

15. Summarize actions taken: "So today I've [describe action]. You should see [expected outcome] within [timeframe]."
16. Provide the case or ticket number if one was created.
17. Ask: "Is there anything else I can help you with today?"
18. Thank the customer: "Thank you for calling Babcom. Have a great day!"

Post-Call Wrap-Up (must complete within 5 minutes):
19. Log interaction in CRM with full notes.
20. Tag the interaction with the correct topic category: Billing | Technical | General | Escalation | Complaint | Feedback.
21. If follow-up is required, set a CRM reminder with the agreed date and assign to the appropriate team.
22. If refund or credit was issued, submit the approval form within 2 hours.`,

'Escalation_Matrix.md': `# Escalation Matrix — Babcom Support Operations
Version 2.1 | Effective: January 2026

## Overview
This document defines escalation paths, thresholds, and responsible teams for all customer-facing interactions. All agents must be familiar with this matrix before handling live calls.

---

## Tier 1 — Frontline Resolution
**Scope:** Standard inquiries, basic troubleshooting, account lookups, billing explanations.
**Max Handle Time:** 12 minutes
**Tools:** CRM (Salesforce), Knowledge Base, FAQ Portal

| Issue Type         | Resolution Path                    | Escalate If                        |
|--------------------|------------------------------------|------------------------------------|
| Password reset     | Self-serve guide → manual reset    | Account locked after 5 attempts    |
| Billing question   | Explain invoice line items         | Disputed amount > $200             |
| Service slowness   | Basic diagnostics checklist        | Persists after steps or is widespread |
| Feature inquiry    | Point to documentation             | Custom enterprise requirement       |

---

## Tier 2 — Specialist Queue
**Scope:** Complex billing disputes, account security, compliance-sensitive issues.
**Max Handle Time:** 25 minutes
**SLA:** Response within 4 hours during business hours

Trigger criteria:
- Billing dispute between $200–$1,000
- Suspected account compromise
- Customer has contacted 3+ times for the same issue
- Customer has mentioned GDPR/CCPA data rights

---

## Tier 3 — Management / Legal
**Scope:** High-value accounts, legal threats, media escalation, executive contacts.
**SLA:** Response within 1 business day

Trigger criteria:
- Any legal threat or lawyer mention
- Billing dispute exceeding $1,000
- Media or public-facing complaint (social media, press)
- Accounts with ARR > $50K

---

## After-Hours Escalation
Outside of 8am–8pm EST, Tier 2+ issues are queued for next-business-day response. Agents must:
1. Create a CRM ticket with priority flag
2. Send automated acknowledgement email to customer
3. Log estimated response window

Emergency escalations (security breaches, critical service outages) route to the On-Call Incident Manager via PagerDuty.`,

'Refund_Policy.txt': `BABCOM REFUND & CREDIT POLICY
Effective Date: February 1, 2026
Document ID: POL-FIN-0042

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ELIGIBILITY

Customers are eligible for a refund or service credit under the following conditions:

  a) Service Outage Credit
     Any verified service outage exceeding 4 continuous hours entitles the customer to a prorated credit for the affected period. Credits are calculated based on the monthly subscription rate divided by 720 (hours in a 30-day month).

  b) Billing Error
     Incorrect charges due to system error or agent mistake are eligible for full refund to the original payment method within 5–10 business days.

  c) Cancellation within 14 Days
     New customers who cancel within 14 days of activation are eligible for a full refund, no questions asked. This does not apply to usage-based charges incurred during the period.

  d) Dissatisfaction Refund
     At management discretion only. Requires supervisor approval and CRM documentation. Limited to one per account per 12-month period.

2. NON-REFUNDABLE ITEMS

  • Setup and onboarding fees
  • Custom integration work
  • Usage-based charges beyond the base plan
  • Third-party add-on services

3. PROCESSING

All refund requests must be submitted via the CRM refund workflow. Agents may not promise a refund without supervisor confirmation. Processing time: 3–5 business days for credits, 5–10 days for payment method refunds.

4. ESCALATION

Refund requests over $500 require Tier 2 approval. Requests over $2,000 require Finance sign-off via the standard approval chain.`,

'Onboarding_Checklist.md': `# New Agent Onboarding Checklist
HR & Training Department — Babcom
Last revised: March 2026

## Week 1 — Orientation

- [ ] Complete HR paperwork and system access request
- [ ] Attend company overview session (Day 1, 9am)
- [ ] Complete mandatory compliance training (GDPR, CCPA, Data Handling)
- [ ] Shadow 3 experienced agents on live calls
- [ ] Read and sign: Code of Conduct, Data Privacy Agreement, Call Recording Policy
- [ ] Set up CRM access, telephony system, and knowledge base login
- [ ] Complete introductory product training (4 modules, ~3 hours)

## Week 2 — Supervised Practice

- [ ] Handle 10 supervised calls (trainer listening, feedback after each)
- [ ] Pass the product knowledge quiz (minimum score: 80%)
- [ ] Complete escalation procedure training
- [ ] Review the 10 most common call types with team lead
- [ ] Attend first weekly team standup

## Week 3 — Solo with Safety Net

- [ ] Handle calls independently with trainer available on standby
- [ ] Complete first quality scorecard review with QA
- [ ] Set personal CSAT and handle-time goals with manager
- [ ] Submit first weekly self-assessment

## Week 4 — Full Certification

- [ ] Pass final assessment: role-play scenarios + written exam
- [ ] Complete certification sign-off with training manager
- [ ] Assigned to regular shift schedule
- [ ] Introduced to peer buddy program

## Ongoing Requirements

- Quarterly compliance refresher training
- Monthly 1:1 with team lead
- Bi-annual product knowledge recertification`,

'Privacy_Handbook.pdf': `BABCOM PRIVACY HANDBOOK
Version 3.0 — Confidential Internal Document
Prepared by: Legal & Compliance Team

═══════════════════════════════════════════════════

CHAPTER 1: DATA CLASSIFICATION

All data handled by Babcom agents falls into one of four categories:

  PUBLIC — Information intentionally shared externally (marketing materials, public documentation). No restrictions on handling.

  INTERNAL — Standard business information not intended for external distribution (internal guides, team communications). Handle with normal care.

  CONFIDENTIAL — Customer PII, financial data, contract terms. Must be encrypted in transit and at rest. Access limited to authorized roles only. Never share via unencrypted channels.

  RESTRICTED — Security credentials, legal documents, HR records. Strict need-to-know. Any access must be logged and reviewed quarterly.

═══════════════════════════════════════════════════

CHAPTER 2: CUSTOMER DATA RIGHTS (GDPR / CCPA)

Customers have the right to:
  • Access — Request a copy of all data held about them
  • Rectification — Correct inaccurate data
  • Erasure ("Right to be Forgotten") — Request deletion of personal data
  • Portability — Receive data in a machine-readable format
  • Objection — Opt out of certain processing activities

Agent responsibilities:
  - Never deny or delay a data rights request. Forward immediately to privacy@babcom.com.
  - Do not attempt to fulfill data deletion or export requests manually — always route through the formal process.
  - Response SLA: 30 days for GDPR, 45 days for CCPA.

═══════════════════════════════════════════════════

CHAPTER 3: CALL RECORDING POLICY

All customer calls are recorded for quality assurance and compliance purposes. Agents must:
  1. Be aware that recordings may be reviewed by QA, management, or legal teams.
  2. Inform customers upon request that calls are recorded ("Yes, calls are recorded for quality and training purposes").
  3. Never pause or stop a recording during a live call.
  4. Never share recordings externally without written authorization from the Legal team.

Retention: Recordings are stored for 24 months then automatically purged per our data retention schedule.

═══════════════════════════════════════════════════

CHAPTER 4: INCIDENT REPORTING

If you suspect a data breach or unauthorized access:
  1. Do not attempt to investigate or resolve independently.
  2. Immediately contact your supervisor AND security@babcom.com.
  3. Document what you observed: time, system, data potentially affected.
  4. Do not discuss the incident with colleagues until cleared by the Security team.

Response timeline: Security team acknowledges within 1 hour, initial assessment within 4 hours.`,

'SLA_Definitions.txt': `SERVICE LEVEL AGREEMENTS — INTERNAL REFERENCE GUIDE
Babcom Support Operations | Q1 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESPONSE TIME TARGETS

  First Response (Inbound Call):
    Target: < 30 seconds average wait time
    Threshold: < 2 minutes maximum before agent pickup or IVR escalation

  First Response (Email / Ticket):
    Business Hours (8am–8pm EST): < 2 hours
    After Hours: Next business day by 10am

  First Response (Live Chat):
    Target: < 45 seconds
    Threshold: < 3 minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESOLUTION TIME TARGETS

  Tier 1 (Standard):    Resolved or escalated within 12 minutes on call
  Tier 2 (Specialist):  Resolved within 25 minutes or ticket created with 4hr SLA
  Tier 3 (Management):  Response within 1 business day, resolution within 3 days

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUALITY TARGETS

  CSAT (Customer Satisfaction Score):   Target ≥ 4.2 / 5.0
  FCR (First Contact Resolution Rate):  Target ≥ 72%
  QA Score (call monitoring):           Target ≥ 85 / 100
  Adherence to Script:                  Target ≥ 90%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AVAILABILITY TARGETS

  Phone Support:   Mon–Fri 8am–8pm EST | Sat 9am–5pm EST
  Chat Support:    Mon–Fri 8am–10pm EST
  Email Support:   24/7 with SLA per above

  Holiday coverage: Reduced staffing schedule published in the internal calendar by the 15th of the prior month.`,

'Technical_Troubleshooting.md': `# Technical Troubleshooting Guide
Babcom Platform — Agent Reference
Version 1.8 | Updated: February 2026

---

## Common Issue: Customer Cannot Log In

**Symptoms:** Customer reports password not working, account locked, or MFA not delivering codes.

**Steps:**
1. Verify account exists and is active in CRM (search by email + account number).
2. Check account status — look for "Locked", "Suspended", or "Pending Verification" flags.
3. If locked after failed attempts: unlock from admin panel (Admin > Accounts > Unlock). Inform customer it may take up to 2 minutes to propagate.
4. If MFA issue: ask customer to check spam folder, confirm correct phone number on file, offer backup code option.
5. If account is suspended: do NOT unlock without supervisor approval. Explain: "Your account has been temporarily restricted. I'll connect you with a specialist who can assist."

---

## Common Issue: Service Connectivity / Performance

**Symptoms:** Slow response, timeouts, features not loading, API errors.

**Steps:**
1. Check the Babcom Status Page (internal: status.babcom.internal) for active incidents before troubleshooting.
2. If a known incident is active: inform customer, provide estimated resolution time, log contact as "Informed — Incident #XXXX".
3. If no active incident:
   a. Ask customer for their environment: browser/app version, OS, network type (WiFi/LTE/corporate).
   b. Request they clear cache and cookies, try incognito mode.
   c. Ask them to test on a different network or device.
4. If issue persists: create a technical ticket with full environment details. Set expectation: 4-hour SLA for initial engineering response.

---

## Common Issue: Data Not Appearing / Sync Delay

**Symptoms:** Reports show outdated data, new records not visible, dashboard not refreshing.

**Steps:**
1. Confirm the customer's last data sync time (visible in account > integrations panel).
2. Standard sync cadence is every 15 minutes. If within cadence, advise customer to wait.
3. If sync is overdue (>30 min): trigger a manual sync from admin panel (Admin > Integrations > Force Sync).
4. If manual sync fails or error is shown: escalate to Data Engineering via the internal #data-sync-issues Slack channel with customer ID and error code.

---

## Common Issue: Billing Portal Access

**Symptoms:** Customer cannot see invoices, update payment method, or download receipts.

**Steps:**
1. Confirm the customer has Billing Admin role in their account (Settings > Team > Roles).
2. If role is missing: only the account owner can grant it. Direct customer to their account owner.
3. If role is present but access is still blocked: clear browser cache, try different browser.
4. If still blocked: escalate to Billing Tech queue with account ID and screenshot if possible.`,

'Product_FAQ.txt': `BABCOM PRODUCT — FREQUENTLY ASKED QUESTIONS
Customer Support Reference | March 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Q: What is Babcom and what does the platform do?
A: Babcom is an AI-powered customer intelligence platform. It analyzes voice and text interactions to surface insights about customer sentiment, agent performance, product feedback, and emerging trends — helping operations and CX teams make faster, more informed decisions.

Q: What integrations does Babcom support?
A: Babcom integrates natively with Salesforce, HubSpot, Zendesk, Intercom, Genesys, Five9, Twilio, and all major telephony systems via SIP. Custom integrations are available via the REST API (documentation at docs.babcom.io).

Q: How long does it take to set up?
A: Standard onboarding is 5–10 business days for cloud deployments. Enterprise deployments with custom integrations range from 2–6 weeks. A dedicated onboarding engineer is assigned for accounts over $20K ARR.

Q: Is our data safe? Where is it stored?
A: All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Babcom is SOC 2 Type II certified and GDPR/CCPA compliant. Data residency options available in US, EU, and APAC regions. See the Privacy Handbook for full details.

Q: Can agents access our call recordings directly?
A: Babcom does not store raw audio by default. Only AI-processed transcripts and metadata are retained unless the customer opts into the recording archive add-on. Access to transcripts is role-based and logged.

Q: How accurate is the AI transcription and analysis?
A: Transcription accuracy averages 94–97% for clear audio in supported languages. Accuracy for heavily accented speech or noisy environments may vary. The platform supports English, Spanish, French, German, Portuguese, and Hebrew.

Q: What is the uptime SLA?
A: Babcom guarantees 99.9% uptime (excluding scheduled maintenance). Full SLA terms are available in the service agreement. Downtime credits apply per the Refund Policy (POL-FIN-0042).

Q: Can we customize the AI models used for analysis?
A: Yes. Enterprise customers can select from the model library (Yoko-1, Tomy-1, etc.) or submit custom training data for fine-tuned topic detection. Contact your account manager for details.

Q: How do we export our data if we leave?
A: Customers can export all data (transcripts, metadata, reports) via the Data Export wizard in Settings > Data Management. Exports are provided in CSV and JSON formats within 48 hours of request. Post-cancellation, data is retained for 30 days then purged per our retention policy.`,

}

const MOCK_GLOSSARIES = [
  {
    id: 'gl-support',
    name: 'Support Operations',
    items: [
      { id: 'gi-1', term: 'FCR',  definition: 'First Contact Resolution — percentage of issues fully resolved on the first interaction without requiring a callback or follow-up.' },
      { id: 'gi-2', term: 'AHT',  definition: 'Average Handle Time — total duration of a customer interaction including hold time and post-call wrap-up. Target ≤ 8 minutes for Tier 1.' },
      { id: 'gi-3', term: 'CSAT', definition: 'Customer Satisfaction Score — post-interaction survey metric rated 1–5. Target ≥ 4.2.' },
      { id: 'gi-4', term: 'IVR',  definition: 'Interactive Voice Response — automated phone system that routes callers before connecting to a live agent.' },
    ],
  },
  {
    id: 'gl-compliance',
    name: 'Compliance & Privacy',
    items: [
      { id: 'gi-5', term: 'PII',   definition: 'Personally Identifiable Information — any data that could identify a specific individual (name, email, phone, account number). Classified as Confidential.' },
      { id: 'gi-6', term: 'GDPR',  definition: 'General Data Protection Regulation — EU regulation governing how personal data is collected, stored, and processed. Applies to all Babcom EU customers.' },
      { id: 'gi-7', term: 'CCPA',  definition: 'California Consumer Privacy Act — US state law granting California residents rights over their personal data, including the right to access, delete, and opt out of data sale.' },
      { id: 'gi-8', term: 'SOC 2', definition: 'Service Organization Control 2 — auditing standard for SaaS companies verifying controls around security, availability, and confidentiality. Babcom is SOC 2 Type II certified.' },
    ],
  },
  {
    id: 'gl-sla',
    name: 'SLA & Performance',
    items: [
      { id: 'gi-9',  term: 'SLA',  definition: 'Service Level Agreement — defined performance targets for response and resolution times agreed between Babcom and the customer.' },
      { id: 'gi-10', term: 'SLO',  definition: 'Service Level Objective — internal target (e.g. 99.9% uptime) that Babcom aims to meet, typically more stringent than the contractual SLA.' },
      { id: 'gi-11', term: 'MTTR', definition: 'Mean Time To Resolution — average time from incident detection to full resolution. A key indicator of support team effectiveness.' },
    ],
  },
]

const MOCK_TREE = [
  {
    id: 'folder-babcom',
    type: 'folder',
    name: 'Babcom_Agent_Script_Adherence',
    children: [
      { id: 'file-script',    type: 'file', name: 'Babcom_Script.txt',      content: CONTENT['Babcom_Script.txt'] },
      { id: 'file-escalation',type: 'file', name: 'Escalation_Matrix.md',   content: CONTENT['Escalation_Matrix.md'] },
      { id: 'file-refund',    type: 'file', name: 'Refund_Policy.txt',       content: CONTENT['Refund_Policy.txt'] },
    ],
  },
  {
    id: 'folder-compliance',
    type: 'folder',
    name: 'Compliance & Legal',
    children: [
      { id: 'file-privacy',   type: 'file', name: 'Privacy_Handbook.pdf',   content: CONTENT['Privacy_Handbook.pdf'] },
      { id: 'file-sla',       type: 'file', name: 'SLA_Definitions.txt',    content: CONTENT['SLA_Definitions.txt'] },
    ],
  },
  {
    id: 'folder-training',
    type: 'folder',
    name: 'Training & Onboarding',
    children: [
      { id: 'file-onboarding',type: 'file', name: 'Onboarding_Checklist.md',content: CONTENT['Onboarding_Checklist.md'] },
      { id: 'file-technical', type: 'file', name: 'Technical_Troubleshooting.md', content: CONTENT['Technical_Troubleshooting.md'] },
    ],
  },
  {
    id: 'folder-product',
    type: 'folder',
    name: 'Product Documentation',
    children: [
      { id: 'file-faq',       type: 'file', name: 'Product_FAQ.txt',        content: CONTENT['Product_FAQ.txt'] },
    ],
  },
]

// ── Icons ─────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="3"   r="1.2" fill="currentColor" />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
      <circle cx="7.5" cy="12"  r="1.2" fill="currentColor" />
    </svg>
  )
}

function ChevronUpIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightSmall() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M3 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BreadcrumbChevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M1.5 3.5C1.5 2.95 1.95 2.5 2.5 2.5h3l1.5 1.5H11.5C12.05 4 12.5 4.45 12.5 5v6C12.5 11.55 12.05 12 11.5 12h-9C2 12 1.5 11.55 1.5 11V3.5z"
        fill="#FF7056"
        opacity="0.85"
      />
    </svg>
  )
}

function FileTextIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="2" y="1" width="7" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M4 4h4M4 6h4M4 8h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function FormatIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M1 3h11M1 6.5h7M1 10h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

// ── Header dropdown ───────────────────────────────────────────────────────────

function UploadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 9V2M4.5 4.5L7 2l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 10v1.5A1.5 1.5 0 0 0 3.5 13h7A1.5 1.5 0 0 0 12 11.5V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function KMenuRow({ icon, label, onClick, delay = 0 }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        width: '100%', padding: '7px 12px',
        background: hov ? 'var(--bg-active)' : 'transparent',
        border: 'none', cursor: 'pointer', textAlign: 'left',
        color: 'var(--text-secondary)',
        fontSize: 12, fontFamily: "'Byrd', sans-serif", fontWeight: 500,
        transition: 'background 100ms ease',
        animation: `kItemIn 140ms cubic-bezier(0.22,1,0.36,1) ${delay}ms both`,
      }}
    >
      {icon}
      {label}
    </button>
  )
}

function KMoreMenu() {
  const [anchor, setAnchor] = useState(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!anchor) return
    function onDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) {
        setAnchor(null)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [anchor])

  function openMenu(e) {
    e.stopPropagation()
    if (anchor) { setAnchor(null); return }
    const r = btnRef.current.getBoundingClientRect()
    setAnchor({ top: r.bottom + 4, right: window.innerWidth - r.right })
  }

  return (
    <>
      <style>{`
        @keyframes kDropIn {
          from { opacity: 0; transform: translateY(6px) }
          to   { opacity: 1; transform: translateY(0) }
        }
        @keyframes kItemIn {
          from { opacity: 0; transform: translateY(4px) }
          to   { opacity: 1; transform: translateY(0) }
        }
      `}</style>

      <button
        ref={btnRef}
        onClick={openMenu}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 32, height: 32,
          background: anchor ? 'var(--bg-active)' : 'transparent',
          border: `1px solid ${anchor ? 'var(--border-default)' : 'transparent'}`,
          borderRadius: 8,
          color: 'var(--text-secondary)',
          cursor: 'pointer', flexShrink: 0,
          transition: 'background 120ms ease, border-color 120ms ease',
        }}
        onMouseEnter={e => { if (!anchor) { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.borderColor = 'var(--border-default)' } }}
        onMouseLeave={e => { if (!anchor) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' } }}
      >
        <MoreIcon />
      </button>

      {anchor && createPortal(
        <div ref={menuRef} style={{
          position: 'fixed',
          top: anchor.top, right: anchor.right,
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
          zIndex: 9999, minWidth: 170, padding: '4px 0',
          animation: 'kDropIn 150ms ease both',
        }}>
          <KMenuRow icon={<UploadIcon />} label="Upload"          onClick={() => setAnchor(null)} delay={20} />
          <KMenuRow icon={<GPlusIcon />}  label="Create Glossary" onClick={() => setAnchor(null)} delay={50} />
        </div>,
        document.body
      )}
    </>
  )
}

// ── Section header ─────────────────────────────────────────────────────────────

function SectionHeader({ label, expanded, active = false, onToggle }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 14px 6px',
        cursor: 'pointer',
        userSelect: 'none',
        background: active ? 'var(--bg-active)' : hovered ? 'var(--bg-active)' : 'transparent',
        transition: 'background 120ms ease',
      }}
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-secondary)',
        fontFamily: "'Byrd', sans-serif",
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {label}
      </span>
      <span style={{
        color: 'var(--text-secondary)',
        opacity: hovered ? 1 : 0.6,
        transition: 'opacity 120ms ease',
        display: 'flex', alignItems: 'center',
      }}>
        {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </span>
    </div>
  )
}

// ── Tree folder row ────────────────────────────────────────────────────────────

function FolderRow({ folder, expanded, onToggle, children }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 14px',
          cursor: 'pointer',
          background: expanded
            ? 'var(--bg-active)'
            : hovered ? 'var(--bg-active)' : 'transparent',
          transition: 'background 120ms ease',
          userSelect: 'none',
        }}
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span style={{
          color: expanded ? 'var(--text-primary)' : 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', flexShrink: 0,
          transition: 'color 120ms ease',
        }}>
          {expanded ? <ChevronDownIcon /> : <ChevronRightSmall />}
        </span>
        <FolderIcon />
        <span style={{
          fontSize: 12,
          fontWeight: expanded ? 500 : 400,
          color: 'var(--text-primary)',
          fontFamily: "'Byrd', sans-serif",
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          transition: 'font-weight 120ms ease',
        }}>
          {folder.name}
        </span>
      </div>

      {expanded && (
        <div style={{
          marginLeft: 22,
          borderLeft: '1px solid var(--border-default)',
          marginBottom: 4,
        }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ── Tree file row ──────────────────────────────────────────────────────────────

function FileRow({ file, selected, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 12px 6px 14px',
        cursor: 'pointer',
        background: selected ? 'var(--bg-active)' : hovered ? 'var(--bg-active)' : 'transparent',
        borderLeft: selected ? '2px solid #FF7056' : '2px solid transparent',
        transition: 'background 120ms ease, border-color 120ms ease',
        userSelect: 'none',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <FileTextIcon />
      </span>
      <span style={{
        fontSize: 12,
        color: 'var(--text-primary)',
        fontFamily: "'Byrd', sans-serif",
        fontWeight: selected ? 500 : 400,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {file.name}
      </span>
    </div>
  )
}

// ── Document viewer ────────────────────────────────────────────────────────────

function DocViewer({ file }) {
  if (!file) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 10, color: 'var(--text-secondary)',
      }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.3">
          <rect x="8" y="4" width="20" height="28" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none" />
          <path d="M13 12h12M13 17h12M13 22h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 13, fontFamily: "'Byrd', sans-serif" }}>Select a file to view</span>
      </div>
    )
  }

  return (
    <div style={{
      flex: 1, overflowY: 'auto', padding: '28px 36px',
    }}>
      <pre style={{
        margin: 0,
        fontFamily: "'Byrd', sans-serif",
        fontSize: 13,
        lineHeight: '1.75',
        color: 'var(--text-primary)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {file.content}
      </pre>
    </div>
  )
}

// ── Shared ItemRow primitives (mirrors CreateSignalPage) ──────────────────────

function GDragHandle() {
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
      <circle cx="4" cy="4"  r="1.2" fill="currentColor" />
      <circle cx="8" cy="4"  r="1.2" fill="currentColor" />
      <circle cx="4" cy="8"  r="1.2" fill="currentColor" />
      <circle cx="8" cy="8"  r="1.2" fill="currentColor" />
      <circle cx="4" cy="12" r="1.2" fill="currentColor" />
      <circle cx="8" cy="12" r="1.2" fill="currentColor" />
    </svg>
  )
}

function GTrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M1.5 3.5h10M5 3.5V2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M10.5 3.5l-.7 7a1 1 0 0 1-1 .9H4.2a1 1 0 0 1-1-.9l-.7-7"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GChevronIcon({ open }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
      style={{ transition: 'transform 200ms ease', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GPlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const gInputBase = {
  width: '100%', boxSizing: 'border-box',
  background: 'var(--bg-canvas)', border: '1.5px solid var(--border-strong, var(--k-border))',
  borderRadius: 8, fontSize: 13, color: 'var(--text-primary)',
  fontFamily: "'Byrd', sans-serif", outline: 'none',
  transition: 'border-color 150ms ease',
}
function gFocusBorder(e) { e.currentTarget.style.borderColor = 'var(--b100)' }
function gBlurBorder(e)  { e.currentTarget.style.borderColor = 'var(--border-input)' }

// ── Glossary item row (same pattern as SignalItemRow in CreateSignalPage) ──────

function GlossaryItemRow({ item, onDelete }) {
  const [open, setOpen]           = useState(false)
  const [rowLabel, setRowLabel]   = useState(item.term)
  const [term, setTerm]           = useState(item.term)
  const [definition, setDefinition] = useState(item.definition)

  function handleTermChange(val) {
    setTerm(val)
    setRowLabel(val)
  }

  return (
    <div style={{
      border: '1.5px solid var(--border-strong, var(--k-border))',
      borderRadius: 10,
      background: 'var(--bg-canvas)',
    }}>
      {/* Header row */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setOpen(o => !o)}
      >
        <span style={{ color: 'var(--text-muted)', cursor: 'grab', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          <GDragHandle />
        </span>
        <input
          value={rowLabel}
          onChange={e => setRowLabel(e.target.value)}
          onClick={e => e.stopPropagation()}
          style={{
            flex: 1, fontSize: 13, fontWeight: 500,
            color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif",
            background: 'none', border: 'none', outline: 'none',
            padding: '2px 4px', borderRadius: 4, cursor: 'text',
            transition: 'background 120ms ease',
          }}
          onFocus={e => { e.currentTarget.style.background = 'var(--bg-active)' }}
          onBlur={e => { e.currentTarget.style.background = 'none' }}
        />
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 24, height: 24, borderRadius: 5,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', flexShrink: 0,
            transition: 'color 120ms ease, background 120ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#E53E3E'; e.currentTarget.style.background = 'rgba(229,62,62,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none' }}
        >
          <GTrashIcon />
        </button>
        <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          <GChevronIcon open={open} />
        </span>
      </div>

      {/* Expanded body */}
      {open && (
        <div style={{
          borderTop: '1px solid var(--border-default)',
          padding: '14px 12px 16px',
          display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 12,
        }}>
          <input
            value={term}
            onChange={e => handleTermChange(e.target.value)}
            placeholder="Term"
            style={{ ...gInputBase, height: 34, padding: '0 10px', fontSize: 13 }}
            onFocus={gFocusBorder}
            onBlur={gBlurBorder}
          />
          <textarea
            value={definition}
            onChange={e => setDefinition(e.target.value)}
            placeholder="Definition — describe what this term means in the context of your operations."
            style={{
              ...gInputBase, padding: '9px 11px',
              height: '100%', minHeight: 90,
              resize: 'vertical', lineHeight: 1.6,
            }}
            onFocus={gFocusBorder}
            onBlur={gBlurBorder}
          />
        </div>
      )}
    </div>
  )
}

// ── Glossary editor (right-panel view) ────────────────────────────────────────

function GlossaryEditor({ items, setItems }) {
  function addItem() {
    setItems([...items, { id: `g-${Date.now()}`, term: 'New Term', definition: '' }])
  }
  function deleteItem(id) {
    setItems(items.filter(i => i.id !== id))
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.length === 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 10, color: 'var(--text-secondary)',
          paddingTop: 40,
        }}>
          <span style={{ fontSize: 13, fontFamily: "'Byrd', sans-serif", fontStyle: 'italic' }}>No terms yet — add one below.</span>
        </div>
      )}

      {items.map(item => (
        <GlossaryItemRow key={item.id} item={item} onDelete={() => deleteItem(item.id)} />
      ))}

      <button
        onClick={addItem}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          width: '100%', height: 40, marginTop: 4,
          background: 'none', border: '1.5px dashed var(--border-default)',
          borderRadius: 10, cursor: 'pointer',
          fontSize: 13, color: 'var(--text-secondary)',
          fontFamily: "'Byrd', sans-serif",
          transition: 'border-color 150ms ease, color 150ms ease, background 150ms ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--c100)'
          e.currentTarget.style.color = 'var(--c100)'
          e.currentTarget.style.background = 'rgba(255,112,86,0.04)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border-default)'
          e.currentTarget.style.color = 'var(--text-secondary)'
          e.currentTarget.style.background = 'none'
        }}
      >
        <GPlusIcon /> New Term
      </button>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function KnowledgePage({
  sidebarWidth = 0,
  sidebarTransition = 'left 280ms ease',
}) {
  const [activeSection, setActiveSection]         = useState('documents') // 'documents' | 'glossary'
  const [selectedFile, setSelectedFile]           = useState(MOCK_TREE[0].children[0])
  const [selectedGlossary, setSelectedGlossary]   = useState(null)
  const [glossaries, setGlossaries]               = useState(MOCK_GLOSSARIES)
  const [expandedFolders, setExpandedFolders]     = useState({
    'folder-babcom': true,
    'folder-compliance': true,
    'folder-training': false,
    'folder-product': false,
  })
  const [docsExpanded, setDocsExpanded]           = useState(true)
  const [glossaryExpanded, setGlossaryExpanded]   = useState(true)
  const [searchValue, setSearchValue]             = useState('')
  const [searchFocused, setSearchFocused]         = useState(false)

  function selectFile(file) {
    setSelectedFile(file)
    setSelectedGlossary(null)
    setActiveSection('documents')
  }

  function openGlossary(glossary) {
    setSelectedGlossary(glossary)
    setSelectedFile(null)
    setActiveSection('glossary')
  }

  function updateGlossaryItems(glossaryId, newItems) {
    setGlossaries(prev => prev.map(g => g.id === glossaryId ? { ...g, items: newItems } : g))
    if (selectedGlossary?.id === glossaryId) {
      setSelectedGlossary(prev => ({ ...prev, items: newItems }))
    }
  }

  function toggleFolder(id) {
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const LEFT_W = 268

  return (
    <>
    <style>{`
      :root       { --k-border: #D4D6D9; }
      [data-theme="dark"] { --k-border: #3C3C3C; }
    `}</style>
    <div
      data-inspector="KnowledgePage"
      style={{
        position: 'fixed', top: 0,
        left: sidebarWidth, right: 0, bottom: 0,
        transition: sidebarTransition,
        background: 'var(--bg-canvas)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}
    >

      {/* ── Header ── */}
      <PageHeader
        title="Knowledge"
        crumbs={(selectedFile || selectedGlossary) ? [selectedGlossary ? selectedGlossary.name : selectedFile.name] : []}
        actions={
          <>
            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '0 12px', height: 32,
              background: 'var(--bg-canvas)',
              border: `1px solid ${searchFocused ? '#1779F7' : 'var(--border-default)'}`,
              borderRadius: 8,
              transition: 'border-color 160ms ease',
              minWidth: 200,
            }}>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  border: 'none', outline: 'none', background: 'transparent',
                  fontSize: 12, color: 'var(--text-primary)',
                  fontFamily: "'Byrd', sans-serif",
                  width: '100%',
                }}
              />
            </div>

            {/* Format Content button */}
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '0 14px', height: 32,
                background: '#FF7056', color: '#fff',
                border: 'none', borderRadius: 8,
                fontSize: 12, fontWeight: 600,
                fontFamily: "'Byrd', sans-serif",
                cursor: 'pointer', flexShrink: 0,
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e85f44' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FF7056' }}
            >
              <FormatIcon />
              Format Content
            </button>

            {/* More menu */}
            <KMoreMenu />
          </>
        }
      />

      {/* ── Body ── */}
      <div style={{
        flex: 1,
        display: 'flex', overflow: 'hidden',
        margin: '12px 16px 16px',
        borderRadius: 12,
        border: '1px solid var(--border-default)',
        background: 'var(--bg-sidebar)',
      }}>

        {/* Left panel — file tree */}
        <div
          data-inspector="KnowledgeFileTree"
          style={{
            width: LEFT_W, flexShrink: 0,
            display: 'flex', flexDirection: 'column',
            borderRight: '1px solid var(--border-default)',
            overflowY: 'auto',
          }}
        >
          {/* Documents section */}
          <SectionHeader
            label="Documents"
            expanded={docsExpanded}
            onToggle={() => setDocsExpanded(v => !v)}
          />
          {docsExpanded && (
            <div>
              {MOCK_TREE.map(folder => (
                <FolderRow
                  key={folder.id}
                  folder={folder}
                  expanded={!!expandedFolders[folder.id]}
                  onToggle={() => toggleFolder(folder.id)}
                >
                  {folder.children.map(file => (
                    <FileRow
                      key={file.id}
                      file={file}
                      selected={activeSection === 'documents' && selectedFile?.id === file.id}
                      onClick={() => selectFile(file)}
                    />
                  ))}
                </FolderRow>
              ))}
            </div>
          )}

          {/* Glossary section */}
          <div style={{ borderTop: '1px solid var(--border-default)', margin: '8px 0 0' }} />
          <SectionHeader
            label="Glossary"
            expanded={glossaryExpanded}
            active={activeSection === 'glossary'}
            onToggle={() => setGlossaryExpanded(v => !v)}
          />
          {glossaryExpanded && (
            <div>
              {glossaries.map(g => (
                <FileRow
                  key={g.id}
                  file={{ id: g.id, name: g.name }}
                  selected={activeSection === 'glossary' && selectedGlossary?.id === g.id}
                  onClick={() => openGlossary(g)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right panel — document viewer / glossary editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-canvas)' }}>
          {activeSection === 'glossary' && selectedGlossary
            ? <GlossaryEditor
                key={selectedGlossary.id}
                items={selectedGlossary.items}
                setItems={newItems => updateGlossaryItems(selectedGlossary.id, newItems)}
              />
            : <DocViewer file={selectedFile} />
          }
        </div>
      </div>
    </div>
    </>
  )
}
