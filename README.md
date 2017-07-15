# Chat Frontend
Assignment for the Webengineering Class @ DHBW Stuttgart

### Chat Backend
A simple [Backend] for the chat application was provided and isn't part
of the assignment. Due to a bad websocket implementation, this chat client requires a fork of the backend,
which allows to distinguish between the websocket requests that were made.
([Forked Backend])


### Authentication
For a successful authentication you have to provide the default user 'dhbw'
with the password 'dhbw-pw' or set Environment Variables as described
in the backend repository.

### Angular Material:
https://material.angularjs.org/latest/

### Icons
All Icons are [Material Icons]

### Tech

To create this chat the following libraries were used:

* [AngularJS] - HTML UI Framework
* [Angular Material] - reference implementation of the Material Design for AngularJS
* [Angular Websocket] - Websocket Module for AngularJS
* [Material Icons] - Huge amount of great Material Icons
* [JQuery Emoji Picker] - Provides a popup Window for selecting Emojis
(customized the positioning for this project)
* [angularjs-scroll-glue] - Scrolls Automatically on new Messages

[AngularJS]: <http://angularjs.org>
[Angular Material]: <http://material.angularjs.org>
[Material Icons]: <https://material.io/icons/>
[Backend]: <https://github.com/Lhdang88/cloud_computing_ws>
[JQuery Emoji Picker]: <https://github.com/wedgies/jquery-emoji-picker>
[angularjs-scroll-glue]: <https://github.com/Luegg/angularjs-scroll-glue>
[Angular Websocket]: <https://github.com/AngularClass/angular-websocket>
[Forked Backend]: <https://github.com/M320Trololol/cloud_computing_ws>