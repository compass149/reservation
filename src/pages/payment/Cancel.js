import React from 'react';

export const Cancel = () => {
    const close = () => {
        if (window.opener && window.opener.kakaopay) {
            window.opener.kakaopay.close();
        }
    };

    return (
        <div>
            <h1>결제가 취소되었습니다. (Canceled Payment)</h1>
            <a href="/">Go to index page</a>
            <br />
            <a href="#" onClick={close}>Close</a>
        </div>
    );
};
