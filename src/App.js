import React from 'react';
import CurrencyConverter from './components/CurrencyConverter';

const App = () => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <CurrencyConverter /> {/* Your main component */}
    </div>
  );
};

export default App;
