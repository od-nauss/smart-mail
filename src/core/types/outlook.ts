export interface OutlookAuthConfig {
  clientId: string;
  tenantId: string;
  redirectUri: string;
}

export interface OutlookSendPayload {
  to: string[];
  cc?: string[];
  subject: string;
  htmlBody: string;
}
