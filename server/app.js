var express = require('express');
var json2csv = require('json2csv');
var fs = require('fs');
var app = express();
var morgan = require("morgan");
var winston = require("winston");
var myJSON = require("json");

var headers = ['Agent', 'Time', 'Method', 'Resource', 'Version', 'Status']
app.use(function (req, res, next) {
    // write your logging code here
    var date = new Date();

    var myJSON = JSON.stringify(log);

    var log = {
        agent: req.headers['user-agent'],
        time: date.toISOString(),
        method: req.method,
        resource: req.url,
        version: req.protocol.toUpperCase() + '/' + req.httpVersion,
        status: res.statusCode,
    }

    var string = log.agent.replace(/[,]/g, '') + ',' + log.time + ',' + log.method + ',' + log.resource + ',' + log.version + ',' + log.status + '\n'

    fs.appendFile('./log.csv', string, function (err) {
        if (err) throw err;
        /*console.log('it worked');*/
    });

    console.log(string)
    next()
});

app.get('/', (req, res) => {
    // write your code to respond "ok" here
    res.send("ok")
});

app.get('/logs', (req, res) => {
    // write your code to return a json object containing the log data here
    fs.readFile('log.csv', 'utf8', (err, data) => {
        if (err) throw err;
        data = data + '';
        var logs = data.split('\n');
        var array = [];
        logs.forEach(function (log) {
            var logAll = log.split(',');
            var logValues = {};
            headers.forEach(function (headers, i) {
                logValues[headers] = logAll[i];

            });
            array.push(logValues);
        });
        res.json(array.slice(1));
    });

});

module.exports = app;

