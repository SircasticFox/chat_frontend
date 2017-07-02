/**
 * Created by Andreas on 26.06.2017.
 */
(function() {
    var app = angular.module('chat', ['ngMaterial']);

    var socket = new WebSocket('ws://liebknecht.danielrutz.com:3000/chat');
    socket.onopen = function (event) {
        console.log("Connected!");
        postPrivateMessage("Lobby", "user282948249", "firstMEssage");
        postPublicMessage("Lobby", "user292929", "secondMessage");
        refreshAllRooms();
        refreshUsersInRoom(2);
    };

    socket.onclose = function (event) {
        //Connection closes
    };

    socket.onerror = function (event) {
        //Some kind of error
    };

    socket.onmessage = function (event) {
       // var json_response = JSON.parse(event.data);
        //console.log(json_response);
        console.log(event.data);
    };


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


})();