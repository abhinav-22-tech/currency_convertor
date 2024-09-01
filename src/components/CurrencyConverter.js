import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import ColorGradientAnimation from './ColorGradientAnimation';
import './CurrencyConverter.css';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [error, setError] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [currencyNames, setCurrencyNames] = useState({});

  const fetchCurrencies = useCallback(async () => {
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      setCurrencies(Object.keys(response.data.rates));

      const namesResponse = await axios.get('https://restcountries.com/v3.1/all');
      const names = namesResponse.data.reduce((acc, country) => {
        if (country.currencies) {
          Object.entries(country.currencies).forEach(([code, currency]) => {
            acc[code] = currency.name;
          });
        }
        return acc;
      }, {});
      setCurrencyNames(names);
    } catch (error) {
      setError('Error fetching currency list');
    }
  }, []);

  const fetchExchangeRate = useCallback(debounce(async () => {
    try {
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      setExchangeRate(response.data.rates[toCurrency]);
      setError(null);
    } catch (error) {
      setError('Error fetching exchange rate');
    }
  }, 1000), [fromCurrency, toCurrency]);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  useEffect(() => {
    fetchExchangeRate();
  }, [fetchExchangeRate]);

  useEffect(() => {
    setConvertedAmount(amount * exchangeRate);
  }, [amount, exchangeRate]);

  return (
    <div className="currency-converter">
      <ColorGradientAnimation />
      <div className="content">
        <h1>Currency Converter</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="any"
          />
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencies.map(currency => (
              <option key={currency} value={currency}>
                {currency} ({currencyNames[currency] || currency})
              </option>
            ))}
          </select>
          <span> to </span>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencies.map(currency => (
              <option key={currency} value={currency}>
                {currency} ({currencyNames[currency] || currency})
              </option>
            ))}
          </select>
        </div>
        <h2>Converted Amount: {convertedAmount.toFixed(2)} {toCurrency}</h2>
      </div>
    </div>
  );
};

export default CurrencyConverter;
