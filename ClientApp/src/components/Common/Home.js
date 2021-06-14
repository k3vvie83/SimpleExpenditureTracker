import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import CryptoJS from 'crypto-js';

export function Home(props) {

    var timerIntervalID = 0;

    const [timeNow, setTimeNow] = useState(new Date().toLocaleTimeString());
    const [totalExpenditure, setTotalExpenditure] = useState(0.0);

    const [isUserAuthenticated, setIsUserAuthenticated] = useState(true);
    const [UserRole, setUserRole] = useState('');
    const [decryptedDataArray, SetDecryptedDataArray] = useState([]);

    const [isDecryptDataDone, setDecryptDataDone] = useState(false);

    DecryptData();

    useEffect(() => {
        timerIntervalID = setInterval(() => setTimeNow(new Date().toLocaleTimeString()), 1000);

        return () => {
            clearInterval(timerIntervalID);
        }
    });

    function DecryptData() {
        if (!isDecryptDataDone) {
            var EncryptedData = window.sessionStorage.getItem("Data");
            var isAuthenticated = false;
            var role = '';

            if (EncryptedData != null) {
                var bytes = CryptoJS.AES.decrypt(EncryptedData, 'my-secret-key@123');
                var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                SetDecryptedDataArray(decryptedData);
                var isAuthenticated = decryptedData.isAuthenticated;
                var role = decryptedData.Role;
                var userUUID = decryptedData.UserUUID;

                //UserUUID = userUUID;
                setIsUserAuthenticated(true);
                setUserRole(role);

                console.log("Home::setIsUserAuthenticated " + new Date().getTime() + " " + isAuthenticated);
                console.log("Home::setUserRole " + new Date().getTime() + " " + role);
                console.log("Home::setUserUUID " + new Date().getTime() + " " + userUUID);

                setDecryptDataDone(true);

                getTotalExpenditure(userUUID);
            }
            else {
                setIsUserAuthenticated(false);
                setDecryptDataDone(true);
            }
        }

    }


    function getTotalExpenditure(UserUUID) {

        console.log("getTotalExpenditure");
        const UserUUIDObj = { UserUUID };

        if (UserUUIDObj.UserUUID != '') {
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
        else {

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

    console.log("isUserAuthenticated " + isUserAuthenticated)
    if (!isUserAuthenticated) {
        return <Redirect to='/unauthorised' />
    }


    return (
        <div>

            <HomeScreen />

        </div>
    );

}

export default Home;