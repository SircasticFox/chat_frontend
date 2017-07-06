/**
 * Created by Andreas on 26.06.2017.
 */
(function() {
    var app = angular.module('chat', ['ngMaterial', 'ngWebSocket', 'ngAnimate', 'custom-directives', 'luegg.directives']);

    app.factory('ws', function($websocket) {
        // Open a WebSocket connection
        var baseUrl = "5.45.105.154:3000";
        var wsBaseUrl = "ws://" + baseUrl + "/chat";
        var socket = $websocket(wsBaseUrl);

        socket.onMessage(function(message) {
            wsCalls.onMessageListener(message);
        });
        socket.onOpen(function (message) {
            console.log("Opened Websocket Connection");
            wsCalls.getRooms();
        });
        socket.onClose(function (message) {
            console.log("Closed Websocket Connection");
        });

        var wsCalls = {
            onMessageListener: null,
            getRooms: function() {
                socket.send(JSON.stringify({
                    "action": "getChatRooms"
                }));
            },
            getMessages: function (room) {
                socket.send(JSON.stringify({
                    "action": "getMessagesInRoom",
                    "roomId": room
                }));
            },
            sendPublicMessage: function (room, message, sender) {
                socket.send(JSON.stringify({
                    "action": "postMessage",
                    "roomId": room,
                    "user": sender,
                    "message": message,
                    "meta": { "": ""} // additional data to pass
                }));
            },
            sendPrivateMessage: function (receiver, message, sender) {
                socket.send(JSON.stringify({
                    "action": "postPrivateMessage",
                    "userId": receiver,
                    "user": sender,
                    "message": message,
                    "meta": { "": ""} // additional data to pass
                }));
            }
        };

        return wsCalls;
    });

    //Create Chat Controller, which holds the messages and the rooms
    app.controller('chatController', function ($scope, ws) {
        //Websocket Events
        this.socket = ws;
        ws.onMessageListener = function(message){
            console.log("Received Message: " + message.data);
            var data = JSON.parse(message.data);

            //Room Data
            if(data.length > 0 && !data[0].hasOwnProperty('user')) {
                //Clear Rooms
                $scope.rooms = [];
                //Adding Rooms to List
                data.forEach(function (room) {
                    $scope.rooms.push(room);
                });
                $scope.$apply();
            }
            else if(data.hasOwnProperty('action')){
                var newMessage = {
                    "user": data.user,
                    "message": data.message,
                    "timestamp": Date.now()
                };
                $scope.messages.push(newMessage);
                //Notify about new message
                $scope.notifyNewMessage(newMessage);
            }
            //Message Data
            else if(data.length > 0){
                //Fixes double "join" message when a room was created and joined
                $scope.messages = [];
                data.forEach(function (mes) {
                    //Check if user is in global user list
                    //if not add him with the next free color
                    if($scope.userList.indexOf(mes.user) === -1){
                        $scope.userList.push(mes.user);
                    }

                    //Push message to Array
                    $scope.messages.push(mes);

                });
            }
        };

        //Controller Data
        $scope.rooms = [];
        $scope.messages = [];
        $scope.myRoom = "";
        $scope.myUser = "Hackerman";
        $scope.myMessage = "";
        $scope.userList = [];

        this.joinRoom = function (index) {
            var room = $scope.rooms[index];
            $scope.myRoom = room;
            //Clean Messages
            $scope.userList = [];
            $scope.messages = [];
            //Add Own User Again
            $scope.userList.push($scope.myUser);
            //request messages for that specific room
            ws.getMessages(room);
            console.log("Joining Room: " + room);
        };
        this.createRoom = function () {
            var newRoom = $scope.myNewRoomName;
            //console.log("Create ROOM: " + newRoom);
            ws.sendPublicMessage(newRoom, $scope.myUser + " joined " + newRoom, "Server: ");
            ws.getRooms();

            /*
            var lRoomIndex = 0;
            for(var i=0; i < $scope.rooms.length; i++){
                console.log("current room: " + $scope.rooms[i] + " searching for: " + $scope.myNewRoomName);
                if($scope.rooms[i] === $scope.myNewRoomName){
                    lRoomIndex = i;
                    i = $scope.rooms.length;
                }
            }
            console.log("Joining room after creation, id: " + lRoomIndex);
            this.joinRoom(lRoomIndex);
            */

            $scope.myRoom = newRoom;
            $scope.userList = [];
            $scope.messages  = [];
            $scope.userList.push(($scope.myUser));

            ws.getMessages(newRoom);

            $scope.myNewRoomName = "";
        };
        this.sendMessage = function () {
            //Sending Message to websocket
            console.log("Sending Message: " + $scope.myMessage);
            ws.sendPublicMessage($scope.myRoom, $scope.myMessage, $scope.myUser);
            //Reset my Message after Sending
            $scope.myMessage = "";
        };

        this.getUserColor = function (user) {
            var myColor;

            if(user === $scope.myUser){
                myColor = colorStyles[0];
            }
            else {
                var index = $scope.userList.indexOf(user) % 18;
                //If user is not in the list, add him to list
                if(index === -1) {
                    $scope.userList.push(user);
                    //Get Index again after adding
                    index = $scope.userList.indexOf(user) % 18;
                }
                myColor = colorStyles[index];
            }

            //return color style of specific user
            return myColor;
        };

        this.getRoomColor = function () {
            return colorStyles[colorStyles.length - 1];
        };

        this.getFirstLetter = function(input) {
            return input.substring(0,1);
        };

        this.isOwnMessage = function (user) {
            var flexOrder = 0;

            if(user === $scope.myUser) {
                flexOrder = 2;
            }

            return flexOrder;
        };

        $scope.notifyNewMessage = function (message) {
            //Only show notification if it's another user's message
            if(!(message.user === $scope.myUser)) {
                console.log("Showing Notification");

                var options = {
                    body: message.message
                };

                //check if the browser supports notifications
                if (!("Notification" in window)) {
                    //If it's not supported don't do anything
                }
                //check whether notification permissions have already been granted
                else if (Notification.permission === "granted") {
                    var notification = new Notification(message.user, options);
                }

                // Otherwise ask the user for permission
                else if (Notification.permission !== "denied") {
                    Notification.requestPermission(function (permission) {
                        if (permission === "granted") {
                            var notification = new Notification(message.user, options);
                        }
                    });
                }
            }

        };

        this.emojiClick = function(){
            $('#messageInput').emojiPicker({
                width: '400px',
                height: '200px',
                button: false
            });
            $('#messageInput').emojiPicker('toggle');
        };
    });

    //Google Material Colors
    var colorStyles = [
        {
            'background-color': '#F44336'
        },
        {
            'background-color': '#E91E63'
        },
        {
            'background-color': '#9C27B0'
        },
        {
            'background-color': '#673AB7'
        },
        {
            'background-color': '#3F51B5'
        },
        {
            'background-color': '#3F51B5'
        },
        {
            'background-color': '#03A9F4'
        },
        {
            'background-color': '#00BCD4'
        },
        {
            'background-color': '#009688'
        },
        {
            'background-color': '#4CAF50'
        },
        {
            'background-color': '#8BC34A'
        },
        {
            'background-color': '#CDDC39'
        },
        {
            'background-color': '#FFEB3B'
        },
        {
            'background-color': '#FFC107'
        },
        {
            'background-color': '#FF9800'
        },
        {
            'background-color': '#FF5722'
        },
        {
            'background-color': '#795548'
        },
        {
            'background-color': '#9E9E9E'
        },
        {
            'background-color': '#607D8B'
        }
    ];

})();