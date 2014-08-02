app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
                when('/cgu', {
                    templateUrl: 'partials/cgu.html'
                }).
                when('/home', {
                    templateUrl: 'partials/home.html'
                }).
                when('/members', {
                    templateUrl: 'partials/members.html',
                    controller: 'MembersCtrl'
                }).
                when('/partnership', {
                    templateUrl: 'partials/partnership.html'
                }).
                otherwise({
                    redirectTo: '/home'
                });
    }]);
