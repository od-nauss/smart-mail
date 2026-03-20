import type { OutlookAuthConfig } from '@/core/types';

export function getOutlookConfig(): OutlookAuthConfig {
  return {
    clientId: process.env.MICROSOFT_CLIENT_ID || '',
    tenantId: process.env.MICROSOFT_TENANT_ID || '',
    redirectUri: process.env.MICROSOFT_REDIRECT_URI || ''
  };
}
