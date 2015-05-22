'use strict';

var app = angular.module('sol.Factories', []);

app.factory('Factories', function($http) {
    return {
        
        LocationFromZipService: function(zipCode) {
            var url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + zipCode,
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
                console.log('zip code lookup worked. See: '+lat, lng);
            })
            .error(function(jqXHR, textStatus){
                console.log(textStatus + ' on the google maps');
            });
        },
        
        LocationService: function() {
            var options = {
                enableHighAccuracy: true,
                timeout: 7000,
                maximumAge: 240000
            };

            function success(pos) {
                var crd = pos.coords;
                console.log('location service worked');
                console.log('Latitude : ' + crd.latitude);
                console.log('Longitude: ' + crd.longitude);
                lat = crd.latitude;
                lng = crd.longitude;
            };

            function error(err) {
                console.warn('ERROR(' + err.code + '): ' + err.message);
            };
            navigator.geolocation.getCurrentPosition(success, error, options);
        },
        
        EarthWeatherData: function(scope, lat, lng) {
            $http.jsonp('http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + lat + '&lon=' + lng + 'cnt=1&format=jsonp&callback=JSON_CALLBACK').success(function(data) {
                var temp = {};
                temp = data;
                console.log('EarthWeatherData is returning this: '+lat, lng);
                
                // do the celcius or fahrenheit conversion from kelvin
                if (window.localStorage['tempScale'] === 'Farenheit') {
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
            }).error(function(jqXHR, textStatus) {
                console.log(textStatus + ' Error on the earth weather');
            });
        }
        
    }
})