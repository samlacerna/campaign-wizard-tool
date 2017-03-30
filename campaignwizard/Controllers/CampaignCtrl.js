/* global angular moment */
'use strict'

angular.module('public.campaignwizard')
    .controller('CampaignWizardController', CampaignWizController)

CampaignWizController.$inject = ['CampaignService', 'UploadsService', 'FileUploader', 'ClarifaiService', '$rootScope', '$scope', '$location', '$anchorScroll', 'UsersService', 'InstagramService', '$element', '$window', '$uibModal']

function CampaignWizController(CampaignService, UploadsService, FileUploader, ClarifaiService, $rootScope, $scope, $location, $anchorScroll, UsersService, InstagramService, $element, $window, $uibModal) {
    var vm = this
    vm.campaign = $rootScope.$state.params.campaign
    vm.uploaded = !!vm.campaign.campaign_picture

    vm.showModal = false
    vm.pictureModal = false
    vm.hidePreview = false
    vm.confirmModal = false

    vm.submitCampaign = _submitCampaign
    vm.calcProfit = _calcProfit
    vm.hideModal = _hideModal
    vm.convertDate = _convertDate
    vm.getState = _getState
    vm.setState = _setState

    vm.sizes = ['11x17', '12x18', '16x20', '18x24']
    vm.costs = [10, 12, 14, 16]
    vm.paperType = ['Glossy', 'Matt', 'Satin', 'Pearl', 'Luster']
    vm.dates = ['3 days', '5 days', '7 days', '14 days']

    vm.campaign.expiration_date = moment(new Date().toISOString()).add(3, 'd').calendar(true)

    vm.authenticate = instagramAuthentication
    vm.images = []
    vm.show = false
    vm.confirmation = false
    vm.confirmPhoto = confirmPhoto

    vm.totalItems = null
    vm.currentPage = 1
    vm.pageChanged = pageChanged
    vm.itemsPerPage = 9
    vm.setPage = setPage

    init()

    function init() {
        _goToTop()
        var Upload = new FileUploader()
        vm.Upload = Upload
        Upload.autoUpload = true
        Upload.removeAfterUpload = true

        UploadsService.configureUploaderForS3(Upload, 'campaign', uploadSuccess, addFail)
        Upload.filters.push(UploadsService.fileTypeFilter())
        Upload.filters.push(UploadsService.maxSizeFilter())

        if ($rootScope.$state.current.name !== 'public.campaignwizard.upload' && !vm.campaign.campaign_picture) {
            $rootScope.$state.go('public.campaignwizard.upload')
        } else if ($rootScope.$state.current.name === 'public.campaignwizard.detail') {
            vm.campaign.tags = ClarifaiService.getTags()
        } else if ($rootScope.$state.current.name === 'public.campaignwizard.goal') {
            _setState(2)
            /* $scope.$watch('vm.campaign', function() {
                $scope.$apply(_calcProfit())
            }, true) */
        }
    }

    function uploadSuccess(url, key, gps) {
        vm.imageSrc = url

        vm.campaign.gps = gps
        vm.campaign.campaign_picture = vm.imageSrc
        vm.campaign.campaign_picture_key = key

        vm.hidePreview = true
        vm.hasError = false

        ClarifaiService.tagImage(url)
    }

    function addFail(item, filter) {
        vm.hasError = true
        switch (filter.name) {
            case 'fileType':
                vm.fileError = 'Sorry, we only accept .jpg and .png images. Try again!'
                break
            case 'maxSize':
                vm.fileError = 'Only files under 4MB please!'
                break
            default:
                vm.fileError = 'Sorry, something went wrong. Try again?'
        }
    }

    function _submitCampaign() {
        if (!$rootScope.user) {
            showModal()
        } else {
            vm.campaign.seller_id = $rootScope.user.id
            vm.campaign.status = 'Active'
            CampaignService.insert(vm.campaign, onInsertSuccess, onError)
        }
    }

    function onInsertSuccess(data) {
        vm.campaign = {}
        $rootScope.$state.go('public.campaignwizard.submitted')
    }

    function getPrintCost() {
        var ind = vm.sizes.indexOf(vm.campaign.options.size)
        vm.campaign.cost = vm.costs[ind]
    }

    function showModal() {
        vm.showModal = true
    }

    function _getState() {
        return CampaignService.state
    }

    function _setState(state) {
        CampaignService.state = Math.max(state, CampaignService.state)
    }

    function _calcProfit() {
        getPrintCost()
        var total = (vm.campaign.price - vm.campaign.cost) * vm.campaign.target_orders
        vm.profit = total > 0 ? `$ ${Math.round(total)}+` : 'N/A'
    }

    vm.generalTags = _generalTags
    vm.generalTagsData = []

    // _generalTags()

    function _generalTags(url) {
        // vm.generalTagsData = data
        // console.log('generaltags data?', data)
        vm.showSpinner = true
        // vm.campaign.campaign_picture = false

        ClarifaiService.tagImage(url, onTagSuccess, onTagError)
    }

    function onTagSuccess(data) {
        // vm.showSpinner = false
        // vm.campaign.campaign_picture = false
        // console.log('onTagSuccess and here is the data:', data)
        // vm.generalTagsData = data.data.items.concepts
        // console.log('vm.generalTagsData =', vm.generalTagsData)
        vm.hide = false
        console.log('ontagsuccess!')
    }

    function onTagError(err) {
        console.log(err)
    }

    function _hideModal() {
        vm.showModal = false
    }

    function _convertDate() {
        if (vm.dateItem === '3 days') {
            vm.campaign.expiration_date = moment(new Date().toISOString()).add(3, 'd').calendar(true)
        } else if (vm.dateItem === '5 days') {
            vm.campaign.expiration_date = moment(new Date().toISOString()).add(5, 'd').calendar(true)
        } else if (vm.dateItem === '7 days') {
            vm.campaign.expiration_date = moment(new Date().toISOString()).add(7, 'd').calendar(true)
        } else if (vm.dateItem === '14 days') {
            vm.campaign.expiration_date = moment(new Date().toISOString()).add(14, 'd').calendar(true)
        }
        return vm.campaign.expiration_date
    }

    function instagramAuthentication() {
        vm.userId = $rootScope.user.id
        UsersService.getOne(vm.userId, onUserSuccess, onError)
    }

    function onUserSuccess(data) {
        vm.user = data.item
        if (!vm.user.instagram) {
            $window.open('/api/auth/instagram', '_self')
        } else {
            // service to get user's Instagram media
            InstagramService.getImages(vm.user.instagram.token, onImageSuccess, onError)
            vm.showFeed = true
        }
    }

    function onImageSuccess(data) {
        vm.images = data.item.data
        vm.totalItems = vm.images.length
    }

    function onDownloadSuccess(file) {
        vm.Upload.addToQueue(file)
        vm.instagramFeed = true
    }

    function _goToTop() {
        $anchorScroll()
    }

    function onError() {
        console.log(arguments)
    }

    function setPage(pageNo) {
        vm.currentPage = pageNo
    }

    function pageChanged() {
        console.log('Page changed to: ' + vm.currentPage)
    }

    function confirmPhoto(index) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'confirmModal.html', //  this tells it what html template to use. it must exist in a script tag OR external file
            controller: 'PhotoModalController as pc', //  this controller must exist and be registered with angular for this to work
            size: 'sm',
            resolve: { //  anything passed to resolve can be injected into the modal controller as shown below
                index: function() {
                    return index
                }
            }
        })

        //  when the modal closes it returns a promise
        modalInstance.result.then(function(idx) {
            var url = vm.images[idx].images.standard_resolution.url
            var fileName = vm.images[idx].id
            InstagramService.downloadImage(url, fileName, onDownloadSuccess, onError)
        })
    }
}
