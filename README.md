# Chat Frontend
Assignment for the Webengineering Class @ DHBW Stuttgart

### Chat Backend
A simple [Backend] for the chat application was provided and isn't part
of the assignment. Due to a bad websocket implementation, this chat
client requires a fork of the backend, which allows to distinguish
between websocket requests that were made.
([Forked Backend])

### Authentication
For a successful authentication you have to provide the default user
'dhbw' with the password 'dhbw-pw' or set Environment Variables as
described in the backend repository.

### Included Features / Technical
- **authentication**: ✅ To use the chat client you have to authenticate
with the standard user and password. Behind the scenes it uses the
modern fetch mechanism if available. If fetch is not supported
XMLHttpRequest is used.

- **list chat rooms**: ✅ Chat Rooms are sorted alphabetically and listed
on the left. Users can create new chat rooms with the form at the bottom.

- **support smileys**: ✅ A popup gives the user the possibility to choose
between all the emojis he's already familiar with.

- **send messages**: ✅ Messages are send via a Websocket connection.

- **display new messages**: ✅ New messages from you and other users are
displayed right away at the bottom of the conversation history. When a
new message comes in the client will automatically scroll to the bottom.

- **display historic messages**: ✅ On opening a chat room the history is
loaded and displayed right away. The avatar of the own user appears to
the right of the message, the avatars from every other user are shown
on the left side of the message.

- **list and color users in room**: ✅ Every user gets 1 of 18 Colors
(where 1 color is reserved for the own user). The Avatar is displayed in
the User's color.

- **feature of our choice**: ✅ The first extra feature is a Desktop
Notification Service (if confirmed), which is triggered on every new message
the user receives. The second feature is the display of user's avatars,
which have the specific user color and always show the first (capital)
letter of the nickname.

### Included Features / Non-Technical
- **User Experience, Accessability**: ✅ The Chat client shines with an
appealing UI by using a modern Material Design.
- **proper usage of HTML (appropriate features, validates)**: ✅
Everything (except the AngularJS specific directives) validates fine
with the [W3C Validator]
- **proper usage of CSS (appropriate features, validates)**: ✅
- **proper usage of Javascript (recent features, eslint)**: ✅

### Tech
To create this chat the following libraries were used:

* [AngularJS] - HTML UI Framework
* [Angular Material] - reference implementation of the Material Design
for AngularJS
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
[W3C Validator]: <https://validator.w3.org/>