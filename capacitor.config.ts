import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.telierlabs.puslink',
  appName: 'Puslink',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      overlaysWebView: true,
      style: 'LIGHT',
      backgroundColor: '#00000000'
    }
  }
};

export default config;
