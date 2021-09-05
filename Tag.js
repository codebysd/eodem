import { html as litHtml, render as litRender } from 'https://unpkg.com/lit-html@1.4.1/lit-html.js?module';

/**
 * Poor man's web components framework.
 */
export class Tag extends HTMLElement {
    // tracks component active state
    _componentActive = false;

    /**
     * Synatx sugar for registering a component.
     * @param {string} name Web component name 
     * @param {Function} clazz Web component class 
     * @returns Web component class
     */
    static register(name,clazz){
        window.customElements.define(name, clazz);
        return clazz;
    }

    /**
     * Get the html template function.
     */
    get html() {
        // Can afford lit-html at at least 
        return litHtml;
    }

    /**
     * Called when component is connected to the DOM
     */
    connectedCallback() {
        this.onUpdateLifecycle();
    }

    /**
     * Called when component is disconnected from the DOM
     */
    disconnectedCallback() {
        this.onUpdateLifecycle();
    }

    /**
     * Called when component is migrated to the DOM of another document
     */
    adoptedCallback() {
        this.onUpdateLifecycle();
    }

    /**
     * Element attributes changed
     */
    attributeChangedCallback() {
        this.updateDom();
    }

    /**
     * Detect and call lifecycle methods
     */
    onUpdateLifecycle() {
        if (this.isConnected != this._componentActive) {
            if (this.isConnected) {
                if (typeof this.onStart === 'function') {
                    // begin
                    this.onStart();
                }
                this.updateDom();
            } else if (typeof this.onStop === 'function') {
                // end
                this.onStop();
            }
            this._componentActive = this.isConnected;
        }
    }

    /**
     * Updated rendered markup
     */
    updateDom() {
        if (typeof this.render === 'function') {
            litRender(this.render(), this);
        }
    }
}