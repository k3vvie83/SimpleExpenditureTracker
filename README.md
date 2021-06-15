# SimpleExpenditureTracker (Ver 1.0)
A Simple Expenditure Tracker Application

----
About
===
- Application is created using Visio 2019 (Version 16.10.0)
- Frontend
  - ReactJS 
  - NodeJS 
    - npm version : 7.15.1
    - node version : 16.3.0
  - axios@0.21.1
  - crypto-js@4.0.0
  - js-sha256@0.9.0
- Backend
  - .Net 5.0
  - NuGet Package
    - MySql.Data Version 8.0.25 (MySql.Data.MySqlClient .Net Core Class Library)
- Database
  - MySQL Community Server (Version 8.0.25)




To Build Application:
===
To build the application from source code and compile it into containers, follow the below instructions. 

Alternatively, you can also do a docker pull from ***`kevinchan83/simple_expenditure_tracker:1.0`***.
To pull from docker, type `docker pull kevinchan83/simple_expenditure_tracker:1.0` in the console or terminal.

macOS / Linux (Prerequisite)
---------------
- Install Docker on Linux, Refer to guide (https://docs.docker.com/engine/install/) on installation instruction on different OS variant.
- Install NodeJS on Linux, Refer to guide (https://nodejs.org/en/download/package-manager/) on installation instruction on different OS variant.

Windows (Prerequisite)
-------
- Download and install Docker for Windows (https://desktop.docker.com/win/stable/amd64/Docker%20Desktop%20Installer.exe)
- Download and install NodeJS for Windows (https://nodejs.org/dist/v16.3.0/node-v16.3.0-x86.msi)

To Build
-------
- Pull source code from GitHub ***`k3vvie83/SimpleExpenditureTracker`*** (https://github.com/k3vvie83/SimpleExpenditureTracker)
- Go to console/terminal, unzip package and change directory to the unzip package
- Type `docker build -t simple_expenditure_tracker:1.0 .`
- Wait for image build to finish
- Type `docker images`, you shoud see the the image created under *REPOSITORY*

----
Database:
===
Do a docker pull for latest MySQL Version and initialise the MySQL DB from the SQL script provided in the source code package.

- From console/terminal, type `docker run -d --name=database1 --env="MYSQL_ROOT_PASSWORD=<root_password>" --env="MYSQL_DATABASE=SimpleDatabase" mysql:latest` to pull the MySQL latest image from docker hub.
- Verify the container is running by typing `docker ps`, you should see the process running with the corresponding *CONTAINER ID*
- Copy the SQL script into the docker container. Type `docker cp Simple_Expenditure_App_SQL_Schema.sql <ContainerID>:/`
- Login to the container and execute the script. Type `docker exec -it <ContainerID> bash`
- Type `mysql -u root -p < Simple_Expenditure_App_SQL_Schema.sql`
- Enter Password when prompt. ***Password is the SQL password set during MySQL Image creation.***
- Type `exit` to exit bash shell.
                                                                
To run the application in Docker):
====
To run the application in docker, follow the below steps

- To start application from build:
  - From console/terminal, type `docker run -d -p 80:80 --name application --link database:database simple_expenditure_tracker:1.0` to start the container image
  - Verify the container is running by typing `docker ps`, you should see the process running with the corresponding *CONTAINER ID*
  
  **Alternatively**
  
- To start application from docker pull:
  - From console/terminal, type `docker run -d -p 80:80 --name application --link database:database kevinchan83/simple_expenditure_tracker:1.0` to pull the container from docker hub and then start the container image
  - Verify the container is running by typing `docker ps`, you should see the process running with the corresponding *CONTAINER ID*


How to use the application
===
- To access the application, use web browser and go to `http://localhost` or `http://<IP_ADDRESS>` of host
- There are 3 default test users with 2 distinct roles as shown below ***{Username : Password}***
  - Admin
    - Alice : P@ssw0rdAlice
   - User
     - Bob : P@ssw0rdBob
     - Eve : P@ssw0rdEve
- Admin can add or remove users, but not create expendiure records
- User can create expenditure records but not add or remove users
- Both Admin and User can change own password

