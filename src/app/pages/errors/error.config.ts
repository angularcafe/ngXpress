export type ErrorAction = {
  label: string;
  link?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  reload?: boolean;
  back?: boolean;
};

export type ErrorPageConfig = {
  code: string;
  title: string;
  description: string;
  icon: string;
  actions: ErrorAction[];
};

export const NOT_FOUND_ERROR: ErrorPageConfig = {
  code: '404',
  title: 'Page not found',
  description:
    'The page you are looking for does not exist, may have been moved, or the link might be outdated.',
  icon: 'lucideSearchX',
  actions: [
    { label: 'Go home', link: '/', variant: 'default' },
    { label: 'Sign in', link: '/auth/login', variant: 'outline' },
  ],
};

export const FORBIDDEN_ERROR: ErrorPageConfig = {
  code: '403',
  title: 'Access denied',
  description:
    'You do not have permission to view this page. If you believe this is a mistake, contact your workspace administrator.',
  icon: 'lucideShieldOff',
  actions: [
    { label: 'Go to dashboard', link: '/admin/dashboard', variant: 'default' },
    { label: 'Go home', link: '/', variant: 'outline' },
  ],
};

export const SERVER_ERROR: ErrorPageConfig = {
  code: '500',
  title: 'Something went wrong',
  description:
    'We ran into an unexpected problem on our end. Our team has been notified and we are working to fix it.',
  icon: 'lucideServerCrash',
  actions: [
    { label: 'Try again', reload: true, variant: 'default' },
    { label: 'Go home', link: '/', variant: 'outline' },
  ],
};

export const MAINTENANCE_ERROR: ErrorPageConfig = {
  code: '503',
  title: 'Under maintenance',
  description:
    'We are performing scheduled maintenance to improve your experience. Please check back shortly.',
  icon: 'lucideConstruction',
  actions: [
    { label: 'Try again', reload: true, variant: 'default' },
    { label: 'Go home', link: '/', variant: 'outline' },
  ],
};
