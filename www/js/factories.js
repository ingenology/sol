'use strict';

var app = angular.module('sol.Factories', []);

app.factory('Factories', function($http){
    return{
        EarthWeatherData: function(scope, lat, lng) {
            $http.jsonp('http://api.openweathermap.org/data/2.5/forecast/daily?lat='+lat+'&lon='+lng+'cnt=1&format=jsonp&callback=JSON_CALLBACK')
            .success(function(data){
                var temp = {};
                temp = data;
                // do the celcius or fahrenheit conversion
                if (window.localStorage['tempScale'] === 'Farenheit') {
                    temp.list[0].temp.max = data.list[0].temp.max * 1.8 - 459.67;
                    temp.list[0].temp.min = data.list[0].temp.min * 1.8 - 459.67;
                } else {
                    temp.list[0].temp.max = (data.list[0].temp.max - 273.15);
                    temp.list[0].temp.min = (data.list[0].temp.min - 273.15);
                }
                temp.list[0].temp.max = temp.list[0].temp.max.toFixed(1);
                temp.list[0].temp.min = temp.list[0].temp.min.toFixed(1);
                
                scope.earthWeather = temp;
            })
            .error(function(jqXHR, textStatus){
                console.log(textStatus + ' Error on the earth weather');
            });
        }
    }
})