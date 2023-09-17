import { Component, h, Method, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'custom-side-drawer',
  styleUrl: './side-drawer.scss',
  shadow: true,
})
export class SideDrawer {
  @State() counter = 0;
  @State() showContactInfo = false;
  @Prop({ reflect: true }) topic: string;
  @Prop({ reflect: true, mutable: true }) opened: boolean;

  onClickTab(content: string) {
    this.showContactInfo = content === 'contact';
    console.log('nav clicked', content);
  }

  onClickIncrease() {
    this.counter += 1;
    console.log('clicked', this.counter);
  }
  onBackdropClick() {
    this.opened = false;
  }
  onClickDrawer() {
    this.opened = false;
  }

  @Watch('counter')
  WatchHanlder(newValue: number) {
    this.counter = newValue;
  }

  /**
   * @Method
   * make the open function expose to light DOM
   */
  @Method()
  async open() {
    this.opened = true;
  }
  render() {
    let mainContent = <slot />;

    if (this.showContactInfo) {
      mainContent = [
        <div id="contact-information">
          <h1>Contact information</h1>
          <p>You can reach us via phone or Email</p>
          <ul>
            <li>Phone:9336207711</li>
            <li>
              Email:<a href="mailto:something@gmail.com">something@gmail.com</a>
            </li>
          </ul>
        </div>,
        <div>
          <button onClick={this.onClickIncrease.bind(this)}>Add</button>
        </div>,
      ];
    }

    return [
      <div onClick={this.onBackdropClick.bind(this)} id="backdrop"></div>,
      <aside>
        <header>
          <div>
            <h1>{this.topic}</h1>
            <span>{this.counter}</span>
            <button onClick={this.onClickDrawer.bind(this)}>X</button>
          </div>
          <div class="tabs">
            <button class={this.showContactInfo ? '' : 'active'} onClick={this.onClickTab.bind(this, 'nav')}>
              Navigation
            </button>
            <button class={!this.showContactInfo ? '' : 'active'} onClick={this.onClickTab.bind(this, 'contact')}>
              Contact
            </button>
          </div>
        </header>
        <main>{mainContent}</main>
      </aside>,
    ];
  }
}
