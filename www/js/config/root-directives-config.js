angular.module("MTPOC")

.config(function($provide) {
    $provide.decorator('ngSrcDirective', function($delegate) {
        var directive = $delegate[0],
            link = directive.link;
        directive.compile = function() {
            return function(scope, element, attrs) {
                link.apply(this, arguments);
                element.bind('load', function() {
                    scope.$emit('$imageLoaded');
                });
            };
        };

        return $delegate;
    });
    // ...
})
.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
})
/*.config(function($provide) {
    // ...
    $provide.decorator('ngRepeatDirective', function($delegate) {
        var directive = $delegate[0],
            link = directive.link;
        directive.compile = function() {
            return function(scope, element, attrs) {
               link.apply(this, arguments);
                scope.$watch('$$childTail.$last', function(newVal, oldVal) {
                    newVal && scope.$emit('$repeatFinished');
                });
            };
        };

        return $delegate;
    });
})*/
;