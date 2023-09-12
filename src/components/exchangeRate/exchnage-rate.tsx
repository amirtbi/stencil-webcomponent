import { Component, h, Element, State } from '@stencil/core';
import { getExchangesRate } from '../../utils/fetchExchangeHandler';
@Component({
  tag: 'exchange-rate',
  styleUrl: './exchange-rate.scss',
  shadow: true,
})
export class StockFinder {
  pairCoinNameInput: HTMLInputElement;

  @State() currencyInputValue: string;
  @State() rates: Map<string, any> = new Map([]);
  @State() currency: string;
  @Element() el: HTMLElement;

  addRates(rates) {
    const listOfRates = Object.entries(rates);
    for (const [key, value] of listOfRates) {
      this.rates.set(key, value);
    }
  }
  async onSubmitForm(e: Event) {
    console.log('Event', e);
    e.preventDefault();

    try {
      console.log('input value', this.pairCoinNameInput.value);
      const response = await getExchangesRate(this.pairCoinNameInput.value);
      const res = await response;
      const dataObj = res.data;
      this.currency = res.data.data.currency;
      const { rates } = dataObj.data;

      this.addRates(rates);

      console.log('rates map', this.rates);
    } catch (e) {}
  }
  render() {
    let exchangeRatesWrapper = <div>Please enter your currency</div>;

    if (this.rates.size > 0) {
      exchangeRatesWrapper = (
        <ul>
          {Array.from(this.rates.keys()).map((key: string) => {
            return (
              <li key={key}>
                <p>{key}</p>
                <p>{Math.floor(Number(this.rates.get(key)))}</p>
              </li>
            );
          })}
          ;
        </ul>
      );
    }
    return [
      <div class="wrapper">
        <form class="form-container" onSubmit={this.onSubmitForm.bind(this)}>
          <div class="field">
            <input value={this.currencyInputValue} ref={el => (this.pairCoinNameInput = el)} placeholder="pair coin" />
          </div>
          <div class="field">
            <button type="submit">Find Exchange rates</button>
          </div>
        </form>
        <div class="list-container">{exchangeRatesWrapper}</div>
      </div>,
    ];
  }
}
