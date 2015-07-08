(function (angular) {
    "use strict";

    angular.module("mflwebApp", [
        "ngAnimate",
        "ngCookies",
        "ngSanitize",
        "mflAppConfig",
        "ui.router",
        "ui.bootstrap",
        "ui.bootstrap.tpls",
        "ngTagsInput",
        "angularjs-dropdown-multiselect",
        "angular-loading-bar",
        "templates-app",
        "templates-common",
        "mfl.home",
        "mfl.facility_filter",
        "mfl.gis",
        "mfl.auth",
        "mfl.rating"
    ]);
})(angular);
