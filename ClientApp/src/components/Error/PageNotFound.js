﻿import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router';

export function PageNotFound(props) {

    var intervalID = 0;

    const [countdown, setCountdown] = useState(3);
    const [redirectToHome, setRedirectToHome] = useState(false);
    

    useEffect(() => {
        intervalID = setTimeout(() => countdownFn(), 1000);

        return () => {
            clearTimeout(intervalID);
        };
    }, [countdown]);


    function countdownFn() {

        if (countdown > 0) {
            setCountdown(countdown - 1)
        }

        if (countdown === 0) {
            setRedirectToHome(true);
        }

    }

    if (redirectToHome) {
        return <Redirect to='/' />
    }

    return (
        <div>
            <h1> Error 404 - Page Not Found! </h1>
            <br />
            <h3>You will be redirected within {countdown} seconds...</h3>
        </div>
    );


}

export default PageNotFound;