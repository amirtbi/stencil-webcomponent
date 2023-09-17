import { Component, h, Element, State, Event, EventEmitter, Listen } from '@stencil/core';
import { getExchangesRate } from '../../utils/fetchExchangeHandler';
@Component({
  tag: 'exchange-rate',
  styleUrl: './exchange-rate.scss',
  shadow: true,
})
export class StockFinder {
  pairCoinNameInput: HTMLInputElement;
  names = [1, 2, 3, 4, 5];
  @State() currencyInputValue: string;
  @State() rates: Map<string, any> = new Map([]);
  @State() error: boolean = false;
  @State() currency: string;
  @State() receivedEmit: string = 'false';
  @State() loading: boolean = false;
  @Element() el: HTMLElement;
  @Event({ bubbles: true, composed: true }) emittedSymbol: EventEmitter<string>;

  addRates(rates) {
    this.rates.clear();
    console.log('rates', this.rates);
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
      this.loading = true;
      const response = await getExchangesRate(this.pairCoinNameInput.value);
      const res: any = await response;
      if (res.code === 'ERR_NETWORK') {
        this.error = true;
        this.loading = false;
        return;
      }
      const dataObj = res.data;
      this.currency = res.data.data.currency;
      const { rates } = dataObj.data;

      this.addRates(rates);

      console.log('rates map', this.rates);
    } catch (e) {
      this.loading = false;
    } finally {
      this.loading = false;
    }
  }

  hostData() {
    if (this.error) {
      return { class: 'error' };
    }
  }
  @Listen('emittedEvent', { target: 'body' })
  prinMessage(event: CustomEvent) {
    console.log('Event', event);
    if (event.detail && event.detail === 'true') {
      this.receivedEmit = event.detail;
    }
  }
  onEmitSymbol(symbol: string) {
    console.log('selected symbol', symbol);
    this.emittedSymbol.emit(symbol);
  }
  render() {
    let className;
    let exchangeRatesWrapper = <div>Please enter your currency</div>;
    let btnText = 'Find Exchange rates';

    if (this.loading) {
      exchangeRatesWrapper = <custom-spinner></custom-spinner>;
    }
    if (this.error) {
      className = 'error';
    } else {
      className = null;
    }
    if (this.rates.size > 0 && !this.loading) {
      exchangeRatesWrapper = (
        <ul>
          {Array.from(this.rates.keys()).map((key: string) => {
            return (
              <li onClick={this.onEmitSymbol.bind(this, key)} key={key}>
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
            <input class={className} value={this.currencyInputValue} ref={el => (this.pairCoinNameInput = el)} placeholder="pair coin" />
          </div>
          <div class="field">
            <button disabled={this.loading} type="submit">
              {btnText}
            </button>
          </div>
        </form>
        <div class="list-container">{exchangeRatesWrapper}</div>
      </div>,
    ];
  }
}
