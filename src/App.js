import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function App() {
  const [symbol, setSymbol] = useState('');
  const [result, setResult] = useState(null);
  const [showDaily, setShowDaily] = useState(false);
  const [suggestedStocks, setSuggestedStocks] = useState([]);

  useEffect(() => {
    axios.get('https://stock-analyzer-backend-rfie.onrender.com/suggested-stocks')
      .then(res => setSuggestedStocks(res.data))
      .catch(err => console.error(err));
  }, []);

  const analyze = async (customSymbol) => {
    const finalSymbol = customSymbol || symbol;
    try {
      const formattedSymbol = finalSymbol.toUpperCase().endsWith(".NS")
        ? finalSymbol.toUpperCase()
        : finalSymbol.toUpperCase() + ".NS";

      const response = await axios.post('https://stock-analyzer-backend-rfie.onrender.com/analyze', {
        symbol: formattedSymbol
      });
      setResult(response.data);
    } catch (error) {
      alert('Error fetching stock data.');
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>📊 Stock Fundamental Analyzer</h1>

      {/* Suggested Stock List */}
      <div style={{ marginBottom: '20px', textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
        <h3>📌 Suggested Stocks (Good Entry)</h3>
        <ul>
          {suggestedStocks.map((stock, i) => (
            <li key={i} style={{ cursor: 'pointer', color: '#0070f3' }}
                onClick={() => {
                  setSymbol(stock.symbol.replace('.NS', ''));
                  analyze(stock.symbol);
                }}>
              {stock.name} ({stock.symbol})
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Enter stock symbol (e.g. TCS)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <button onClick={() => analyze()}>Analyze</button>
      </div>

      {result && (
        <>
          <div className="card">
            <h2>{result.name}</h2>
            <p><strong>Sector:</strong> {result.sector}</p>
            <p><strong>Price:</strong> ₹{result.price}</p>
            <p><strong>PE:</strong> {result.pe}</p>
            <p><strong>PB:</strong> {result.pb}</p>
            <p><strong>ROE:</strong> {(result.roe * 100).toFixed(2)}%</p>
            <p><strong>Debt/Equity:</strong> {result.debtToEquity}</p>
            <p><strong>Suggestion:</strong> <strong>{result.suggestion}</strong></p>
            <p><strong>Entry Price:</strong> ₹{result.entry}</p>
            <p><strong>Target Price:</strong> ₹{result.target}</p>
          </div>

          {/* Chart toggle */}
          <div style={{ margin: '20px' }}>
            <button onClick={() => setShowDaily(!showDaily)}>
              {showDaily ? '🔁 Show 6-Month Chart' : '📅 Show Intraday Chart'}
            </button>
          </div>

          {/* Intraday chart */}
          {showDaily && result.chart_daily && (
            <div>
              <h3>📉 Intraday Price Chart (5m)</h3>
              <Line
                data={{
                  labels: result.chart_daily.timestamps,
                  datasets: [{
                    label: 'Price (₹)',
                    data: result.chart_daily.prices,
                    borderColor: '#e91e63',
                    tension: 0.3,
                    fill: false
                  }]
                }}
              />
              <h4 style={{ marginTop: '30px' }}>🔊 Volume</h4>
              <Bar
                data={{
                  labels: result.chart_daily.timestamps,
                  datasets: [{
                    label: 'Volume',
                    data: result.chart_daily.volume,
                    backgroundColor: 'rgba(100, 149, 237, 0.6)'
                  }]
                }}
              />
            </div>
          )}

          {/* 6-month chart */}
          {!showDaily && result.chart_6mo && (
            <div>
              <h3>📈 6-Month Price History</h3>
              <Line
                data={{
                  labels: result.chart_6mo.dates,
                  datasets: [{
                    label: 'Closing Price (₹)',
                    data: result.chart_6mo.prices,
                    borderColor: '#0070f3',
                    tension: 0.3,
                    fill: false
                  }]
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;