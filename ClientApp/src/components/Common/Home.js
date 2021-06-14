import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import CryptoJS from 'crypto-js';

export function Home(props) {

    //Var for clock tick message
    var timerIntervalID = 0;
    const [timeNow, setTimeNow] = useState(new Date().toLocaleTimeString());
    const [totalExpenditure, setTotalExpenditure] = useState(0.0);

    //Get Session Storage Data
    const [UserUUID, setUserUUID] = useState('');
    const [UserFullName, setUserFullName] = useState('');
    const [UserRole, setUserRole] = useState('User');
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(true);
    const [LoggedInTimestamp, setLoggedInTimestamp] = useState(0);
    const [decryptedDataArray, SetDecryptedDataArray] = useState([]);


    //Flag for DecryptData()
    const [isDecryptDataDone, setDecryptDataDone] = useState(false);

    //UseEffect for Clock Tick Message
    useEffect(() => {
        timerIntervalID = setInterval(() => setTimeNow(new Date().toLocaleTimeString()), 1000);

        return () => {
            clearInterval(timerIntervalID);
        }
    });

    //Run Decrypt Data Function
    DecryptData();

    //if Decrypt Data and User is NOT auth, Redirect to 401 page
    if (isDecryptDataDone) {

        if (!isUserAuthenticated) {

            return <Redirect to='/unauthorised' />

        }

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

                //Get Total expenditure for user
                getTotalExpenditure(decryptedData.UserUUID);
            }
            else {

                //Set User Auth to False
                setIsUserAuthenticated(false);

                //Set Decryption Flag Done
                setDecryptDataDone(true);
            }
        }

    }

    //Get Total Expenditure for User Function
    function getTotalExpenditure(UserUUID) {

        if (UserUUID != '') {

            //Create newUserInfo JSON object
            const UserUUIDObj = { UserUUID };

            //Call Backend to query
            axios.post('/api/querytotalexpenditurebyuser', UserUUIDObj).then(response => {

                if (response.status === 200) {

                    setTotalExpenditure(response.data)
                }
                else {

                }
            },
                (error => {

                }));
        }

    }

    function HomeScreen() {
        return (
            <div>

                <h1>Hello, {decryptedDataArray.UserFullName}!</h1>
                <br />

                <h2>   You are logged in as {decryptedDataArray.Role}!</h2>
                <br />

                <p>Welcome to your expenditure tracking application.</p>

                <p>The time now is {timeNow}.</p>

                <p>For info, your user unique system generated UUID is {decryptedDataArray.UserUUID}.</p>

                {decryptedDataArray.Role === "User" ? <p>Your current total expenditure is <b>$ {totalExpenditure.toFixed(2)}</b></p> : ""}

            </div>
        );
    }



    return (
        <div>

            <HomeScreen />

        </div>
    );

}

export default Home;