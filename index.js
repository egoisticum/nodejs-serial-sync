var SerialPort = require("serialport");
var request = require('request');
var portName = "COM3";

//first part of code - serial communication
var port = new SerialPort(portName, {
    baudRate: 9600,
    dataBits: 8,
    parser: SerialPort.parsers.readline("\n"),
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

var body = {
    "elems": {
        "light": {
            "type": "boolean",
            "value": false
        }
    }
};

port.on("open", function () {
    console.log("Connection established");

    //Listening incoming data
    port.on("data", function (sensorData) {
        if (sensorData.toString().indexOf("L=1") !== -1) {
            body.elems.light.value = true;
        }
        else if (sensorData.toString().indexOf("L=0") !== -1) {
            body.elems.light.value = false;
        }
        //2nd part of code - http communication
        //Options object preps
        var options = {
            method: "post",
            url: "https://api.flowthings.io/v0.1/adodigovic/drop/f58daa4df5db77c6fe38d6162",
            body: body,
            json: true,
            headers: {
                "Content-type": "application/json",
                "X-Auth-Token": "5GfmiMXaSjGGMPpP6Kflqlt78Wnbv3hY"
            }
        };
        //Sending request to flowthings.io
        request(options, function (error, response, body) {
            console.log("error");
            console.log(error);

            console.log("body");
            console.log(body);
        });

        console.log(body);
    });
});


