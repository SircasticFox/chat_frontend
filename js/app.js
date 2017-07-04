/**
 * Created by Andreas on 26.06.2017.
 */
(function() {
    var app = angular.module('chat', ['ngMaterial', 'custom-directives']);

    //Create Chat Controller, which holds the messages and the rooms
    app.controller('chatController', function () {
        this.messages = dummyMessages;
        this.myMessage = "";
        this.rooms = dummyRooms;
        this.openRoom = function (room) {
            console.log("Joining Room: " + room.room);
        };
        this.sendMessage = function () {
            
        };
        this.getFirstLetter = function(input) {
            return input.substring(0,1);
        };
        this.scrollOnNew = function(scope, element){
            scope.$watchCollection('this.messages', this.scrollDown);
        };
        this.scrollDown = function(){
            var list = angular.element( document.querySelector( '#chat-content' ) );
            var scrollH = list.prop('scrollHeight');
            list.animate({scrollTop: scrollH}, 500);
        };
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
        },
        {
            user: "User",
            message: "Message 5",
            timestamp: 1397490980837
        },
        {
            user: "User",
            message: "Message 6",
            timestamp: 1397490980837
        },
        {
            user: "User",
            message: "Message 7",
            timestamp: 1397490980837
        },
        {
            user: "User",
            message: "Message 8",
            timestamp: 1397490980837
        },
        {
            user: "User",
            message: "Message 9",
            timestamp: 1397490980837
        }
        ,
        {
            user: "User",
            message: "Message 10",
            timestamp: 1397490980837
        }
    ];

    var dummyRooms = [
        {
            room: "Lobby",
            lastUser: "User1",
            lastMessage: "test"
        },
        {
            room: "Room 1",
            lastUser: "User2",
            lastMessage: "test2"
        },
        {
            room: "Room 2",
            lastUser: "User3",
            lastMessage: "test3"
        },
        {
            room: "Room 3",
            lastUser: "User3",
            lastMessage: "test3"
        },
        {
            room: "Room 4",
            lastUser: "User3",
            lastMessage: "test3"
        },
        {
            room: "Room 5",
            lastUser: "User3",
            lastMessage: "test3"
        },
        {
            room: "Room 6",
            lastUser: "User3",
            lastMessage: "test3"
        },
        {
            room: "Room 7",
            lastUser: "User3",
            lastMessage: "test3"
        },
        {
            room: "Room 8",
            lastUser: "User3",
            lastMessage: "test3"
        }
    ];

})();