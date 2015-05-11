// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('sol', ['ionic'])

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
    .state('marsWeather', {
        url: '/mars',
        views: {
            'mars' : {
                templateUrl: 'templates/marsweather.html',
                controller: 'MarsWeatherController'
            }
        }
    })
    //$urlRouterProvider.otherwise('/mars');
})

.controller('MarsWeatherController', ['$scope', '$http',
  function($scope, $http){
    $http.get('http://marsweather.ingenology.com/v1/latest/?format=jsonp')
    .success(function(data){
        $scope.marsWeather = data;
        console.log(data);
    });
}]);

/*
.controller('EarthWeatherController');
.controller('Tutorial');
*/