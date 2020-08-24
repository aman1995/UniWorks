
IMPORTANT NOTES:

    1. Make sure you follow the steps mentioned under "PROJECT START STEPS" and ensure that the steps execute successfully. 

PROJECT START STEPS:

    Pre-requisites:
    1. Install node, npm
    2. Install express (npm install express --save)
    3. Install MongoDB

    Steps:
    1. To run this application, do the following:
        1.a  Open up your command prompt and type mongod to start the MongoDB server.
        1.b. Go to the project root directory.
        1.c. Run the following commands respectively in the terminal/command line to build and run the app:
            - npm install
            - npm start or nodemon
    
    2. Go to http://localhost:3000 in your browser to view it.

API END POINTS:
    1.    /api/user/create - Post request to create an user
    2.    /api/login- Post request to obtain the JWT token 
   
    3.    To access any resource attach key as 'x-auth-token' and value as token            obtained during login in header while sending request through postman
        
    
    4.  /api/user/get/:id  - Get Request to obtain a particular ID. 
    5.  /api/user/pendingList - Get request to obtain all the pending approvals
    6.  /api/user/approve/:userId - Put request to approve an user.
    7.  /api/user/approvedList - Get request to obtain all approved users.
    8.  /api/user/edit/:id - Put request to edit an user.
    9.  /delete/:id - Delete request to delete an user.