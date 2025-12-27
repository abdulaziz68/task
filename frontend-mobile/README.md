# Task Linker Mobile App

React Native mobile application for Task Linker.

## Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for macOS) or Android Studio (for Android development)

## Installation

```bash
npm install
```

## Running the App

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## Configuration

Update the API URL in `App.tsx`:

```typescript
const API_URL = 'http://YOUR_IP_ADDRESS:5000/api';
```

Replace `YOUR_IP_ADDRESS` with your machine's IP address for local testing.

## Features

- ✅ User authentication
- ✅ Dashboard with statistics
- ✅ Shop Drawings list
- ✅ RFIs list
- ✅ Meeting Minutes list
- ✅ Engineers list
- ✅ Tasks list with linked items
- ✅ Pull to refresh
- ✅ Native navigation

## Building for Production

```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios
```

## Troubleshooting

If you encounter connection issues:
1. Make sure your mobile device and development machine are on the same network
2. Use your machine's IP address instead of localhost
3. Check if the backend API is running and accessible
