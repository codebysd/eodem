import {CustomElement} from './lib/CustomElement.js';

/**
 * Application header/top bar
 */
export class TopBar extends CustomElement {
    /**
     * @inheritdoc
     */
    ceCss() {
        return `
            :host {
                width:100%;
                height:3rem;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                box-shadow: 0 1px 4px #ccc;

                display: flex;
                flex-direction: row;
                align-items: center;

                padding:0;
                background: radial-gradient(ellipse 200% 150% at top, #fff, #eee);
            }

            :host > * {
                margin: 0 4px;
            }

            .title {
                font-size: 1.5rem;
                color: var(--theme-accent-color);
            }
        `;
    }

    /**
     * @inheritdoc
     */
    ceHtml(html){
        return html`
            <span class="mi mi-medium">schedule</span>
            <span class="title">Time Zone Matcher</span>
            <div style="flex-grow:1"></div>
            <span class="mi">help_outline</span>
            <a href="https://github.com/codebysd/eodem" target="_blank">Github</a>
        `;
    }
}
CustomElement.register('app-top-bar',TopBar);