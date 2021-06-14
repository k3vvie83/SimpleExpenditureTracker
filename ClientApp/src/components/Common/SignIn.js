import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { sha256 } from 'js-sha256';
import axios from 'axios';
import CryptoJS from 'crypto-js';


export function SignIn(props) {

    //Variables to set into Session Storage
    const [UserLoginID, setUserLoginID] = useState('');
    const [Password, setPassword] = useState('');
    const [UserUUID, setUserUUID] = useState('');
    const [UserFullName, setUserFullName] = useState('');
    const [Role, setRole] = useState('');
    const [Timestamp, setTimestamp] = useState('');
    const [EncryptedData, setEncryptedData] = useState('');

    //Redirect to Home Flag
    const [toHome, setToHome] = useState(false);

    //Notfication Bar Switch Case Selection
    const [notificationSelection, setNotificationSelection] = useState(0);



    //Get Session Storage Data
    //const [UserUUID, setUserUUID] = useState('');
    //const [UserFullName, setUserFullName] = useState('');
    //const [UserRole, setUserRole] = useState('User');
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(true);
    //const [LoggedInTimestamp, setLoggedInTimestamp] = useState(0);
    const [decryptedDataArray, SetDecryptedDataArray] = useState([]);

    //Flag for DecryptData()
    const [isDecryptDataDone, setDecryptDataDone] = useState(false);


    //Run Decrypt Data Function
    DecryptData();

    //if Decrypt Data and User is auth, Redirect to Home page
    if (isDecryptDataDone) {

        if (isUserAuthenticated) {

            return <Redirect to='/home' />

        }
    }

    //Decrypt Session Storage Data Function
    function DecryptData() {

        //If Decrypt Data is not Done, Then Proceed, Else Skip
        if (!isDecryptDataDone) {

            //Get Encrypted Dat from Session Storage.
            var EncryptedData = window.sessionStorage.getItem("Data");

            // If Data is not NULL
            if (EncryptedData != null) {

                //Decrypt Data
                var bytes = CryptoJS.AES.decrypt(EncryptedData, 'my-secret-key@123');
                var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                //Set Decrypted Data into Array
                SetDecryptedDataArray(decryptedData);

                //Set User Auth to True
                setIsUserAuthenticated(true);

                //Set Decryption Flag Done
                setDecryptDataDone(true);

            }
            else {

                //Set User Auth to False
                setIsUserAuthenticated(false);

                //Set Decryption Flag Done
                setDecryptDataDone(true);
            }
        }

    }

    //If login Success, Create Session Storage and redirect to Home
    if (toHome) {

        //window.sessionStorage.setItem("isAuthenticated", "true");
        //window.sessionStorage.setItem("UserUUID", UserUUID);
        //window.sessionStorage.setItem("UserFullName", UserFullName);
        //window.sessionStorage.setItem("Role", Role);


        window.sessionStorage.setItem("Data", EncryptedData);
        window.sessionStorage.setItem("Timestamp", Timestamp);

        return <Redirect to='/home' />
    }


    //Form Submit Handler
    const mySubmitHandler = (event) => {

        event.preventDefault();

        //Check NULL fields
        if (!UserLoginID || !Password) {

            setNotificationSelection(2);

            return;
        }

                //Hash Password
        var HashedPassword = sha256(Password);

                //Create newUserInfo JSON object
        const SignIn = { UserLoginID, HashedPassword };

               //Call Backend to Sign In
        axios.post('/api/signin', SignIn).then(response => {

            if (response.status === 200) {

                //Formulate Session Storage Data JSON Content for Encryption
                var isAuthenticated = true;
                var UserUUID = response.data.UserUUID;
                var UserFullName = response.data.UserFullName;
                var Role = response.data.Role;
                var TimestampLocal = new Date().getTime();

                const data = { isAuthenticated, UserUUID, UserFullName, Role, TimestampLocal }

                //console.log("Data Before Encryption: " + JSON.stringify(data));

                //Encrypt Data
                var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'my-secret-key@123').toString();

                //Set Encrypted Data
                setEncryptedData(ciphertext);

                //Set Timestamp
                setTimestamp(TimestampLocal);

                //Set toHome = true to redirect to Home at next render
                setToHome(true);
            }
            else {

                //Set Notification Bar Status
                setNotificationSelection(1);
            }
        },
            (error => {

                //Set Notification Bar Status
                setNotificationSelection(1);
            }));
    }


    function DisplayErrorMessage() {

        switch (notificationSelection) {

            case 0: return (null);

            case 1: return (

                <div className='error'><a> Error signing in. </a></div>

            );
                break;

            case 2: return (

                <div className='error'><a> Empty Username or Password! </a></div>

            );       
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