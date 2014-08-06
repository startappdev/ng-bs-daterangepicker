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
                var datepickerObj;
                $element.css('position', 'relative');
                var options = {};
                options.invalidText = $attributes.invalidText || 'date format is invalid';
                options.format = $attributes.format || 'YYYY-MM-DD';
                options.showDropdowns = $attributes.showDropdowns || false;
                // options.parentEl = $element[0].tagName + '[ng-model="' + $attributes.ngModel + '"]';
                options.separator = $attributes.separator || ' - ';
                options.minDate = $attributes.minDate && moment(new Date($attributes.minDate));
                options.maxDate = $attributes.maxDate && moment(new Date($attributes.maxDate));
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

                var dateValid = function (dateObj) {
                    if (!(dateObj.startDate.isValid() && dateObj.endDate.isValid() && dateObj.startDate.isBefore(dateObj.endDate))) {
                        return false;
                    }
                    if (options.minDate && options.minDate.isValid()) {
                        if (dateObj.startDate.isBefore(options.minDate)) {
                            return false;
                        }
                    }
                    if (options.maxDate && options.maxDate.isValid()) {
                        if (dateObj.endDate.isAfter(options.maxDate)) {
                            return false;
                        }
                    }
                    return true;
                };

                var buildValidation = function(){
                    var html = $('<span class="help-block text-center alert-warning"></span>').text(options.invalidText);

                };

                var afterDateChoosen = function (start, end) {
                    $scope.$apply(function () {
                        if (dateValid({startDate: start, endDate: end})) {
                            ngModel.$setViewValue({startDate: start, endDate: end});
                            ngModel.$render();
                        }
                        else {
                            buildValidation();
                        }
                    });
                };
                // invoke the jquery plugin and supply the callback, cache the controller object
                datepickerObj = $element.daterangepicker(options, afterDateChoosen);


                var updateCalender = function (modelValue) {
                    if (!modelValue || (!modelValue.startDate)) {
                        ngModel.$setViewValue({
                            startDate: moment().startOf('day'),
                            endDate: moment().startOf('day')
                        });
                    }
                    else if (dateValid(modelValue)) {
                        datepickerObj.startDate = modelValue.startDate;
                        datepickerObj.endDate = modelValue.endDate;
                        datepickerObj.updateView();
                        datepickerObj.updateCalendars();
                        datepickerObj.showCalendars();
                        datepickerObj.updateInputText();
                    } else {
                            buildValidation();
                    }
                    return modelValue;
                };
//                $element.on('apply.daterangepicker', function (e, datepicker) {
//                    cl(datepicker);
//
//                });
                ngModel.$render = function () {
                    if (!ngModel.$viewValue || !ngModel.$viewValue.startDate) return;
                    if ($element[0].tagName == 'input')
                        $element.val(formatted(ngModel.$viewValue));
                };

                ngModel.$formatters.unshift(updateCalender);

                if ($element[0].tagName == 'input') {
                    ngModel.$parsers.unshift(updateCalender);

                }
            }
        };
    });

})(angular);