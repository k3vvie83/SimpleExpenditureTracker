import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';




export function EnterExpenditure(props) {

    var UUID = window.sessionStorage.getItem("UserUUID");

    const [UserUUID, setUserUUID] = useState(UUID);
    const [DateOfExpenditure, setDateOfExpenditure] = useState('');
    const [Description, setDescription] = useState('');
    const [AmountSpent, setAmountSpent] = useState('');
    const [Remarks, setRemarks] = useState('');
    const [DateOfExpenditureInNoticeBar, setDateOfExpenditureInNoticeBar] = useState('');
    const [DescriptionInNoticeBar, setDescriptionInNoticeBar] = useState('');
    const [AmountSpentInNoticeBar, setAmountSpentInNoticeBar] = useState('');
    const [RemarksInNoticeBar, setRemarksInNoticeBar] = useState('');
    const [notificationSelection, setNotificationSelection] = useState(0);


    useEffect(() => {
        console.log('EnterExpenditure >> component mounted! SignIn')
    },[]); 

    if (!window.sessionStorage.getItem("isAuthenticated")) {
        return <Redirect to='/unauthorised' />
    }

    const mySubmitHandler = (event) => {

        event.preventDefault();

        if (!DateOfExpenditure || !Description || !AmountSpent) {
            setNotificationSelection(3);
            return;
        }

        if (isNaN(AmountSpent)) {
            setNotificationSelection(4);
            return;
        }

        const NewExpenditureInfo = { UserUUID, DateOfExpenditure, Description, AmountSpent, Remarks };

        axios.post('/api/createexpenditure', NewExpenditureInfo).then(response => {


            console.log("EnterExpenditure >>  Response Status : " + response.status + "Response Data : " + response.data);


            if (response.status === 200) {


                setNotificationSelection(2);

                setDescriptionInNoticeBar(Description);
                setRemarksInNoticeBar(Remarks);
                setAmountSpentInNoticeBar(AmountSpent);
                setDateOfExpenditureInNoticeBar(DateOfExpenditure);

                setDescription('');
                setRemarks('');
                setAmountSpent('');
                setDateOfExpenditure(0);
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
                    <input type="Date" className="form-control" placeholder="Enter Date Of Expenditure" onChange={e => setDateOfExpenditure(e.target.value)} value={ DateOfExpenditure }/>
                </div>
                <br />
                <div className="form-group">
                    <label>Description</label>
                    <input type="Textbox" className="form-control" placeholder="Enter Description" onChange={e => setDescription(e.target.value)} value={ Description }/>
                </div>
                <br />
                <div className="form-group">
                    <label>Amount Spent</label>
                    <input type="Textbox" className="form-control" placeholder="Enter Amount Spent in SGD $" onChange={e => setAmountSpent(e.target.value)} value={ AmountSpent }/>
                </div>
                <br />
                <div className="form-group">
                    <label>Remarks</label>
                    <input type="TextArea" className="form-control" placeholder="Enter Remarks (Not Mandatory)" onChange={e => setRemarks(e.target.value)} value={ Remarks }/>
                </div>

                <div>
                    <button type="submit" className="btn btn-primary btn-block">Submit</button>
                </div>

            </form>

        </div>);
}


export default EnterExpenditure;