export interface AppCard {
  icon: string;
  name: string;
  description: string;
  badges: string[];
  /** Live web app. Empty string renders the button as "coming soon". */
  url: string;
  /** Android APK. Empty string renders the button as "coming soon". */
  apkUrl: string;
  /** Shown under the buttons for iPhone users. */
  iosHint?: string;
}
