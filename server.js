var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model

var port = process.env.PORT || 3000;
mongoose.connect(config.database);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// basic route
app.get('/', function(req, res) {
    res.send('Hello! The REST API endpoint is http://localhost:' + port + '/api');
});

// get an instance of the router for api routes
var apiRoutes = express.Router();

// Route for Authentication (POST http://localhost:8080/api/auth)
apiRoutes.post('/auth', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // Create our JWT
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresInMinutes: 2880 // expires in 48 hours
        });

        // Return the information including the generated token as JSON for use in the client app
        res.json({
          success: true,
          message: 'You are now authenticated!',
          token: token
        });
      }

    }

  });
});

// Perform checks for each call on an API route
apiRoutes.use(function(req, res, next) {

  // Check the headers or URL for token information
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // Decode the supplied token
  if (token) {

    // Make sure the secret is correct
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // Return a 403 and block access
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});

apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to our example REST API!' });
});

// All users
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

// Apply our defines routes to this endpoint
app.use('/api', apiRoutes);


// Populate the mongodb database with our admin user
app.get('/setup', function(req, res) {

  // Create an admin user for our API
  var nick = new User({
    name: 'John doe',
    password: 'password',
    admin: true
  });

  // Save the user
  nick.save(function(err) {
    if (err) throw err;

    console.log('Admin user created');
    res.json({ success: true });
  });
});

app.listen(port);
console.log('Running at http://localhost:' + port);
