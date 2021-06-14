import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import CryptoJS from 'crypto-js';

export function DeleteUser(props) {

    //Userlist Returned from Query
    const [AllUsersList, setAllUsersList] = useState([]);
    const [loading, setLoading] = useState(true);

    //Notfication Bar Switch Case Selection
    const [notificationSelection, setNotificationSelection] = useState(0);

    //Set Selected User UUID
    const [SelectedUserUUID, setSelectedUserUUID] = useState('');

    //Get Session Storage Data
    const [UserUUIDStorage, setUserUUIDStorage] = useState('');
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
            var role = '';

            // If Data is not NULL
            if (EncryptedData != null) {

                //Decrypt Data
                var bytes = CryptoJS.AES.decrypt(EncryptedData, 'my-secret-key@123');
                var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                //Set Decrypted Data into Array
                SetDecryptedDataArray(decryptedData);

                //Set User UUID
                setUserUUIDStorage(decryptedData.UserUUID);

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

                //Query all users
                GetAllUser();

            }
            else {
                //Set User Auth to False
                setIsUserAuthenticated(false);

                //Set Decryption Flag Done
                setDecryptDataDone(true);
            }

        }
    }


    const mySubmitHandler = (event) => {

        event.preventDefault();

        //If no selection
        if (SelectedUserUUID === '') {
            setNotificationSelection(2);
            return;
        }

        console.log("SelectedUserUUID " + SelectedUserUUID)
        console.log("UserUUIDStorage " + UserUUIDStorage)
        //If logged in user same as selected user
        if (SelectedUserUUID === UserUUIDStorage) {
            setNotificationSelection(3);
            return;
        }

        var UserUUID = SelectedUserUUID;

        const UserUUIDObj = { UserUUID };

        axios.post('/api/deleteuser', UserUUIDObj).then(response => {

            setNotificationSelection(1);

            setLoading(true);

            //Query all users
            GetAllUser();
        });


    }

    function DisplayStatus() {

        switch (notificationSelection) {

            case 0: return (null);

            case 1: return (

                <div className='success'><a> Error Delete Record From Database! </a></div>

            );
                break;

            case 2: return (

                <div className='error'><a> No User Selected! </a></div>

            );
                break;

            case 3: return (

                <div className='error'><a> Cannot Delete Own Account! </a></div>

            );
                break;

            default: return (null);
        }
    }

    //Query all User Function
    function GetAllUser() {

        if (isUserAuthenticated) {

            var UserUUID = 'null';

            const UserUUIDObj = { UserUUID };

            axios.post('/api/getallusers', UserUUIDObj).then(response => {

                setAllUsersList(response.data);

                setLoading(false);
            });
        }
    }

    //Render User Table
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
                                <th>User Full Name</th>
                                <th>User Login ID</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {AllUsersList.map(AllUsersList =>
                                <tr key={AllUsersList.UserUUID}>
                                    <td><input type="radio" value={AllUsersList.UserUUID} name="DelUser" onChange={e => setSelectedUserUUID(e.target.value)} /></td>
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


    let contents = loading ? <p><em>Loading...</em></p> : renderUserTable(AllUsersList);

    return (

        <div>
            <DisplayStatus />
            <br />
            {contents}
        </div>

    )
}


export default DeleteUser;