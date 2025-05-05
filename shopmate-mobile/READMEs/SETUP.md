# Setup and Project Running
## 1. Create the App with Tabs Template
```bash
    npx create-expo-app@latest shopmate-mobile --template tabs
```
This will create an Expo project named shopmate-mobile with pre-configured bottom tab navigation using react-navigation.

## 2. Folder Structure Overview
shopmate-mobile/
├── app/
│   ├── _layout.tsx         # Root navigator with tabs
│   ├── index.tsx           # Home tab
│   ├── shopping.tsx        # Sample second tab
│   └── ... (add more pages here)
├── assets/
├── package.json
├── app.config.ts
└── ...
The app/ directory handles navigation. Each file represents a screen (or nested layout) using File-based Routing powered by Expo Router.

## 3. Start and Run the App
```bash
    cd shopmate-mobile
    npx expo start
```
Use i, a, or w to run on iOS, Android, or Web.

if you do not have expo cli installed run
```bash
    npm install -g expo-cli
```