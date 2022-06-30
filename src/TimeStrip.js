import { CustomElement } from './lib/CustomElement.js';
import { TimeZone } from './lib/TimeZone.js';

/**
 * @typedef Slot
 * @property {string} from
 * @property {string} to
 * @property {boolean} daytime
 * @property {boolean} worktime
 */

/**
 * Time slot listing for a particular date in a particular time zone.
 */
export class TimeStrip extends CustomElement {
    /**
     * Current time zone.
     * @type {string}
     */
    #zone;

    /**
     * Current content scroll offset from top.
     * @type {number}
     */
    #contentScroll = 0;

    /**
     * Current date.
     * @type {Date}
     */
    #date;

    /**
     * Current slots
     * @type {Array<Slot>}
     */
    #slots = [];

    /**
     * @inheritdoc
     */
    ceCss() {
        return `
            :host {
                min-width: 100px;
                border: 0px solid transparent;
                border-radius: 3px;
                background: radial-gradient(ellipse 100% 100% at 50% 25%, #fff, transparent);
                box-shadow: 0 0 4px #ccc;
                margin:4px;
                display:flex;
                flex-direction: column;
                align-items: stretch;
                flex-wrap: nowrap;
            }

            :host > * {
                min-height: 0;
            }

            .header {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                align-items:flex-start;
                flex-shrink: 0;
            }

            .header > * {
                min-width:0;
            }

            .title {
                margin: 6px;
                font-size: 1.1rem;
                color: var(--theme-accent-color);
                overflow:hidden;
                text-overflow:ellipsis;
                flex:1;
                text-align:center;
            }

            .icon-close {
                color: #ccc;
                cursor: pointer;
                padding: 3px;
            }

            .header:hover > .icon-close {
                color: #666;
            }

            .strip {
                display: flex;
                flex-direction: column;
                flex-wrap: nowrap;
                align-items:stretch;
                gap: 6px;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 6px;
            }

            .strip > span {
                padding:4px;
                text-align: center;
                border-top: 1px solid #eee;
            }
        `
    }

    /**
     * Current time zone
     * @param {string} z
     */
    set zone(z) {
        this.#zone = z;
        this.#updateSlots();
        this.ceRender();
    }

    /**
     * Current date
     * @param {Date} d
     */
    set date(d) {
        this.#date = d;
        this.#updateSlots();
        this.ceRender();
    }

    /**
     * Content scroll offset from top.
     * @param {number} n
     */
    set contentScroll(n) {
        this.#contentScroll = n;
        if (this.ceActive) {
            this.#updateContentScroll();
        }
    }

    /**
     * @inheritdoc
     */
    ceStart() {
        this.#updateContentScroll();
    }

    /**
     * @inheritdoc
     */
    ceHtml(html) {
        return html`
        <div class="header">
            <span class="title">${this.#zone}</span>
            <span class="mi mi-small icon-close" @click=${this.#onClickClose}>close</span>
        </div>
        <div _strip class="strip" @scroll=${this.#onScrollContent} data-simplebar>
            ${this.#slots.map(s => this.#renderSlot(s, html))}
        </div>
        `;
    }

    /**
     * Render a time slot.
     * @param {Slot} slot Time slot
     * @param {html} html HTML renderer 
     * @returns 
     */
    #renderSlot(slot, html) {
        return html`
        <span>${slot.from} - ${slot.to}</span>
        `
    }

    /**
     * Handle close click.
     */
    #onClickClose() {
        this.ceEvent('close', this.#zone);
    }

    /**
     * Handle content scroll
     * @param {Event} evt 
     */
    #onScrollContent(evt) {
        if (evt.target instanceof Element) {
            this.ceEvent('scrollContent', { top: evt.target.scrollTop });
        }
    }

    /**
     * Update content scroll offset from top.
     */
    #updateContentScroll() {
        const el = this.ceRef('_strip');
        if (el instanceof Element) {
            el.scrollTop = this.#contentScroll;
        }
    }

    #updateSlots() {
        this.#slots = TimeZone.slots(this.#zone,this.#date);
    }
}
CustomElement.register('app-time-strip', TimeStrip);