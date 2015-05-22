// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('sol', ['ionic', 'sol.Factories', 'ngMessages', 'ngCordova'])

.run(function($ionicPlatform, $cordovaStatusbar) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.hide();
    } else {
        $cordovaStatusbar.hide();
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

.controller('PlanetsController', ['$location', '$scope', '$http', 'Factories', '$cordovaSocialSharing', function ($location, $scope, $http, Factories, $cordovaSocialSharing) {
    ionic.Platform.ready(function() { // ready for geolocation to work
        
        // just toggling classes on the planetz
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
        
        // mars weather!
        $scope.getMarsWeatherData = function() {
            $http.jsonp('http://marsweather.ingenology.com/v1/latest?format=jsonp&callback=JSON_CALLBACK')
            .success(function(data){
                $scope.marsWeather = data.report;
                if (window.localStorage['tempScale'] != 'Farenheit') {
                    $scope.marsWeather.max_temp_fahrenheit = ((data.report.max_temp_fahrenheit - 32) * 1.8).toFixed(1);
                    $scope.marsWeather.min_temp_fahrenheit = ((data.report.min_temp_fahrenheit - 32) * 1.8).toFixed(1);
                }
            })
            .error(function(jqXHR, textStatus){
                console.log(textStatus + ' on the mars weather feed');
                $scope.marsWeatherError = 'Error ' + textStatus + '. Your connection to Curiosity has gone haywire.';
            });
        };
        
        // earth weather!
        $scope.getEarthWeatherData = function() {            
            // if geo, then get lat and long and do the weather
            // if window, then do the weather
            // else, you're set in KC, the greatest city on Earph.
            // then, go run the earth weather
            var lat, lng;
                
            if (window.localStorage['locator'] === 'device') {
                console.log('device locator service started.');
                Factories.LocationService();
            } else if (window.localStorage['lat'] && window.localStorage['lng']) {
                console.log('device using zip');
                lat = window.localStorage['lat'];
                lng = window.localStorage['lng'];
            } else {
                lat = 39.0997;
                lng = -94.5783;
            }
            Factories.EarthWeatherData($scope, lat, lng);
        }
        
        $scope.getWeatherData = function() {
            $scope.getMarsWeatherData();
            $scope.getEarthWeatherData();
        }
        
        $scope.share = function() {
            $cordovaSocialSharing.share('According to Sol, the first interplanetary weather app, it is '+$scope.earthWeather.list[0].temp.day+' outside in '+ $scope.earthWeather.city.name +'. But on Mars, it is only '+ $scope.max_temp_fahrenheit, null, 'www/imagefile.png', 'http://marsweather.com');
        }
    });
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
    // set scope zip to locale storage if it's there.
    if (window.localStorage['zipCode']) {
        $scope.zipCode = parseInt(window.localStorage['zipCode']);
    }
    // set scope zip and locale storage zip with form entry
    $scope.setZipCode = function($scope) {
        if (zipCodeForm.zipCode.$valid = true) {
            zipCode = this.zipCode;
            window.localStorage['zipCode'] = zipCode;
            Factories.LocationFromZipService(zipCode);
        }
    }
    
}]);

setLocation = function(lat, lng){
    window.localStorage['lat'] = lat;
    window.localStorage['lng'] = lng;
}

/*
.controller('Tutorial');
*/