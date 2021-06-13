import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router';

export function SignOut(props) {

    var UserFullNameVar = window.sessionStorage.getItem("UserFullName");
    const [UserFullName, setUserFullName] = useState(UserFullNameVar);

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
            <h1> Kthxbye { UserFullName } ! </h1>
            <br />
            <h3>You will be redirected to the Sign In page within 3 seconds...</h3>
        </div>
    );


}

export default SignOut;