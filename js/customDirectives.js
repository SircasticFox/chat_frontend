(function () {
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

    app.directive("loginWindow", function() {
        return {
            restrict: "E",
            templateUrl: "directives/login.html"
        };
    });
})();
