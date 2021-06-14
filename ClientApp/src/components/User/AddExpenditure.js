import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import CryptoJS from 'crypto-js';

export function AddExpenditure(props) {

    //Var for Add Expenditure Form
    const [DateOfExpenditure, setDateOfExpenditure] = useState('');
    const [Description, setDescription] = useState('');
    const [AmountSpent, setAmountSpent] = useState('');
    const [Remarks, setRemarks] = useState('');

    //Var for Notification Bar display
    const [DateOfExpenditureInNoticeBar, setDateOfExpenditureInNoticeBar] = useState('');
    const [DescriptionInNoticeBar, setDescriptionInNoticeBar] = useState('');
    const [AmountSpentInNoticeBar, setAmountSpentInNoticeBar] = useState('');
    const [RemarksInNoticeBar, setRemarksInNoticeBar] = useState('');

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
        if (!DateOfExpenditure || !Description || !AmountSpent) {

            setNotificationSelection(3);

            return;
        }

        //Check Amount entered is Numeric
        if (isNaN(AmountSpent)) {

            setNotificationSelection(4);

            return;
        }

        //Create New Expenditure JSON object
        const NewExpenditureInfo = { UserUUID, DateOfExpenditure, Description, AmountSpent, Remarks };

        //Call Backend to create new Expenditure
        axios.post('/api/createexpenditure', NewExpenditureInfo).then(response => {


            //if response is 200 HTTP OK
            if (response.status === 200) {

                //Set info in Notification Bar
                setDescriptionInNoticeBar(Description);
                setRemarksInNoticeBar(Remarks);
                setAmountSpentInNoticeBar(AmountSpent);
                setDateOfExpenditureInNoticeBar(DateOfExpenditure);


                //Set Notification Bar Status
                setNotificationSelection(2);

                //Clear Form and Reset
                setDescription('');
                setRemarks('');
                setAmountSpent('');
                setDateOfExpenditure(0);

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

        switch (notificationSelection) {

            case 0: return (null);

            case 1: return (<div className='error'><a> Error Saving Record into Database! </a></div>);
                break;

            case 2: return (
                <div className='success'>
                    <p><a> Record Entered Successfully! </a></p>
                    <p> Date : {DateOfExpenditureInNoticeBar}</p>
                    <p> Description : {DescriptionInNoticeBar}</p>
                    <p> Amount Spent : {parseFloat(AmountSpentInNoticeBar).toFixed(2)}</p>
                    <p> Remarks : {RemarksInNoticeBar}</p>
                </div>
            );
                break;

            case 3: return (<div className='error'><a> Empty Field Detected! Please Check Submission! </a></div>);
                break;

            case 4: return (<div className='error'><a> Please Check Amount Entered! </a></div>);
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
                <h3>Enter New Expense</h3>
                <br />
                <div className="form-group">
                    <label>Date Of Expenditure</label>
                    <input type="Date" className="form-control" placeholder="Enter Date Of Expenditure" onChange={e => setDateOfExpenditure(e.target.value)} value={DateOfExpenditure} />
                </div>
                <br />
                <div className="form-group">
                    <label>Description</label>
                    <input type="Textbox" className="form-control" placeholder="Enter Description" onChange={e => setDescription(e.target.value)} value={Description} />
                </div>
                <br />
                <div className="form-group">
                    <label>Amount Spent</label>
                    <input type="Textbox" className="form-control" placeholder="Enter Amount Spent in SGD $" onChange={e => setAmountSpent(e.target.value)} value={AmountSpent} />
                </div>
                <br />
                <div className="form-group">
                    <label>Remarks</label>
                    <input type="TextArea" className="form-control" placeholder="Enter Remarks (Not Mandatory)" onChange={e => setRemarks(e.target.value)} value={Remarks} />
                </div>

                <div>
                    <button type="submit" className="btn btn-primary btn-block">Submit</button>
                </div>

            </form>

        </div>);
}


export default AddExpenditure;