/* global angular */
'use strict'

angular.module('public.campaignwizard').factory('ClarifaiService', ClarifaiService)

ClarifaiService.$inject = ['$http']

function ClarifaiService($http) {
    var tags = []
    return {
        tagImage,
        setTags,
        getTags
    }

    function setTags(newTags) {
        tags = newTags.data.items
    }

    function getTags() {
        return tags
    }

    function tagImage(url, onSuccess, onError) {
        $http.get('/api/clarifai/tagimage', {
                params: {
                    url: url
                }
            })
            .then((data) => {
                setTags(data)
            })
    }
}
