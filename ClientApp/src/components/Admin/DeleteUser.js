import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

export function DeleteUser(props) {

    var CurrentUserUUID = window.sessionStorage.getItem("UserUUID");

    const [AllUsersList, setAllUsersList] = useState([]);
    const [loading, setLoading] = useState(true);

    //const [CurrentUserUUID, SetCurrentUserUUID] = useState('');
    const [UserUUID, SetUserUUID] = useState('');

    const [notificationSelection, setNotificationSelection] = useState(0);
    const [refresh, setrefresh] = useState(0);
    //SetCurrentUserUUID(window.sessionStorage.getItem("UserUUID"));

    useEffect(() => {
        GetAllUser();
    }, []);

    if (!window.sessionStorage.getItem("isAuthenticated")) {
        return <Redirect to='/unauthorised' />
    }

    if (window.sessionStorage.getItem("Role").toString() != "Admin") {
        return <Redirect to='/unauthorised' />
    }




    function DisplayUUIDSelected() {

        //setNotificationSelection(0);

        return (
            <div>
                <p>UUID Selected for deletion : {UserUUID}</p>
            </div>);
    }


    const mySubmitHandler = (event) => {

        event.preventDefault();

        if (UserUUID === '') {
            setNotificationSelection(2);
            return;
        }

        if (UserUUID === CurrentUserUUID) {
            setNotificationSelection(3);
            return;
        }

        const UserUUIDObj = { UserUUID };

        axios.post('/api/deleteuser', UserUUIDObj).then(response => {

            console.log("deleteuser response.status : " + response.status);
            console.log("deleteuser response.data  : " + response.data);

            setNotificationSelection(1);

            setLoading(true);

            GetAllUser();


        });


    }

    function DisplayStatus() {

        switch (notificationSelection) {

            case 0: return (null);

            case 1: return (<div className='success'><a> Error Delete Record From Database! </a></div>);
                break;

            case 2: return (<div className='error'><a> No User Selected! </a></div>);
                break;

            case 3: return (<div className='error'><a> Cannot Delete Own Account! </a></div>);
                break;

            default: return (null);
        }
    }


    function GetAllUser() {

        SetUserUUID('');

        const UserUUIDObj = { UserUUID };

        axios.post('/api/getallusers', UserUUIDObj).then(response => {

            console.log("response.status : " + response.status);
            console.log("response.data  : " + response.data);

            setAllUsersList(response.data);

            setLoading(false);

        });
    }


    function renderUserTable(AllUsersList) {
        return (
            <div>

                <h3>ALL Users</h3>
                <p>The following shows all the users to the system.</p>

                <form onSubmit={mySubmitHandler}>
                    <table className='table table-striped' aria-labelledby="tabelLabel">
                        <thead>
                            <tr>
                                <th> </th>
                                {/*<th>User UUID</th>*/}
                                <th>User Full Name</th>
                                <th>User Login ID</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {AllUsersList.map(AllUsersList =>
                                <tr key={AllUsersList.UserUUID}>
                                    <td><input type="radio" value={AllUsersList.UserUUID} name="DelUser" onChange={e => SetUserUUID(e.target.value)} /></td>
                                    {/*<td>{AllUsersList.UserUUID}</td>*/}
                                    <td>{AllUsersList.UserFullName}</td>
                                    <td>{AllUsersList.UserLoginID}</td>
                                    <td>{AllUsersList.Role}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div>
                        <button type="submit" className="btn btn-primary btn-block">Delete User</button>
                    </div>
                </form>

            </div>
        );
    }


    let contents = loading
        ? <p><em>Loading...</em></p>
        : renderUserTable(AllUsersList);

    return (
        <div>
            {/*<DisplayUUIDSelected />*/}
            <DisplayStatus />
            {contents}

        </div>

    )
}


export default DeleteUser;