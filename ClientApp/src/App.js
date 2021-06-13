import React from 'react';
import { useEffect } from 'react';
import { Route } from 'react-router';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import { Layout } from './components/Layout';

import { Home } from './components/Common/Home';
import { SignIn } from './components/Common/SignIn';
import { SignOut } from './components/Common/SignOut';
import { About } from './components/Common/About';
import { ChangePassword } from "./components/Common/ChangePassword";

import { EnterExpenditure } from "./components/User/EnterExpenditure";
import { QueryExpenditure } from "./components/User/QueryExpenditure";

import { AddUser } from "./components/Admin/AddUser";
import { DeleteUser } from "./components/Admin/DeleteUser";

import { Unauthorised } from "./components/Error/Unauthorised";
import { PageNotFound } from "./components/Error/PageNotFound";

import './custom.css'

export default function App(props) {

    useEffect(() => {
    }, []);

    return (
        <Router>
            <Layout>
                <Switch>
                    <Route exact path='/' component={SignIn} />
                    <Route path='/about' component={About} />
                    <Route path='/home' component={Home} />
                    <Route path='/enterexpenditure' component={EnterExpenditure} />
                    <Route path='/queryexpenditure' component={QueryExpenditure} />
                    <Route path='/changepassword' component={ChangePassword} />
                    <Route path='/adduser' component={AddUser} />
                    <Route path='/deleteuser' component={DeleteUser} />
                    <Route path='/signout' component={SignOut} />
                    <Route path='/unauthorised' component={Unauthorised} />
                    <Route component={PageNotFound} />
                </Switch>
            </Layout>
        </Router>
    );

}
