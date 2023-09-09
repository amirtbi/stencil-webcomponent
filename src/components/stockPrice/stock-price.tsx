import { Component, h, State, Prop, Element } from '@stencil/core';
import { fetchPrice } from '../../utils/fetchStock';
@Component({
  tag: 'stock-price',
  styleUrl: './stock-price.scss',
  shadow: true,
})
export class StockPrice {
  @Element() el: HTMLElement;
  @Prop({ reflect: true }) title: string;
  @State() Price = 0;

  async onFetchPrice(event: Event) {
    event.preventDefault();
    try {
      const stockSymbol = (this.el.shadowRoot.querySelector('#symbol') as HTMLInputElement).value;
      if (stockSymbol !== '') {
        const res = await fetchPrice(stockSymbol);
        this.Price = res['05. price'];
      } else {
        this.Price = 0;
      }

      console.log('price', this.Price);
    } catch (e) {
      console.log('error', e);
    }
  }
  render() {
    return [
      <form id="form" onSubmit={this.onFetchPrice.bind(this)}>
        <div class="field">
          <input placeholder="stock symbol" id="symbol" />
        </div>
        <div class="field">
          <button id="btn-submit" type="submit">
            Fetch Price
          </button>
        </div>
      </form>,
      <div>Price:${this.Price}</div>,
    ];
  }
}
