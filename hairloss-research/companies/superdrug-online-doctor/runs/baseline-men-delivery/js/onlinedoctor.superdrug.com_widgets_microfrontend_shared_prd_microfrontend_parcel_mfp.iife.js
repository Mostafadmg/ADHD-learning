(function () {
    'use strict';

    function MFPError (error, parcelName) {
        error.message = `MFPError[${parcelName}]: ${error.message}`;
        return error
    }

    function HTMLElementShim () {
        return Reflect.construct(HTMLElement, [], Object.getPrototypeOf(this).constructor)
    }

    Object.setPrototypeOf(HTMLElementShim.prototype, HTMLElement.prototype);
    Object.setPrototypeOf(HTMLElementShim, HTMLElement);

    class MicroFrontendParcel extends HTMLElementShim {
        constructor () {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' });
            this.rootNode = document.createElement('div');
            shadowRoot.appendChild(this.rootNode);
            this.parcelName = this.getAttribute('parcel');
            this.name = `${this.parcelName}-${Date.now()}-${Math.round(Math.random() * 10000)}`;
        }

        handleError (error) {
            throw MFPError(error, this.parcelName)
        }

        connectedCallback () {
            if (!window.System) {
                console.warn('Global System JS missing!');
                return
            }

            // When loading this element on Vue 2, we won't have attributes available until connectedCallback
            // as Vue creates element first and then attaches the attributes to it
            this.parcelName = this.parcelName || this.getAttribute('parcel');

            window.System.import(this.parcelName).then((mfp) => {
                // if element got removed from the DOM meanwhile
                if (!this.isConnected) {
                    return
                }
                this.mfp = mfp;
                this.dispatchEvent(new Event('loadstart'));
                const data = { appMountElement: this.rootNode, ...this.data, shadowRoot: this.rootNode };
                if (data.globalErrorHandler) {
                    data.globalErrorHandler = data.globalErrorHandler.bind(this.parcelName);
                }

                if (!data.name) {
                    data.name = this.name;
                }

                this.mfp.mount(data);
            }, (err) => {
                if (this.data !== undefined && this.data.globalErrorHandler !== undefined && this.data.globalErrorHandler) {
                    return this.data.globalErrorHandler.call(this.parcelName, err)
                }
                this.dispatchEvent(new ErrorEvent('error', { error: MFPError(err, this.parcelName) }));
            });
        }

        disconnectedCallback () {
            if (this.mfp && this.mfp.unmount instanceof Function) {
                const data = { appMountElement: this.rootNode, ...this.data, shadowRoot: this.rootNode };

                if (!data.name) {
                    data.name = this.name;
                }

                this.mfp.unmount(data);
            }
        }
    }

    customElements.define('micro-frontend-parcel', MicroFrontendParcel);

})();
