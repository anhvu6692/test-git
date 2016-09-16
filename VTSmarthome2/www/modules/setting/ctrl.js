var SettingCtrl = function ($scope,$state,$stateParams,$ionicHistory) {
	var idDevice = $stateParams.id;
	console.log(idDevice);
	$scope.device = {
		name:"Đèn",
		state:'off',
		signal:20,
		signalMin:1,
		signalMax:100,
		auto:true,
		timeStart:'16:08',
		timeEnd:'18:09'
	}
	$scope.back = function () {
		$ionicHistory.goBack();
	};
	$scope.submit = function () {
		$state.go('home');
	};
};

angular.module('setting.ctrl',[])
	.controller('SettingCtrl',['$scope','$state','$stateParams','$ionicHistory',SettingCtrl]);