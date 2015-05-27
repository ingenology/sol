'use strict';

var app = angular.module('sol.Factories', []);

app.factory('Factories', function($http) {
    return {
        
        LocationFromZipService: function(zipCode) {
            var url = 'http://maps.googleapis.com/maps/api/geocode/json?address='+zipCode,
            lat = null,
            lng = null;
            $http({
                url: url,
                method: 'GET',
                params: {
                    callback : 'JSON_CALLBACK'
                }
            })
            .success(function(data){
                lat = data.results[0].geometry.location.lat;
                lng = data.results[0].geometry.location.lng;
                setLocation(lat, lng);
                console.log('LocationFromZipService factory worked. Lat and long are: '+lat+' and '+lng);
            })
            .error(function(jqXHR, textStatus){
                console.log(textStatus+' on the google maps');
            });
        },
        
        LocationService: function(scope) {
            var options = {
                enableHighAccuracy: true,
                timeout: 7000,
                maximumAge: 240000
            };

            function success(pos) {
                var crd = pos.coords,
                    lat = '',
                    lng = '';
                    
                console.log('LocationService Factory used and worked');
                console.log('Lat: ' + crd.latitude);
                console.log('Long: ' + crd.longitude);
                lat = crd.latitude;
                lng = crd.longitude;
                codeLatLng(scope, lat, lng);
                
                function codeLatLng(scope, lat, lng){
                    var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng;
                    $http({
                        url: url,
                        method: 'GET',
                        params: {
                            callback : 'JSON_CALLBACK'
                        }
                    })
                    .success(function(data){
                        // help from this stack answer http://stackoverflow.com/a/6798005
                        if (data.results[1]) {
                            console.log(data.results[0].formatted_address)
                            for (var i=0; i<data.results[0].address_components.length; i++) {
                                for (var b=0;b<data.results[0].address_components[i].types.length;b++) {
                                    if (data.results[0].address_components[i].types[b] == "administrative_area_level_1") {
                                        $scope.city = data.results[0].address_components[2].long_name;
                                        console.log(data.results[0].address_components[2].long_name);
                                        break;
                                    }
                                }
                            }
                        //city data
                        // console.log(data.results[0].address_components[i].short_name + " " + data.results[0].address_components[i].long_name)
                        } else {
                        console.log("No results found");
                        }
                    })
                    .error(function(jqXHR, textStatus){
                        console.log(textStatus+' on the codeLatLng');
                    });
                }
            };

            function error(err) {
                console.log('LocationService Factory error(' + err.code + '): ' + err.message);
            };
            navigator.geolocation.getCurrentPosition(success, error, options);
        },
        
        EarthWeatherData: function(scope, lat, lng) {
            $http.jsonp('http://api.openweathermap.org/data/2.5/forecast/daily?lat='+lat+'&lon='+lng+'cnt=1&format=jsonp&callback=JSON_CALLBACK')
            .success(function(data) {
                var temp = {};
                temp = data;
                
                // do the celcius or fahrenheit conversion from kelvin. using if not celsius to cover null and fahrenheit. defaults fahrenheit
                if (window.localStorage['tempScale'] != 'Celsius'){
                    temp.list[0].temp.max = data.list[0].temp.max * 1.8 - 459.67;
                    temp.list[0].temp.min = data.list[0].temp.min * 1.8 - 459.67;
                    temp.list[0].temp.day = data.list[0].temp.day * 1.8 - 459.67;
                } else {
                    temp.list[0].temp.max = (data.list[0].temp.max - 273.15);
                    temp.list[0].temp.min = (data.list[0].temp.min - 273.15);
                    temp.list[0].temp.day = (data.list[0].temp.day - 273.15);
                }
                
                temp.list[0].temp.max = temp.list[0].temp.max.toFixed(1);
                temp.list[0].temp.min = temp.list[0].temp.min.toFixed(1);
                temp.list[0].temp.day = temp.list[0].temp.day.toFixed(1);
                scope.earthWeather = temp;
                console.log('EarthWeatherData Factory sez day temp = ' + temp.list[0].temp.day )
                console.log('EarthWeatherData Factory sez lat and long it is using are '+lat+' and '+lng)
            })
            .error(function(jqXHR, textStatus) {
                console.log(textStatus+' Error on the Earth Weather Data factory');
            });
        }
        
    }
})
.service('ModalService', function($ionicModal, $rootScope) {
	var init = function(template, $scope) {

		var promise;
	    $scope = $scope || $rootScope;

	    promise = $ionicModal.fromTemplateUrl(template, {
			scope: $scope,
			animation: 'slide-in-up'
	    }).then(function(modal) {
			$scope.modal = modal;
			return modal;
	    });

	    $scope.openModal = function() {
			$scope.modal.show();
		};
		$scope.closeModal = function() {
			$scope.modal.hide();
		};
		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
	    
	    return promise;
	}

	return {
		init: init
	}
});