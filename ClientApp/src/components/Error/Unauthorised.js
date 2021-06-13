import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router';

export function Unauthorised(props) {

    const [countdown, setCountdown] = useState(3);
    const [redirectToHome, setRedirectToHome] = useState(false);

    function countdownFn() {

        if (countdown > 1)
            setCountdown(countdown - 1)
        else
            setRedirectToHome(true);

    }

    useEffect(() => {

        setInterval(() => countdownFn(), 1000);

        return () => {
        }
    });

    if (redirectToHome) {

        return <Redirect to='/' />
    }

    return (
        <div>
            <h1> Error 401 - Unauthorised Access! </h1>
            <br />
            <h3>You will be redirected within 3 seconds...</h3>
        </div>
    );


}

export default Unauthorised;