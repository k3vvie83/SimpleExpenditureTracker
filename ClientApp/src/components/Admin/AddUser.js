import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { sha256 } from 'js-sha256';
import axios from 'axios';

export function AddUser(props) {

    const [UserFullName, setUserFullName] = useState('');
    const [UserLoginID, setUserLoginID] = useState('');
    const [Password, setPassword] = useState('');
    const [ReEnterPassword, setReEnterPassword] = useState('');
    const [Role, setRole] = useState('User');

    const [UserFullNameInNoticeBar, setUserFullNameInNoticeBar] = useState('');
    const [UserLoginIDInNoticeBar, setUserLoginIDInNoticeBar] = useState('');
    const [RoleInNoticeBar, setRoleInNoticeBar] = useState('');

    const [notificationSelection, setNotificationSelection] = useState(0);


    useEffect(() => {
    }, []);

    if (!window.sessionStorage.getItem("isAuthenticated")) {
        return <Redirect to='/unauthorised' />
    }

    if (window.sessionStorage.getItem("Role").toString() != "Admin") {
        return <Redirect to='/unauthorised' />
    }

    const mySubmitHandler = (event) => {

        event.preventDefault();

        if (!UserFullName || !UserLoginID || !Password || !ReEnterPassword) {
            setNotificationSelection(3);
            return;
        }

        if (Password.localeCompare(ReEnterPassword) != 0) {
            setNotificationSelection(4);
            return;
        }

        if (!(Password.length >= 8)) {
            setNotificationSelection(5);
            return;
        }

        var HashedPassword = sha256(Password);

        const NewUserInfo = { UserFullName, UserLoginID, HashedPassword, Role };

        axios.post('/api/adduser', NewUserInfo).then(response => {

            if (response.status === 200) {

                setNotificationSelection(2);

                setUserFullNameInNoticeBar(UserFullName);
                setUserLoginIDInNoticeBar(UserLoginID);
                setRoleInNoticeBar(Role);

                setUserFullName('');
                setUserLoginID('');
                setPassword('');
                setReEnterPassword('');
                setRole('User');
            }
            else {

                setNotificationSelection(1);
            }
        },
            (error => {

                setNotificationSelection(1);
            }));

    }

    function DisplayStatus() {

        switch (notificationSelection) {

            case 0: return (null);

            case 1: return (<div className='error'><a> Error Saving Record into Database! </a></div>);
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

            case 3: return (<div className='error'><a> Empty Field Detected! Please Check Submission! </a></div>);
                break;

            case 4: return (<div className='error'><a> New and Re-Entered Password Does Not Match! Try Again! </a></div>);
                break;

            case 5: return (<div className='error'><a> Password less than 8 characters! </a></div>);
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
                <h3>Enter New User Information</h3>
                <br />
                <br />
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="Textbox" className="form-control" placeholder="Enter User's Full Name" onChange={e => setUserFullName(e.target.value)} value={UserFullName} />
                </div>
                <br />
                <div className="form-group">
                    <label>User Login ID</label>
                    <input type="Textbox" className="form-control" placeholder="Enter User's Login ID" onChange={e => setUserLoginID(e.target.value)} value={UserLoginID} />
                </div>
                <br />
                <div className="form-group">
                    <label>Password</label>
                    <input type="Password" className="form-control" placeholder="Enter Password" onChange={e => setPassword(e.target.value)} value={Password} />
                </div>
                <br />
                <div className="form-group">
                    <label>Re-Enter Password</label>
                    <input type="Password" className="form-control" placeholder="Re-Enter Password" onChange={e => setReEnterPassword(e.target.value)} value={ReEnterPassword} />
                </div>
                <br />
                <div className="form-group">
                    <label>Select Role </label>
                    <br />
                    <label><input type="radio" value="User" name="role" onChange={e => setRole(e.target.value)} defaultChecked /> User </label>

                        &nbsp;&nbsp;&nbsp;

                    <label><input type="radio" value="Admin" name="role" onChange={e => setRole(e.target.value)} /> Admin </label>
                </div>
                <div>
                    <button type="submit" className="btn btn-primary btn-block">Submit</button>
                </div>

            </form>

        </div>);
}


export default AddUser;