import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import CryptoJS from 'crypto-js';

export function QueryExpenditure(props) {

    const [expenditure, setExpenditure] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isUserAuthenticated, setIsUserAuthenticated] = useState(true);
    const [UserRole, setUserRole] = useState('User');
    const [decryptedDataArray, SetDecryptedDataArray] = useState([]);
    //const [UserUUID, setUserUUID] = useState('');

    const [isDecryptDataDone, setDecryptDataDone] = useState(false);

    var UserUUID = '';
    //var isUserAuthenticated = false  ;


    //useEffect(() => {
    if (!isDecryptDataDone) {
        DecryptData();
        /*populateExpenses();*/
        //}, []);
    }

//    if (isDecryptDataDone && isUserAuthenticated) {
//    populateExpenses();
//}



    function DecryptData() {
        if (!isDecryptDataDone) {
            var EncryptedData = window.sessionStorage.getItem("Data");

            if (EncryptedData != null) {
                var bytes = CryptoJS.AES.decrypt(EncryptedData, 'my-secret-key@123');
                var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                //var isAuthenticated = decryptedData.isAuthenticated;

                SetDecryptedDataArray(decryptedData);
                //setUserUUID(decryptedData.UserUUID);
                UserUUID = decryptedData.UserUUID;
                setIsUserAuthenticated(true);
                setUserRole(decryptedData.Role);
                setDecryptDataDone(true);

                populateExpenses();
            }
            else {
                setIsUserAuthenticated(false);
                setDecryptDataDone(true);
            }
        }
    }



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

    function populateExpenses() {

        const UserUUIDObj = { UserUUID };

        if (UserUUIDObj != '') {
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


    if (isDecryptDataDone) {
        if (!isUserAuthenticated) {
            return <Redirect to='/unauthorised' />
        }
    }

    if (isDecryptDataDone) {
        if (UserRole !== 'User') {
            return <Redirect to='/unauthorised' />
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