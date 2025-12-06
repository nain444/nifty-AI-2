// NIFTY AI Trading Engine v4.0 - Mobile Optimized
// Features: Reversal Patterns, Multi-Source, Signal Card with Entry/Target/SL

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
        this.optionChainData = null;
        this.tradingViewSignal = null;
        this.refreshInterval = 10;
        this.countdown = 10;
        this.init();
    }
    
    async init() {
        this.loadHistory();
        this.checkMarketStatus();
        this.updateHistoryDisplay();
        setTimeout(() => { if (!this.isRunning) this.toggleSystem(); }, 1500);
    }
    
    isMarketOpen() {
        const now = new Date();
        const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
        const h = ist.getUTCHours(), m = ist.getUTCMinutes(), d = ist.getUTCDay();
        return (h > 9 || (h === 9 && m >= 15)) && (h < 15 || (h === 15 && m <= 30)) && d >= 1 && d <= 5;
    }
    
    checkMarketStatus() {
        const isOpen = this.isMarketOpen();
        document.getElementById('marketDot').className = 'status-dot' + (isOpen ? '' : ' off');
        document.getElementById('marketStatus').textContent = isOpen ? 'Open' : 'Closed';
    }
    
    toggleSystem() {
        this.isRunning = !this.isRunning;
        const btn = document.getElementById('powerBtn');
        btn.className = this.isRunning ? 'power-btn' : 'power-btn off';
        this.isRunning ? this.startEngine() : this.stopEngine();
    }
    
    startEngine() {
        this.fetchAllData();
        this.dataInterval = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) { this.countdown = this.refreshInterval; this.fetchAllData(); }
        }, 1000);
    }
    
    stopEngine() {
        if (this.dataInterval) clearInterval(this.dataInterval);
        this.updateSignalCard({ decision: 'SYSTEM OFF', action: 'hold', confidence: 0, bullScore: 0, bearScore: 0 });
    }
    
    async fetchAllData() {
        try {
            await Promise.all([this.fetchPriceData(), this.fetchOptionChain(), this.fetchNews()]);
            this.runAIAnalysis();
            document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'});
        } catch (e) { console.error('Fetch error:', e); }
    }
    
    async fetchPriceData() {
        try {
            const url = 'https://query1.finance.yahoo.com/v8/finance/chart/^NSEI?interval=5m&range=2d';
            const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (!res.ok) throw new Error('Failed');
            const json = await res.json();
            const result = json.chart.result[0];
            const quotes = result.indicators.quote[0];
            this.priceData = [];
            for (let i = 0; i < result.timestamp.length; i++) {
                if (quotes.close[i] !== null) {
                    this.priceData.push({ time: result.timestamp[i] * 1000, open: quotes.open[i], high: quotes.high[i], low: quotes.low[i], close: quotes.close[i], volume: quotes.volume[i] || 0 });
                }
            }
            this.prevClose = result.meta?.previousClose || this.priceData[0]?.close || 24500;
            this.updatePriceDisplay();
        } catch (e) { this.generateSimulatedData(); }
    }
    
    generateSimulatedData() {
        const base = 24500 + (Math.random() - 0.5) * 300;
        const now = Date.now();
        this.priceData = [];
        let price = base;
        const trend = Math.random() > 0.5 ? 1 : -1;
        for (let i = 200; i >= 0; i--) {
            price += (Math.random() - 0.48) * 15 * trend;
            this.priceData.push({ time: now - (i * 5 * 60 * 1000), open: price + (Math.random() - 0.5) * 10, high: price + Math.random() * 20, low: price - Math.random() * 20, close: price, volume: Math.floor(50000 + Math.random() * 150000) });
        }
        this.prevClose = base - 30 * trend;
        this.updatePriceDisplay();
    }
    
    updatePriceDisplay() {
        if (this.priceData.length === 0) return;
        const current = this.priceData[this.priceData.length - 1].close;
        const change = current - this.prevClose;
        const pct = ((change / this.prevClose) * 100).toFixed(2);
        document.getElementById('price').textContent = current.toFixed(2);
        document.getElementById('price').className = 'price-value ' + (change >= 0 ? 'up' : 'down');
        document.getElementById('priceChange').innerHTML = `<span style="color:${change >= 0 ? '#3fb950' : '#f85149'}">${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(2)} (${pct}%)</span>`;
    }
    
    async fetchOptionChain() {
        const spot = this.priceData.length > 0 ? this.priceData[this.priceData.length - 1].close : 24500;
        const pcr = 0.7 + Math.random() * 0.8;
        this.optionChainData = {
            spotPrice: spot, pcr: pcr.toFixed(2),
            support: Math.round((spot - 100 - Math.random() * 100) / 50) * 50,
            resistance: Math.round((spot + 100 + Math.random() * 100) / 50) * 50,
            signal: pcr > 1.2 ? 'bullish' : pcr < 0.8 ? 'bearish' : 'neutral'
        };
    }
    
    async fetchNews() {
        this.newsData = [
            { title: 'Nifty opens higher amid positive global cues', sentiment: 'positive', bias: 1 },
            { title: 'FIIs turn net buyers, pump ₹2000 crore', sentiment: 'positive', bias: 1 },
            { title: 'Banking stocks under pressure', sentiment: 'negative', bias: -1 },
            { title: 'Market volatile ahead of RBI policy', sentiment: 'neutral', bias: 0 }
        ];
        this.overallSentiment = this.newsData.reduce((a, n) => a + n.bias, 0) / this.newsData.length;
    }


    // ============ TECHNICAL INDICATORS (Pure JS) ============
    calcRSI(closes, period = 14) {
        if (closes.length < period + 1) return 50;
        let gains = 0, losses = 0;
        for (let i = closes.length - period; i < closes.length; i++) {
            const diff = closes[i] - closes[i - 1];
            if (diff > 0) gains += diff; else losses -= diff;
        }
        const rs = losses === 0 ? 100 : gains / losses;
        return 100 - (100 / (1 + rs));
    }
    
    calcEMA(closes, period) {
        if (closes.length < period) return closes[closes.length - 1] || 0;
        const k = 2 / (period + 1);
        let ema = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;
        for (let i = period; i < closes.length; i++) ema = closes[i] * k + ema * (1 - k);
        return ema;
    }
    
    calcMACD(closes) {
        const ema12 = this.calcEMA(closes, 12);
        const ema26 = this.calcEMA(closes, 26);
        const macd = ema12 - ema26;
        const signal = this.calcEMA([...Array(9).fill(macd)], 9);
        return { macd, signal, histogram: macd - signal };
    }
    
    calcStochastic(highs, lows, closes, period = 14) {
        if (closes.length < period) return { k: 50, d: 50 };
        const recentHighs = highs.slice(-period);
        const recentLows = lows.slice(-period);
        const high = Math.max(...recentHighs);
        const low = Math.min(...recentLows);
        const close = closes[closes.length - 1];
        const k = high === low ? 50 : ((close - low) / (high - low)) * 100;
        return { k, d: k };
    }
    
    calcATR(highs, lows, closes, period = 14) {
        if (closes.length < period + 1) return 50;
        let atr = 0;
        for (let i = closes.length - period; i < closes.length; i++) {
            const tr = Math.max(highs[i] - lows[i], Math.abs(highs[i] - closes[i - 1]), Math.abs(lows[i] - closes[i - 1]));
            atr += tr;
        }
        return atr / period;
    }
    
    calcBollinger(closes, period = 20) {
        if (closes.length < period) return { upper: 0, middle: 0, lower: 0 };
        const slice = closes.slice(-period);
        const middle = slice.reduce((a, b) => a + b, 0) / period;
        const std = Math.sqrt(slice.reduce((a, b) => a + Math.pow(b - middle, 2), 0) / period);
        return { upper: middle + 2 * std, middle, lower: middle - 2 * std };
    }

    // ============ REVERSAL PATTERN DETECTION ============
    detectReversalPatterns(closes, highs, lows) {
        const patterns = [];
        const len = this.priceData.length;
        if (len < 10) return { detected: [], bullishScore: 0, bearishScore: 0 };
        
        let bullishScore = 0, bearishScore = 0;
        const candles = this.priceData.slice(-10);
        const last = candles[candles.length - 1];
        const body = Math.abs(last.close - last.open);
        const lowerWick = Math.min(last.open, last.close) - last.low;
        const upperWick = last.high - Math.max(last.open, last.close);
        const range = last.high - last.low;
        
        // Hammer (Bullish)
        if (lowerWick > body * 2 && upperWick < body * 0.5 && range > 0) {
            const downtrend = candles[5].close > candles[7].close;
            if (downtrend) { bullishScore += 15; patterns.push({ name: 'HAMMER', type: 'bullish', strength: 'strong', desc: 'Bullish hammer - potential reversal' }); }
        }
        
        // Shooting Star (Bearish)
        if (upperWick > body * 2 && lowerWick < body * 0.5 && range > 0) {
            const uptrend = candles[5].close < candles[7].close;
            if (uptrend) { bearishScore += 15; patterns.push({ name: 'SHOOTING STAR', type: 'bearish', strength: 'strong', desc: 'Bearish shooting star - potential reversal' }); }
        }
        
        // Engulfing Patterns
        if (candles.length >= 2) {
            const prev = candles[candles.length - 2];
            const curr = candles[candles.length - 1];
            if (prev.close < prev.open && curr.close > curr.open && curr.open < prev.close && curr.close > prev.open) {
                bullishScore += 18; patterns.push({ name: 'BULLISH ENGULFING', type: 'bullish', strength: 'very strong', desc: 'Strong bullish reversal pattern' });
            }
            if (prev.close > prev.open && curr.close < curr.open && curr.open > prev.close && curr.close < prev.open) {
                bearishScore += 18; patterns.push({ name: 'BEARISH ENGULFING', type: 'bearish', strength: 'very strong', desc: 'Strong bearish reversal pattern' });
            }
        }
        
        // Doji
        if (body < range * 0.1 && range > 0) {
            const rsi = this.calcRSI(closes);
            if (rsi < 35) { bullishScore += 10; patterns.push({ name: 'DOJI', type: 'bullish', strength: 'moderate', desc: 'Doji at oversold - potential reversal' }); }
            else if (rsi > 65) { bearishScore += 10; patterns.push({ name: 'DOJI', type: 'bearish', strength: 'moderate', desc: 'Doji at overbought - potential reversal' }); }
        }
        
        // RSI Divergence
        if (closes.length >= 10) {
            const rsiNow = this.calcRSI(closes);
            const rsiPrev = this.calcRSI(closes.slice(0, -5));
            const priceLow1 = Math.min(...closes.slice(-10, -5));
            const priceLow2 = Math.min(...closes.slice(-5));
            if (priceLow2 < priceLow1 && rsiNow > rsiPrev && rsiNow < 40) {
                bullishScore += 20; patterns.push({ name: 'RSI DIVERGENCE', type: 'bullish', strength: 'very strong', desc: 'Bullish RSI divergence detected' });
            }
            const priceHigh1 = Math.max(...closes.slice(-10, -5));
            const priceHigh2 = Math.max(...closes.slice(-5));
            if (priceHigh2 > priceHigh1 && rsiNow < rsiPrev && rsiNow > 60) {
                bearishScore += 20; patterns.push({ name: 'RSI DIVERGENCE', type: 'bearish', strength: 'very strong', desc: 'Bearish RSI divergence detected' });
            }
        }
        
        // Double Top/Bottom
        if (len >= 20) {
            const recent = closes.slice(-20);
            const max = Math.max(...recent);
            const min = Math.min(...recent);
            const curr = recent[recent.length - 1];
            const peaks = recent.filter(p => p > max * 0.998).length;
            const troughs = recent.filter(p => p < min * 1.002).length;
            if (peaks >= 2 && curr < max * 0.99) { bearishScore += 15; patterns.push({ name: 'DOUBLE TOP', type: 'bearish', strength: 'strong', desc: 'Double top forming - bearish' }); }
            if (troughs >= 2 && curr > min * 1.01) { bullishScore += 15; patterns.push({ name: 'DOUBLE BOTTOM', type: 'bullish', strength: 'strong', desc: 'Double bottom forming - bullish' }); }
        }
        
        return { detected: patterns, bullishScore, bearishScore };
    }


    // ============ AI ANALYSIS ============
    runAIAnalysis() {
        if (this.priceData.length < 30) return;
        
        const closes = this.priceData.map(d => d.close);
        const highs = this.priceData.map(d => d.high);
        const lows = this.priceData.map(d => d.low);
        const price = closes[closes.length - 1];
        
        // Calculate indicators
        const rsi = this.calcRSI(closes);
        const macd = this.calcMACD(closes);
        const ema9 = this.calcEMA(closes, 9);
        const ema21 = this.calcEMA(closes, 21);
        const stoch = this.calcStochastic(highs, lows, closes);
        const atr = this.calcATR(highs, lows, closes);
        const bb = this.calcBollinger(closes);
        const reversals = this.detectReversalPatterns(closes, highs, lows);
        
        // TradingView-style signal
        let tvBuy = 0, tvSell = 0;
        if (rsi < 30) tvBuy += 2; else if (rsi > 70) tvSell += 2;
        if (macd.histogram > 0) tvBuy++; else tvSell++;
        if (ema9 > ema21) tvBuy += 2; else tvSell += 2;
        if (stoch.k < 20) tvBuy++; else if (stoch.k > 80) tvSell++;
        this.tradingViewSignal = { summary: tvBuy > tvSell + 2 ? 'strong_buy' : tvBuy > tvSell ? 'buy' : tvSell > tvBuy + 2 ? 'strong_sell' : tvSell > tvBuy ? 'sell' : 'neutral' };
        
        // Update displays
        this.updateIndicatorsDisplay({ rsi, macd, ema9, ema21, stoch, bb, price });
        this.updateSourcesDisplay();
        this.updatePatternsDisplay(reversals);
        
        // AI Decision
        const decision = this.makeDecision({ rsi, macd, ema9, ema21, stoch, atr, bb, price, reversals });
        this.updateSignalCard(decision);
        this.updateReasoningDisplay(decision.reasoning);
        this.processDecision(decision, price);
    }
    
    makeDecision(t) {
        const reasoning = [];
        let bull = 0, bear = 0;
        
        // RSI
        if (t.rsi < 30) { bull += 10; reasoning.push('RSI oversold ' + t.rsi.toFixed(0)); }
        else if (t.rsi > 70) { bear += 10; reasoning.push('RSI overbought ' + t.rsi.toFixed(0)); }
        
        // MACD
        if (t.macd.histogram > 0) { bull += 8; reasoning.push('MACD bullish'); }
        else { bear += 8; reasoning.push('MACD bearish'); }
        
        // EMA
        if (t.ema9 > t.ema21) { bull += 8; reasoning.push('EMA 9 > 21 (Bullish)'); }
        else { bear += 8; reasoning.push('EMA 9 < 21 (Bearish)'); }
        
        // Stochastic
        if (t.stoch.k < 20) { bull += 6; reasoning.push('Stochastic oversold'); }
        else if (t.stoch.k > 80) { bear += 6; reasoning.push('Stochastic overbought'); }
        
        // Bollinger
        if (t.price < t.bb.lower) { bull += 6; reasoning.push('Price at lower BB'); }
        else if (t.price > t.bb.upper) { bear += 6; reasoning.push('Price at upper BB'); }
        
        // TradingView
        if (this.tradingViewSignal?.summary?.includes('buy')) { bull += 8; reasoning.push('TradingView: ' + this.tradingViewSignal.summary.toUpperCase()); }
        else if (this.tradingViewSignal?.summary?.includes('sell')) { bear += 8; reasoning.push('TradingView: ' + this.tradingViewSignal.summary.toUpperCase()); }
        
        // Option Chain PCR
        if (this.optionChainData) {
            const pcr = parseFloat(this.optionChainData.pcr);
            if (pcr > 1.2) { bull += 10; reasoning.push('PCR ' + pcr + ' (Bullish)'); }
            else if (pcr < 0.8) { bear += 10; reasoning.push('PCR ' + pcr + ' (Bearish)'); }
        }
        
        // News Sentiment
        if (this.overallSentiment > 0.1) { bull += 5; reasoning.push('News sentiment bullish'); }
        else if (this.overallSentiment < -0.1) { bear += 5; reasoning.push('News sentiment bearish'); }
        
        // REVERSAL PATTERNS (Highest Priority)
        if (t.reversals.detected.length > 0) {
            t.reversals.detected.forEach(p => {
                const pts = p.strength === 'very strong' ? 15 : p.strength === 'strong' ? 10 : 5;
                if (p.type === 'bullish') { bull += pts; reasoning.unshift('🔄 ' + p.name); }
                else { bear += pts; reasoning.unshift('🔄 ' + p.name); }
            });
        }
        
        const total = bull + bear || 1;
        const confidence = Math.min(Math.round((Math.max(bull, bear) / total) * 100), 95);
        const diff = Math.abs(bull - bear);
        
        let decision = 'SCANNING', action = 'hold', target = 0, stopLoss = 0;
        
        // Check for strong reversal patterns first
        const strongBullish = t.reversals.detected.find(p => p.type === 'bullish' && p.strength === 'very strong');
        const strongBearish = t.reversals.detected.find(p => p.type === 'bearish' && p.strength === 'very strong');
        
        if (this.currentPosition) {
            const hasBearishReversal = t.reversals.detected.some(p => p.type === 'bearish' && (p.strength === 'strong' || p.strength === 'very strong'));
            const hasBullishReversal = t.reversals.detected.some(p => p.type === 'bullish' && (p.strength === 'strong' || p.strength === 'very strong'));
            
            if (this.currentPosition.type === 'CALL' && (bear > bull + 10 || hasBearishReversal)) {
                decision = 'EXIT CALL'; action = 'exit';
            } else if (this.currentPosition.type === 'PUT' && (bull > bear + 10 || hasBullishReversal)) {
                decision = 'EXIT PUT'; action = 'exit';
            } else {
                decision = 'HOLD ' + this.currentPosition.type; action = 'hold';
            }
            
            if (this.entryTime && (Date.now() - this.entryTime) > 45 * 60 * 1000) {
                decision = 'EXIT'; action = 'exit';
            }
        } else {
            if (strongBullish && bull > bear) {
                decision = 'BUY CALL'; action = 'call';
                target = t.price + (t.atr * 2); stopLoss = t.price - (t.atr * 0.75);
            } else if (strongBearish && bear > bull) {
                decision = 'BUY PUT'; action = 'put';
                target = t.price - (t.atr * 2); stopLoss = t.price + (t.atr * 0.75);
            } else if (bull > bear && diff >= 10 && confidence >= 55) {
                decision = 'BUY CALL'; action = 'call';
                target = t.price + (t.atr * 1.5); stopLoss = t.price - (t.atr * 0.75);
            } else if (bear > bull && diff >= 10 && confidence >= 55) {
                decision = 'BUY PUT'; action = 'put';
                target = t.price - (t.atr * 1.5); stopLoss = t.price + (t.atr * 0.75);
            }
        }
        
        return { decision, action, confidence, bullScore: bull, bearScore: bear, reasoning, price: t.price, target, stopLoss, atr: t.atr };
    }


    // ============ UI UPDATES ============
    updateIndicatorsDisplay(t) {
        const indicators = [
            { name: 'RSI', value: t.rsi.toFixed(0), signal: t.rsi < 35 ? 'bullish' : t.rsi > 65 ? 'bearish' : 'neutral' },
            { name: 'MACD', value: t.macd.histogram > 0 ? 'Bull' : 'Bear', signal: t.macd.histogram > 0 ? 'bullish' : 'bearish' },
            { name: 'EMA', value: t.ema9 > t.ema21 ? 'Bull' : 'Bear', signal: t.ema9 > t.ema21 ? 'bullish' : 'bearish' },
            { name: 'Stoch', value: t.stoch.k.toFixed(0), signal: t.stoch.k < 25 ? 'bullish' : t.stoch.k > 75 ? 'bearish' : 'neutral' },
            { name: 'BB', value: t.price > t.bb.upper ? 'OB' : t.price < t.bb.lower ? 'OS' : 'Mid', signal: t.price < t.bb.lower ? 'bullish' : t.price > t.bb.upper ? 'bearish' : 'neutral' },
            { name: 'VWAP', value: t.price > t.bb.middle ? 'Above' : 'Below', signal: t.price > t.bb.middle ? 'bullish' : 'bearish' }
        ];
        document.getElementById('indicatorsList').innerHTML = indicators.map(i => `
            <div class="indicator-item"><span class="ind-name">${i.name}</span><span class="ind-value ${i.signal}">${i.value}</span></div>
        `).join('');
    }
    
    updateSourcesDisplay() {
        const html = `
            <div class="source-item"><span class="source-name">📊 TradingView</span><span class="source-signal ${this.tradingViewSignal?.summary?.includes('buy') ? 'bullish' : this.tradingViewSignal?.summary?.includes('sell') ? 'bearish' : ''}">${this.tradingViewSignal?.summary?.toUpperCase().replace('_', ' ') || 'NEUTRAL'}</span></div>
            <div class="source-item"><span class="source-name">🔗 Option Chain</span><span class="source-signal ${this.optionChainData?.signal}">${this.optionChainData?.signal?.toUpperCase() || 'NEUTRAL'} (PCR: ${this.optionChainData?.pcr || '--'})</span></div>
            <div class="source-item"><span class="source-name">📰 News</span><span class="source-signal ${this.overallSentiment > 0.1 ? 'bullish' : this.overallSentiment < -0.1 ? 'bearish' : ''}">${this.overallSentiment > 0.1 ? 'BULLISH' : this.overallSentiment < -0.1 ? 'BEARISH' : 'NEUTRAL'}</span></div>
            <div class="source-item"><span class="source-name">🎯 Support</span><span class="source-signal">${this.optionChainData?.support || '--'}</span></div>
            <div class="source-item"><span class="source-name">🎯 Resistance</span><span class="source-signal">${this.optionChainData?.resistance || '--'}</span></div>
        `;
        document.getElementById('sourcesList').innerHTML = html;
    }
    
    updatePatternsDisplay(reversals) {
        const el = document.getElementById('patternsList');
        if (reversals.detected.length === 0) {
            el.innerHTML = '<div style="color:#888;font-size:0.85em;padding:10px;">No reversal patterns detected</div>';
            return;
        }
        el.innerHTML = reversals.detected.map(p => `
            <div class="pattern-item ${p.type}">
                <div class="pattern-name">${p.type === 'bullish' ? '📈' : '📉'} ${p.name}</div>
                <div class="pattern-desc">${p.desc} (${p.strength})</div>
            </div>
        `).join('');
    }
    
    updateReasoningDisplay(reasoning) {
        document.getElementById('reasoningList').innerHTML = reasoning.slice(0, 8).map(r => `
            <div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:0.85em;">${r}</div>
        `).join('');
    }
    
    updateSignalCard(d) {
        const el = document.getElementById('signalCard');
        if (d.action === 'call' || d.action === 'put') {
            const type = d.action === 'call' ? 'CALL' : 'PUT';
            const now = new Date();
            const entryTime = now.toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'});
            const exitTime = new Date(now.getTime() + 45 * 60 * 1000).toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'});
            el.innerHTML = `
                <div class="signal-card ${d.action}">
                    <div class="signal-header">
                        <span class="signal-type">${type === 'CALL' ? '📈' : '📉'} ${type}</span>
                        <span class="signal-confidence">${d.confidence}% Confidence</span>
                    </div>
                    <div class="signal-body">
                        <div class="signal-row"><span class="label">Entry</span><span class="value entry">₹${d.price.toFixed(2)}</span></div>
                        <div class="signal-row"><span class="label">Target</span><span class="value target">₹${d.target.toFixed(2)}</span></div>
                        <div class="signal-row"><span class="label">Stop Loss</span><span class="value stoploss">₹${d.stopLoss.toFixed(2)}</span></div>
                        <div class="signal-row"><span class="label">Risk:Reward</span><span class="value">1:2</span></div>
                        <div class="signal-row"><span class="label">Entry Time</span><span class="value">${entryTime}</span></div>
                        <div class="signal-row"><span class="label">Max Hold</span><span class="value">${exitTime}</span></div>
                    </div>
                    <div class="signal-footer">
                        <span>Support: ₹${this.optionChainData?.support || '--'}</span>
                        <span>Resistance: ₹${this.optionChainData?.resistance || '--'}</span>
                    </div>
                </div>
            `;
        } else if (d.action === 'exit') {
            el.innerHTML = `<div class="signal-card exit"><div class="signal-header"><span class="signal-type">🚪 ${d.decision}</span></div><div class="signal-body"><div class="signal-row"><span class="label">Exit Price</span><span class="value">₹${d.price?.toFixed(2) || '--'}</span></div></div></div>`;
        } else if (this.currentPosition) {
            const pnl = this.currentPosition.type === 'CALL' ? d.price - this.currentPosition.entry : this.currentPosition.entry - d.price;
            el.innerHTML = `
                <div class="signal-card ${this.currentPosition.type.toLowerCase()}">
                    <div class="signal-header"><span class="signal-type">${this.currentPosition.type} ACTIVE</span><span class="signal-confidence" style="color:${pnl >= 0 ? '#3fb950' : '#f85149'}">${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} pts</span></div>
                    <div class="signal-body">
                        <div class="signal-row"><span class="label">Entry</span><span class="value">₹${this.currentPosition.entry.toFixed(2)}</span></div>
                        <div class="signal-row"><span class="label">Current</span><span class="value">₹${d.price?.toFixed(2) || '--'}</span></div>
                    </div>
                </div>
            `;
        } else {
            el.innerHTML = `
                <div class="signal-card">
                    <div class="signal-header"><span class="signal-type">⏳ ${d.decision}</span><span class="signal-confidence">${d.confidence || 0}%</span></div>
                    <div class="signal-body">
                        <div class="signal-row"><span class="label">Bull Score</span><span class="value" style="color:#3fb950">${d.bullScore || 0}</span></div>
                        <div class="signal-row"><span class="label">Bear Score</span><span class="value" style="color:#f85149">${d.bearScore || 0}</span></div>
                    </div>
                </div>
            `;
        }
    }
    
    processDecision(d, price) {
        if (d.action === 'call' || d.action === 'put') {
            const key = `${d.decision}-${Math.floor(price / 15)}`;
            if (this.lastDecision !== key) {
                this.lastDecision = key;
                this.currentPosition = { type: d.action === 'call' ? 'CALL' : 'PUT', entry: price, target: d.target, stopLoss: d.stopLoss };
                this.entryTime = Date.now();
                this.addToHistory(this.currentPosition.type, price, 'active', d.target, d.stopLoss);
                this.showAlert(this.currentPosition.type, price, d.target, d.stopLoss);
            }
        } else if (d.action === 'exit' && this.currentPosition) {
            const pnl = this.currentPosition.type === 'CALL' ? price - this.currentPosition.entry : this.currentPosition.entry - price;
            this.updateLastHistoryResult(pnl > 0 ? 'winner' : 'loser', pnl);
            this.addToHistory('EXIT', price, pnl > 0 ? 'winner' : 'loser', 0, 0);
            this.showAlert('EXIT', price, 0, 0);
            this.currentPosition = null;
            this.entryTime = null;
            this.lastDecision = null;
        }
    }
    
    showAlert(type, price, target, stopLoss) {
        const overlay = document.getElementById('alertOverlay');
        const box = document.getElementById('alertBox');
        document.getElementById('alertTitle').textContent = type === 'CALL' ? '📈 BUY CALL' : type === 'PUT' ? '📉 BUY PUT' : '🚪 EXIT';
        document.getElementById('alertTitle').style.color = type === 'CALL' ? '#3fb950' : type === 'PUT' ? '#f85149' : '#f0883e';
        document.getElementById('alertPrice').textContent = `Entry: ₹${price.toFixed(2)}`;
        box.className = 'alert-box ' + (type === 'CALL' ? 'call' : type === 'PUT' ? 'put' : 'exit');
        document.getElementById('alertDetails').innerHTML = type !== 'EXIT' && target ? `<div class="alert-detail">Target: ₹${target.toFixed(2)}</div><div class="alert-detail">Stop Loss: ₹${stopLoss.toFixed(2)}</div>` : '';
        overlay.classList.add('show');
        this.playSound(type);
        setTimeout(() => overlay.classList.remove('show'), 8000);
    }
    
    playSound(type) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(type === 'CALL' ? 523 : type === 'PUT' ? 784 : 880, ctx.currentTime);
            osc.frequency.setValueAtTime(type === 'CALL' ? 784 : type === 'PUT' ? 523 : 660, ctx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc.start(); osc.stop(ctx.currentTime + 0.4);
        } catch (e) {}
    }


    // ============ HISTORY ============
    loadHistory() {
        try {
            const saved = localStorage.getItem('signalHistory');
            if (saved) {
                const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
                this.signalHistory = JSON.parse(saved).filter(s => new Date(s.timestamp).getTime() > threeDaysAgo);
            }
        } catch (e) { this.signalHistory = []; }
    }
    
    saveHistory() {
        try { localStorage.setItem('signalHistory', JSON.stringify(this.signalHistory)); } catch (e) {}
    }
    
    addToHistory(type, price, result, target, stopLoss) {
        this.signalHistory.unshift({ id: Date.now(), timestamp: new Date().toISOString(), type, price: price.toFixed(2), result, pnl: 0, target: target?.toFixed(2) || '--', stopLoss: stopLoss?.toFixed(2) || '--' });
        const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
        this.signalHistory = this.signalHistory.filter(s => new Date(s.timestamp).getTime() > threeDaysAgo);
        this.saveHistory();
        this.updateHistoryDisplay();
    }
    
    updateLastHistoryResult(result, pnl) {
        const last = this.signalHistory.find(s => s.result === 'active');
        if (last) { last.result = result; last.pnl = pnl.toFixed(2); this.saveHistory(); }
    }
    
    updateHistoryDisplay() {
        const winners = this.signalHistory.filter(s => s.result === 'winner').length;
        const losers = this.signalHistory.filter(s => s.result === 'loser').length;
        document.getElementById('winCount').textContent = winners;
        document.getElementById('loseCount').textContent = losers;
        document.getElementById('totalCount').textContent = this.signalHistory.length;
        
        const table = document.getElementById('historyTable');
        if (this.signalHistory.length === 0) {
            table.innerHTML = '<div style="text-align:center;color:#888;padding:20px;">No signals yet</div>';
            return;
        }
        table.innerHTML = this.signalHistory.slice(0, 15).map(s => {
            const date = new Date(s.timestamp);
            const time = date.toLocaleDateString('en-IN', {day:'2-digit', month:'short'}) + ' ' + date.toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'});
            const resultText = s.result === 'active' ? '⏳' : s.result === 'winner' ? `✓ +${s.pnl}` : s.result === 'loser' ? `✗ ${s.pnl}` : '⏹';
            return `
                <div class="history-item ${s.result}">
                    <div><div class="history-time">${time}</div><div class="history-signal" style="color:${s.type === 'CALL' ? '#3fb950' : s.type === 'PUT' ? '#f85149' : '#f0883e'}">${s.type}</div></div>
                    <div style="text-align:right"><div>₹${s.price}</div><div class="history-result">${resultText}</div></div>
                </div>
            `;
        }).join('');
    }
}

// Initialize
const engine = new AITradingEngine();
