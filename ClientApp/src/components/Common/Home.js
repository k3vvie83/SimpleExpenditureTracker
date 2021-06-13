import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';

export function Home(props) {

    var UserUUID = window.sessionStorage.getItem("UserUUID");
    var Role = window.sessionStorage.getItem("Role");

    const [timeNow, setTimeNow] = useState(new Date().toLocaleTimeString());
    const [totalExpenditure, setTotalExpenditure] = useState(0.0);

    useEffect(() => {
        setInterval(() => setTimeNow(new Date().toLocaleTimeString()), 1000);

        return () => {
        }
    });

    function RenderOneTimeComponent() {

        useEffect(() => {
            getTotalExpenditure();
        }, []);
    }

    if (!window.sessionStorage.getItem("isAuthenticated")) {
        return <Redirect to='/unauthorised' />
    }

    function getTotalExpenditure() {

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

    RenderOneTimeComponent();

    function HomeScreen() {

        switch (Role) {
            case "Admin": return (
                <div>
                    <h1>Hello, {window.sessionStorage.getItem("UserFullName")}!</h1>
                    <br />
                    <h2>   You are logged in as Admin!</h2>

                    <p>Welcome to your expenditure tracking application.</p>

                    <p>The Time now is {timeNow}.</p>

                    <p>For Info, your user unique system generated UUID is {UserUUID}.</p>

                </div>
            );
                break;


            case "User": return (
                <div>
                    <h1>Hello, {window.sessionStorage.getItem("UserFullName")}!</h1>
                    <br />
                    <h2>   You are logged in as Admin!</h2>

                    <p>Welcome to your expenditure tracking application.</p>

                    <p>The Time now is {timeNow}.</p>

                    <p>For Info, your user unique system generated UUID is {UserUUID}.</p>

                    <p>Your current total expenditure is <b>$ {totalExpenditure.toFixed(2)}</b></p>
                </div>
            );
                break;

            default: return (null);
        }
    }


    return (
        <div>

            <HomeScreen />

        </div>
    );

}

export default Home;