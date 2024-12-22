import React from 'react';


export const Ready = ({ response }) => {
    React.useEffect(() => {
        const kakaopay = {
            ref: null,
            showTms: function (url) {
                this.ref = iframeLayer.open(url);
            },
            close: function () {
                this.ref && this.ref.close();
            },
        };

        const iframeLayer = {
            elIframe: null,
            elContainer: document.createElement('div'),
            elBackgroundPanel: document.createElement('div'),

            open: function (url) {
                this.setupBackground();
                this.createIframe(url);
                document.body.appendChild(this.elContainer);
                return this;
            },

            close: function () {
                if (this.elIframe) {
                    this.elContainer.removeChild(this.elIframe);
                    document.body.removeChild(this.elContainer);
                    this.elIframe = null;
                }
            },

            createIframe: function (url) {
                this.elIframe = document.createElement('iframe');
                this.elIframe.src = url;
                Object.assign(this.elIframe.style, {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '426px',
                    height: '510px',
                    margin: '-255px 0 0 -213px',
                    border: '0px solid',
                    backgroundColor: '#fff',
                    zIndex: 9999,
                });
                this.elContainer.appendChild(this.elIframe);
            },

            setupBackground: function () {
                Object.assign(this.elContainer.style, {
                    width: '100%',
                    height: '100%',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 9998,
                });
                Object.assign(this.elBackgroundPanel.style, {
                    width: '100%',
                    height: '100%',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    backgroundColor: '#000',
                    opacity: 0.6,
                });
                this.elContainer.appendChild(this.elBackgroundPanel);
            },
        };

        kakaopay.showTms(response.next_redirect_pc_url);

        return () => {
            kakaopay.close();
        };
    }, [response]);

    return <div />;
};