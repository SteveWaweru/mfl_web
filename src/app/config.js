(function (angular) {
    "use strict";
    angular.module("mflAppConfig", [
        "ui.router",
        "ngCookies",
        "sil.api.wrapper",
        "mfl.common.interceptors",
        "LocalForageModule"
    ])

    .constant("SERVER_URL", angular.copy(window.MFL_SETTINGS.SERVER_URL))

    .constant("CREDZ", angular.copy(window.MFL_SETTINGS.CREDZ))

    .config(["$urlRouterProvider", function ($urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");
    }])
    .config(["$localForageProvider", function($localForageProvider) {
        $localForageProvider.config({
            name: "mflApp" // name of the database and prefix for your data
        });
    }])
    .config(["$httpProvider",function ($httpProvider) {
        $httpProvider.interceptors.push("mfl.common.interceptors.headers");
        $httpProvider.defaults.withCredentials = false;
        $httpProvider.defaults.headers.common = {
            "Content-Type":"application/json",
            "Accept" : "application/json, */*"
        };
    }])

    .run(["$http","$cookies","$rootScope","$state","$stateParams",
          function ($http, $cookies,$rootScope,$state,$stateParams) {
        // apparently the angular doesn"t do CSRF headers using
        // CORS across different domains thereby this hack
        var csrftoken = $cookies.csrftoken;
        var header_name = "X-CSRFToken";
        $http.defaults.headers.common[header_name] = csrftoken;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]);
})(angular);
