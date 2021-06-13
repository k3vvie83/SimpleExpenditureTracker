import React from 'react';
import { useState, useEffect } from 'react'
import axios from 'axios';
import { Redirect } from 'react-router';


export function QueryExpenditure(props) {

    var UserUUID = window.sessionStorage.getItem("UserUUID");

    const [expenditure, setExpenditure] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('component mounted!')
        populateExpenses();

    }, [])

    if (!window.sessionStorage.getItem("isAuthenticated")) {
        return <Redirect to='/unauthorised' />
    }

    function renderQueryTable(expenditure) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Expenses ID</th>
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
                            <td>{expenditure.DateOfExpenditure}</td>
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

    let contents = loading
        ? <p><em>Loading...</em></p>
        : renderQueryTable(expenditure);

    return (
        <div>
            <h3>Query Expenditure</h3>
            <p>The following shows all the expenses incurred.</p>
            {contents}
        </div>
    );
}


export default QueryExpenditure;