export const Fail = () => {
    const close = () => {
        if (window.opener && window.opener.kakaopay) {
            window.opener.kakaopay.close();
        }
    };

    return (
        <div>
            <h1>결제가 실패했습니다. (Failed Payment)</h1>
            <a href="/">Go to index page</a>
            <br />
            <a href="#" onClick={close}>Close</a>
        </div>
    );
};
