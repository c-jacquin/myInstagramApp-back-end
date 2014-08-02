app.directive('file', function() {
    return {
        restrict: 'E',
        template: '<input type="file" />',
        replace: true,
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            var listener = function() {
                scope.$apply(function() {
                    attr.multiple ? ctrl.$setViewValue(element[0].files) : ctrl.$setViewValue(element[0].files[0]);
                });
            };
            element.bind('change', listener);
        }
    };
});

app.directive('ngContent', [
    function() {
      return {
        link: function($scope, $el, $attrs) {
                $scope.$watch($attrs.ngContent, function(value) {
                  $el.attr('content', value);
                });
              }
      };
    }
  ])
;

app.directive('showonhoverparent',
   function() {
      return {
         link : function(scope, element, attrs) {
            element.parent().bind('mouseenter', function() {
                element.show();
            });
            element.parent().bind('mouseleave', function() {
                 element.hide();
            });
       }
   };
});