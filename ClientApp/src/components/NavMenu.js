import React from 'react';
import { useState, useEffect } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

export function NavMenu(props) {

    const [collapsed, setCollapsed] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);


    function checkAUthentication() {
        if (window.sessionStorage.getItem("isAuthenticated")) {
            setIsAuthenticated(true);
        }
        else {
            setIsAuthenticated(false);
        }

        var isAdmin = window.sessionStorage.getItem("Role");

        if (isAdmin != null) {
            if (isAdmin == 'Admin') {
                setIsAdmin(true);
            }
            else {
                setIsAdmin(false);
            }
        }
    }

    setInterval(() => checkAUthentication(), 250);

    useEffect(() => {
        return () => {
        }
    });

    function toggleNavbar() {
        setCollapsed(!collapsed);
    }

    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                <Container>
                    <NavbarBrand>A Simple Web App</NavbarBrand>
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