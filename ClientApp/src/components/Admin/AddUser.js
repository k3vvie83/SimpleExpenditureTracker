import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { sha256 } from 'js-sha256';
import axios from 'axios';
import CryptoJS from 'crypto-js';

export function AddUser(props) {

    //Var for Add User Form
    const [UserFullNameForm, setUserFullNameForm] = useState('');
    const [UserLoginIDForm, setUserLoginIDForm] = useState('');
    const [PasswordForm, setPasswordForm] = useState('');
    const [ReEnterPasswordForm, setReEnterPasswordForm] = useState('');
    const [RoleForm, setRoleForm] = useState('User');

    //Var for Notification Bar display
    const [UserFullNameInNoticeBar, setUserFullNameInNoticeBar] = useState('');
    const [UserLoginIDInNoticeBar, setUserLoginIDInNoticeBar] = useState('');
    const [RoleInNoticeBar, setRoleInNoticeBar] = useState('');

    //Notfication Bar Switch Case Selection
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

    //if Decrypt Data and User NOT Admin, Redirect to 401 page
    if (isDecryptDataDone) {

        if (UserRole !== 'Admin') {

            return <Redirect to='/unauthorised' />

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
        if (!UserFullNameForm || !UserLoginIDForm || !PasswordForm || !ReEnterPasswordForm) {

            setNotificationSelection(3);

            return;
        }

        // Check for Pasword Mismatch
        if (PasswordForm.localeCompare(ReEnterPasswordForm) != 0) {

            setNotificationSelection(4);

            return;
        }


        //Check for Password Lenght Less than 8 Char
        if (!(PasswordForm.length >= 8)) {

            setNotificationSelection(5);

            return;
        }

        //Hash Password
        var HashedPassword = sha256(PasswordForm);

        var UserFullName = UserFullNameForm;
        var UserLoginID = UserLoginIDForm;
        var Role = RoleForm;

        //Create newUserInfo JSON object
        const NewUserInfo = { UserFullName, UserLoginID, HashedPassword, Role };

        //Call Backend to create new user
        axios.post('/api/adduser', NewUserInfo).then(response => {

            //if response is 200 HTTP OK
            if (response.status === 200) {

                //Set info in Notification Bar
                setUserFullNameInNoticeBar(UserFullName);
                setUserLoginIDInNoticeBar(UserLoginID);
                setRoleInNoticeBar(Role);

                //Set Notification Bar Status
                setNotificationSelection(2);

                //Clear Form and Reset
                setUserFullNameForm('');
                setUserLoginIDForm('');
                setPasswordForm('');
                setReEnterPasswordForm('');
                setRoleForm('User');

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

    function DisplayStatus() {

        if (isUserAuthenticated) {

            switch (notificationSelection) {

                case 0: return (null);

                case 1: return (

                    <div className='error'><a> Error Saving Record into Database! </a></div>

                );
                    break;

                case 2: return (

                    <div className='success'>
                        <p><a> Record Entered Successfully! </a></p>
                        <p> User Full Name : {UserFullNameInNoticeBar}</p>
                        <p> User Login ID : {UserLoginIDInNoticeBar}</p>
                        <p> Role : {RoleInNoticeBar}</p>
                    </div>

                );
                    break;

                case 3: return (

                    <div className='error'><a> Empty Field Detected! Please Check Submission! </a></div>

                );
                    break;

                case 4: return (

                    <div className='error'><a> New and Re-Entered Password Does Not Match! Try Again! </a></div>

                );
                    break;

                case 5: return (

                    <div className='error'><a> Password less than 8 characters! </a></div>

                );
                    break;

                default: return (null);
            }
        }
    }


    return (
        <div>
            <br />

            <DisplayStatus />

            <br />

            <form onSubmit={mySubmitHandler}>
                <h3>Enter New User Information</h3>
                <br />
                <br />
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="Textbox" className="form-control" placeholder="Enter User's Full Name" onChange={e => setUserFullNameForm(e.target.value)} value={UserFullNameForm} />
                </div>
                <br />
                <div className="form-group">
                    <label>User Login ID</label>
                    <input type="Textbox" className="form-control" placeholder="Enter User's Login ID" onChange={e => setUserLoginIDForm(e.target.value)} value={UserLoginIDForm} />
                </div>
                <br />
                <div className="form-group">
                    <label>Password</label>
                    <input type="Password" className="form-control" placeholder="Enter Password" onChange={e => setPasswordForm(e.target.value)} value={PasswordForm} />
                </div>
                <br />
                <div className="form-group">
                    <label>Re-Enter Password</label>
                    <input type="Password" className="form-control" placeholder="Re-Enter Password" onChange={e => setReEnterPasswordForm(e.target.value)} value={ReEnterPasswordForm} />
                </div>
                <br />
                <div className="form-group">
                    <label>Select Role </label>
                    <br />
                    <label><input type="radio" value="User" name="roleForm" onChange={e => setRoleForm(e.target.value)} defaultChecked /> User </label>

                        &nbsp;&nbsp;&nbsp;

                    <label><input type="radio" value="Admin" name="roleForm" onChange={e => setRoleForm(e.target.value)} /> Admin </label>
                </div>
                <div>
                    <button type="submit" className="btn btn-primary btn-block">Submit</button>
                </div>

            </form>

        </div>);
}


export default AddUser;