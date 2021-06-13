import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { sha256 } from 'js-sha256';

export function SignIn(props) {

    useEffect(() => {

    }, []);

    const [UserLoginID, setUserLoginID] = useState('');
    const [Password, setPassword] = useState('');
    const [UserUUID, setUserUUID] = useState('');
    const [UserFullName, setUserFullName] = useState('');
    const [Role, setRole] = useState('');
    const [toHome, setToHome] = useState(false);
    const [notificationSelection, setNotificationSelection] = useState(0);

    if (window.sessionStorage.getItem("isAuthenticated")) {
        return <Redirect to='/home' />
    }

    if (toHome) {

        window.sessionStorage.setItem("isAuthenticated", "true");
        window.sessionStorage.setItem("UserUUID", UserUUID);
        window.sessionStorage.setItem("UserFullName", UserFullName);
        window.sessionStorage.setItem("Role", Role);
        window.sessionStorage.setItem("Timestamp", new Date().getTime());

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

                setUserUUID(response.data.UserUUID);
                setUserFullName(response.data.UserFullName);
                setRole(response.data.Role);

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