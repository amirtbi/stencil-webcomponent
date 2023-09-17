import { Component, h, State, Prop, Element, Watch, Listen, Event, EventEmitter } from '@stencil/core';
import { setValues } from '../../utils/fetchCoinHandler';
@Component({
  tag: 'stock-price',
  styleUrl: './stock-price.scss',
  shadow: true,
})
export class StockPrice {
  stockInput: HTMLInputElement;

  @Element() el: HTMLElement;
  @Prop({ reflect: true }) title: string;
  @State() initialSymbol: string;
  @State() PairCoin: Map<any, any> = new Map();
  @State() stockUserInput: string;
  @State() stockInputValid = false;
  @State() error: string;
  @State() loading = 'false';
  @Prop({ reflect: true, mutable: true }) stockSymbol: string;
  @State() currentState: string;
  @Event({ bubbles: true, composed: true }) emittedEvent: EventEmitter<string>;

  @Watch('stockSymbol')
  async watchSymbolHanlder(newValue, oldValue) {
    if (newValue !== oldValue) {
      await this.setPrices(newValue);
    }
  }

  // Update status of disabled button
  onUpdateUserInput = (event: Event) => {
    this.stockUserInput = (event.target as HTMLInputElement).value;
    console.log('user input', this.stockUserInput);

    if (this.stockUserInput.trim() !== '') {
      this.stockInputValid = true;
    } else {
      this.stockInputValid = false;
    }
  };

  setPrices = async (symbol: string) => {
    console.log('symbol');

    try {
      const res = await setValues(symbol);
      if (res) {
        this.stockInputValid = true;
        this.stockSymbol = symbol;
        this.stockUserInput = this.stockSymbol;
        this.PairCoin = res;
        this.error = '';
      } else {
        this.error = 'Not valid symbol';
        return null;
      }
    } catch (e) {
      this.error = 'Not valid symbol';
      return null;
    }

    //this.initialSymbol = this.stockSymbol;
  };
  // Fetch price and send request
  onFetchPrice = async (event: Event) => {
    event.preventDefault();

    // const stockSymbol = (this.el.shadowRoot.querySelector('#symbol') as HTMLInputElement).value;
    const stockSymbol = this.stockInput.value;
    if (stockSymbol !== '') {
      await this.setPrices(stockSymbol);
    }
  };

  // Life cylces

  async connectedCallback() {
    this.loading = 'true';
    if (!this.stockSymbol) {
      console.log('========Connected callback====');

      const res = await setValues(this.stockSymbol);
      if (res) {
        this.PairCoin = res;
      }
      //this.initialSymbol = this.stockSymbol;
    }
    this.loading = 'false';
  }
  // Before rendering component
  // componentWillLoad() {
  //   console.log('component will load');
  //   this.Price = 0;
  // }

  componentDidRender() {
    this.currentState = 'did rendered';
    console.log('rendered component');
  }

  hostData() {
    return { class: 'error' };
  }
  // Component rendered completely
  async componentDidLoad() {
    this.loading = 'true';
    if (this.stockSymbol) {
      // const res = await fetchPrices(this.stockSymbol);
      await this.setPrices(this.stockSymbol);
    }
  }

  emitEvent() {
    this.emittedEvent.emit('true');
  }

  // async componentDidUpdate() {
  //   console.log('component updated ');
  //   if (this.stockSymbol !== this.initialSymbol) {
  //     console.log('http request sent');
  //     this.initialSymbol = this.stockSymbol;
  //     await this.setPrices(this.stockSymbol);
  //   }
  // }
  // Before rerendering component
  componentWillUpdate() {
    console.log('updating ');
  }

  // Listen evenets from body
  @Listen('emittedSymbol', { target: 'body' })
  async onSubmitListenedEmit(event: CustomEvent) {
    console.log('Emiited');
    if (event.detail !== this.stockSymbol && event.detail) {
      await this.setPrices(event.detail + '-USD');
    }
  }
  render() {
    let PriceWrapper = <div>Please enter a valid symbol</div>;

    if (this.error) {
      PriceWrapper = <div class="error">Error:{this.error}</div>;
    } else if (this.PairCoin.size > 0) {
      PriceWrapper = (
        <div>
          <p>Symbol:&nbsp;{this.PairCoin.get('name')}</p>
          <p>Price:&nbsp;{this.PairCoin.get('formatted')}</p>
        </div>
      );
    } else {
      PriceWrapper = <div>Please enter a valid symbol</div>;
    }

    return [
      <form id="form" onSubmit={this.onFetchPrice.bind(this)}>
        <div>Status:{this.currentState}</div>
        <div class="field">
          <input value={this.stockUserInput} onInput={this.onUpdateUserInput.bind(this)} ref={el => (this.stockInput = el)} placeholder="stock symbol" id="symbol" />
        </div>
        <div class="field">
          <button disabled={!this.stockInputValid} id="btn-submit" type="submit">
            Fetch Price
          </button>
        </div>
      </form>,
      <button onClick={this.emitEvent.bind(this)}>Emit event</button>,

      <section class={this.error ? 'error-box' : ''}>{PriceWrapper}</section>,
    ];
  }
}
