import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import CryptoJS from 'crypto-js';

export function QueryExpenditure(props) {

    //Expenditure List Returned from Query
    const [expenditure, setExpenditure] = useState([]);
    const [loading, setLoading] = useState(true);

    //Get Session Storage Data
    const [UserUUID, setUserUUID] = useState('');
    const [UserFullName, setUserFullName] = useState('');
    const [UserRole, setUserRole] = useState('User');
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(true);
    const [LoggedInTimestamp, setLoggedInTimestamp] = useState(0);
    const [decryptedDataArray, SetDecryptedDataArray] = useState([]);

    //Flag for DecryptData()
    const [isDecryptDataDone, setDecryptDataDone] = useState(false);

    //var UserUUID = '';


    //Run Decrypt Data Function
    DecryptData();

    //if Decrypt Data and User is NOT auth, Redirect to 401 page
    if (isDecryptDataDone) {

        if (!isUserAuthenticated) {

            return <Redirect to='/unauthorised' />

        }

    }

    //if Decrypt Data and User NOT User, Redirect to 401 page
    if (isDecryptDataDone) {

        if (UserRole !== 'User') {

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

                //Populate User Expenses
                populateExpenses(decryptedData.UserUUID);
            }
            else {

                //Set User Auth to False
                setIsUserAuthenticated(false);

                //Set Decryption Flag Done
                setDecryptDataDone(true);
            }
        }
    }


    //Render Query Table
    function renderQueryTable(expenditure) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Expenditure ID (System Generated)</th>
                        <th>Date Of Expenditure</th>
                        <th>Description</th>
                        <th>Amount Spent</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {expenditure.map(expenditure =>
                        <tr key={expenditure.ExpensesUUID}>
                            <td>{expenditure.ExpensesUUID}</td>
                            <td>{new Date(Date.parse(expenditure.DateOfExpenditure)).toISOString().substr(8, 2)
                                + "-"
                                + new Date(Date.parse(expenditure.DateOfExpenditure)).toISOString().substr(5, 2)
                                + "-"
                                + new Date(Date.parse(expenditure.DateOfExpenditure)).toISOString().substr(0, 4)}</td>
                            <td>{expenditure.Description}</td>
                            <td>$ {parseFloat(expenditure.AmountSpent).toFixed(2)}</td>
                            <td>{expenditure.Remarks}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    //Populate Expense of User
    function populateExpenses(UserUUID) {

        if (UserUUID != '') {

            const UserUUIDObj = { UserUUID };

            axios.post('/api/populatedetailedpenditurebyuser', UserUUIDObj).then(response => {

                if (response.status === 200) {

                    setExpenditure(response.data);
                    setLoading(false);
                }
                else {
                }
            },
                (error => {
                }));
        }
    }

    let contents = loading ? <p><em>Loading...</em></p> : renderQueryTable(expenditure);

    return (
        <div>
            <h3>Query Expenditure</h3>
            <p>The following shows all past expenditure incurred.</p>
            {contents}
        </div>
    );
}


export default QueryExpenditure;