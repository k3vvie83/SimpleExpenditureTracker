import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import CryptoJS from 'crypto-js';


export function SignOut(props) {

    //Set Countdown Timer
    var intervalID = 0;
    const [countdown, setCountdown] = useState(3);

    //Redirect To SignIn Page Flag
    const [redirectToSignInPage, setRedirectToSignInPage] = useState(false);

    //Get Session Storage Data
    const [UserUUID, setUserUUID] = useState('');
    const [UserFullName, setUserFullName] = useState('');
    const [UserRole, setUserRole] = useState('User');
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(true);
    const [LoggedInTimestamp, setLoggedInTimestamp] = useState(0);
    const [decryptedDataArray, SetDecryptedDataArray] = useState([]);

    //Flag for DecryptData()
    const [isDecryptDataDone, setDecryptDataDone] = useState(false);

    //Count down Timer Effect
    useEffect(() => {
        intervalID = setTimeout(() => countdownFn(), 1000);

        return () => {
            clearTimeout(intervalID);
        };
    }, [countdown]);


    //Run Decrypt Data Function
    DecryptData();


    //Count Down Timer
    function countdownFn() {

        if (countdown > 0) {
            setCountdown(countdown - 1)
        }
        else {
            setRedirectToSignInPage(true);
        }

    }

    //If True, Redirect to Home
    if (redirectToSignInPage) {

        return <Redirect to='/' />
    }

    //Decrypt Session Storage Data Function
    function DecryptData() {

        //If Decrypt Data is not Done, Then Proceed, Else Skip
        if (!isDecryptDataDone) {

            //Get Encrypted Dat from Session Storage.
            var EncryptedData = window.sessionStorage.getItem("Data");
            var timestamp = window.sessionStorage.getItem("Timestamp");

            // If Data is not NULL
            if (EncryptedData != null) {

                //Decrypt Data
                var bytes = CryptoJS.AES.decrypt(EncryptedData, "htx" + timestamp + "htx");
                var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                //Set Decrypted Data into Array
                SetDecryptedDataArray(decryptedData);

                //Set User UUID
                setUserUUID(decryptedData.UserUUID);

                //Set User Full Name
                setUserFullName(decryptedData.UserFullName);

                //Set User Role
                setUserRole(decryptedData.Role);

                //Set Logged in Timestamp
                setLoggedInTimestamp(decryptedData.Timestamp)

                //Set User Auth to True
                setIsUserAuthenticated(true);

                //Set Decryption Flag Done
                setDecryptDataDone(true);

                //Clear Session Storage
                window.sessionStorage.clear();
            }
        }

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