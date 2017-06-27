/**
 * Created by Andreas on 26.06.2017.
 */
(function() {
    var app = angular.module('chat', ['ngMaterial']);

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
//test
})();