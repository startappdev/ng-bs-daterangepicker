/**
 * @license ng-bs-daterangepicker v0.0.1
 * @forked by StartAppDev (Nadav Sinai,misterBit)
 @original Author* (c) 2013 Luis Farzati http://github.com/luisfarzati/ng-bs-daterangepicker
 * License: MIT
 */
(function (angular) {
    'use strict';

    angular.module('ngDateRange', []).directive('ngDateRange', function ($compile, $parse) {
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: function ($scope, $element, $attributes, ngModel) {
                if (ngModel === null) return;

                var options = {};
                options.format = $attributes.format || 'YYYY-MM-DD';
                options.separator = $attributes.separator || ' - ';
                options.minDate = $attributes.minDate && moment($attributes.minDate);
                options.maxDate = $attributes.maxDate && moment($attributes.maxDate);
                options.dateLimit = $attributes.limit && moment.duration.apply(this, $attributes.limit.split(' ').map(function (elem, index) {
                    return index === 0 && parseInt(elem, 10) || elem;
                }));
                options.ranges = $attributes.ranges && $parse($attributes.ranges)($scope);
                options.locale = $attributes.locale && $parse($attributes.locale)($scope);
                options.opens = $attributes.opens && $parse($attributes.opens)($scope);

                function format(date) {
                    return date.format(options.format);
                }

                function formatted(dates) {
                    return [format(dates.startDate), format(dates.endDate)].join(options.separator);
                }

                var updateCalender = function (modelValue) {
                    if (!modelValue || (!modelValue.startDate)) {
                        ngModel.$setViewValue({startDate: moment().startOf('day'), endDate: moment().startOf('day')});
                        return;
                    }
                    $element.data('daterangepicker').startDate = modelValue.startDate;
                    $element.data('daterangepicker').endDate = modelValue.endDate;
                    $element.data('daterangepicker').updateView();
                    $element.data('daterangepicker').updateCalendars();
                    $element.data('daterangepicker').updateInputText();
                    return modelValue;
                };

                ngModel.$formatters.unshift(updateCalender);

                ngModel.$parsers.unshift(updateCalender)

                ngModel.$render = function () {
                    if (!ngModel.$viewValue || !ngModel.$viewValue.startDate) return;
                    $element.val(formatted(ngModel.$viewValue));
                };

                $element.daterangepicker(options, function (start, end) {
                    $scope.$apply(function () {
                        ngModel.$setViewValue({startDate: start, endDate: end});
                        ngModel.$render();
                    });
                });
            }
        };
    });

})(angular);