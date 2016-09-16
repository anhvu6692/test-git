var ManagerCtrl = function ($scope,$ionicHistory,$ionicSideMenuDelegate) {
	$scope.back = function () {
		$ionicHistory.goBack();
	};
	$scope.toggleSidemenu = function () {
		$ionicSideMenuDelegate.toggleLeft();
	};
};

angular.module('manager.ctrl',[])
	.controller('ManagerCtrl',['$scope','$ionicHistory','$ionicSideMenuDelegate','$storageService',ManagerCtrl])
	.controller('ManagerDeviceCtrl',['$scope','$stateParams','$ionicHistory','$storageService','$state','$filter',ManagerDeviceCtrl])
	.controller('ManagerFloorsCtrl',['$scope','$storageService','$state',ManagerFloorsCtrl])
	.controller('ManagerRoomCtrl',['$scope','$stateParams','$storageService','$ionicHistory','$state',ManagerRoomCtrl])
	.controller('ManagerEditRoomCtrl',['$scope','$stateParams','$storageService','$ionicHistory','$state','$ionicPopup','$ionicModal','$filter',ManagerEditRoomCtrl])
	.controller('ManagerEditDeviceCtrl',['$scope','$stateParams','$state','$storageService','$mockingService','$statementService','$deviceParsingService','$ionicHistory','$filter',ManagerEditDeviceCtrl])
	.controller('ManagerEditFloorsCtrl',['$scope','$stateParams','$state','$storageService','$mockingService','$deviceParsingService','$ionicHistory','$filter','$ionicPopup','$cordovaImagePicker','$cordovaFileTransfer',ManagerEditFloorsCtrl])
	.controller('ManagerCameraCtrl',['$scope','$storageService','$state',ManagerCameraCtrl])
	.controller('ManagerEditCameraCtrl',['$scope','$stateParams','$state','$storageService',ManagerEditCameraCtrl])
	.controller('ManagerProfileCtrl',['$scope','$stateParams','$state','$storageService',ManagerProfileCtrl])
	.controller('ManagerEditProfileCtrl',['$scope','$stateParams','$state','$storageService',ManagerEditProfileCtrl]);

