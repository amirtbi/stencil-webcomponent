let selectedSymbol;
const exChangeRateEl = document.querySelector('exchange-rate');
const stockPriceEl = document.querySelector('stock-price');
exChangeRateEl.addEventListener('emittedSymbol', event => {
  selectedSymbol = event.detail;

  if (selectedSymbol) {
    stockPriceEl.stockSymbol = selectedSymbol + '-USD';
  }
  console.log('event', event.detail);
});

stockPriceEl.addEventListener('emittedEvent', event => {
  console.log('Evenet', event);
});
