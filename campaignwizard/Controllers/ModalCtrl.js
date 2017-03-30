/* global angular moment */
'use strict'

angular.module('public.campaignwizard')
    .controller('PhotoModalController', PhotoModalController)

PhotoModalController.$inject = ['$scope', '$uibModalInstance', 'index', '$location']

function PhotoModalController($scope, $uibModalInstance, index, $location) {
    var vm = this

    vm.$scope = $scope
    vm.$uibModalInstance = $uibModalInstance
    vm.$location = $location
    vm.index = index
    //  $uibModalInstance is used to communicate and send data back to main controller
    vm.cancel = function() {
        vm.$uibModalInstance.dismiss()
    }

    vm.ok = function() {
        vm.$uibModalInstance.close(vm.index)
    }
}
