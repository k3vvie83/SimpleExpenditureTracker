import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { sha256 } from 'js-sha256';
import axios from 'axios';
import CryptoJS from 'crypto-js';


export function SignIn(props) {

    const [UserLoginID, setUserLoginID] = useState('');
    const [Password, setPassword] = useState('');
    const [UserUUID, setUserUUID] = useState('');
    const [UserFullName, setUserFullName] = useState('');
    const [Role, setRole] = useState('');
    const [Timestamp, setTimestamp] = useState('');
    const [EncryptedData, setEncryptedData] = useState('');
    const [toHome, setToHome] = useState(false);
    const [notificationSelection, setNotificationSelection] = useState(0);

    const [isUserAuthenticated, setIsUserAuthenticated] = useState(true);
    const [decryptedDataArray, SetDecryptedDataArray] = useState([]);

    const [isDecryptDataDone, setDecryptDataDone] = useState(false);

    //var isUserAuthenticated = false;

    DecryptData();

    if (isDecryptDataDone) {
        if (isUserAuthenticated) {
            return <Redirect to='/home' />
        }
    }


    function DecryptData() {
        if (!isDecryptDataDone) {

            var EncryptedData = window.sessionStorage.getItem("Data");

            if (EncryptedData != null) {
                var bytes = CryptoJS.AES.decrypt(EncryptedData, 'my-secret-key@123');
                var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                SetDecryptedDataArray(decryptedData);
                var isAuthenticated = decryptedData.isAuthenticated;
                var role = decryptedData.Role;
                var userUUID = decryptedData.UserUUID;

                setIsUserAuthenticated(true);

                console.log("SignIn::setIsUserAuthenticated " + new Date().getTime() + " " + isAuthenticated);

                setDecryptDataDone(true);

            }
            else {
                setIsUserAuthenticated(false);
                setDecryptDataDone(true);
            }
        }

    }

    if (toHome) {

        window.sessionStorage.setItem("isAuthenticated", "true");
        window.sessionStorage.setItem("UserUUID", UserUUID);
        window.sessionStorage.setItem("UserFullName", UserFullName);
        window.sessionStorage.setItem("Role", Role);


        window.sessionStorage.setItem("Data", EncryptedData);
        window.sessionStorage.setItem("Timestamp", Timestamp);

        return <Redirect to='/home' />
    }

    const mySubmitHandler = (event) => {

        event.preventDefault();

        if (!UserLoginID || !Password) {
            setNotificationSelection(2);
            return;
        }

        var HashedPassword = sha256(Password);

        const SignIn = { UserLoginID, HashedPassword };

        axios.post('/api/signin', SignIn).then(response => {

            if (response.status === 200) {


                var isAuthenticated = true;
                var UserUUID = response.data.UserUUID;
                var UserFullName = response.data.UserFullName;
                var Role = response.data.Role;
                var TimestampLocal = new Date().getTime();


                const data = { isAuthenticated, UserUUID, UserFullName, Role, TimestampLocal }

                //console.log("Data Before Encryption: " + JSON.stringify(data));

                var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'my-secret-key@123').toString();

                setEncryptedData(ciphertext);

                setUserUUID(response.data.UserUUID);
                setUserFullName(response.data.UserFullName);
                setRole(response.data.Role);
                setTimestamp(TimestampLocal);

                setToHome(true)
            }
            else {
                setNotificationSelection(1);
            }
        },
            (error => {
                setNotificationSelection(1);
            }));
    }


    function DisplayErrorMessage() {

        switch (notificationSelection) {

            case 0: return (null);

            case 1: return (<div className='error'><a> Error signing in. </a></div>);
                break;

            case 2: return (<div className='error'><a> Empty Username or Password! </a></div>);
                break;

            default: return (null);
        }

        return (null);
    }



    return (
        <div>
            <br />

            <DisplayErrorMessage />

            <br />

            <form onSubmit={mySubmitHandler}>
                <h3>Sign In</h3>
                <br />

                <div className="form-group">
                    <label>User ID</label>
                    <input type="textbox" className="form-control" placeholder="Enter User ID" onChange={e => setUserLoginID(e.target.value)} />
                </div>
                <br />
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter Password" onChange={e => setPassword(e.target.value)} />
                </div>

                <div>
                    <button type="submit" className="btn btn-primary btn-block">Submit</button>
                </div>

            </form>

        </div>);
}


export default SignIn;