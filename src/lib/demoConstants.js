export const DEMO_INV_PROFILE = {
  id: 'demo-company',
  user_email: '',
  name: 'Demo inv',
  subtitle: 'Default environment',
  color: '#1779F7',
  config: {
    companyName: 'Demo inv',
    industry: 'Enterprise SaaS',
    keyProducts: ['Platform', 'Analytics', 'Integrations'],
    commonTopics: ['Pricing', 'Support', 'Onboarding', 'Compliance', 'Performance', 'Escalations', 'Sentiment', 'Agent Evaluation'],
    suggestedPrompts: [
      'Who are my top performing agents this month?',
      'Show me trending topics from the last 24 hours',
      'Which calls had the highest risk score this week?',
      'Summarize customer sentiment from today\'s calls',
      'What are the most common complaints in the last 7 days?',
      'Which agent has the lowest CSAT score this month?',
      'Show me all calls flagged for compliance review',
      'What topics are spiking in enterprise accounts?',
    ],
  },
}

export function withDemoInv(list) {
  return [DEMO_INV_PROFILE, ...list.filter(p => p.id !== 'demo-company')]
}
