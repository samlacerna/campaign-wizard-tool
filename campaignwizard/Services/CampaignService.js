/* global angular */
'use strict'

angular.module('public.campaignwizard')
    .factory('CampaignService', CampaignServiceFactory)

CampaignServiceFactory.$inject = ['$http']

function CampaignServiceFactory($http) {
    return {
        insert,
        getAll,
        checkUrl,
        state: 0
    }



    // get all
    function getAll(onSuccess, onError) {
        return $http.get('/api/campaigns/')
            .then((response) => {
                onSuccess(response.data)
            })
            .catch((response) => {
                onError(response.data)
            })
    }

    function insert(data, onSuccess, onError) { // accepting two function as parameters... ,
        return $http.post('/api/campaigns/', data)
            .then((response) => { // '.then run function 'onSuccess', once promis is resolved //returns $http. $http is angulars service that allows you to make ajax / xml calls ,  specifically  the .get
                onSuccess(response.data) // send response data back to controller
            })
            .catch((response) => {
                onError(response.data)
            })
    }

    function checkUrl(url) {
        return $http.get('/api/campaigns/check', { url }).then(res => res.item)
    }
}
