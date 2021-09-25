import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
// import { fireEvent } from './one-base';

interface RadioItem extends HTMLElement {
  name: string;
  checked: boolean;
}

@customElement('one-radio-group')
export class OneRadioGroup extends LitElement {
  @property({ type: String }) selected?: string;
  private radioNodes: RadioItem[] = [];
  private checkListener = this.handleChecked.bind(this);

  static get styles() {
    return css`
      :host {
        display: inline-block;
        font-family: inherit;
        outline: none;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <slot id="slot" @slotchange="${this.slotChange}"></slot>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this.checkListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('change', this.checkListener);
  }

  slotChange() {
    this.requestUpdate();
  }

  firstUpdated() {
    this.setAttribute('role', 'radiogroup');
    this.tabIndex = +(this.getAttribute('tabindex') || 0);
    this.addEventListener('keydown', event => {
      switch(event.keyCode) {
        case 37:
        case 38:
          event.preventDefault();
          break;
        case 39:
        case 40:
          event.preventDefault();
          break;
      }
    });
  }

  updated() {
    const slot = this.shadowRoot!.getElementById('slot') as HTMLSlotElement;
    const nodes = slot.assignedNodes();
    this.radioNodes = [];
    if (nodes && nodes.length) {
      for (let i = 0; i < nodes.length; i++) {
        const element = nodes[i] as RadioItem;
        if (element.tagName === 'ONE-RADIO') {
          this.radioNodes.push(element);
          const name = element.name || '';
          if (this.selected && (name === this.selected)) {
            element.checked = true;
          } else {
            element.checked = false;
          }
        }
      }
    }
  }

  private handleChecked(event: Event) {
    const checked = (event as CustomEvent).detail.checked;
    const item = event.target as any as RadioItem;
    const name = item.name || '';
    if (!checked) {
      item.checked = true;
    } else {
      this.selected = (checked && name) || '';
      this.firstUpdated();
    }
  }

  // private firstSelected() {
  //   fireEvent(this, 'selected', { selected: this.selected });
  // }
}