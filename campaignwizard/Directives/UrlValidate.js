(function() {
    /* global angular */

    angular
        .module('public.campaignwizard')
        .directive('urlValidate', ['$q', '$http', function($q, $http) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, elem, attr, ctrl) {
                    ctrl.$asyncValidators.url = function(modelValue, viewValue) {
                        if (ctrl.$isEmpty(modelValue)) return $q.resolve()

                        return $http.get('/api/campaigns/check?url=' + viewValue)
                            .then(res => {
                                if (!res.data.item) return $q.resolve()
                                return $q.reject()
                            })
                    }
                }
            }
        }])
})()
