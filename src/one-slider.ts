import { css, CSSResultArray, html, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { BaseCSS, OneBase, Point } from './one-base'
import { line, ellipse } from "./one-lib";

@customElement('one-slider')
export class OneSlider extends OneBase {
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;

  @query('input') private input?: HTMLInputElement;

  private knob?: SVGElement;
  private canvasWidth = 300;
  private pendingValue?: number;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
      :host {
        display: inline-block;
        position: relative;
        width: 300px;
        box-sizing: border-box;
      }
      input[type=range] {
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        margin: 0;
        -webkit-appearance: none;
        background: transparent;
        outline: none;
        position: relative;
      }
      input[type=range]::-moz-range-thumb {
        border-radius: 50px;
        background: none;
        cursor: pointer;
        border: none;
        margin: 0;
        height: 24px;
        width: 24px;
        line-height: 1;
      }
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        border-radius: 50px;
        background: none;
        cursor: pointer;
        border: none;
        height: 24px;
        width: 24px;
        margin: 0;
        line-height: 1;
      }
      .bar {
        stroke: rgb(255, 255, 255);
        stroke-width: 1;
      }
      .knob {
        fill: rgb(51, 103, 214);
        stroke: rgb(51, 103, 214);
      }
    `];
  }

  get value(): number {
    if (this.input) {
      return +this.input.value;
    }

    return this.min;
  }

  set value(v: number) {
    if (this.input) {
      this.input.value = `${v}`;
    } else {
      this.pendingValue = v;
    }
    this.updateThumbPosition();
  }

  oneRender(force: boolean = false) {
    super.oneRender(force);
    this.updateThumbPosition();
  }

  firstUpdated() {
    this.value = this.pendingValue || +(this.getAttribute('value') || this.value || this.min);
    delete this.pendingValue;
  }

  render(): TemplateResult {
    return html`
    <div id="container">
      <input type="range"
        min="${this.min}"
        max="${this.max}"
        step="${this.step}"
        @input="${this.onInput}"
      >
      <div id="overlay">
        <svg></svg>
      </div>
    </div>
    `;
  }

  private onInput(e: Event) {
    e.stopPropagation();
    this.updateThumbPosition();
    if (this.input) {
      this.fire('change', { value: +this.input.value });
    }
  }

  protected canvasSize(): Point {
    const size = this.getBoundingClientRect();
    return [size.width, size.height];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    this.canvasWidth = size[0];
    const midY = Math.round(size[1] / 2);
    line(svg, 0, midY, size[0], midY).classList.add('bar');
    this.knob = ellipse(svg, 12, midY, 24, 24);
    this.knob.classList.add('knob');
  }

  private updateThumbPosition() {
    if (this.input) {
      const value = +this.input!.value;
      const delta = Math.max(this.step, this.max - this.min);
      const pct = (value - this.min) / delta;
      if (this.knob) {
        this.knob.style.transform = `translateX(${pct * (this.canvasWidth - 24)}px)`;
      }
    }
  }
}
