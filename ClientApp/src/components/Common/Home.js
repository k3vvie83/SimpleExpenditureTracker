import React, { useState, useEffect }from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

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
                    <h1>Hello, {window.sessionStorage.getItem("UserFullName")}! You are logged in as Admin!</h1>

                    <p>Welcome to your daily expense tracking application.</p>

                    <p>The Time now is {timeNow}.</p>

                    <p>Your UUID is {UserUUID}.</p>

                </div>
            );
                break;


            case "User": return (
                <div>
                    <h1>Hello, {window.sessionStorage.getItem("UserFullName")}! You are logged in as User!</h1>

                    <p>Welcome to your daily expense tracking application.</p>

                    <p>The Time now is {timeNow}.</p>

                    <p>Your UUID is {UserUUID}.</p>

                    <p>Your current total expenditure is <b><u>$ {totalExpenditure.toFixed(2)}</u></b></p>
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