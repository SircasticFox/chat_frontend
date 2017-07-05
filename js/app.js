/**
 * Created by Andreas on 26.06.2017.
 */
(function() {
    var app = angular.module('chat', ['ngMaterial', 'custom-directives']);

    //Create Chat Controller, which holds the messages and the rooms
    app.controller('chatController', function () {
        this.myMessage = "";
        this.myRoom = "Lobby";
        this.messages = dummyMessages;
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
        this.emojiClick = function(){
            $('#messageInput').emojiPicker({
                width: '600px',
                height: '350px',
                button: false

            });
            $('#messageInput').emojiPicker('toggle');
        };
    });




    //Connection URLs, might add a feature to change it in the Client
    var baseUrl = "5.45.105.154:3000";
    //var baseUrl = "localhost:3000"
    var restBaseUrl = "http://" + baseUrl + "/api";
    var wsBaseUrl = "ws://" + baseUrl + "/chat";

    var CC = new ChatContent();
    LoadRooms();

    //Websocket and all its events
    var socket = new WebSocket(wsBaseUrl);

    socket.onopen = function (event) {
        var createChannels = {
            "action": "postMessage",
            "roomId": "Lobby",
            //"userId": "receiverUser_for_postPrivateMessage",
            "user": "Bot",
            "message": "test",
            "meta": {"": ""} // additional data to pass
            };
        socket.send(JSON.stringify(createChannels));
    };

    socket.onclose = function (event) {
        //Connection closes
    };

    socket.onerror = function (event) {
        //Some kind of error
    };

    socket.onmessage = function (event) {
        console.log(event.data);
    };

     function ChatRoomData(roomID, users, messagesInRoom){

        this.roomID  = roomID;
        this.usersInRoom = users;
        this.messagesInRoom = messagesInRoom;

        //checks if user is already recognised in the current room, if not, he/she will get added
        this.checkUser =  function (userID) {
            var exist = false;
            for(user of this.usersInRoom){
                if(userID == user){
                    exist = true;
                }
            }
            if(!exist){
                this.usersInRoom.push(userID);
            }
        };

        this.incommingMessage = function (msg) {
            this.checkUser(msg.user);
            this.messagesInRoom.push(msg);


        }
    }

    function ChatContent() {
        this.rooms = [];
    }

    function LoadRooms() {

        //load all Rooms
        var opts = {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa('dhbw:dhbw-pw'),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        fetch(restBaseUrl + "/chats", opts).then(function (response) {
            return response.json();
        }).then(function (body) {

            for (channel of body) {
                CC.rooms.push(new ChatRoomData(channel, [], []));
            }

            LoadMessages();
        });



    }

    function LoadMessages(){
        //load all messages and so on
        var opts = {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa('dhbw:dhbw-pw'),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        for(room of CC.rooms) {

            fetch(restBaseUrl + "/chats/" + room.roomID, opts).then(function (response) {
                return response.json();

            }).then(function (body) {
                console.log("loading messages for room: " + room.roomID);
                for(msg of body){
                    console.log(msg);
                    room.incommingMessage(msg);
                }

            });
        }
        LoadUsers();
    }

    function LoadUsers() {
        //load all Users and so on
        var opts = {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa('dhbw:dhbw-pw'),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        for(room of CC.rooms) {
            fetch(restBaseUrl + "/chats/" + room.roomID + "/users", opts).then(function (response) {
                return response.json();

            }).then(function (body) {
                for(usr of body){
                    room.checkUser(msg);

                }
            });
        }
        console.log(CC);

    }



    function refreshAllRooms(){
        var payload = {
            "action": "getChatRooms"
        }
        var jString = JSON.stringify(payload);
        console.log(jString);

        socket.send(jString);
    };

    function refreshUsersInRoom(roomId) {
        var payload = {
            "action": "getUsersInRoom",
            "roomId": roomId
        }
        socket.send(JSON.stringify(payload));

    }

    function postPrivateMessage(targetUID, user_source, message){
        var content = {
            "action": "postPrivateMessage",
            "userId": targetUID,
            "user": user_source,
            "message": message,
            "meta": { "foo": "bar"} // additional data to pass
        }
        console.log(JSON.stringify(content));
        socket.send(JSON.stringify(content));

    }

    function postPublicMessage(roomId, user_source, message){
        var content = {
            "action": "postMessage",
            "roomId": roomId,
            "user": user_source,
            "message": message,
            "meta": { "foo": "bar"} // additional data to pass
        }
        console.log(JSON.stringify(content));
        socket.send(JSON.stringify(content));
    }


    var dummyMessages = [
        {
            user: "User",
            message: "Message 1s 😂",
            timestamp: 1397490980837
        },
        {
            user: "User",
            message: "Message 2 😂",
            timestamp: 1397490980837
        },
        {
            user: "User",
            message: "Message 3 😂",
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