import React from 'react';
import { useState, useEffect } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';

export function NavMenu(props) {

    var intervalID = 0;
    const [collapsed, setCollapsed] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [decryptedDataArray, SetDecryptedDataArray] = useState([]);

    useEffect(() => {
        intervalID = setInterval(() => checkAuthentication(), 1000);

        return () => {
            clearInterval(intervalID);
        };
    });

    function checkAuthentication() {

        var EncryptedData = window.sessionStorage.getItem("Data");
        var isAuthenticated = false;
        var isAdmin = '';

        if (EncryptedData != null) {
            var bytes = CryptoJS.AES.decrypt(EncryptedData, 'my-secret-key@123');
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

            SetDecryptedDataArray(decryptedData);
            isAuthenticated = decryptedData.isAuthenticated;
            isAdmin = decryptedData.Role;
            //console.log("NavMenu::isAuthenticated " + new Date().getTime() + " " +   isAuthenticated);
            //console.log("NavMenu::isAdmin " + new Date().getTime() + " " +isAdmin);
        }

        if (isAuthenticated) {
            setIsAuthenticated(true);
        }
        else {
            setIsAuthenticated(false);
        }

        //var isAdmin = window.sessionStorage.getItem("Role");


        if (isAdmin == 'Admin') {
            setIsAdmin(true);
        }
        else {
            setIsAdmin(false);
        }

    }



    function toggleNavbar() {
        setCollapsed(!collapsed);
    }

    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                <Container>
                    <NavbarBrand>Simple Expenditure Tracker (Ver 1.0)</NavbarBrand>
                    <NavbarToggler onClick={toggleNavbar} className="mr-2" />
                    <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
                        <ul className="navbar-nav flex-grow">
                            {!isAuthenticated ? <NavItem><NavLink tag={Link} className="text-dark" to="/">Sign In</NavLink></NavItem> : ""}
                            <NavItem><NavLink tag={Link} className="text-dark" to="/about">About</NavLink></NavItem>
                            {isAuthenticated ? <NavItem><NavLink tag={Link} className="text-dark" to="/home">Home</NavLink></NavItem> : ""}
                            {isAuthenticated && !isAdmin ? <NavItem><NavLink tag={Link} className="text-dark" to="/enterexpenditure">Enter Expenditure</NavLink></NavItem> : ""}
                            {isAuthenticated && !isAdmin ? <NavItem><NavLink tag={Link} className="text-dark" to="/queryexpenditure">Query Expenditure</NavLink></NavItem> : ""}
                            {isAuthenticated && isAdmin ? <NavItem><NavLink tag={Link} className="text-dark" to="/adduser">Add User</NavLink></NavItem> : ""}
                            {isAuthenticated && isAdmin ? <NavItem><NavLink tag={Link} className="text-dark" to="/deleteuser">Delete User</NavLink></NavItem> : ""}
                            {isAuthenticated ? <NavItem><NavLink tag={Link} className="text-dark" to="/changepassword">Change Password</NavLink></NavItem> : ""}
                            {isAuthenticated ? <NavItem><NavLink tag={Link} className="text-dark" to="/signout">Sign Out</NavLink></NavItem> : ""}
                        </ul>
                    </Collapse>
                </Container>
            </Navbar>
        </header>
    );

}

export default NavMenu;