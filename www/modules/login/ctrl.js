var LoginCtrl = function ($scope,$state,$mockingService,$deviceParsingService,$storageService,$statementService,$socketService,$ionicLoading,$timeout) {
	$storageService.loadAllConfig();
	var user = $storageService.getUser();

	$scope.user = {
		username : user.username,
		password : user.password
	};

	 $scope.$watch('$viewContentLoaded', function(){
	 	$ionicLoading.show({
	 		template: '<ion-spinner></ion-spinner>'
	 	});
	 	$timeout(function(){
	 		$socketService.connect(function(code,message){
	 			if (code == 0 ){ // init complete
	 				$socketService.sendData($statementService.createLoginString($scope.user.username,$scope.user.password));
	 			} else if (code == -1){
	 				alert("Không thể kết nối đến server ! ");
	 			} else if (code == 20 || code == 21){
	 				$storageService.saveUserToStorage($scope.user.username,$scope.user.password);
	 				$state.go('home');
	 				$ionicLoading.hide();
	 			} else {
	 				alert("Lỗi khi kết nối đến server !");
	 			}
	 		});
			$timeout(function(){ $ionicLoading.hide(); },500);
	 	},300);
	 });

	$scope.doLogin = function () {

		//Mock
		var stringArray = $mockingService.createDeviceRecvArray();
		$deviceParsingService.parsingDeviceArray(stringArray,function(masterDevice,deviceArr){
			$statementService.setMasterDevice(masterDevice);
            $storageService.setDevicesRecv(deviceArr);
			$state.go('home');
		});
		//End Mock

		 $socketService.connect(function(code,message){
		 	if (code == 0 ){ // init complete
		 		// isConnected = true;
		 		$socketService.sendData($statementService.createLoginString($scope.user.username,$scope.user.password));
		 	} else if (code == -1){
		 		alert("Không thể kết nối đến server ! ");
		 	} else if (code == 20 || code == 21){
		 		$storageService.saveUserToStorage($scope.user.username,$scope.user.password);
		 		$state.go('home');
		 	} else {
		 		alert("Lỗi khi kết nối đến server !");
		 	}
		 });

	};
};

angular.module('login.ctrl',[])
	.controller('LoginCtrl',['$scope','$state','$mockingService','$deviceParsingService','$storageService','$statementService','$socketService','$ionicLoading','$timeout',LoginCtrl]);
