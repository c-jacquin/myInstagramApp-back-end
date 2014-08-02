app.service('BasicHttpAuth', ['Base64', '$localStorage', '$http', function (Base64, $localStorage, $http) {
    // initialize to whatever is in the cookie, if anything
    $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.authdata;

    return {
        setCredentials: function (username, password) {
            var encoded = Base64.encode(username + ':' + password);
            $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
            $localStorage.authdata = encoded;
        },
        clearCredentials: function () {
            document.execCommand("ClearAuthenticationCache");
            delete $localStorage.authdata;
            delete $localStorage.user;
            $http.defaults.headers.common.Authorization = 'Basic ';
        }
    };
}]);