import { Component, h, State, Prop, Element } from '@stencil/core';
import { fetchPrice } from '../../utils/fetchStock';
@Component({
  tag: 'stock-price',
  styleUrl: './stock-price.scss',
  shadow: true,
})
export class StockPrice {
  stockInput: HTMLInputElement;
  @Element() el: HTMLElement;
  @Prop({ reflect: true }) title: string;
  @State() Price: number | undefined;
  @State() stockUserInput: string;
  @State() stockInputValid = false;
  @State() error: string;
  @Prop() stockSymbol: string;

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

  // Fetch price and send request
  onFetchPrice = async (event: Event) => {
    event.preventDefault();
    try {
      // const stockSymbol = (this.el.shadowRoot.querySelector('#symbol') as HTMLInputElement).value;
      const stockSymbol = this.stockInput.value;
      if (stockSymbol !== '') {
        const res = await fetchPrice(stockSymbol);
        console.log('res', res);
        if ('05. price' in res) {
          this.Price = res['05. price'];
          this.error = null;
        } else {
          this.stockUserInput = '';
          throw new Error('Something went wrong');
        }
      } else {
        this.stockUserInput = '';
        this.Price = undefined;
      }

      console.log('price', this.Price);
    } catch (e) {
      this.error = e.message;
      this.Price = undefined;
      this.stockUserInput = '';
      this.stockInputValid = false;
      console.log('error', e);
    }
  };

  async componentDidLoad() {
    if (this.stockSymbol) {
      const res = await fetchPrice(this.stockSymbol);
      this.Price = res['05. price'];
    }
  }
  render() {
    let PriceWrapper = <div>Please enter a valid symbol</div>;

    if (this.error) {
      PriceWrapper = <div class="error">Error:{this.error}</div>;
    }
    if (this.Price !== undefined) {
      PriceWrapper = <div>Price:{this.Price}</div>;
    } else {
      PriceWrapper = <div>Please enter a valid symbol</div>;
    }

    return [
      <form id="form" onSubmit={this.onFetchPrice.bind(this)}>
        <div class="field">
          <input value={this.stockUserInput} onInput={this.onUpdateUserInput.bind(this)} ref={el => (this.stockInput = el)} placeholder="stock symbol" id="symbol" />
        </div>
        <div class="field">
          <button disabled={!this.stockInputValid} id="btn-submit" type="submit">
            Fetch Price
          </button>
        </div>
      </form>,

      <section class={this.error ? 'error-box' : ''}>{PriceWrapper}</section>,
    ];
  }
}
