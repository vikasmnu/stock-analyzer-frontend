import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function App() {
  const [symbol, setSymbol] = useState('');
  const [result, setResult] = useState(null);

  const analyze = async () => {
    try {
      const formattedSymbol = symbol.toUpperCase().endsWith(".NS")
        ? symbol.toUpperCase()
        : symbol.toUpperCase() + ".NS";

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
      <input
        type="text"
        placeholder="Enter stock symbol (e.g. TCS)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <button onClick={analyze}>Analyze</button>

      {result && (
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
      )}

      {/* 6-Month Chart */}
      {result?.chart_6mo && (
        <div style={{ marginTop: '40px' }}>
          <h3>📈 6-Month Price History</h3>
          <Line
            data={{
              labels: result.chart_6mo.dates,
              datasets: [
                {
                  label: 'Closing Price (₹)',
                  data: result.chart_6mo.prices,
                  borderColor: '#0070f3',
                  tension: 0.3,
                  fill: false,
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: false,
                },
              },
            }}
          />
        </div>
      )}

      {/* Intraday Chart */}
      {result?.chart_daily && (
        <div style={{ marginTop: '40px' }}>
          <h3>📉 Intraday Price Chart (Today - 5 min)</h3>
          <Line
            data={{
              labels: result.chart_daily.timestamps,
              datasets: [
                {
                  label: 'Price (₹)',
                  data: result.chart_daily.prices,
                  borderColor: '#e91e63',
                  tension: 0.3,
                  fill: false,
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                x: {
                  ticks: {
                    maxTicksLimit: 12,
                    autoSkip: true,
                  },
                },
                y: {
                  beginAtZero: false,
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;