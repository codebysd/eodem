import { CustomElement } from './lib/CustomElement.js';
import { TimeZone } from './lib/TimeZone.js';
import { TopBar } from './TopBar.js';
import { DatePicker } from './lib/DatePicker.js';
import { TimeStrip } from './TimeStrip.js';

/**
 * App element.
 */
export class App extends CustomElement {

    /**
     * Currently shown time zones
     * @type {string[]}
     */
    #zones = [];

    /**
     * Time strip shared scroll offset from top.
     * @type {number}
     */
    #stripScrollTop = 0;

    /**
     * @inheritdoc
     */
    ceCss() {
        return `
            :host {
                padding: 0;
                margin: 0;
                height:100%;
                width: 100%;
                background: radial-gradient(ellipse 100% 100% at 50% 25%, #fff, #ddd);
                display:flex;
                flex-direction:column;
                flex-wrap:nowrap;
            }

            .content {
               padding:12px;
               display:flex;
               flex-direction:row;
               flex-wrap:nowrap;
               align-items:flex-start;
               flex:1;
               min-height:0;     
            }

            .strip {
                align-self: stretch;
                flex-basis: 200px;
            }

            .btn-add {
                margin:4px;
            }
        `
    }

    /**
     * @inheritdoc
     */
    ceHtml(html) {
        return html`
            <app-top-bar></app-top-bar>
            <app-date-picker _picker @change=${this.ceRender}></app-date-picker>
            <div class="content">
                ${this.#zones.map((z, i) => this.#renderStrip(html, z, i))}
                <button class="btn-add" @click="${this.#onClickAddZone}">Add Time Zone</button>
            </div>
        `
    }

    /**
     * Render time strip
     * @param {html} html html renderer 
     * @param {string} zone time zone
     * @param {number} index time strip index
     * @returns {string} Time strip markup
     */
    #renderStrip(html, zone, index) {
        return html`
        <app-time-strip class="strip" 
            .zone=${zone} 
            .date=${this.#date} 
            .contentScroll=${this.#stripScrollTop}
            @close=${() => this.#onClickCloseStrip(index)}
            @scrollContent=${this.#onScrollStrip}>
        </app-time-strip>`
    }

    /**
     * Currently selected date
     * @type {Date}
     */
    get #date() {
        return this.ceRef('_picker')?.selectedDate;
    }

    /**
     * @inheritdoc
     */
    ceStart() {
        this.#zones.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
        this.ceRender();
    }

    /**
     * Handle time zone addition
     */
    #onClickAddZone() {
        const zone = TimeZone.ZONES[Math.floor(Math.random()*TimeZone.ZONES.length)];
        this.#zones.push(zone);
        this.ceRender();
    }

    /**
     * Handle time strip close.
     * @param {number} index Time strip index 
     */
    #onClickCloseStrip(index) {
        this.#zones.splice(index, 1);
        this.ceRender();
    }

    /**
     * Handle time strip scroll
     * @param {{detail:{top:number}, target: TimeStrip}} evt 
     */
    #onScrollStrip(evt) {
        this.#stripScrollTop = evt?.detail?.top ?? 0;
        this.ceRoot.querySelectorAll('app-time-strip').forEach(el => {
            if (el instanceof TimeStrip && el !== evt.target) {
                el.contentScroll = this.#stripScrollTop;
            }
        })
    }
}
CustomElement.register('eo-app', App);