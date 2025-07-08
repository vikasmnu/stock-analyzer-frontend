import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [symbol, setSymbol] = useState('');
  const [result, setResult] = useState(null);

  const analyze = async () => {
    try {
         const response = await axios.post('https://stock-analyzer-backend-rfie.onrender.com/analyze', {
         symbol: symbol.toUpperCase().endsWith(".NS") ? symbol.toUpperCase() : symbol.toUpperCase() + ".NS"
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
        placeholder="Enter stock symbol (e.g., TCS.NS)"
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
    </div>
  );
}

export default App;