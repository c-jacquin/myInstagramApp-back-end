function MembersCtrl($scope, $routeParams, $http, FDTDResources) {

    $scope.newUser = {
                email: $routeParams.email,
                reset_password_token: $routeParams.reset_password_token
    };

    $scope.activate = function(newUser) {
        $http.post('/activate', newUser)
                .success(function(data) {
                    alert('DAYSOLE PAS LE TEMPS YA WALKING DEAD QUI REPREND !!!');
                    alert('ps : c bon c valide');
                    $scope.activateMessage = "User successfully activate, enjoy your 2 invitations" + data.pseudo;
                })
                .error(function(data) {
                    alert('erreur lors de la validation : '+data);
                    $scope.activateMessage = "Operation unsuccessful : " + data.message;
                });
    };
}
;
