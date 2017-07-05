/**
 * Created by andreas on 03.07.17.
 */
var app = angular.module('custom-directives', []);

app.directive("chatToolbar", function() {
    return {
        restrict: "E",
        templateUrl: "directives/toolbar.html"
    };
});

app.directive("chatSidebar", function() {
    return {
        restrict: "E",
        templateUrl: "directives/sidebar.html"
    };
});

app.directive("chatArea", function() {
    return {
        restrict: "E",
        templateUrl: "directives/chat.html"
    };
});