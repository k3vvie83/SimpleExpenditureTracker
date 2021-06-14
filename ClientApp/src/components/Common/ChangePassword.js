﻿import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { sha256 } from 'js-sha256';
import axios from 'axios';
import CryptoJS from 'crypto-js';

export function ChangePassword(props) {

    const [isUserAuthenticated, setIsUserAuthenticated] = useState(true);
    const [decryptedDataArray, SetDecryptedDataArray] = useState([]);
    const [UserUUID, setUserUUID] = useState('');

    const [OldPassword, setOldPassword] = useState('');
    const [NewPassword, setNewPassword] = useState('');
    const [ReEnterNewPasword, setReEnterNewPasword] = useState('');
    const [notificationSelection, setNotificationSelection] = useState(0);

    const [isDecryptDataDone, setDecryptDataDone] = useState(false);

    DecryptData();

    const mySubmitHandler = (event) => {

        event.preventDefault();

        if (!OldPassword || !NewPassword || !ReEnterNewPasword) {
            setNotificationSelection(3);
            return;
        }

        if (NewPassword.localeCompare(ReEnterNewPasword) != 0) {
            setNotificationSelection(4);
            return;
        }

        if (!(NewPassword.length >= 8)) {
            setNotificationSelection(6);
            return;
        }

        var HashedOldPassword = sha256(OldPassword);
        var HashedNewPassword = sha256(NewPassword);

        //console.log("Hashed Old Password: " + HashedOldPassword);
        //console.log("Hashed New Password: " + HashedNewPassword);

        const ChangePasswordInfo = { UserUUID, HashedOldPassword, HashedNewPassword };

        axios.post('/api/changepassword', ChangePasswordInfo).then(response => {

            if (response.status === 200) {

                if (response.data == true) {
                    setNotificationSelection(2);

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

            case 1: return (<div className='error'><a> Old Password Mismatch! </a></div>);
                break;

            case 2: return (<div className='success'><a> Password Changed Successfully! </a></div>);
                break;

            case 3: return (<div className='error'><a> Empty Field Detected! </a></div>);
                break;

            case 4: return (<div className='error'><a> New and Re-Entered Password Does Not Match! Try Again! </a></div>);
                break;

            case 5: return (<div className='error'><a> Password Change Failed! Contact Administrator! </a></div>);
                break;

            case 6: return (<div className='error'><a> Password less than 8 characters! </a></div>);
                break;

            default: return (null);
        }
    }

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

                setUserUUID(userUUID);
                setIsUserAuthenticated(true);
                //setUserRole(role);

                console.log("ChangePassword::setIsUserAuthenticated " + new Date().getTime() + " " + isAuthenticated);
                console.log("ChangePassword::setUserRole " + new Date().getTime() + " " + role);
                console.log("ChangePassword::setUserUUID " + new Date().getTime() + " " + userUUID);

                setDecryptDataDone(true);

               // getTotalExpenditure(userUUID);
            }
            else {
                setIsUserAuthenticated(false);
                setDecryptDataDone(true);
            }
        }

    }


    if (!isUserAuthenticated) {
        return <Redirect to='/unauthorised' />
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