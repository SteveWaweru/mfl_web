(function(angular){
    "use strict";

    angular.module("mfl.chul.services", [
        "api.wrapper",
        "mflAppConfig"
    ])

    .service("mfl.chul.services.wrappers",
        ["api", function(api) {
            this.chul = api.setBaseUrl("api/chul/units/");
            this.filters = api.setBaseUrl("api/common/filtering_summaries/");
        }]
    );

})(window.angular);
