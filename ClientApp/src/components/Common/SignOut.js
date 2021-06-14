import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import CryptoJS from 'crypto-js';


export function SignOut(props) {

    var intervalID = 0;
    //var UserFullNameVar = window.sessionStorage.getItem("UserFullName");
    const [UserFullName, setUserFullName] = useState('');

    //window.sessionStorage.clear();

    const [countdown, setCountdown] = useState(3);
    const [redirectToSignInPage, setRedirectToSignInPage] = useState(false);
    const [decryptedDataArray, SetDecryptedDataArray] = useState([]);
    

    useEffect(() => {
        DecryptData();
        window.sessionStorage.clear();
        return () => {
        }
    },[]);

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
            //clearTimeout(intervalID);
            redirectToSignInPage(true);
        }

    }

    function DecryptData() {
        var EncryptedData = window.sessionStorage.getItem("Data");
        var UserFullName = false;

        if (EncryptedData != null) {
            var bytes = CryptoJS.AES.decrypt(EncryptedData, 'my-secret-key@123');
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

            SetDecryptedDataArray(decryptedData);
            UserFullName = decryptedData.UserFullName;
            setUserFullName(UserFullName);
            console.log("SignOut::UserFullName " + new Date().getTime() + " " + UserFullName);
        }

    }

    function countdownFn() {

        if (countdown > 1)
            setCountdown(countdown - 1)
        else
            setRedirectToSignInPage(true);

    }

    if (redirectToSignInPage) {
        return <Redirect to='/' />
    }

    return (
        <div>
            <h1> Kthxbye { UserFullName } ! </h1>
            <br />
            <h3>You will be redirected to the Sign In page within {countdown} seconds...</h3>
        </div>
    );


}

export default SignOut;