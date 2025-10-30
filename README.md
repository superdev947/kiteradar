# Kiteradar

A React Native mobile application for kite surfing enthusiasts. Track spots, equipment, and connect with other kiters.

## Features

- Radar system for finding kite spots and other kiters
- Equipment marketplace
- Lost and found section
- Chat system
- User profiles
- Real-time notifications
- Location-based filtering
- Image handling and gallery support
- Multi-language support

## Prerequisites

Before you begin, ensure you have installed:

- Node.js
- npm or yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS dependencies)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/superdev947/kiteradar.git
cd kiteradar
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. iOS specific setup:
```bash
cd ios
pod install
cd ..
```

## Running the App

### iOS

```bash
npm run ios
# or
yarn ios
```

### Android

```bash
npm run android
# or
yarn android
```

## Development Scripts

- `npm start` - Start the Metro bundler
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Tech Stack

- React Native (v0.63.3)
- Redux + Redux Saga for state management
- React Navigation v5 for routing
- Axios for API requests
- React Native Vector Icons
- Various React Native community packages for enhanced functionality

## Project Structure

```
src/
├── assets/         # Static assets (images, fonts, icons)
├── components/     # Reusable components
├── pages/         # Screen components
├── services/      # API and external services
├── store/         # Redux store configuration and modules
├── styles/        # Global styles and theme
└── utils/         # Utility functions and helpers
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
