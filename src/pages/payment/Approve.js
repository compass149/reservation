import React from 'react';


export const Approve = ({ response }) => {
    return (
        <div>
            <h1>승인 결과 (Result of Approval)</h1>
            <p>{response}</p>
            <a href="/">Go to index page</a>
        </div>
    );
};