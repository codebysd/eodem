import * as lit from '../../deps/lit-html/lit-html.min.js';
import '../../deps/less/less.min.js';

/**
 * Turn off less.js noise
 */
less.options.logLevel = 0;
const COMMON_STYLES = ['theme.less', 'ce.less'].map(s => less.render(`@import "/assets/styles/${s}";`, { filename: s }));

/**
 * A minimal custom component implementation.
 * Utilizes lit-html for markup templating and rendering and less.js for styles.
 * Provides simple lifecycle hooks.
 */
export class CustomElement extends HTMLElement {

    /**
     * Tracks first time initialization status.
     * @type {boolean}
     */
    #isInitialized = false;

    /**
     * Tracks DOM attached status.
     * @type {boolean}
     */
    #isActive = false;

    /**
     * Shadow DOM host (root)
     * @type {ShadowRoot}
     */
    #shadowRoot = null;

    /**
     * Element styles compiled by less.js
     * @type {Less.RenderOutput[]}
     */
    #compiledStyles = [];

    /**
     * Initializes instance.
     */
    constructor() {
        super();
        // attach a shadow root
        this.#shadowRoot = this.attachShadow({ mode: 'closed' });

        // compile styles at creation
        this.#compileStyles();
    }

    /**
     * Compile element styles.
     */
    #compileStyles() {
        // include common styles for shadow root
        Promise.all([...COMMON_STYLES,less.render(this.ceCss() ?? '',{filename:this.constructor.name})]).then(s => {
            this.#compiledStyles = s;
            if (this.#isActive) {
                this.ceRender();
            }
        }).catch(err => {
            const stack = err?.extract?.map(i => i.trim()).join('\n');
            console.error(`Error processing styles for: "${err.filename}", at: \n${stack}`);
        });
    }

    /**
     * Synatx sugar for registering a component.
     * @param {string} name Web component name 
     * @param {Function} clazz Web component class 
     * @returns Web component class
     */
    static register(name, clazz) {
        window.customElements.define(name, clazz);
        return clazz;
    }

    /**
     * True if component is attached to DOM.
     */
    get ceActive() {
        return this.#isActive;
    }

    /**
     * The host element of the custom component.
     * @type {HTMLElement}
     */
    get ceHost() {
        return this.#shadowRoot.host;
    }

    /**
     * Get root of component shadow DOM. Usefull for querying component DOM.
     */
    get ceRoot() {
        return this.#shadowRoot;
    }

    /**
     * Called on render. Should return a CSS string.
     * Subclasses hould override this method to provide custom styles.
     * @returns CSS styles for the component.
     */
    ceCss() {
        return '';
    }

    /**
     * Called on render. Should return an HTML template.
     * Subclasses hould override this method to provide custom HTMl template.
     * @param {lit.html} html - html template function.
     * @param {lit} lit - html renderer.
     * @returns HTML template for the component.
     */
    ceHtml(html, lit) {
        return html``;
    }

    /**
     * Called when component is attched to DOM for first time.
     * Subclasses should override this method to provide custom logic.
     */
    ceInit() {
        // override to customize
    }

    /**
     * Callled when component is attached to the DOM.
     * Subclasses should override this method to provide custom logic.
     */
    ceStart() {
        // override to customize
    }

    /**
     * Called when component is detached from the DOM.
     * Subclasses should override this method to provide custom logic.
     */
    ceStop() {
        // override to customizes
    }


    /**
     * Detect DOm attchement and call lifecycle hooks.
     */
    #onAttachedChanged() {
        // check if cannected state is changed
        if (this.isConnected === this.#isActive) {
            // nothing changed
            return;
        }

        // update active state
        this.#isActive = this.isConnected;

        if (this.#isActive) {
            // one time initialization
            if (!this.#isInitialized) {
                this.#isInitialized = true;
                this.ceInit();
                this.ceRender();
            }

            // call start hook
            this.ceStart();
        } else {
            // call stop hook
            this.ceStop();
        }
    }

    /**
     * Called once on first initialization.
     * Should be called whenever rendered content is to be updated.
     */
    ceRender() {
        // component markup
        const markup = lit.html`
            ${this.#compiledStyles.map(s => lit.html`<style>${s.css}</style>`)}
            ${this.ceHtml(lit.html, lit)}`;

        // render markup in shadow host
        lit.render(markup, this.#shadowRoot, { host: this });
    }

    /**
     * @internal
     * Called by browser when component is connected to the DOM
     */
    connectedCallback() {
        this.#onAttachedChanged();
    }

    /**
     * @internal
     * Called by browser when component is disconnected from the DOM
     */
    disconnectedCallback() {
        this.#onAttachedChanged();
    }

    /**
     * @internal
     * Called by browser when component is migrated to the DOM of another document
     */
    adoptedCallback() {
        this.#onAttachedChanged();
    }

    /**
     * @internal
     * Element by browser attributes changed
     */
    attributeChangedCallback() {
        this.ceRender();
    }

    /**
     * Query select an element marked with given reference attribute.
     * @param {string} ref Reference name of the element
     * @returns matching element or null
     */
    ceRef(ref) {
        return this.ceRoot.querySelector(`[${ref}]`);
    }

    /**
     * Dispatch a custom event.
     * @param {string} name event name/type
     * @param {*} [data] optional event data 
     */
    ceEvent(name, data) {
        this.dispatchEvent(new CustomEvent(name, { composed: true, detail: data ?? {} }))
    }
}