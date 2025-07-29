export interface IAppInfo {
  id?: string;
  appName: string;
  version: string;
  buildNumber: string;
  description: string;
  supportEmail: string;
  supportPhone?: string;
  termsUrl?: string;
  privacyPolicyUrl?: string;
  disableCurrencyResume: boolean;
  disableFeesButton: boolean;
  createdAt: number;
  updatedAt: number;
}