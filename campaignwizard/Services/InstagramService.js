/* global angular */
'use strict'

angular.module('public.campaignwizard')
    .factory('InstagramService', InstagramServiceFactory)

InstagramServiceFactory.$inject = ['$http']

function InstagramServiceFactory($http) {
    return {
        getImages,
        downloadImage
    }

    function getImages(token, onSuccess, onError) {
        return $http.get('/api/instagram')
            .then((response) => {
                onSuccess(response.data)
            })
            .catch((response) => {
                onError(response.data)
            })
    }

    function downloadImage(url, fileName, onSuccess, onError) {
        return $http.get(url, {responseType: 'arraybuffer'})
            .then((response) => {
                var blob = new Blob([response.data], {type: 'image/jpeg'})
                var file = new File([blob], fileName + '.jpg', {type: 'image/jpeg'})
                onSuccess(file)
            })
            .catch((response) => {
                onError(response.data)
            })
    }
}
