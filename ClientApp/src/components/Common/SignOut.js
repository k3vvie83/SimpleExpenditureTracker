import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router';

export function SignOut(props) {

    window.sessionStorage.clear();

    const [countdown, setCountdown] = useState(3);
    const [redirectToSignInPage, setRedirectToSignInPage] = useState(false);

    function countdownFn() {

        if (countdown > 1)
            setCountdown(countdown - 1)
        else
            setRedirectToSignInPage(true);

    }


    useEffect(() => {
        setInterval(() => countdownFn(), 1000);

        return () => {

        }
    });

    if (redirectToSignInPage) {
        return <Redirect to='/' />
    }

    return (
        <div>
            <h1> Bye! </h1>
            <br />
            <h3>You will be redirected to the Sign In page ....</h3>
        </div>
    );


}

export default SignOut;