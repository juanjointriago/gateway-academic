export interface IAppInfo {
  id?: string;
  appName: string;
  version: string;
  buildNumber: string;
  description: string;
  supportEmail: string;
  supportPhone?: string;
  termsUrl?: string;
  address?: string;
  privacyPolicyUrl?: string;
  disableCurrencyResume: boolean;
  disableFeesButton: boolean;
  generalDirectorName: string
  webSyte?:string;
  createdAt: number;
  updatedAt: number;
}