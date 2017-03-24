"use strict";

var logger = require("winston");
const socketIO = require("socket.io-client");
const config = require("./config/server.config.json");
const ClientModel = require("./dataAccess/models/clientModel");

function initSocketIO() {
    logger.info("Initializing socketIO");

    var intervalTime = 1 * 1000 * 60; // minutes_number * ms * second = miliseconds number

    var io = socketIO.connect(config.centralAddress + "/backupLine", {forceNew: true});

    setInterval(function () {
        ClientModel.find({}, function (err, clients) {
            if (err) {
                logger.error(err);
                io.emit("backup", {date: new Date(), message: err, collectionData: clients});
                return;
            }
            logger.info("Emitting Clients collection");
            io.emit("backup", {date: new Date(), message: "Emitting Clients collection", collectionData: clients});
        });
    }, intervalTime);


    diagnoseConnection(io);
}

function diagnoseConnection(io) {

    io.on("error", function () {
        logger.info("Error in connecting socket");

    });
    io.on("connect", function () {
        logger.info("Connected to central server");

    });
    io.on("connect_error", function () {
        logger.info("connect_error");
    });
    io.on("connect_timeout", function () {
        logger.info("connect_timeout");
    });
    io.on("disconnect", function () {
        logger.info("Disconnected from central server");

    });
    io.on("reconnect", function () {
        logger.info("Reconnecting to socket");
    });
    io.on("reconnect_attempt", function () {
        logger.info("reconnect_attempt");
    });
    io.on("reconnect_error", function () {
        logger.info("Can not connect to socket.");
    });

    io.on("reconnect_failed", function () {
        logger.info("reconnect_failed");
    });
    io.on("reconnecting", function () {
        logger.info("reconnecting");
    });
}

module.exports = initSocketIO;