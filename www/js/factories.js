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
                scope.LocationFromZipServiceErrorHandler(textStatus);
            });
        },

        EarthWeatherService: function(scope, lat, lng) {
            scope.earthTempLoading = true;
            $http.jsonp('http://api.openweathermap.org/data/2.5/forecast/daily?lat='+lat+'&lon='+lng+'cnt=1&format=jsonp&callback=JSON_CALLBACK')
            .success(function(data) {
                var temp = {};
                temp = data;
                // debugger;
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
                scope.earthTempLoading = false;
                scope.$broadcast('scroll.refreshComplete');
                scope.earthWeather = temp;
                console.log('EarthWeatherService Factory sez ' + temp.city.name);
/*
                console.log('EarthWeatherService Factory sez day temp = ' + temp.list[0].temp.day );
                console.log('EarthWeatherService Factory sez lat and long it is using are '+lat+' and '+lng);
                console.log('EarthWeatherService Factory sez city is ' + scope.earthWeather.city.name );
*/
            })
            .error(function(jqXHR, textStatus) {
                console.log(textStatus+' Error on the Earth Weather Data factory');
                scope.earthWeatherServiceErrorHandler();
                $scope.$broadcast('scroll.refreshComplete');
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
})

.directive('focusMe', function($timeout) {
    return {
        scope: { trigger: '@focusMe' },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if(value === "true") {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            });
        }
    };
});
