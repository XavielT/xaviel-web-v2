export interface AppCard {
  icon: string;
  name: string;
  description: string;
  badges: string[];
  /** Live web app. Empty string renders the button as "coming soon". */
  url: string;
  /** Android APK. Empty string renders the button as "coming soon". */
  apkUrl: string;
  /** Optional direct download of the .apk asset, shown as a small text link. */
  apkDirectUrl?: string;
  /** Shown under the buttons for iPhone users. */
  iosHint?: string;
}
