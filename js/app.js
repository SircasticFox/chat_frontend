/**
 * Created by Andreas on 26.06.2017.
 */
(function() {
    var app = angular.module('chat', ['ngMaterial']);

    //Create Chat Controller, which holds the messages and the rooms
    app.controller('chatController', function () {
        this.messages = dummyMessages;
        this.rooms = dummyRooms;
    });

    var socket = new WebSocket('wss://echo.websocket.org');
    socket.onopen = function (event) {
        //Connection opens
    };

    socket.onclose = function (event) {
        //Connection closes
    };

    socket.onerror = function (event) {
        //Some kind of error
    };

    socket.onmessage = function (event) {
        //new message from server
    };


    var dummyMessages = [
        {
            user: "User",
            message: "Message 1",
            timestamp: 1397490980837
        },
        {
            user: "User",
            message: "Message 2",
            timestamp: 1397490980837
        },
        {
            user: "User",
            message: "Message 3",
            timestamp: 1397490980837
        },
        {
            user: "User",
            message: "Message 4",
            timestamp: 1397490980837
        }
    ];

    var dummyRooms = [
        {
            room: "Lobby"
        },
        {
            room: "Room 1"
        },
        {
            room: "Room 2"
        },
        {
            room: "Room 3"
        }
    ];
})();