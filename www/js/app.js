// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('sol', ['ionic', 'sol.Factories', 'ngMessages'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('planets', {
            url: '/',
            templateUrl: 'templates/planets.html',
            controller: 'PlanetsController'
        })
        .state('settings', {
            url: '/settings',
            templateUrl: 'templates/settings.html',
            controller: 'SettingsController'
        })
    $urlRouterProvider.otherwise('/');
})

.controller('PlanetsController', ['$location', '$scope', '$http', 'Factories', function ($location, $scope, $http, Factories) {
    
    $scope.active = '';
    
    $scope.toggleMars = function() {
        if ($scope.active === '' || $scope.active === 'earthActive') {
            $scope.active = 'marsActive';
        } else {
            $scope.active = '';
        }
    }
    
    $scope.toggleEarth = function() {
        if ($scope.active === ''|| $scope.active === 'marsActive') {
            $scope.active = 'earthActive';
        } else {
            $scope.active = '';
        }
    }
    
    
    $scope.getMarsWeatherData = function() {
        $http.jsonp('http://marsweather.ingenology.com/v1/latest?format=jsonp&callback=JSON_CALLBACK')
        .success(function(data){
            $scope.marsWeather = data.report;
            if (window.localStorage['tempScale'] != 'Farenheit') {
                $scope.marsWeather.max_temp_fahrenheit = ((data.report.max_temp_fahrenheit - 32) * 1.8).toFixed(1);
                $scope.marsWeather.min_temp_fahrenheit = ((data.report.min_temp_fahrenheit - 32) * 1.8).toFixed(1);
            }
            
            // console.log($scope.marsWeather);
        })
        .error(function(jqXHR, textStatus){
            console.log(textStatus + ' on the mars weather feed');
            $scope.marsWeatherError = 'Error ' + textStatus + '. Your connection to Curiosity has gone haywire.';
        });
        
    };
    
    $scope.getEarthWeatherData = function() {
        
        // if geo, then get lat and long and do the weather
        // if window, then do the weather
        // else go to settings screen
/*
        if (1 == 2) {
            var lat = 39.0997;
            var lng = 94.5783;
        } else
*/

        if (window.localStorage['lat'] && window.localStorage['lng']) {
            var lat = window.localStorage['lat'];
            var lng = window.localStorage['lng'];
        } else {
            // you're set in KC, the greatest city on Earph.
            var lat = 39.0997;
            var lng = -94.5783;
        }
        Factories.EarthWeatherData($scope, lat, lng);
    }
    $scope.getWeatherData = function() {
        $scope.getMarsWeatherData();
        $scope.getEarthWeatherData();
    }
    
}])

// Fetches the lat and lng from a zip code and adds to windowstorage
.service('latlngService', function($scope, $http){
    var zip = $scope.zipCode;
    var url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + zip;
    var lat = null;
    var lng = null;
    $http.jsonp(finalUrl)
    .success(function(data){
        console.log(data);
    })
    .error(function(jqXHR, textStatus){
        console.log(textStatus + ' on the google maps');
    });

})

.controller('EarthWeatherController', ['$location', '$scope', '$http', function ($location, $scope, $http) {
/*
    $scope.getWeatherData = function() {

        set location lat and long by:
            try getting user location '$cordovaGeolocation',
                if success, set lat and lon variables and go on to get weather
                if fail ask "ok loser, give me your zip code" for user zip
            get user zip
                user input of zip and store to window.localstorage
                try get lang and long from zip 
                http://maps.googleapis.com/maps/api/geocode/json?latlng=[preferences:lat],[preferences:lng]&amp;sensor=true
                    set lang and long variables
                fail "sorry"

        get weather data 
            try http://api.openweathermap.org/data/2.1/find/city?lat=[preferences:lat]&amp;lon=[preferences:lng]&amp;radius=10
            fail "sorry"

    };
*/

    if (window.localStorage['locator']) {
        alert(window.localStorage['locator'])
    }
    
}])

.controller('SettingsController', ['$scope', '$http', function ($scope, $http) {
    //check local storage first, or set it to one and wait until user sets it.
    
    // TempScale settings
    if (window.localStorage['tempScale']) {
        $scope.TempScale = window.localStorage['tempScale'];   
    } else {
        $scope.TempScale = 'Farenheit';
    }
    $scope.setTempScale = function(type) {
        $scope.TempScale = type;
    };
    $scope.isTempScale = function(type) {
        window.localStorage['tempScale'] = $scope.TempScale;
        return type === $scope.TempScale;
    };
    
    // Locator settings

    if (window.localStorage['locator']) {
        $scope.Locator = window.localStorage['locator'];   
    } else {
        $scope.Locator = 'device';
    }
    $scope.setLocator = function(type) {
        $scope.Locator = type;
    };
    $scope.isLocator = function(type) {
        window.localStorage['locator'] = $scope.Locator;
        return type === $scope.Locator;
    };
    
    // set Zip Code
  
    if (window.localStorage['zipCode']) {
        $scope.zipCode = parseInt(window.localStorage['zipCode']);
    }
    $scope.setZipCode = function($scope) {
        if (zipCodeForm.zipCode.$valid = true) {
            zipCode = this.zipCode;
            window.localStorage['zipCode'] = zipCode;
            // use service to get the lat and lon 66202 64105
            
            var url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + zipCode;
            var lat = null;
            var lng = null;
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
            })
            .error(function(jqXHR, textStatus){
                console.log(textStatus + ' on the google maps');
            });
        }
    }
    
}]);

setLocation = function(lat, lng){
    window.localStorage['lat'] = lat;
    window.localStorage['lng'] = lng;
    console.log('all set ' + window.localStorage['lat'] + ' ' + window.localStorage['lng'])
}

/*
.controller('Tutorial');
*/