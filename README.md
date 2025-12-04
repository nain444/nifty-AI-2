# NIFTY AI Mobile Trading App 📱

AI-powered intraday trading signal system for NIFTY 50 Index with Android APK support.

## Features ✨

- **AI-Powered Signals**: CALL, PUT, and EXIT signals based on 8 technical indicators
- **News Sentiment Analysis**: Real-time Moneycontrol news integration
- **Auto-Refresh**: Updates every 10 seconds
- **Signal History**: Track last 3 days of signals with winner/loser status
- **Mobile Optimized**: Touch-friendly UI designed for Android phones
- **Sound Alerts**: Audio notifications for new signals

## Technical Indicators 📊

1. RSI (Relative Strength Index)
2. MACD (Moving Average Convergence Divergence)
3. EMA (Exponential Moving Average)
4. Bollinger Bands
5. ADX (Average Directional Index)
6. Stochastic Oscillator
7. VWAP (Volume Weighted Average Price)
8. SuperTrend

## Installation 📲

### Download APK
1. Go to [Releases](https://github.com/nain444/nifty-AI-2/releases)
2. Download the latest `app-debug.apk`
3. Copy to your Android phone
4. Enable "Install from Unknown Sources" in Settings
5. Install the APK

### Build from Source
See [BUILD-APK-GUIDE.md](BUILD-APK-GUIDE.md) for detailed instructions.

## Usage 🚀

1. Open the app on your Android phone
2. Tap the **START SIGNALS** button
3. Wait for AI analysis to complete
4. View signals in the Signals tab
5. Check history in the History tab
6. Review AI reasoning in the Analysis tab

## How It Works 🧠

The AI engine analyzes:
- **Technical Indicators**: 8 different indicators with weighted scoring
- **News Sentiment**: Moneycontrol RSS feed analysis
- **Market Trends**: EMA crossovers, trend strength, momentum
- **Risk Assessment**: Volatility, overbought/oversold conditions

Signals are generated when multiple indicators align with high confidence.

## Development 🛠️

```bash
# Install dependencies
npm install

# Run development server
npm start

# Build for Android
npm run build
npx cap sync android
npx cap open android
```

## Technologies Used 💻

- **Frontend**: HTML5, CSS3, JavaScript (Pure JS, no frameworks)
- **Mobile**: Capacitor for Android packaging
- **Indicators**: Custom implementations of all technical indicators
- **News**: Moneycontrol RSS feed scraping
- **Sentiment**: Basic sentiment analysis algorithm

## License 📄

MIT License - Feel free to use and modify!

## Disclaimer ⚠️

This app is for educational purposes only. Trading involves risk. Always do your own research and consult with financial advisors before making trading decisions.

---

Made with ❤️ for NIFTY traders
