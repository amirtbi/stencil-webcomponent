import { Component, h } from '@stencil/core';

@Component({
  tag: 'custom-spinner',
  styleUrl: './spinner.scss',
  shadow: true,
})
export class CustomSpinner {
  render() {
    return (
      <div class="wrapper">
        <div class="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
}
