import { CustomElement } from './CustomElement.js';
import '../../deps/flatpickr/flatpickr.min.js';

/**
 * Date picker element based on Flatpickr
 */
export class DatePicker extends CustomElement {
    /**
     * Flatpickr instance
     * @type {flatpickr}
     */
    #picker = null;

    /**
     * @inheritdoc
     */
    ceCss() {
        return `
            :host {
                padding: 24px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
            }

            :host > * {
                margin: 0 3px;
            }

            .label-date {
                font-size:1.1rem;
                color: var(--theme-accent-color);
            }

            .date-input {
                min-width:100px;
                text-align: center;
            }
        `
    }

    /**
     * @inheritdoc
     */
    ceHtml(html) {
        return html`
            <span class="label-date">On Date:</span>
            <input _flatpickr class="date-input"></input>
            <button class="mi btn-icon" @click=${this.#onIconClick}>event</button>
        `
    }

    /**
     * @inheritdoc
     */
    ceStart() {
        // setup flatpickr
        const el = this.ceRef('_flatpickr');
        this.#picker = flatpickr(el, {
            defaultDate: new Date(),
            dateFormat: 'l, F-j, Y',
            minDate: new Date(Date.now() - 72 * 3600000),
        });

        // handle changes
        this.#picker.config.onChange.push((dates) => {
            this.#picker.close();
            this.ceEvent('change', dates[0]);
        });
    }

    /**
     * Currently selected date
     * @type {Date}
     */
    get selectedDate() {
        return this.#picker?.selectedDates[0];
    }

    /**
     * On date icon click
     */
    #onIconClick() {
        this.#picker?.open();
    }
}
CustomElement.register('app-date-picker', DatePicker);