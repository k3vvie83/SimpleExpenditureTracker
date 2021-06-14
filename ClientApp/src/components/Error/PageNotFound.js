import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router';

export function PageNotFound(props) {

    //Variable for Count down Timer
    var intervalID = 0;
    const [countdown, setCountdown] = useState(3);

    //Redirect to Home Flag
    const [redirectToHome, setRedirectToHome] = useState(false);

    //UseEffect for Count down timer 
    useEffect(() => {
        intervalID = setTimeout(() => countdownFn(), 1000);

        return () => {
            clearTimeout(intervalID);
        };
    }, [countdown]);

    //Count down Timer Function
    function countdownFn() {

        if (countdown > 0) {
            setCountdown(countdown - 1)
        }
        else {
            setRedirectToHome(true);
        }

    }

    //If true, Redirect to Home
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