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
                    //"userId": "receiverUser_for_postPrivateMessage",
                    "user": sender,
                    "message": message,
                    "meta": { "": ""} // additional data to pass
                }));
            },
            sendPrivateMessage: function (receiver, message, sender) {
                socket.send(JSON.stringify({
                    "action": ["postPrivateMessage"],
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
                //Adding Rooms to List
                data.forEach(function (room) {
                    $scope.rooms.push(room);
                });
            }
            else if(data.hasOwnProperty('action')){
                var newMessage = {
                    "user": data.user,
                    "message": data.message,
                    "timestamp": Date.now()
                };
                $scope.messages.push(newMessage);
            }
            //Message Data
            else if(data.length > 0){
                data.forEach(function (mes) {
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

        this.joinRoom = function (index) {
            var room = $scope.rooms[index];
            $scope.myRoom = room;
            //Clean Messages
            $scope.messages = [];
            //request messages for that specific room
            ws.getMessages(room);
            console.log("Joining Room: " + room);
        };

        this.sendMessage = function () {
            //Sending Message to websocket
            console.log("Sending Message: " + $scope.myMessage);
            ws.sendPublicMessage($scope.myRoom, $scope.myMessage, $scope.myUser);
            //Reset my Message after Sending
            $scope.myMessage = "";
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
        this.emojiClick = function(){
            $('#messageInput').emojiPicker({
                width: '400px',
                height: '200px',
                button: false
            });
            $('#messageInput').emojiPicker('toggle');
        };
    });

})();