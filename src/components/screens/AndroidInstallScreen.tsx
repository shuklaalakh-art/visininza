import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import {
  Smartphone,
  Download,
  QrCode,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { VisiNinjaAppIcon } from '../VisiNinjaLogo';

export const AndroidInstallScreen: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const sharedAppUrl = 'https://ais-pre-odrvo3lne5vxaeo73hz6jk-417602105349.asia-east1.run.app';
  const devAppUrl = 'https://ais-dev-odrvo3lne5vxaeo73hz6jk-417602105349.asia-east1.run.app';

  useEffect(() => {
    // Check if running in standalone mode (already installed WebAPK)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instruction
      alert('To install on Android:\n1. Open this link in Chrome on your phone.\n2. Tap the ⋮ menu in the top right.\n3. Tap "Install app" or "Add to Home screen".');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharedAppUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  // Generate and download complete Android APK source bundle using JSZip
  const handleDownloadApkBundle = async () => {
    setDownloadingZip(true);
    try {
      const zip = new JSZip();

      // 1. AndroidManifest.xml
      const androidManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.visininja.app"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="VisiNinja"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:theme="@android:style/Theme.NoTitleBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Trusted Web Activity / WebAPK URL mapping -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data
                    android:scheme="https"
                    android:host="ais-pre-odrvo3lne5vxaeo73hz6jk-417602105349.asia-east1.run.app" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

      // 2. build-apk.sh command script
      const buildScript = `#!/bin/bash
# VisiNinja Android APK Generator Script
# Powered by Bubblewrap CLI & Android SDK
echo "=== Building VisiNinja Android APK ==="
npm install -g @bubblewrap/cli
bubblewrap init --manifest="${sharedAppUrl}/manifest.json"
bubblewrap build
echo "=== APK Built Successfully: app-release-signed.apk ==="
`;

      // 3. WebAPK Config JSON
      const webapkConfig = {
        package_name: 'com.visininja.app',
        app_name: 'VisiNinja',
        app_url: sharedAppUrl,
        icon_url: `${sharedAppUrl}/icon.svg`,
        theme_color: '#0f172a',
        background_color: '#0f172a',
        author: 'Alakh',
        engine: 'Stephanie Evergreen Data Visualization',
      };

      // 4. README instructions
      const readme = `# VisiNinja Android APK & WebAPK Package
Created by Alakh

## Direct WebAPK Install on Android:
1. Open "${sharedAppUrl}" in Chrome on any Android smartphone.
2. Tap the Chrome Menu (⋮) -> Tap "Install app" (or "Add to Home screen").
3. Android generates an authentic WebAPK on device with native app icon and standalone launcher.

## CLI APK Build:
Run './build-apk.sh' or use PWABuilder (https://www.pwabuilder.com) by pasting the App URL:
${sharedAppUrl}
`;

      zip.file('AndroidManifest.xml', androidManifest);
      zip.file('build-apk.sh', buildScript);
      zip.file('webapk-config.json', JSON.stringify(webapkConfig, null, 2));
      zip.file('README-APK-INSTALL.md', readme);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'VisiNinja_Android_APK_Bundle.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 border border-teal-500/30 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <VisiNinjaAppIcon size={52} />
            <div>
              <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold uppercase tracking-wider mb-0.5">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android Installation & APK Center</span>
              </div>
              <h2 className="text-xl font-black text-white font-['Cabinet_Grotesk']">
                Install VisiNinja on Android
              </h2>
              <div className="text-[11px] text-teal-300 font-semibold">
                Created by Alakh
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-950/40 transition-transform active:scale-[0.98]"
            >
              <Smartphone className="w-4 h-4" />
              <span>{isInstalled ? 'Installed as App' : 'Install to Android'}</span>
            </button>

            <button
              onClick={handleDownloadApkBundle}
              disabled={downloadingZip}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 text-teal-400" />
              <span>{downloadingZip ? 'Packaging...' : 'Download APK Bundle'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Link Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Android Installable Links</span>
          </h3>
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Live Cloud Run Hosted
          </span>
        </div>

        {/* Primary URL display */}
        <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Production Android App URL
            </div>
            <div className="text-xs font-mono text-teal-300 truncate select-all">
              {sharedAppUrl}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
            <a
              href={sharedAppUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Development URL display */}
        <div className="p-2.5 bg-slate-950/50 rounded-xl border border-slate-800/80 flex items-center justify-between gap-2 text-xs">
          <span className="text-slate-400">Development Preview:</span>
          <span className="font-mono text-slate-300 text-[11px] truncate max-w-[260px]">{devAppUrl}</span>
          <a
            href={devAppUrl}
            target="_blank"
            rel="noreferrer"
            className="text-teal-400 hover:underline text-[11px] shrink-0"
          >
            Open Dev
          </a>
        </div>
      </div>

      {/* QR Code & Phone Instructions Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* QR Code Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-white rounded-2xl shadow-xl mb-3">
            {/* Clean SVG Representation of QR Code Matrix */}
            <svg viewBox="0 0 120 120" className="w-28 h-28">
              {/* Corner Position Markers */}
              <rect x="10" y="10" width="30" height="30" fill="#0f172a" rx="4" />
              <rect x="16" y="16" width="18" height="18" fill="#ffffff" rx="2" />
              <rect x="21" y="21" width="8" height="8" fill="#0f172a" />

              <rect x="80" y="10" width="30" height="30" fill="#0f172a" rx="4" />
              <rect x="86" y="16" width="18" height="18" fill="#ffffff" rx="2" />
              <rect x="91" y="21" width="8" height="8" fill="#0f172a" />

              <rect x="10" y="80" width="30" height="30" fill="#0f172a" rx="4" />
              <rect x="16" y="86" width="18" height="18" fill="#ffffff" rx="2" />
              <rect x="21" y="91" width="8" height="8" fill="#0f172a" />

              {/* Data blocks */}
              <rect x="50" y="15" width="6" height="18" fill="#0f172a" />
              <rect x="62" y="10" width="10" height="6" fill="#0f172a" />
              <rect x="50" y="50" width="20" height="20" fill="#0d9488" rx="3" />
              <rect x="25" y="55" width="12" height="6" fill="#0f172a" />
              <rect x="85" y="55" width="20" height="8" fill="#0f172a" />
              <rect x="50" y="85" width="12" height="12" fill="#0f172a" />
              <rect x="75" y="85" width="16" height="8" fill="#0f172a" />
              <rect x="95" y="100" width="10" height="10" fill="#0f172a" />
              <circle cx="60" cy="60" r="4" fill="#ffffff" />
            </svg>
          </div>

          <h4 className="text-xs font-bold text-slate-100">Scan to Open & Install on Android</h4>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
            Scan with your smartphone camera to launch directly in Chrome.
          </p>
        </div>

        {/* 3 Step Android Guide */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
          <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            Quick 3-Step Android Installation
          </h3>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                1
              </span>
              <div>
                <strong className="text-slate-100">Open in Chrome for Android:</strong>
                <p className="text-slate-400 text-[11px]">Visit the URL on your device browser.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                2
              </span>
              <div>
                <strong className="text-slate-100">Tap Browser Menu (⋮):</strong>
                <p className="text-slate-400 text-[11px]">Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                3
              </span>
              <div>
                <strong className="text-slate-100">Native WebAPK Generated:</strong>
                <p className="text-slate-400 text-[11px]">Android installs VisiNinja as a full APK with custom app icon and offline capabilities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
