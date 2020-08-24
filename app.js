const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/user');
const loginRouter = require('./routes/userLogin');
const bodyParser = require("body-parser");
var app = express();
const config = require('config');

//connect to db
const connectionString = config.get('db');
mongoose.connect(connectionString);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

app.use('/uploads' , express.static('uploads'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/api/user', usersRouter);
app.use('/api/login', loginRouter);

const port = process.env.PORT || 3000; 
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));



module.exports = app;