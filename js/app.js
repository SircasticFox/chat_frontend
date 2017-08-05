(function() {
    const baseUrl = "localhost:3000";

    var app = angular.module('chat', ['ngMaterial', 'ngWebSocket', 'ngAnimate', 'custom-directives', 'luegg.directives'])
        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .accentPalette('amber'); //Changes the default color palette for the 'md-accent' from standart pink to amber see more: https://material.io/guidelines/style/color.html#color-color-palette
        });

    app.factory('ws', function($websocket) {
        var socket;
        // Websocket Endpoint
        var wsBaseUrl = "ws://" + baseUrl + "/chat";

        var wsCalls = {
            openWebsocketConnection: function () {
                socket = $websocket(wsBaseUrl);

                socket.onMessage(function(message) {
                    wsCalls.onMessageListener(message);
                });
                socket.onOpen(function (message) {
                    wsCalls.onOpenListener(message);
                });
                socket.onClose(function (message) {
                    wsCalls.onCloseListener(message);
                });
            },
            closeWebsocketConnection: function() {
                socket.close();
            },
            onMessageListener: null,
            onCloseListener: null,
            onOpenListener: null,
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
            getUsers: function (room) {
                socket.send(JSON.stringify({
                    "action": "getUsersInRoom",
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
    app.controller('chatController', function ($scope, $interval, $mdDialog, ws) {

        //Controller Data
        $scope.me = this;
        this.rooms = [];
        this.messages = [];
        this.myRoom = "";
        this.myUser = "";
        this.myMessage = "";
        this.userList = [];
        this.loggedIn = false;
        this.authUser = "";
        this.authPassword ="";
        this.userLogout = false;
        this.myEmoji = null;

        //Set Websocket Listeners
        ws.onMessageListener = function(message){
            console.log("Received Message: " + message.data);
            var data = JSON.parse(message.data);

            switch (data.action) {
                case 'getChatRooms':
                    //Clear Rooms
                    $scope.me.rooms = [];
                    //Adding Rooms to List
                    data.chatRooms.forEach(function (room) {
                        $scope.me.rooms.push(room);
                    });
                    break;

                case 'getMessagesInRoom':
                    //Fixes double "join" message when a room was created and joined
                    $scope.me.messages = [];
                    data.messages.forEach(function (mes) {
                        //Push message to Array
                        $scope.me.messages.push(mes);
                    });
                    break;

                case 'getUsersInRoom':
                    //Reset users
                    $scope.me.userList = [];
                    //Add all the users to the list
                    data.users.forEach(function (user) {
                        //Add at first position if own user
                        if(user === $scope.me.myUser) {
                            $scope.me.userList.splice(0, 0, user);
                        }
                        //push user to list
                        else {
                            $scope.me.userList.push(user);
                        }
                    });
                    break;

                case 'postMessage':
                    //Check which room this message belongs to
                    //only push if it's the current room
                    if(data.roomId === $scope.me.myRoom) {
                        var response = data.message;
                        var newMessage = {
                            "user": response.user,
                            "message": response.message,
                            "timestamp": response.timestamp
                        };
                        $scope.me.messages.push(newMessage);
                        //Notify about new message
                        $scope.me.notifyNewMessage(newMessage);

                        //Update User list
                        ws.getUsers(data.roomId);
                    }
                    break;
            }
        };
        ws.onOpenListener = function () {
            console.log("Opened Websocket Connection");
            if($scope.me.rooms[0] != null){
                $scope.me.joinRoom($scope.me.rooms[0]);
            }
        };
        ws.onCloseListener = function (message) {
            console.log("Closed Websocket Connection");
            //Logout user on websocket closed
            $scope.me.logout(false);

            //Set Dialog Text
            var title;
            var text;
            var altText;

            if($scope.me.userLogout){
                //Set Different Dialog Text
                title = 'Logged Out';
                text = 'You have been logged out successfully';
                altText = 'Logged Out Dialog';
                //Reset to default
                $scope.me.userLogout = false;
            }
            else {
                title = 'Disconnected';
                text = 'You were disconnected from the server.';
                altText = 'Disconnected Dialog';
            }

            //Show Dialog that you were logged out
            $scope.me.showMessageDialog(title, text, altText);
        };

        //Refresh Roomlist every 5 seoconds
        $interval(function () {
            if($scope.me.loggedIn){
                ws.getRooms();
            }
        }, 5000);

        //Shows Notifcations
        this.notifyNewMessage = function (message) {
            //Only show notification if it's another user's message
            if(!(message.user === $scope.me.myUser)) {
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

        //Shows a small Dialog box with different information
        this.showMessageDialog = function (title, message, altText) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#loginBox')))
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(message)
                    .ariaLabel(altText)
                    .ok('Ok'));
        };

        //Login with credentials
        this.login = function () {
            //Detect if fetch is available
            if (self.fetch) {
                console.log("Authenticate using fetch");
                $scope.me.loginWithFetch();
            } else {
                console.log("Authenticate using XMLHttpRequest");
                $scope.me.loginWithXMLHttpRequest();
            }
        };

        //Use the old XMLHttpRequest if browser doesn't support fetch
        this.loginWithXMLHttpRequest = function () {
            var token = $scope.me.authUser + ":" + $scope.me.authPassword;
            var hash = btoa(token);

            var httpBaseUrl = "http://" + baseUrl + "/api/chats";
            // New XMLHTTPRequest
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    var data = JSON.parse(request.responseText);
                    $scope.me.onLoginSuccessful(data);
                }
                else if(this.readyState === 4 && this.status === 401) {
                    //Authentication Failed / Invalid User
                    console.log("Authentication Failed");
                    $scope.me.showMessageDialog('Authentication Failed',
                        'The provided User or Password is wrong. Please provide correct credentials.',
                        'Wrong credentials Dialog');
                }
            };
            request.open("GET", httpBaseUrl);
            request.setRequestHeader("Authorization", "Basic " + hash);
            request.send();
        };

        //Use fetch if available
        this.loginWithFetch = function () {
            var httpBaseUrl = "http://" + baseUrl + "/api/chats";
            var token = $scope.me.authUser + ":" + $scope.me.authPassword;
            var hash = btoa(token);

            var header = new Headers();
            header.append("Authorization", "Basic " + hash);

            var options = {
                method: 'GET',
                headers: header
            };

            fetch(httpBaseUrl, options).then(function(response) {
                var statusCode = response.status;

                //Response
                if(statusCode === 200) {
                    response.json().then(function (data) {
                        $scope.me.onLoginSuccessful(data);
                    });
                }
                else if(statusCode === 401){
                    //Authentication Failed / Invalid User
                    console.log("Authentication Failed");
                    $scope.me.showMessageDialog('Authentication Failed',
                        'The provided User or Password is wrong. Please provide correct credentials.',
                        'Wrong credentials Dialog');
                }
            });
        };

        //If the login is successful
        this.onLoginSuccessful = function (data) {
            //Valid User
            console.log("Authentication Succeeded");
            //Adding Rooms to List
            //Rooms array needs a reset, otherwise angular throws an error because rooms exists multiple times
            $scope.me.rooms = [];
            data.forEach(function (room) {
                $scope.me.rooms.push(room);
            });

            //Log-In
            $scope.me.loggedIn = true;
            //Bindings need to be updated here
            $scope.$apply();

            //Open Websocket Connection
            ws.openWebsocketConnection();
        };

        //Logout user (form reset and websocket disconnect
        this.logout = function (closeWebsocket) {
            $scope.me.loggedIn = false;
            $scope.me.authUser = "";
            $scope.me.authPassword = "";
            //Reset Message and Room Form as well
            $scope.me.myNewRoomName = "";
            $scope.me.myMessage = "";

            //Close the websocket if the logout was triggered by the user
            //(and not from the disconnect)
            if(closeWebsocket) {
                //set userLogout to true
                //(used to show a different Dialog)
                $scope.me.userLogout = true;
                ws.closeWebsocketConnection();
            }
        };

        //Open a selected room
        this.joinRoom = function (room) {
            //Don't open if the room is already open
            if(!($scope.me.myRoom===room)) {
                $scope.me.myRoom = room;
                //request messages for that specific room
                ws.getMessages(room);
                //request users for that specific room
                ws.getUsers(room);
                //request users for that specific room
                console.log("Joining Room: " + room);
            }
        };

        //This function is used to create a room and join it instantly
        this.createRoom = function () {
            var newRoom = $scope.me.myNewRoomName;

            //Create Room by sending a Message to the Room
            ws.sendPublicMessage(newRoom, $scope.me.myUser + " created " + newRoom, "the System");

            //To Refresh all Rooms in the Sidebar, the new one instantly appears)
            ws.getRooms();

            //Join the newly created room
            $scope.me.joinRoom(newRoom);

            //Reset input field
            $scope.me.myNewRoomName = "";
        };

        //Send Message to the most recent room
        this.sendMessage = function () {
            if(!($scope.me.myMessage === "")) {
                //Sending Message to websocket
                console.log("Sending Message: " + $scope.me.myMessage);
                ws.sendPublicMessage($scope.me.myRoom, $scope.me.myMessage, $scope.me.myUser);
                //Reset my Message after Sending
                $scope.me.myMessage = "";
            }
        };

        //Get the color for the user avatar
        this.getUserColor = function (user) {
            var myColor;

            //The own user has a reserved color
            if(user === $scope.me.myUser){
                myColor = reservedColors[0];
            }
            else {
                var index = $scope.me.userList.indexOf(user) % 17;
                myColor = colorStyles[index];
            }

            //return color style of specific user
            return myColor;
        };

        //Get the color for the room avater
        this.getRoomColor = function () {
            return reservedColors[1];
        };

        //returns the first letter of any given string
        this.getFirstLetter = function(input) {
            if(input !== undefined) {
                return input.substring(0,1);
            }
        };

        //Checks if the user is the own user
        this.isOwnMessage = function (user) {
            var flexOrder = 0;

            if(user === $scope.me.myUser) {
                flexOrder = 2;
            }

            return flexOrder;
        };

        //Opens/Closes the emoji popup
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
    //19 Colors
    //2 Reserved, 17 for other Users
    var reservedColors = [
        {
            'background-color': '#F44336'
        },
        {
            'background-color': '#607D8B'
        }
    ];
    var colorStyles = [
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
        }
    ];

})();