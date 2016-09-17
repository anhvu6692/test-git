var RouteConfig = function($stateProvider, $urlRouterProvider) {
	
    $stateProvider
	    .state('login', {
	    	cache: false,
	    	url: '/login',
	    	templateUrl: 'modules/login/tpl.html',
	    	controller:'LoginCtrl'
	    }).state('home', {
	    	cache: false,
	    	url: '/home',
	    	templateUrl: 'modules/home/tpl.html',
	    	controller:'HomeCtrl'
	    }).state('setting', {
	    	cache: false,
	    	url: '/setting/:id',
	    	templateUrl: 'modules/setting/tpl.html',
	    	controller:'SettingCtrl'
		}).state('profile_apply', {
			cache: false,
			url: '/profile_apply',
			templateUrl: 'modules/home/profile_apply.html',
			controller:'ProfileApplyCtrl'
	    }).state('manager', {
	    	cache: false,
	    	abstract: true,
	    	url: '/manager',
	    	templateUrl: 'modules/manager/tpl.html',
	    	controller:'ManagerCtrl'
	    }).state('manager.device', {
	    	cache: false,
	    	url: '/device',
	    	views:{
		    	'menuContent':{
		    		templateUrl: 'modules/manager/tpl_devices.html',
		    		controller:'ManagerDeviceCtrl'
		    	}
	    	}
		}).state('manager.edit_device', {
			cache: false,
			url: '/device/:id',
			views:{
				'menuContent':{
					templateUrl: 'modules/manager/tpl_edit_device.html',
					controller:'ManagerEditDeviceCtrl'
				}
			}
	    }).state('manager.floors', {
	    	cache: false,
	    	url: '/floors',
	    	views:{
		    	'menuContent':{
		    		templateUrl: 'modules/manager/tpl_floors.html',
		    		controller:'ManagerFloorsCtrl'
		    	}
	    	}
		}).state('manager.edit_floors', {
			cache: false,
			url: '/floors/:id',
			views:{
				'menuContent':{
					templateUrl: 'modules/manager/tpl_edit_floors.html',
					controller:'ManagerEditFloorsCtrl'
				}
			}
		}).state('manager.profile', {
			cache: false,
			url: '/profiles',
			views:{
				'menuContent':{
					templateUrl: 'modules/manager/tpl_profiles.html',
					controller:'ManagerProfileCtrl'
				}
			}
		}).state('manager.edit_profile', {
			cache: false,
			url: '/profiles/:id',
			views:{
				'menuContent':{
					templateUrl: 'modules/manager/tpl_edit_profiles.html',
					controller:'ManagerEditProfileCtrl'
				}
			}
		}).state('manager.camera', {
			cache: false,
			url: '/camera',
			views:{
				'menuContent':{
					templateUrl: 'modules/manager/tpl_cameras.html',
					controller:'ManagerCameraCtrl'
				}
			}
		}).state('manager.edit_camera', {
			cache: false,
			url: '/camera/:id',
			views:{
				'menuContent':{
					templateUrl: 'modules/manager/tpl_edit_cameras.html',
					controller:'ManagerEditCameraCtrl'
				}
			}
	    }).state('room', {
	    	cache: false,
	    	url: '/room/:id',
	    	templateUrl: 'modules/manager/tpl_rooms.html',
	    	controller:'ManagerRoomCtrl'
		}).state('edit_room', {
			cache: false,
			url: '/edit_room/:id/:floorID',
			templateUrl: 'modules/manager/tpl_edit_rooms.html',
			controller:'ManagerEditRoomCtrl'
	    }).state('devices', {
	    	cache: false,
	    	url: '/devices/:id',
	    	templateUrl: 'modules/manager/tpl_devices.html',
	    	controller:'ManagerDeviceCtrl'
	    });

    $urlRouterProvider.otherwise("/login");

};

angular.module('app.routes',["ngRoute"])
	.config(['$stateProvider', '$urlRouterProvider',RouteConfig]);