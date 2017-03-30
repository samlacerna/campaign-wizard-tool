'use strict'
angular.module('public.campaignwizard', ['ui.router', 'ui.bootstrap-slider'])
    .config(function($stateProvider) {
        $stateProvider
            .state('public.campaignwizard', {
                abstract: true,
                data: {
                    title: 'collab',
                    css: ['assets/css/bootstrap-slider.css', '/client/campaignwizard/css/wizard.css']
                },
                url: '/create/wizard',
                params: {
                    campaign: {}
                },
                views: {
                    'content@public': {
                        templateUrl: '/client/campaignwizard/views/createMain.html',
                        controller: 'CampaignWizardController as vm'
                    }
                }
            })
            .state('public.campaignwizard.upload', {
                url: '/upload',
                params: {
                    campaign: { tags: [] }
                },
                data: {
                    title: 'upload a collab'
                },
                views: {
                    'subContent@public.campaignwizard': {
                        templateUrl: '/client/campaignwizard/views/upload.html',
                        controller: 'CampaignWizardController as vm'
                    }
                }
            })
            .state('public.campaignwizard.goal', {
                url: '/goal',
                params: {
                    campaign: {}
                },
                views: {
                    'subContent@public.campaignwizard': {
                        templateUrl: '/client/campaignwizard/views/goal.html',
                        controller: 'CampaignWizardController as vm'
                    }
                }
            })
            .state('public.campaignwizard.detail', {
                url: '/detail',
                params: {
                    campaign: {}
                },
                data: {
                    title: 'Add Details'
                },
                views: {
                    'subContent@public.campaignwizard': {
                        templateUrl: '/client/campaignwizard/views/details.html',
                        controller: 'CampaignWizardController as vm'
                    }
                }

            })
            .state('public.campaignwizard.submitted', {
                url: '/submitted',
                params: {
                    campaign: {}
                },
                data: {
                    title: 'Successful submit'
                },
                views: {
                    'subContent@public.campaignwizard': {
                        template: '<h1>Your Collab was successfully submitted!</h1>',
                        controller: 'CampaignWizardController as vm'
                    }
                }
            })
    })
