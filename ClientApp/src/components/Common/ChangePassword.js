import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { sha256 } from 'js-sha256';
import axios from 'axios';
import CryptoJS from 'crypto-js';

export function ChangePassword(props) {

    //Password Form variables
    const [OldPassword, setOldPassword] = useState('');
    const [NewPassword, setNewPassword] = useState('');
    const [ReEnterNewPasword, setReEnterNewPasword] = useState('');
    const [notificationSelection, setNotificationSelection] = useState(0);

    //Get Session Storage Data
    const [UserUUID, setUserUUID] = useState('');
    const [UserFullName, setUserFullName] = useState('');
    const [UserRole, setUserRole] = useState('User');
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(true);
    const [LoggedInTimestamp, setLoggedInTimestamp] = useState(0);
    const [decryptedDataArray, SetDecryptedDataArray] = useState([]);

    //Flag for DecryptData()
    const [isDecryptDataDone, setDecryptDataDone] = useState(false);

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
            }
            else {
                //Set User Auth to False
                setIsUserAuthenticated(false);

                //Set Decryption Flag Done
                setDecryptDataDone(true);
            }
        }

    }


    //Form Submit Handler
    const mySubmitHandler = (event) => {

        event.preventDefault();

        //Check NULL fields
        if (!OldPassword || !NewPassword || !ReEnterNewPasword) {
            setNotificationSelection(3);
            return;
        }

        // Check for Pasword Mismatch
        if (NewPassword.localeCompare(ReEnterNewPasword) != 0) {
            setNotificationSelection(4);
            return;
        }

        //Check for Password Lenght Less than 8 Char
        if (!(NewPassword.length >= 8)) {
            setNotificationSelection(6);
            return;
        }

        //Hasn Old and New Password
        var HashedOldPassword = sha256(OldPassword);
        var HashedNewPassword = sha256(NewPassword);

        //console.log("Hashed Old Password: " + HashedOldPassword);
        //console.log("Hashed New Password: " + HashedNewPassword);

        //Create newUserInfo JSON object
        const ChangePasswordInfo = { UserUUID, HashedOldPassword, HashedNewPassword };

        //Call Backend to update password
        axios.post('/api/changepassword', ChangePasswordInfo).then(response => {

            //if response is 200 HTTP OK
            if (response.status === 200) {

                //if success
                if (response.data === "Success") {

                    setNotificationSelection(2);

                    //Clear Form
                    setOldPassword('');
                    setNewPassword('');
                    setReEnterNewPasword('');
                }
                else {

                    setNotificationSelection(1);
                }
            }
            else {

                setNotificationSelection(5);
            }
        },
            (error => {

                setNotificationSelection(5);
            }));
    }

    function DisplayStatus() {

        switch (notificationSelection) {

            case 0: return (null);

            case 1: return (

                <div className='error'><a> Old Password Mismatch! </a></div>

            );
                break;

            case 2: return (

                <div className='success'><a> Password Changed Successfully! </a></div>

            );
                break;

            case 3: return (

                <div className='error'><a> Empty Field Detected! </a></div>

            );
                break;

            case 4: return (

                <div className='error'><a> New and Re-Entered Password Does Not Match! Try Again! </a></div>

            );
                break;

            case 5: return (

                <div className='error'><a> Password Change Failed! Contact Administrator! </a></div>

            );
                break;

            case 6: return (

                <div className='error'><a> Password less than 8 characters! </a></div>

            );
                break;

            default: return (null);
        }
    }


    return (
        <div>
            <br />

            <DisplayStatus />

            <br />

            <form onSubmit={mySubmitHandler}>
                <h3>Change Password</h3>
                <br />
                <p> Password to be longer than minimum 8 characters</p>
                <div className="form-group">
                    <label>Old Password</label>
                    <input type="Password" className="form-control" placeholder="Enter Old Password" onChange={e => setOldPassword(e.target.value)} value={OldPassword} />
                </div>
                <br />
                <div className="form-group">
                    <label>New Password</label>
                    <input type="Password" className="form-control" placeholder="Enter New Password" onChange={e => setNewPassword(e.target.value)} value={NewPassword} />
                </div>
                <br />
                <div className="form-group">
                    <label>Re-Enter New Password</label>
                    <input type="Password" className="form-control" placeholder="Re-enter New Password" onChange={e => setReEnterNewPasword(e.target.value)} value={ReEnterNewPasword} />
                </div>
                <br />

                <div>
                    <button type="submit" className="btn btn-primary btn-block">Submit</button>
                </div>

            </form>

        </div>);
}

export default ChangePassword;