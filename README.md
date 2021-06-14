# SimpleExpenditureTracker (Ver 1.0)
A Simple Expenditure Tracker Application

----
About
===
- Application is created using Visio 2019.
- Frontend
  - ReactJS
  - NodeJS
  - axios@0.21.1
  - crypto-js@4.0.0
  - js-sha256@0.9.0
- Backend
  - .Net Core 5
  - MySql.Data Version 8.0.25 (MySql.Data.MySqlClient .Net Core Class Library)
- Database
  - MySQL Community Server (Version 8.0.25)




To Build (Application):
===

To build the application from source code and compile it into containers, follow the below instructions. 

***Alternatively, you can also do a docker pull from `kevinchan83/simple_expenditure_tracker:0.1`***

Linux (Ubuntu)
---------------
- Install Docker, Refer to guide (https://docs.docker.com/engine/install/ubuntu/)
- Install NodeJS, Refer to guide (https://github.com/nodesource/distributions/blob/master/README.md#debinstall)
- Pull source code from GitHub ***`k3vvie83/SimpleExpenditureTracker`*** (https://github.com/k3vvie83/SimpleExpenditureTracker)
- Go to terminal, unzip package and change directory to the unzip package
- Type `sudo docker build -t simple_expenditure_tracker:0.1 .` 
- Enter SUDO password
- Wait for image build to finish
- Type `sudo docker images`, you shoud see the the image created under *REPOSITORY*

Windows
-------
- Download and install Docker for Windows (https://desktop.docker.com/win/stable/amd64/Docker%20Desktop%20Installer.exe)
- Download and install NodeJS for Windows (https://nodejs.org/dist/v16.3.0/node-v16.3.0-x86.msi)
- Pull source code from GitHub ***`k3vvie83/SimpleExpenditureTracker`*** (https://github.com/k3vvie83/SimpleExpenditureTracker)
- Go to console, unzip package and change directory to the unzip package
- Type `docker build -t simple_expenditure_tracker:0.1 .`
- Wait for image build to finish
- Type `docker images`, you shoud see the the image created under *REPOSITORY*

----
Database:
==
Do a docker pull from **mysql:latest** and initialise the MySQL DB from the SQL script `"Simple_Expenditure_App_SQL_Schema.sql"` provided in the source code package.


Linux (Ubuntu)
---------------
- From terminal, type `sudo docker run -d --name=database --env="MYSQL_ROOT_PASSWORD=<your_own_root_password>" mysql:latest` to download the MySQL latest image 
- Verify the container is running by typing `sudo docker ps`, you should see the process running with the corresponding *CONTAINER ID*
- Copy the SQL script into the docker container. Type `sudo docker cp Simple_Expenditure_App_SQL_Schema.sql <ContainerID>:/tmp`
- Login to the container and execute the script. Type `sudo docker exec -it <ContainerID> bash`
- Change Directory to `/tmp`
- Type `mysql -u root -p < Simple_Expenditure_App_SQL_Schema.sql `
- Enter Password when prompt.                                                              

Windows
-------
- From console, type `docker run -d --name=database --env="MYSQL_ROOT_PASSWORD=<your_own_root_password>" mysql:latest` to download the MySQL latest image 
- Verify the container is running by typing `docker ps`, you should see the process running with the corresponding *CONTAINER ID*
- Copy the SQL script into the docker container. Type `docker cp Simple_Expenditure_App_SQL_Schema.sql <ContainerID>:/tmp`
- Login to the container and execute the script. Type `docker exec -it <ContainerID> bash`
- Change Directory to `/tmp`
- Type `mysql -u root -p < Simple_Expenditure_App_SQL_Schema.sql`
- Enter Password when prompt.  

                                                                
To Start (Application):
====
Linux (Ubuntu)
---------------
- To start application from build:
  - From terminal, type `sudo docker run -d -p 80:80 --name application --link database:database simple_expenditure_tracker:0.1` to start the container image
  - Verify the container is running by typing `sudo docker ps`, you should see the process running with the corresponding *CONTAINER ID*
  
  **Alternatively**
  
- To start application from docker pull:
  - From terminal, type `sudo docker run -d -p 80:80 --name application --link database:database kevinchan83/simple_expenditure_tracker:0.1` to pull the container from docker hub and then start the container image
  - Verify the container is running by typing `sudo docker ps`, you should see the process running with the corresponding *CONTAINER ID*

Windows
-------
- To start application from build:
  - From console, type `docker run -d -p 80:80 --name application --link database:database simple_expenditure_tracker:0.1` to start the container image
  - Verify the container is running by typing `docker ps`, you should see the process running with the corresponding *CONTAINER ID*
  
  **Alternatively**
  
- To start application from docker pull:
  - From console, type `docker run -d -p 80:80 --name application --link database:database kevinchan83/simple_expenditure_tracker:0.1` to pull the container from docker hub and then start the container image
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

How to change Database Connection
===
- Locate file `app.config` in source code package
- Locate line `<add key="database_server" value="database"/>` and change value to new hostname or ip address
- Recompile application
