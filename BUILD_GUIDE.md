# 📱 MCX Studios24 - Sudoku Master APK Build Guide

## 🎯 Overview
This guide will help you build your Sudoku Master app into an APK file ready for distribution.

## ✅ Pre-Build Checklist

### 1. **Google AdMob Configuration** ✅
- **App ID**: `ca-app-pub-9992987709866316~3478776009` (configured)
- **Interstitial Ad Unit**: `ca-app-pub-9992987709866316/8112155581` (configured)
- **Rewarded Ad Unit**: `ca-app-pub-9992987709866316/2345678901` ⚠️ **PLACEHOLDER - UPDATE THIS!**

### 2. **App Metadata** ✅
- **Package Name**: `com.mcxstudios24.sudokumaster`
- **App Name**: "Sudoku Master"
- **Version**: 1.0.0
- **Version Code**: 1

### 3. **Assets** ✅
- **App Icon**: `assets/images/icon.png`
- **MCX Studios Logo**: `assets/images/mcx-logo.png`
- **Adaptive Icon**: Configured for Android

## 🔧 Setup Requirements

### Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

### Login to Expo
```bash
eas login
```

## 🚀 Building the APK

### Option 1: Preview Build (for testing)
```bash
npm run build:android:preview
```

### Option 2: Production Build (for release)
```bash
npm run build:android:production
```

### Manual EAS Commands
```bash
# Preview APK
eas build --platform android --profile preview

# Production APK
eas build --platform android --profile production
```

## ⚠️ Important: Update Your Real Ad Unit IDs

Before building for production, you MUST update the placeholder ad unit ID:

### File: `components/AdMobRewardedAd.tsx`
```typescript
// Replace this placeholder with your real rewarded ad unit ID
const REWARDED_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-9992987709866316/YOUR_REAL_IOS_REWARDED_ID',
  android: 'ca-app-pub-9992987709866316/YOUR_REAL_ANDROID_REWARDED_ID',
  default: 'ca-app-pub-9992987709866316/YOUR_REAL_REWARDED_ID',
});
```

## 🎮 Ad Configuration Summary

### Current Production Ad IDs:
- **App ID**: `ca-app-pub-9992987709866316~3478776009`
- **Interstitial Ads**: `ca-app-pub-9992987709866316/8112155581`
- **Rewarded Ads**: `ca-app-pub-9992987709866316/2345678901` ⚠️ **UPDATE THIS**

### Development vs Production
- **Development**: Uses Google test ad units
- **Production**: Uses your real AdMob ad units
- **Switching**: Automatic based on `__DEV__` flag

## 📦 Build Process

1. **Run build command**
2. **EAS will:**
   - Upload your code to Expo servers
   - Build the APK in the cloud
   - Provide download link when complete
3. **Download APK** from the provided link
4. **Test APK** on device before release

## 🔍 Testing the APK

### Before Release:
- [ ] Install APK on Android device
- [ ] Test all game functionality
- [ ] Verify ads are showing (production ads)
- [ ] Test hint system with rewarded videos
- [ ] Check all interstitial ad placements
- [ ] Verify MCX Studios24 splash screen
- [ ] Test settings and history features

## 📱 Distribution Options

### Direct Distribution:
- Send APK file directly to users
- Users need to enable "Unknown sources" in Android settings

### Google Play Store:
- Convert APK to AAB format: `eas build --platform android --profile production`
- Upload to Google Play Console

## 🐛 Common Issues

### Build Fails:
- Check Expo account limits
- Verify all dependencies are compatible
- Check for TypeScript errors: `npx tsc --noEmit`

### Ads Not Showing:
- Verify ad unit IDs are correct
- Check AdMob account is approved
- Ensure app package name matches AdMob settings

### App Crashes:
- Check native dependencies
- Verify Android permissions
- Test in development first

## 📋 Final Checklist

Before submitting to app stores:
- [ ] Real ad unit IDs configured
- [ ] App tested thoroughly on device
- [ ] Icons and branding correct
- [ ] Version numbers updated
- [ ] Privacy policy prepared (for ads)
- [ ] App description written

## 🎯 Quick Build Commands

```bash
# 1. Prepare environment
npm install -g @expo/eas-cli
eas login

# 2. Build preview APK (recommended first)
npm run build:android:preview

# 3. Build production APK (when ready)
npm run build:android:production
```

## 🎮 MCX Studios24 Branding

Your app includes:
- ✅ MCX Studios24 splash screen with particles
- ✅ Professional game interface
- ✅ Comprehensive ad monetization
- ✅ Game history and statistics
- ✅ Settings and customization
- ✅ Hint system with rewarded ads

---

**Ready to build your Sudoku Master APK!** 🚀

Run `npm run build:android:preview` to get started!
