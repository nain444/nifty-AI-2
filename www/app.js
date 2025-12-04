// NIFTY AI Trading Engine - Mobile Version
// No external dependencies - Pure JavaScript

class AITradingEngine {
    constructor() {
        this.isRunning = false;
        this.priceData = [];
        this.newsData = [];
        this.signalHistory = [];
        this.currentPosition = null;
        this.entryTime = null;
        this.lastDecision = null;
        this.overallSentiment = 0;
        this.refreshInterval = 10;
        this.countdown = 10;
        
        this.init();
    }
    
    async init() {
        this.loadHistory();
        this.checkMarketStatus();
        this.updateHistoryDisplay();
        
        // Auto-start if market is open
        if (this.isMarketOpen()) {
            this.toggleSystem();
        }
    }
    
    isMarketOpen() {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const ist = new Date(now.getTime() + istOffset);
        const hours = ist.getUTCHours();
        const mins = ist.getUTCMinutes();
        const day = ist.getUTCDay();
        
        const open = (hours > 9 || (hours === 9 && mins >= 15)) && (hours < 15 || (hours === 15 && mins <= 30));
        return open && day >= 1 && day <= 5;
    }
    
    checkMarketStatus() {
        const isOpen = this.isMarketOpen();
        document.getElementById('marketDot').className = 'status-dot' + (isOpen ? '' : ' off');
        document.getElementById('marketStatus').textContent = isOpen ? 'Open' : 'Closed';
    }
    
    toggleSystem() {
        this.isRunning = !this.isRunning;
        const btn = document.getElementById('powerBtn');
        
        if (this.isRunning) {
            btn.className = 'power-btn';
            this.startEngine();
        } else {
            btn.className = 'power-btn off';
            this.stopEngine();
        }
    }
    
    startEngine() {
        this.fetchAllData();
        
        this.dataInterval = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                this.countdown = this.refreshInterval;
                this.fetchAllData();
            }
        }, 1000);
        
        this.marketInterval = setInterval(() => this.checkMarketStatus(), 60000);
    }
    
    stopEngine() {
        if (this.dataInterval) clearInterval(this.dataInterval);
        if (this.marketInterval) clearInterval(this.marketInterval);
        
        document.getElementById('decision').textContent = 'SYSTEM OFF';
        document.getElementById('decision').className = 'decision-value wait';
        document.getElementById('decisionBox').className = 'decision-card';
    }
    
    async fetchAllData() {
        try {
            await Promise.all([
                this.fetchPriceData(),
                this.fetchNews()
            ]);
            this.runAIAnalysis();
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
    
    async fetchPriceData() {
        try {
            // Use CORS proxy for mobile
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const yahooUrl = encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/^NSEI?interval=5m&range=2d');
            
            const response = await fetch(proxyUrl + yahooUrl);
            if (!response.ok) throw new Error('Fetch failed');
            
            const json = await response.json();
            const result = json.chart.result[0];
            const quotes = result.indicators.quote[0];
            const timestamps = result.timestamp || [];
            
            this.priceData = [];
            for (let i = 0; i < timestamps.length; i++) {
                if (quotes.close[i] !== null) {
                    this.priceData.push({
                        time: timestamps[i] * 1000,
                        open: quotes.open[i],
                        high: quotes.high[i],
                        low: quotes.low[i],
                        close: quotes.close[i],
                        volume: quotes.volume[i] || 0
                    });
                }
            }
            
            this.prevClose = result.meta?.previousClose || this.priceData[0]?.close || 0;
            this.updatePriceDisplay();
            
        } catch (e) {
            console.log('Using simulated data');
            this.generateSimulatedData();
        }
    }
    
    generateSimulatedData() {
        const base = 24500 + (Math.random() - 0.5) * 300;
        const now = Date.now();
        this.priceData = [];
        
        for (let i = 200; i >= 0; i--) {
            const time = now - (i * 5 * 60 * 1000);
            const trend = Math.sin(i / 20) * 40;
            const noise = (Math.random() - 0.5) * 30;
            const close = base + trend + noise;
            
            this.priceData.push({
                time,
                open: close + (Math.random() - 0.5) * 10,
                high: close + Math.random() * 15,
                low: close - Math.random() * 15,
                close,
                volume: Math.floor(50000 + Math.random() * 150000)
            });
        }
        this.prevClose = base - 30;
        this.updatePriceDisplay();
    }
    
    updatePriceDisplay() {
        if (this.priceData.length === 0) return;
        
        const current = this.priceData[this.priceData.length - 1].close;
        const change = current - this.prevClose;
        const changePct = ((change / this.prevClose) * 100).toFixed(2);
        
        const priceEl = document.getElementById('price');
        const changeEl = document.getElementById('priceChange');
        
        priceEl.textContent = current.toFixed(2);
        priceEl.className = 'price-value ' + (change >= 0 ? 'up' : 'down');
        
        const arrow = change >= 0 ? '▲' : '▼';
        changeEl.textContent = `${arrow} ${Math.abs(change).toFixed(2)} (${changePct}%)`;
        changeEl.style.color = change >= 0 ? '#3fb950' : '#f85149';
    }


    async fetchNews() {
        try {
            // Use simulated news for mobile (RSS requires server-side parsing)
            this.newsData = this.getSimulatedNews();
            this.analyzeNewsSentiment();
            this.updateNewsDisplay();
        } catch (e) {
            this.newsData = this.getSimulatedNews();
            this.analyzeNewsSentiment();
            this.updateNewsDisplay();
        }
    }
    
    getSimulatedNews() {
        const templates = [
            { title: 'Nifty opens higher amid positive global cues', bias: 1 },
            { title: 'FIIs turn net buyers, pump ₹2000 crore', bias: 1 },
            { title: 'IT stocks rally on strong Q3 expectations', bias: 1 },
            { title: 'Banking stocks under pressure on NPA concerns', bias: -1 },
            { title: 'Market volatile ahead of RBI policy decision', bias: 0 },
            { title: 'Nifty faces resistance at 24600 levels', bias: -0.5 },
            { title: 'DIIs continue buying spree for 5th session', bias: 1 },
            { title: 'Global markets mixed, Asian indices flat', bias: 0 },
            { title: 'Rupee strengthens against dollar, aids sentiment', bias: 0.5 },
            { title: 'Metal stocks surge on China stimulus hopes', bias: 1 }
        ];
        
        // Shuffle and pick random news
        const shuffled = templates.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 6).map(t => ({
            title: t.title,
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            sentiment: null,
            bias: t.bias
        }));
    }
    
    analyzeNewsSentiment() {
        let totalScore = 0;
        
        // Simple sentiment analysis without external library
        const positiveWords = ['rally', 'surge', 'jump', 'gain', 'rise', 'bullish', 'buy', 'higher', 'positive', 'strong', 'buyers'];
        const negativeWords = ['crash', 'plunge', 'tank', 'fall', 'drop', 'bearish', 'sell', 'lower', 'negative', 'weak', 'pressure', 'concerns'];
        
        this.newsData.forEach(news => {
            const lower = news.title.toLowerCase();
            let score = news.bias || 0;
            
            positiveWords.forEach(w => { if (lower.includes(w)) score += 0.3; });
            negativeWords.forEach(w => { if (lower.includes(w)) score -= 0.3; });
            
            news.sentimentScore = score;
            news.sentiment = score > 0.1 ? 'positive' : score < -0.1 ? 'negative' : 'neutral';
            totalScore += score;
        });
        
        this.overallSentiment = this.newsData.length > 0 ? totalScore / this.newsData.length : 0;
    }
    
    updateNewsDisplay() {
        const list = document.getElementById('newsList');
        const overall = document.getElementById('overallSentiment');
        
        if (this.newsData.length === 0) {
            list.innerHTML = '<div class="news-item">No news available</div>';
            return;
        }
        
        list.innerHTML = this.newsData.map(n => `
            <div class="news-item">
                <div>${n.title}</div>
                <div class="news-sentiment ${n.sentiment}">${n.sentiment.toUpperCase()} • ${n.time}</div>
            </div>
        `).join('');
        
        const sentimentText = this.overallSentiment > 0.1 ? '🟢 Bullish' : 
                             this.overallSentiment < -0.1 ? '🔴 Bearish' : '🟡 Neutral';
        overall.textContent = sentimentText;
    }

    // ============ TECHNICAL INDICATORS (Pure JS) ============
    
    calculateSMA(data, period) {
        const result = [];
        for (let i = period - 1; i < data.length; i++) {
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j];
            }
            result.push(sum / period);
        }
        return result;
    }
    
    calculateEMA(data, period) {
        const result = [];
        const multiplier = 2 / (period + 1);
        
        // First EMA is SMA
        let sum = 0;
        for (let i = 0; i < period; i++) {
            sum += data[i];
        }
        result.push(sum / period);
        
        // Calculate EMA
        for (let i = period; i < data.length; i++) {
            const ema = (data[i] - result[result.length - 1]) * multiplier + result[result.length - 1];
            result.push(ema);
        }
        return result;
    }
    
    calculateRSI(closes, period = 14) {
        if (closes.length < period + 1) return [50];
        
        const gains = [];
        const losses = [];
        
        for (let i = 1; i < closes.length; i++) {
            const change = closes[i] - closes[i - 1];
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? Math.abs(change) : 0);
        }
        
        const result = [];
        let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
        let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
        
        for (let i = period; i < gains.length; i++) {
            avgGain = (avgGain * (period - 1) + gains[i]) / period;
            avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
            
            const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
            result.push(100 - (100 / (1 + rs)));
        }
        
        return result.length > 0 ? result : [50];
    }
    
    calculateMACD(closes) {
        const ema12 = this.calculateEMA(closes, 12);
        const ema26 = this.calculateEMA(closes, 26);
        
        const macdLine = [];
        const offset = ema26.length - ema12.length;
        
        for (let i = 0; i < ema26.length; i++) {
            const idx12 = i - offset;
            if (idx12 >= 0 && idx12 < ema12.length) {
                macdLine.push(ema12[idx12] - ema26[i]);
            }
        }
        
        const signalLine = this.calculateEMA(macdLine, 9);
        const histogram = [];
        
        const sigOffset = macdLine.length - signalLine.length;
        for (let i = 0; i < signalLine.length; i++) {
            histogram.push(macdLine[i + sigOffset] - signalLine[i]);
        }
        
        return {
            MACD: macdLine[macdLine.length - 1] || 0,
            signal: signalLine[signalLine.length - 1] || 0,
            histogram: histogram[histogram.length - 1] || 0,
            prevHist: histogram[histogram.length - 2] || 0
        };
    }
    
    calculateBollingerBands(closes, period = 20, stdDev = 2) {
        if (closes.length < period) return { upper: 0, middle: 0, lower: 0 };
        
        const sma = this.calculateSMA(closes, period);
        const middle = sma[sma.length - 1];
        
        // Calculate standard deviation
        const slice = closes.slice(-period);
        const mean = slice.reduce((a, b) => a + b, 0) / period;
        const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
        const std = Math.sqrt(variance);
        
        return {
            upper: middle + (stdDev * std),
            middle: middle,
            lower: middle - (stdDev * std)
        };
    }
    
    calculateStochastic(highs, lows, closes, period = 14) {
        if (closes.length < period) return { k: 50, d: 50 };
        
        const kValues = [];
        
        for (let i = period - 1; i < closes.length; i++) {
            const highSlice = highs.slice(i - period + 1, i + 1);
            const lowSlice = lows.slice(i - period + 1, i + 1);
            
            const highest = Math.max(...highSlice);
            const lowest = Math.min(...lowSlice);
            
            const k = highest === lowest ? 50 : ((closes[i] - lowest) / (highest - lowest)) * 100;
            kValues.push(k);
        }
        
        const dValues = this.calculateSMA(kValues, 3);
        
        return {
            k: kValues[kValues.length - 1] || 50,
            d: dValues[dValues.length - 1] || 50
        };
    }
    
    calculateADX(highs, lows, closes, period = 14) {
        if (closes.length < period * 2) return { adx: 0, pdi: 0, mdi: 0 };
        
        const tr = [], plusDM = [], minusDM = [];
        
        for (let i = 1; i < closes.length; i++) {
            const high = highs[i], low = lows[i], prevHigh = highs[i-1], prevLow = lows[i-1], prevClose = closes[i-1];
            
            tr.push(Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose)));
            
            const upMove = high - prevHigh;
            const downMove = prevLow - low;
            
            plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
            minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);
        }
        
        const smoothTR = this.calculateEMA(tr, period);
        const smoothPlusDM = this.calculateEMA(plusDM, period);
        const smoothMinusDM = this.calculateEMA(minusDM, period);
        
        const pdi = (smoothPlusDM[smoothPlusDM.length - 1] / smoothTR[smoothTR.length - 1]) * 100 || 0;
        const mdi = (smoothMinusDM[smoothMinusDM.length - 1] / smoothTR[smoothTR.length - 1]) * 100 || 0;
        
        const dx = Math.abs(pdi - mdi) / (pdi + mdi) * 100 || 0;
        
        return { adx: dx, pdi, mdi };
    }


    // ============ AI ANALYSIS ENGINE ============
    
    runAIAnalysis() {
        try {
            if (this.priceData.length < 50) return;
            
            const closes = this.priceData.map(d => d.close).filter(c => c != null);
            const highs = this.priceData.map(d => d.high).filter(h => h != null);
            const lows = this.priceData.map(d => d.low).filter(l => l != null);
            const volumes = this.priceData.map(d => d.volume || 0);
            
            if (closes.length < 50) return;
            
            const currentPrice = closes[closes.length - 1];
            const technicals = this.calculateTechnicals(closes, highs, lows, volumes);
            
            this.updateIndicatorsDisplay(technicals);
            const decision = this.makeAIDecision(technicals, currentPrice);
            this.updateDecisionDisplay(decision);
            this.processDecision(decision, currentPrice);
        } catch (error) {
            console.error('AI Analysis error:', error);
        }
    }
    
    calculateTechnicals(closes, highs, lows, volumes) {
        const len = closes.length;
        
        // RSI
        const rsiValues = this.calculateRSI(closes, 14);
        const rsi = rsiValues[rsiValues.length - 1] || 50;
        
        // MACD
        const macd = this.calculateMACD(closes);
        
        // EMAs
        const ema9 = this.calculateEMA(closes, 9);
        const ema21 = this.calculateEMA(closes, 21);
        const ema50 = this.calculateEMA(closes, 50);
        
        // Bollinger Bands
        const bb = this.calculateBollingerBands(closes, 20, 2);
        
        // ADX
        const adx = this.calculateADX(highs, lows, closes, 14);
        
        // Stochastic
        const stoch = this.calculateStochastic(highs, lows, closes, 14);
        
        // ATR (simplified)
        let atrSum = 0;
        for (let i = Math.max(1, len - 14); i < len; i++) {
            atrSum += highs[i] - lows[i];
        }
        const atr = atrSum / 14;
        
        // VWAP
        let cumTPV = 0, cumVol = 0;
        this.priceData.forEach(d => {
            const tp = (d.high + d.low + d.close) / 3;
            cumTPV += tp * d.volume;
            cumVol += d.volume;
        });
        const vwap = cumVol > 0 ? cumTPV / cumVol : closes[len - 1];
        
        // SuperTrend
        const mult = 3;
        const hl2 = (highs[len - 1] + lows[len - 1]) / 2;
        const stUpper = hl2 + (mult * atr);
        const stLower = hl2 - (mult * atr);
        const stTrend = closes[len - 1] > stUpper ? 'bearish' : closes[len - 1] < stLower ? 'bullish' : 
                       closes[len - 1] > closes[len - 2] ? 'bullish' : 'bearish';
        
        // Volume analysis
        const avgVol = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
        const volRatio = volumes[len - 1] / avgVol;
        
        return {
            rsi,
            macd,
            ema: { 
                ema9: ema9[ema9.length - 1] || closes[len - 1], 
                ema21: ema21[ema21.length - 1] || closes[len - 1], 
                ema50: ema50[ema50.length - 1] || closes[len - 1] 
            },
            bb,
            adx,
            stoch,
            atr,
            vwap,
            supertrend: { trend: stTrend, upper: stUpper, lower: stLower },
            volume: { ratio: volRatio || 1, current: volumes[len - 1] || 0 },
            price: closes[len - 1]
        };
    }
    
    updateIndicatorsDisplay(t) {
        try {
            const indicators = [
                { name: 'RSI', value: (t.rsi || 50).toFixed(1), signal: t.rsi < 35 ? 'bullish' : t.rsi > 65 ? 'bearish' : 'neutral' },
                { name: 'MACD', value: (t.macd?.histogram || 0) > 0 ? 'Bullish' : 'Bearish', signal: (t.macd?.histogram || 0) > 0 ? 'bullish' : 'bearish' },
                { name: 'EMA', value: (t.ema?.ema9 || 0) > (t.ema?.ema21 || 0) ? 'Bullish' : 'Bearish', signal: (t.ema?.ema9 || 0) > (t.ema?.ema21 || 0) ? 'bullish' : 'bearish' },
                { name: 'SuperTrend', value: (t.supertrend?.trend || 'neutral').toUpperCase(), signal: t.supertrend?.trend || 'neutral' },
                { name: 'ADX', value: (t.adx?.adx || 0).toFixed(1), signal: (t.adx?.pdi || 0) > (t.adx?.mdi || 0) ? 'bullish' : 'bearish' },
                { name: 'Stochastic', value: `K:${(t.stoch?.k || 50).toFixed(0)}`, signal: (t.stoch?.k || 50) < 25 ? 'bullish' : (t.stoch?.k || 50) > 75 ? 'bearish' : 'neutral' },
                { name: 'VWAP', value: (t.price || 0) > (t.vwap || 0) ? 'Above' : 'Below', signal: (t.price || 0) > (t.vwap || 0) ? 'bullish' : 'bearish' },
                { name: 'Bollinger', value: (t.price || 0) > (t.bb?.upper || 0) ? 'OB' : (t.price || 0) < (t.bb?.lower || 0) ? 'OS' : 'Mid', signal: (t.price || 0) < (t.bb?.lower || 0) ? 'bullish' : (t.price || 0) > (t.bb?.upper || 0) ? 'bearish' : 'neutral' }
            ];
            
            document.getElementById('indicatorsList').innerHTML = indicators.map(i => `
                <div class="indicator-row">
                    <span class="ind-name">${i.name}</span>
                    <span class="ind-value ${i.signal}">${i.value}</span>
                </div>
            `).join('');
        } catch (e) {
            console.log('Indicator display error:', e);
        }
    }
    
    // ============ AI DECISION MAKING ============
    
    makeAIDecision(t, price) {
        const reasoning = [];
        let bullScore = 0, bearScore = 0;
        
        // 1. RSI Analysis (15 points)
        if (t.rsi < 30) { bullScore += 15; reasoning.push({ tag: 'tech', text: `RSI oversold at ${t.rsi.toFixed(1)} - Strong buy zone` }); }
        else if (t.rsi < 40) { bullScore += 8; reasoning.push({ tag: 'tech', text: `RSI low at ${t.rsi.toFixed(1)} - Potential reversal` }); }
        else if (t.rsi > 70) { bearScore += 15; reasoning.push({ tag: 'tech', text: `RSI overbought at ${t.rsi.toFixed(1)} - Strong sell zone` }); }
        else if (t.rsi > 60) { bearScore += 8; reasoning.push({ tag: 'tech', text: `RSI high at ${t.rsi.toFixed(1)} - Caution advised` }); }
        
        // 2. MACD Analysis (15 points)
        const macdCross = (t.macd.histogram > 0 && t.macd.prevHist <= 0) ? 'bullish' :
                         (t.macd.histogram < 0 && t.macd.prevHist >= 0) ? 'bearish' : 'none';
        
        if (macdCross === 'bullish') { bullScore += 15; reasoning.push({ tag: 'tech', text: 'MACD bullish crossover detected!' }); }
        else if (macdCross === 'bearish') { bearScore += 15; reasoning.push({ tag: 'tech', text: 'MACD bearish crossover detected!' }); }
        else if (t.macd.histogram > 0) { bullScore += 8; reasoning.push({ tag: 'tech', text: 'MACD histogram positive - Bullish momentum' }); }
        else { bearScore += 8; reasoning.push({ tag: 'tech', text: 'MACD histogram negative - Bearish momentum' }); }
        
        // 3. EMA Trend (12 points)
        if (t.ema.ema9 > t.ema.ema21 && t.ema.ema21 > t.ema.ema50) {
            bullScore += 12; reasoning.push({ tag: 'tech', text: 'Strong uptrend: EMA 9 > 21 > 50' });
        } else if (t.ema.ema9 < t.ema.ema21 && t.ema.ema21 < t.ema.ema50) {
            bearScore += 12; reasoning.push({ tag: 'tech', text: 'Strong downtrend: EMA 9 < 21 < 50' });
        } else if (t.ema.ema9 > t.ema.ema21) {
            bullScore += 6; reasoning.push({ tag: 'tech', text: 'Short-term bullish: EMA 9 > 21' });
        } else {
            bearScore += 6; reasoning.push({ tag: 'tech', text: 'Short-term bearish: EMA 9 < 21' });
        }
        
        // 4. SuperTrend (12 points)
        if (t.supertrend.trend === 'bullish') {
            bullScore += 12; reasoning.push({ tag: 'tech', text: 'SuperTrend signals BUY' });
        } else {
            bearScore += 12; reasoning.push({ tag: 'tech', text: 'SuperTrend signals SELL' });
        }
        
        // 5. ADX Trend Strength (10 points)
        if (t.adx.adx > 25) {
            const adxDir = t.adx.pdi > t.adx.mdi ? 'bullish' : 'bearish';
            if (adxDir === 'bullish') { bullScore += 10; reasoning.push({ tag: 'tech', text: `Strong trend (ADX ${t.adx.adx.toFixed(0)}) favoring bulls` }); }
            else { bearScore += 10; reasoning.push({ tag: 'tech', text: `Strong trend (ADX ${t.adx.adx.toFixed(0)}) favoring bears` }); }
        }
        
        // 6. Stochastic (10 points)
        if (t.stoch.k < 20 && t.stoch.k > t.stoch.d) {
            bullScore += 10; reasoning.push({ tag: 'tech', text: 'Stochastic oversold with bullish cross' });
        } else if (t.stoch.k > 80 && t.stoch.k < t.stoch.d) {
            bearScore += 10; reasoning.push({ tag: 'tech', text: 'Stochastic overbought with bearish cross' });
        }
        
        // 7. VWAP (8 points)
        if (price > t.vwap * 1.002) {
            bullScore += 8; reasoning.push({ tag: 'tech', text: 'Price above VWAP - Institutional buying' });
        } else if (price < t.vwap * 0.998) {
            bearScore += 8; reasoning.push({ tag: 'tech', text: 'Price below VWAP - Institutional selling' });
        }
        
        // 8. Bollinger Bands (8 points)
        if (price <= t.bb.lower) {
            bullScore += 8; reasoning.push({ tag: 'tech', text: 'Price at lower Bollinger Band - Oversold' });
        } else if (price >= t.bb.upper) {
            bearScore += 8; reasoning.push({ tag: 'tech', text: 'Price at upper Bollinger Band - Overbought' });
        }
        
        // 9. Volume Confirmation (5 points)
        if (t.volume.ratio > 1.5) {
            const volDir = bullScore > bearScore ? 'bullish' : 'bearish';
            if (volDir === 'bullish') bullScore += 5;
            else bearScore += 5;
            reasoning.push({ tag: 'tech', text: `High volume (${t.volume.ratio.toFixed(1)}x) confirms ${volDir} move` });
        }
        
        // 10. NEWS SENTIMENT (15 points)
        const sentimentScore = this.overallSentiment || 0;
        if (sentimentScore > 0.15) {
            bullScore += 15; reasoning.push({ tag: 'news', text: 'News sentiment strongly bullish' });
        } else if (sentimentScore > 0.05) {
            bullScore += 8; reasoning.push({ tag: 'news', text: 'News sentiment mildly bullish' });
        } else if (sentimentScore < -0.15) {
            bearScore += 15; reasoning.push({ tag: 'news', text: 'News sentiment strongly bearish' });
        } else if (sentimentScore < -0.05) {
            bearScore += 8; reasoning.push({ tag: 'news', text: 'News sentiment mildly bearish' });
        } else {
            reasoning.push({ tag: 'news', text: 'News sentiment neutral' });
        }
        
        // Calculate final decision
        const confidence = Math.min(Math.round((Math.max(bullScore, bearScore) / 100) * 100), 95);
        const scoreDiff = Math.abs(bullScore - bearScore);
        
        let decision = 'WAIT';
        let action = 'hold';
        
        // Decision logic with position awareness
        if (this.currentPosition) {
            if (this.currentPosition.type === 'CALL') {
                if (bearScore > bullScore + 20 || t.rsi > 75) {
                    decision = 'EXIT';
                    action = 'exit';
                    reasoning.unshift({ tag: 'sentiment', text: '⚠️ EXIT CALL - Bearish reversal detected' });
                } else {
                    decision = 'STAY CALL';
                    action = 'hold';
                    reasoning.unshift({ tag: 'sentiment', text: '✓ Hold CALL position - Trend intact' });
                }
            } else if (this.currentPosition.type === 'PUT') {
                if (bullScore > bearScore + 20 || t.rsi < 25) {
                    decision = 'EXIT';
                    action = 'exit';
                    reasoning.unshift({ tag: 'sentiment', text: '⚠️ EXIT PUT - Bullish reversal detected' });
                } else {
                    decision = 'STAY PUT';
                    action = 'hold';
                    reasoning.unshift({ tag: 'sentiment', text: '✓ Hold PUT position - Trend intact' });
                }
            }
            
            // Time-based exit check
            if (this.entryTime && (Date.now() - this.entryTime) > 2 * 60 * 60 * 1000) {
                decision = 'EXIT';
                action = 'exit';
                reasoning.unshift({ tag: 'sentiment', text: '⏰ 2-hour time limit reached - Exit now' });
            }
        } else {
            if (bullScore > bearScore && scoreDiff >= 25 && confidence >= 60) {
                decision = 'BUY CALL';
                action = 'call';
                reasoning.unshift({ tag: 'sentiment', text: '🚀 Strong bullish confluence - Enter CALL' });
            } else if (bearScore > bullScore && scoreDiff >= 25 && confidence >= 60) {
                decision = 'BUY PUT';
                action = 'put';
                reasoning.unshift({ tag: 'sentiment', text: '📉 Strong bearish confluence - Enter PUT' });
            } else {
                reasoning.unshift({ tag: 'sentiment', text: '⏳ No clear signal - Wait for better setup' });
            }
        }
        
        return { decision, action, confidence, bullScore, bearScore, reasoning, price };
    }


    // ============ UI UPDATES & ALERTS ============
    
    updateDecisionDisplay(d) {
        const box = document.getElementById('decisionBox');
        const decEl = document.getElementById('decision');
        const confFill = document.getElementById('confFill');
        const confVal = document.getElementById('confValue');
        
        decEl.textContent = d.decision;
        
        if (d.action === 'call' || d.decision.includes('CALL')) {
            decEl.className = 'decision-value call';
            box.className = 'decision-card call';
        } else if (d.action === 'put' || d.decision.includes('PUT')) {
            decEl.className = 'decision-value put';
            box.className = 'decision-card put';
        } else if (d.action === 'exit') {
            decEl.className = 'decision-value exit';
            box.className = 'decision-card exit';
        } else {
            decEl.className = 'decision-value wait';
            box.className = 'decision-card';
        }
        
        confFill.style.width = d.confidence + '%';
        confVal.textContent = d.confidence;
        
        const reasonList = document.getElementById('reasoningList');
        reasonList.innerHTML = d.reasoning.slice(0, 8).map(r => `
            <div class="reasoning-item">
                <span class="tag ${r.tag}">${r.tag.toUpperCase()}</span>${r.text}
            </div>
        `).join('');
    }
    
    processDecision(d, price) {
        const signalKey = `${d.decision}-${Math.floor(price / 15)}`;
        
        if (d.action === 'call' || d.action === 'put') {
            if (this.lastDecision !== signalKey) {
                this.lastDecision = signalKey;
                
                this.currentPosition = {
                    type: d.action === 'call' ? 'CALL' : 'PUT',
                    entry: price,
                    time: new Date()
                };
                this.entryTime = Date.now();
                
                this.addToHistory(d.action === 'call' ? 'CALL' : 'PUT', price, 'active');
                this.showAlert(d.action === 'call' ? 'CALL' : 'PUT', price, d.reasoning[0]?.text || 'Strong signal detected');
            }
        } else if (d.action === 'exit' && this.currentPosition) {
            const entryPrice = this.currentPosition.entry;
            const pnl = this.currentPosition.type === 'CALL' ? price - entryPrice : entryPrice - price;
            const result = pnl > 0 ? 'winner' : 'loser';
            
            this.updateLastHistoryResult(result, pnl);
            this.addToHistory('EXIT', price, result);
            
            this.currentPosition = null;
            this.entryTime = null;
            this.lastDecision = null;
            
            this.showAlert('EXIT', price, d.reasoning[0]?.text || 'Exit signal triggered');
        }
    }
    
    showAlert(type, price, reason) {
        const overlay = document.getElementById('alertOverlay');
        const box = document.getElementById('alertBox');
        const title = document.getElementById('alertTitle');
        const priceEl = document.getElementById('alertPrice');
        const reasonEl = document.getElementById('alertReason');
        
        if (type === 'CALL') {
            title.textContent = '📈 BUY CALL';
            title.style.color = '#3fb950';
            box.className = 'alert-box call';
        } else if (type === 'PUT') {
            title.textContent = '📉 BUY PUT';
            title.style.color = '#f85149';
            box.className = 'alert-box put';
        } else {
            title.textContent = '🚪 EXIT NOW';
            title.style.color = '#f0883e';
            box.className = 'alert-box exit';
        }
        
        priceEl.textContent = `₹${price.toFixed(2)}`;
        reasonEl.textContent = reason;
        
        overlay.classList.add('show');
        this.playSound(type);
        this.vibrate(type);
        
        setTimeout(() => closeAlert(), 8000);
    }
    
    playSound(type) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            if (type === 'CALL') {
                osc.frequency.setValueAtTime(523, ctx.currentTime);
                osc.frequency.setValueAtTime(659, ctx.currentTime + 0.15);
                osc.frequency.setValueAtTime(784, ctx.currentTime + 0.3);
            } else if (type === 'PUT') {
                osc.frequency.setValueAtTime(784, ctx.currentTime);
                osc.frequency.setValueAtTime(659, ctx.currentTime + 0.15);
                osc.frequency.setValueAtTime(523, ctx.currentTime + 0.3);
            } else {
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
                osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
            }
            
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {}
    }
    
    vibrate(type) {
        try {
            if ('vibrate' in navigator) {
                if (type === 'CALL' || type === 'PUT') {
                    navigator.vibrate([200, 100, 200, 100, 200]);
                } else {
                    navigator.vibrate([300, 100, 300]);
                }
            }
        } catch (e) {}
    }
    
    // ============ HISTORY MANAGEMENT ============
    
    loadHistory() {
        try {
            const saved = localStorage.getItem('niftySignalHistory');
            if (saved) {
                const parsed = JSON.parse(saved);
                const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
                this.signalHistory = parsed.filter(s => new Date(s.timestamp).getTime() > threeDaysAgo);
            }
        } catch (e) {
            this.signalHistory = [];
        }
    }
    
    saveHistory() {
        try {
            localStorage.setItem('niftySignalHistory', JSON.stringify(this.signalHistory));
        } catch (e) {}
    }
    
    addToHistory(type, price, result) {
        const entry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type,
            price: price.toFixed(2),
            result,
            pnl: 0
        };
        
        this.signalHistory.unshift(entry);
        
        const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
        this.signalHistory = this.signalHistory.filter(s => new Date(s.timestamp).getTime() > threeDaysAgo);
        
        this.saveHistory();
        this.updateHistoryDisplay();
    }
    
    updateLastHistoryResult(result, pnl) {
        const lastActive = this.signalHistory.find(s => s.result === 'active');
        if (lastActive) {
            lastActive.result = result;
            lastActive.pnl = pnl.toFixed(2);
            this.saveHistory();
        }
    }
    
    updateHistoryDisplay() {
        const table = document.getElementById('historyTable');
        const winCount = document.getElementById('winCount');
        const loseCount = document.getElementById('loseCount');
        const exitCount = document.getElementById('exitCount');
        
        const winners = this.signalHistory.filter(s => s.result === 'winner').length;
        const losers = this.signalHistory.filter(s => s.result === 'loser').length;
        const exits = this.signalHistory.filter(s => s.type === 'EXIT').length;
        
        winCount.textContent = winners;
        loseCount.textContent = losers;
        exitCount.textContent = exits;
        
        if (this.signalHistory.length === 0) {
            table.innerHTML = '<div class="history-item exit"><div class="time">No signals yet</div></div>';
            return;
        }
        
        table.innerHTML = this.signalHistory.slice(0, 20).map(s => {
            const date = new Date(s.timestamp);
            const timeStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + ' ' + 
                           date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            
            const resultClass = s.result === 'winner' ? 'winner' : s.result === 'loser' ? 'loser' : 'exit';
            const resultText = s.result === 'active' ? '⏳ Active' : 
                              s.result === 'winner' ? `✓ +${s.pnl}` : 
                              s.result === 'loser' ? `✗ ${s.pnl}` : '⏹ Exit';
            
            return `
                <div class="history-item ${resultClass}">
                    <div class="time">${timeStr}</div>
                    <div class="signal" style="color: ${s.type === 'CALL' ? '#3fb950' : s.type === 'PUT' ? '#f85149' : '#f0883e'}">${s.type}</div>
                    <div class="result">${resultText} @ ₹${s.price}</div>
                </div>
            `;
        }).join('');
    }
}

// ============ GLOBAL FUNCTIONS ============

let engine;

function toggleSystem() {
    engine.toggleSystem();
}

function closeAlert() {
    document.getElementById('alertOverlay').classList.remove('show');
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.remove('hidden');
    event.target.classList.add('active');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    engine = new AITradingEngine();
});

// Handle back button
document.addEventListener('backbutton', (e) => {
    e.preventDefault();
    if (document.getElementById('alertOverlay').classList.contains('show')) {
        closeAlert();
    }
});
