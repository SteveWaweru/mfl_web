(function (angular, _){
    "use strict";

    /**
     * @ngdoc module
     *
     * @name mfl.gis_country.controllers
     *
     * @description
     * Contains the controller used in the country view
     */
    angular
    .module("mfl.gis_country.controllers", ["leaflet-directive","nemLogging",
        "mfl.gis.wrapper"])

    /**
     * @ngdoc controller
     *
     * @name mfl.gis.controllers.gis
     *
     * @description
     * Controller for the country view
     */
    .controller("mfl.gis.controllers.gis", ["$scope","leafletData",
        "$http","$stateParams","$state","SERVER_URL",
        "$timeout","leafletMapEvents","gisAdminUnitsApi",
        function ($scope,leafletData,$http, $stateParams,
                  $state, SERVER_URL, $timeout, leafletEvents,
                  gisAdminUnitsApi) {
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        $scope.spinner = false;
        var bounds = [
            [-4.669618,33.907219],
            [-4.669618,41.90516700000012],
            [4.622499,41.90516700000012],
            [4.622499,33.907219],
            [-4.669618,33.907219]
        ];
        $scope.selectedConst = {};
        $scope.markers = {};
        $scope.layers = {};
        angular.extend($scope, {
            defaults: {
                scrollWheelZoom: false,
                tileLayer: "",
                dragging:true
            },
            events: {
                map: {
                    enable: ["moveend", "popupopen"],
                    logic: "emit"
                }
            }
        });
        gisAdminUnitsApi.getCounties().then(function (data) {
            var marks = data.results.features;
            var markers = _.mapObject(marks, function(mark){
                return  {
                        layer: "counties",
                        lat: mark.properties.center.coordinates[1],
                        lng: mark.properties.center.coordinates[0],
                        label: {
                            message: mark.properties.name,
                            options: {
                                noHide: false
                            }
                        },
                        riseOnHover: true
                    };
            });
            $scope.markers = markers;
            $scope.geodata = data.results;
            angular.extend($scope, {
                geojson: {
                    data: $scope.geodata,
                    style: {
                        fillColor: "rgba(255, 255, 255, 0.01)",
                        weight: 2,
                        opacity: 1,
                        color: "rgba(0, 0, 0, 0.52)",
                        dashArray: "3",
                        fillOpacity: 0.7
                    }
                },
                layers:{
                    baselayers:{
                        country: {
                            name: "Country",
                            url: "/assets/img/transparent.png",
                            type:"xyz"
                        }
                    },
                    overlays:{
                        counties:{
                            name:"Counties",
                            type:"group",
                            visible: true
                        }
                    }
                }
            });
        },function(err){
            $scope.alert = err.error;
        });
        leafletData.getMap("countrymap")
            .then(function (map) {
                map.fitBounds(bounds);
                map.spin(true,
                         {lines: 13, length: 20,corners:1,radius:30,width:10});
                $timeout(function() {map.spin(false);}, 1000);
            });
        /*Gets Facilities for heatmap*/
        $scope.filters = {
            "fields" : "geometry"
        };
        gisAdminUnitsApi.getFacCoordinates($scope.filters)
        .then(function (data){
            var heats = data;
            var heatpoints = _.map(heats, function(heat){
                return [
                        heat.geometry.coordinates[1],
                        heat.geometry.coordinates[0]
                    ];
            });
            $scope.layers.overlays.heat = {
                name: "Facilities",
                type: "heat",
                data: heatpoints,
                layerOptions: {
                    radius: 25,
                    opacity:1,
                    blur: 1,
                    gradient: {0.2: "lime", 0.3: "orange",0.4: "red"}
                },
                visible: true
            };
        },
        function(err) {
            $scope.alert = err.error;
        });
        $scope.$on("leafletDirectiveGeoJson.countrymap.mouseover", function(ev, county) {
            $scope.hoveredCounty = county.model;
        });
        $scope.$on("leafletDirectiveGeoJson.countrymap.click", function(ev, county) {
            $scope.spinner = true;
            var boundary_ids = county.model.properties.constituency_boundary_ids.join(",");
            $stateParams.const_boundaries = boundary_ids;
            $state.go("gis.gis_county",{county_id: county.model.id,
                                    const_boundaries : boundary_ids});
        });
    }]);
})(window.angular, window._);
