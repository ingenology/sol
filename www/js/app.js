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

.controller('PlanetsController', ['$location', '$scope', '$http', 'Factories', '$cordovaSocialSharing', '$ionicModal', 'ModalService', '$ionicPopup', function ($location, $scope, $http, Factories, $cordovaSocialSharing, $ionicModal, ModalService, $ionicPopup) {
    // just toggling classes on the planetz
    $scope.active = '';
    $scope.earthTempLoading = false;
    $scope.marsTempLoading = false;
    
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
        $scope.marsTempLoading = true;
        $http.jsonp('http://marsweather.ingenology.com/v1/latest?format=jsonp&callback=JSON_CALLBACK')
        .success(function(data){
            $scope.marsWeather = data.report;
            $scope.marsTempLoading = false;
            if (window.localStorage['tempScale'] != 'Farenheit') {
                $scope.marsWeather.max_temp_fahrenheit = ((data.report.max_temp_fahrenheit - 32) * 1.8).toFixed(1);
                $scope.marsWeather.min_temp_fahrenheit = ((data.report.min_temp_fahrenheit - 32) * 1.8).toFixed(1);
            }
            console.log(' app.js ln 69 getMarsWeatherData sez ' + $scope.marsWeather.max_temp_fahrenheit)
        })
        .error(function(jqXHR, textStatus){
            console.log(textStatus + ' on the getMarsWeatherData app.js ln 72');
            $scope.showRetryMars();
            $scope.marsWeatherError = 'Error ' + textStatus + '. Your connection to Curiosity has gone haywire.';
        });
    };
    
    // earth weather!
    $scope.earthWeather = {};
    $scope.getEarthWeatherData = function() {            
        // if geo, then get lat and long and do the weather
        // if window, then do the weather
        // else, you're set in KC, the greatest city on Earph.
        // then, go run the earth weather
        var lat, lng;
            
        if (window.localStorage['locator'] === 'device') {
            console.log('app.js ln 86 getEarthWeatherData controller using device locator.');
            Factories.LocationService();
        } else if (window.localStorage['lat'] && window.localStorage['lng']) {
            console.log('app.js ln 89 getEarthWeatherData controller using zip');
            lat = window.localStorage['lat'];
            lng = window.localStorage['lng'];
        } else {
            lat = 39.0997;
            lng = -94.5783;
        }
        Factories.EarthWeatherService($scope, lat, lng);
        console.log('app.js ln 97 getEarthWeatherData lat and long: ' + lat + ' and ' + lng)
    }
    
    $scope.finishTutorial = function() {
        $scope.closeModal();
		window.localStorage['viewedTutorial'] = 'yes';
	};
    
    $scope.getWeatherData = function() {
        if (!window.localStorage['viewedTutorial']) {
			ModalService.init('templates/tutorial.html', $scope).then(function(modal) {
				modal.show();
			});
		}
        $scope.getMarsWeatherData();
        $scope.getEarthWeatherData();
    }
    
    $scope.share = function() {
        $cordovaSocialSharing.share('According to Sol, the first interplanetary weather app, it is '+$scope.earthWeather.list[0].temp.day+' outside in '+ $scope.earthWeather.city.name +'. But on Mars, it is only '+ $scope.max_temp_fahrenheit, null, 'www/imagefile.png', 'http://marsweather.com');
    }
    
    //Error Helpers
    // this mars weather feed connection error calls this popup.
    $scope.showRetryMars = function() {
        var myPopup = $ionicPopup.show({
            template: 'Your connection to Curiosity has gone haywire.',
            title: 'Mars Weather Error',
            scope: $scope,
            buttons: [{   
                    text: 'Cancel',
                    onTap: function(e) {
                        $scope.marsTempLoading = false;
                    }
                },{   
                    text: '<b>Retry</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        $scope.getMarsWeatherData();
                    }
                }
            ]
        })
    }
}])

.controller('SettingsController', ['$scope', '$http', '$ionicModal', function ($scope, $http, $ionicModal) {
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
    
    // set Zip Code to locale storage if it's there.
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
    
    // acknowledgments modal
    $ionicModal.fromTemplateUrl('acknowledgments.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    
}])

setLocation = function(lat, lng){
    window.localStorage['lat'] = lat;
    window.localStorage['lng'] = lng;
}

/*

$scope.showRetryEarthLocation = function() {
    var myPopup = $ionicPopup.show({
        template: 'Your connection to Curiosity has gone haywire.',
        title: 'Mars Weather Error',
        scope: $scope,
        buttons: [
            { text: 'Cancel' },
            {
                text: '<b>Retry</b>',
                type: 'button-positive',
                onTap: function(e) {
                $scope.getMarsWeatherData();
                }
            }
        ]
    })
}
*/