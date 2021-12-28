import { css, CSSResultArray, html, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseCSS, OneBase, Point } from './one-base'
import { rectangle } from './one-lib';

@customElement('one-input')
export class OneInput extends OneBase {
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) type = 'text';
  @property({ type: Number }) size?: number;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
      :host {
        display: inline-block;
        position: relative;
        padding: 5px;
        font-family: inherit;
        width: 150px;
        outline: none;
      }
      input {
        display: block;
        width: 100%;
        box-sizing: border-box;
        outline: none;
        border: none;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        padding: 6px;
      }
    `];
  }

  oneRender(force: boolean = false) {
    super.oneRender(force);
  }

  render(): TemplateResult {
    return html`
    <input type="${this.type}" size="${this.size}">
    <div id="overlay">
      <svg></svg>
    </div>
    `;
  }

  protected canvasSize(): Point {
    const size = this.getBoundingClientRect();
    return [size.width, size.height];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    rectangle(svg, 2, 2, size[0] - 2, size[1] - 2);
  }
}
