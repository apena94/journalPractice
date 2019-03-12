const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config  = require('./config/database'); //importing module.exports of DB
const path = require('path'); // prod requirement to connect to angular
const authentication = require('./routes/authentication')(router); //passing it in this way is to share
const bodyParser = require('body-parser');//acts as middleware to translate json

mongoose.Promise = global.Promise;//mongoose config
mongoose.connect(config.uri, {useNewUrlParser: true}, (err) => {
    if(err) {
        console.log('Could NOT connect to database: ', err);
    } else{
        console.log('Could connect to database: ', config.db);
    }
});

app.use(bodyParser.urlencoded({ extended: false}));//middleware for json deserialization and into model. application/c-www-form-urlencoded accepted
app.use(bodyParser.json());

app.use(express.static(__dirname + '/client/dist/'));// TODO prod only
app.use('/authentication', authentication);

app.get( '*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index/html')); //prod
});

app.get( '/', (req, res) => {
    res.send('<h1>hello world</h1>');
});
app.get( '*', (req, res) => {
    res.send('<h1>default for all routes</h1>');
});

app.listen(8080, () => {
    console.log('Listening on port 8080');
});