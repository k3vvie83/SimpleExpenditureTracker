import React from 'react';

export function About(props) {

    return (
        <div>
            <h1>This is a simple web app for expediture tracking.</h1>

            <br />

            <h2> Application is created using Visio 2019 (Version 16.10.0) </h2>

            <br />

            <h2>Front End is created with ReactJS</h2>
            <p>npm (version : 7.15.1)</p>
            <p>node (version : 16.3.0)</p>
            <br />
            <p><u>Additional npm Packages</u></p>
            <p>axios@0.21.1</p>
            <p>crypto-js@4.0.0</p>
            <p>js-sha256@0.9.0</p>

            <br />

            <h2>Back End is created with .NET 5.0</h2>
            <p><u>NuGet Packages</u></p>
            <p>MySql.Data Version 8.0.25 (MySql.Data.MySqlClient .Net Core Class Library)</p>

            <br />

            <h2>Database is using MySQL Community Server (Version 8.0.25)</h2>
            <p><u>MySQL Container from Docker Hub</u></p>
            <p>To pull the latest container image, type <i><b>"docker pull mysql:latest"</b></i> in console.</p>

            <br />

            <h2>Login Instruction</h2>
            <p>There are '3' users in the database.</p>
            <p> 1. Username : 'Alice', Password : 'P@ssw0rdAlice' => Role : Admin</p>
            <p> 2. Username : 'Bob' , Password : 'P@ssw0rdBob' => Role : User</p>
            <p> 3. Username : 'Eve' , Password : P@ssw0rdEve' => Role : User</p>

        </div>
    );

}

export default About;