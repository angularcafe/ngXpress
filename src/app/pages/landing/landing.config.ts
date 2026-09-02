import { APP_NAME, APP_TAGLINE } from '@core/config/app-brand';

export type LandingNavLink = {
  label: string;
  href: string;
};

export type LandingFeature = {
  icon: string;
  title: string;
  description: string;
};

export type LandingStep = {
  step: number;
  title: string;
  description: string;
};

export type LandingPricingTier = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: readonly string[];
  highlighted?: boolean;
  ctaLabel: string;
};

export type LandingTestimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export type LandingFaqItem = {
  question: string;
  answer: string;
};

export type LandingFooterColumn = {
  title: string;
  links: readonly { label: string; href: string }[];
};

/** Edit this object to customize all landing page content. */
export const LANDING_CONFIG = {
  meta: {
    title: `${APP_NAME} — Issue tracking for focused teams`,
    description: APP_TAGLINE,
  },
  nav: [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ] satisfies readonly LandingNavLink[],
  hero: {
    badge: 'Now with Cycles & Roadmaps',
    title: 'Issue tracking for teams that ship',
    subtitle:
      'Stride helps product teams plan sprints, track issues, and move work forward — with the speed and clarity of a tool built for makers.',
    primaryCta: 'Start for free',
    secondaryCta: 'See how it works',
    secondaryHref: '#how-it-works',
  },
  logos: {
    title: 'Trusted by high-performing product teams',
    companies: ['Vercel', 'Raycast', 'Loom', 'Notion', 'Figma', 'Stripe'],
  },
  features: {
    title: 'Built for how teams actually work',
    subtitle: 'Everything you need to plan, prioritize, and deliver — without switching tools.',
    items: [
      {
        icon: 'lucideListTodo',
        title: 'Issue tracking',
        description:
          'Create, assign, and prioritize tasks with statuses, due dates, and rich context — all in one place.',
      },
      {
        icon: 'lucideKanban',
        title: 'Boards & backlogs',
        description:
          'Visualize work on kanban boards or triage from a backlog. Drag, drop, and ship.',
      },
      {
        icon: 'lucideZap',
        title: 'Keyboard-first',
        description:
          'Fly through your workflow with shortcuts for creating issues, changing status, and navigating views.',
      },
      {
        icon: 'lucideUsers',
        title: 'Team collaboration',
        description:
          'Assign owners, leave comments, and keep everyone aligned without endless standup meetings.',
      },
      {
        icon: 'lucideBarChart3',
        title: 'Cycles & insights',
        description:
          'Run time-boxed sprints with cycle views and track velocity, burndown, and team progress.',
      },
      {
        icon: 'lucideBell',
        title: 'Smart notifications',
        description:
          'Stay in the loop on what matters — mentions, assignments, and status changes, not noise.',
      },
    ] satisfies readonly LandingFeature[],
  },
  howItWorks: {
    title: 'From idea to done',
    subtitle: 'Three steps to get your team moving.',
    steps: [
      {
        step: 1,
        title: 'Capture work',
        description: 'Log issues, bugs, and ideas as they come up. Add context, priority, and assignees in seconds.',
      },
      {
        step: 2,
        title: 'Plan your cycle',
        description: 'Pull items into a sprint, set deadlines, and organize your board by status or priority.',
      },
      {
        step: 3,
        title: 'Ship with clarity',
        description: 'Track progress in real time, close out work, and review what your team delivered.',
      },
    ] satisfies readonly LandingStep[],
  },
  pricing: {
    title: 'Simple, transparent pricing',
    subtitle: 'Start free. Upgrade when your team grows.',
    tiers: [
      {
        name: 'Free',
        price: '$0',
        period: '/month',
        description: 'For individuals and small teams getting started.',
        features: [
          'Up to 5 team members',
          'Unlimited issues',
          'Kanban boards',
          'Basic notifications',
        ],
        ctaLabel: 'Get started',
      },
      {
        name: 'Pro',
        price: '$12',
        period: '/user/month',
        description: 'For growing teams that need more power.',
        features: [
          'Unlimited team members',
          'Cycles & roadmaps',
          'Advanced filters',
          'Priority support',
          'Custom workflows',
        ],
        highlighted: true,
        ctaLabel: 'Start free trial',
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For organizations with advanced security needs.',
        features: [
          'SSO & SAML',
          'Audit logs',
          'Dedicated support',
          'SLA guarantee',
          'Custom integrations',
        ],
        ctaLabel: 'Contact sales',
      },
    ] satisfies readonly LandingPricingTier[],
  },
  testimonials: {
    title: 'Loved by product teams',
    subtitle: 'See why teams switch to Stride for their daily workflow.',
    items: [
      {
        quote:
          'We replaced three tools with Stride. Our sprint planning went from an hour to fifteen minutes.',
        name: 'Sarah Chen',
        role: 'Head of Product, Nova Labs',
        initials: 'SC',
      },
      {
        quote:
          'The keyboard shortcuts alone saved our eng team hours every week. It just feels fast.',
        name: 'Marcus Rivera',
        role: 'Engineering Lead, Stackline',
        initials: 'MR',
      },
      {
        quote:
          'Finally an issue tracker that doesn\'t get in the way. Clean UI, zero clutter.',
        name: 'Elena Kowalski',
        role: 'Design Director, Brightpath',
        initials: 'EK',
      },
    ] satisfies readonly LandingTestimonial[],
  },
  faq: {
    title: 'Frequently asked questions',
    subtitle: 'Everything you need to know before getting started.',
    items: [
      {
        question: 'How is Stride different from other issue trackers?',
        answer:
          'Stride is built for speed and focus. No bloated features, no cluttered UI — just a fast, keyboard-friendly tool for tracking and shipping work.',
      },
      {
        question: 'Can I migrate from Jira, Linear, or Asana?',
        answer:
          'Yes. Stride supports CSV import for issues and projects. Our team can also help with larger migrations on Pro and Enterprise plans.',
      },
      {
        question: 'Is there a free plan?',
        answer:
          'Absolutely. The free plan includes unlimited issues, kanban boards, and up to 5 team members — no credit card required.',
      },
      {
        question: 'Does Stride support sprints and cycles?',
        answer:
          'Yes. Pro and Enterprise plans include Cycles for time-boxed sprints, plus roadmap views to plan work across quarters.',
      },
      {
        question: 'Can I use Stride on mobile?',
        answer:
          'Stride is fully responsive and works great on tablets and phones. A dedicated mobile app is on our roadmap.',
      },
    ] satisfies readonly LandingFaqItem[],
  },
  cta: {
    title: 'Ready to ship faster?',
    subtitle: 'Join thousands of teams using Stride to plan, track, and deliver great work.',
    primaryCta: 'Get started for free',
    secondaryCta: 'Sign in',
  },
  footer: {
    tagline: APP_TAGLINE,
    columns: [
      {
        title: 'Product',
        links: [
          { label: 'Features', href: '#features' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'Changelog', href: '#' },
          { label: 'Roadmap', href: '#' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: '#' },
          { label: 'Blog', href: '#' },
          { label: 'Careers', href: '#' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy', href: '#' },
          { label: 'Terms', href: '#' },
        ],
      },
    ] satisfies readonly LandingFooterColumn[],
  },
} as const;
