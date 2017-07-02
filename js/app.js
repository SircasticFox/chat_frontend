/**
 * Created by Andreas on 26.06.2017.
 */
(function() {
    var app = angular.module('chat', ['ngMaterial']);




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

})();

