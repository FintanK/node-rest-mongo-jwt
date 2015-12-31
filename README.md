Node.js REST API with JWT (JSON web token authentication)
---------------------------------------------------------

Note: Make sure your mongodb service is running.

Components

- MongoDB Database
- Node.js

Check 'package.json' for Node module dependencies

Installation
------------

> npm install

Visit http://localhost:3000/setup in your browser to populate the admin user for the database.


Running the application
------------------------

In the root directory

> npm install nodemon -g
> nodemon server.js

(Changes will reload automatically)

or alternatively

> node server.js

Endpoints
----------

GET http://localhost:3000/api
POST http://localhost:3000/api/auth
GET http://localhost:3000/api/users


Useful links
------------

Mongodb connection strings - https://docs.mongodb.org/v3.0/reference/connection-string/
