angular.module("MTPOC")

.directive('imageLoadWatcher', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            if (typeof $rootScope.loadCounter === 'undefined') {
                $rootScope.loadCounter = 0;
            }
            element.find('img').bind('load', function() {
                scope.$emit('$imageLoaded', $rootScope.loadCounter++);
            });
        },
        controller: function($scope) {
            $scope.$parent.$on('$imageLoaded', function(event, data) {
                if ($scope.$last && $scope.$index === $rootScope.loadCounter - 1) {
                    $scope.$emit('$allImagesLoaded');
                    delete $rootScope.loadCounter;
                }
            });
        }
    };
});