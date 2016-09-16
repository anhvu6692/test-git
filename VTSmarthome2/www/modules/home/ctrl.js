var HomeCtrl = function ($scope, $state,$storageService,$statementService,$socketService,$filter,$deviceParsingService,$ionicPopup,ionicTimePicker,$timeout,$cordovaDatePicker,$ionicModal,$route) {
	$scope.width = (window.screen.width-50)/window.screen.width * 100;

	$storageService.loadAllConfig();

	// Return home when disconnect
	// if (!$socketService.isConnected()) {
	// 	alert("Mất kết nối với máy chủ, vui lòng kết nối lại ! ");
	// 	$state.go("login");
	// }

	// Create tabs
	$scope.tabs = angular.copy($storageService.getFloors());
	var allDeviceTab = new Floor();
	allDeviceTab.id = "-1";
	allDeviceTab.name = "Tất cả thiết bị";
	$scope.tabs.unshift(allDeviceTab);

	// Apply current status for device
	var allDevices = $storageService.getDevices();
	var cameras = $storageService.getCameras();

	// Load outdor
	$scope.outDoorDevices = $filter('filter')(allDevices,function(d) {return ((d.type == 1 || d.type == 2) && d.isOutdoor && d.status == 1 ); });

	// Moving view
	$scope.viewType = 1; // 1: All Device , 2: show image , 3: Device in ROOM ( with temp and hum)
	$scope.currentTabs = 0; // all floor + 1

	// $scope.itemsInTabs = controlDevice;
	$scope.itemsInTabs = $filter('filter')(allDevices,function(d) {return (d.type != 1 && d.type != 2 && d.status == 1); });

	// View 02
	$scope.rooms = [];
	$scope.floor = {
		image: "",
		name: ""
	}

	$scope.onSlideMove = function(data){
		$scope.currentTabs = data.index;
		if ($scope.currentTabs == 0){ // Slide to first tab
			$scope.viewType = 1;
			$scope.itemsInTabs = $filter('filter')(allDevices,function(d) {return (d.type != 1 && d.type != 2  && d.status == 1); });
		} else { // Slide to other tabs
			$scope.itemsInTabs = [];

			var floor = $scope.tabs[$scope.currentTabs];
			var deviceList = floor.deviceList;
			for(var i =0 ; i < deviceList.length ; i++){
				var device = allDevices[deviceList[i]];
				if (device.type != 1 && device.type != 2) $scope.itemsInTabs.push(device);
			}

			$scope.rooms = [];
			var rooms = $storageService.getRoomFromFloor(floor.id);
			for (var i = 0 ; i < rooms.length ; i++){
				var roomDeviceList = rooms[i].deviceList;
				$scope.rooms.push({id:rooms[i].id, name: rooms[i].name,active: false });
				for(var j =0 ; j < roomDeviceList.length ; j++){
					var device = allDevices[roomDeviceList[j]];
					if (device.type != 1 && device.type != 2){
						var existsDevice = $filter('filter')($scope.itemsInTabs,function(d) { return d.id == roomDeviceList[j] } )[0];
						if (device && !existsDevice) {
							$scope.itemsInTabs.push(device);
						}
					}
				}
			}

			$scope.floor.image = floor.image;
			$scope.floor.name = floor.name;
			$scope.viewType = $storageService.getView();

		}
		changeItemsOfView();
	}
	$scope.changeView = function(){
		if ($scope.tabs.length > 0 && $scope.currentTabs == 0){ // IF CLICK TO CHANGE VIEW IN ALL DEVICE
			$scope.currentTabs = 1;
		} else if ($scope.tabs.length == 0) {
			optionPopup.close();
			return;
		}

		if ($scope.viewType == 1) $scope.viewType = 2;
		else $scope.viewType = 1;

		var floor = $scope.tabs[$scope.currentTabs];
		floor.view = $scope.viewType;
		$scope.floor.image = floor.image;
		$scope.floor.name = floor.name;
		// $scope.floor.view = floor.view;
		$storageService.saveViewToStorage($scope.viewType);
		// $storageService.setFloorView(floor.id,$scope.viewType);
		optionPopup.close();

	}
	$scope.gotoProfile = function(){
		$state.go("profile_apply");
	}
	$scope.setupDevice = function(){
		optionPopup.close();
		$state.go("manager.device");
	}
	$scope.logout = function(){
		optionPopup.close();
		$storageService.saveUserToStorage('','');
		$state.go("login");
	}

	$scope.changeStatus = function(id){
		var device = allDevices[parseInt(id)];
		if (parseInt(device.isSchedule) == 1) {
			alert("Thiết bị đang được chạy tự động ");
			return;
		}
		if (device){
			if (parseInt(device.isOn) == 1 ) $socketService.sendData($statementService.turnOffDevice(id));
			else $socketService.sendData($statementService.turnOnDevice(id));
		} else {
			alert("Can't find device");
		}
	}
	$scope.offDevice = function (id) {
		$socketService.sendData($statementService.turnOffDevice(id));
	}
	$scope.changeOnOffSchedule = function(id){
		var device = allDevices[parseInt(id)];
		if (device){
			if (parseInt(device.isSchedule) == 1 ) $socketService.sendData($statementService.switchToManual(id));
			else $socketService.sendData($statementService.switchToAutomatic(id));
		}
	}
	$scope.addValue = function(id){
		var device = allDevices[parseInt(id)];
		if (device){
			if (device.type == 7){
				$socketService.sendData($statementService.changeAnalogValue(id,100));
			} else {
				if (parseInt(device.value) < parseInt(device.toValue)) $socketService.sendData($statementService.changeAnalogValue(id,parseInt(device.value)+1));
			}
		}
	};
	$scope.subtractValue = function(id){
		var device = allDevices[parseInt(id)];
		if (device){
			if (device.type == 7){
				$socketService.sendData($statementService.changeAnalogValue(id,0));
			} else {
				if (parseInt(device.value) >  parseInt(device.fromValue)) $socketService.sendData($statementService.changeAnalogValue(id,parseInt(device.value-1)));
			}
		}
	}

	$scope.expandAndColl = function(id){
		var device = allDevices[parseInt(id)];
		if (device){
			if (device.expand == 1) device.expand = 0;
			else device.expand = 1;
		}
	}
	$scope.goToSetting = function(id){
		var device = $filter('filter')($scope.itemsInTabs, function (d) {return d.id == id;})[0];
		$scope.data = {};
		$scope.s_startDate = device.fromSchedule; // 00:10
		$scope.s_endDate = device.toSchedule; // 20:31
		$scope.startTime = $deviceParsingService.parseStringToTime(device.fromSchedule) *60;
		$scope.endTime = $deviceParsingService.parseStringToTime(device.toSchedule) *60;

		// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
			template:   '' +
			'<input type="text" ng-model="s_startDate" ng-click="createStart()" readonly value="Giờ bắt đầu"><br/>' +
			'<input type="text" ng-model="s_endDate" ng-click="createEnd()" readonly value="Giờ kết thúc "><br/>',
			title: '<h2 style="color: white;">Cài đặt hẹn giờ</h2>',
			scope: $scope,
			buttons: [
				{text: 'Huỷ '},
				{
					text: '<b>Lưu lại </b>',
					type: 'button-positive',
					onTap: function (e) {
						$socketService.sendData($statementService.scheduleDevice(id,$scope.s_startDate,$scope.s_endDate));
					}
				}
			]
		});
		myPopup.then(function(res) {

		});
	}
	$scope.createStart = function(){
		var olddate = parseMinutesToDate($scope.startTime);

		var options = {
			date: olddate,
			mode: 'time',
			doneButtonLabel: 'DONE',
			doneButtonColor: '#2f79e6',
			cancelButtonLabel: 'CANCEL',
			cancelButtonColor: '#000000'
		};
		$cordovaDatePicker.show(options).then(function(date){
			if (date){
				$scope.s_startDate = pad(date.getHours(),2)+":"+pad(date.getMinutes(),2);
			}
		});
	}
	$scope.createEnd = function(){
		var olddate = parseMinutesToDate($scope.endTime);

		var options = {
			date: olddate,
			mode: 'time',
			doneButtonLabel: 'DONE',
			doneButtonColor: '#2f79e6',
			cancelButtonLabel: 'CANCEL',
			cancelButtonColor: '#000000'
		};
		$cordovaDatePicker.show(options).then(function(date){
			if (date){
				$scope.s_endDate = pad(date.getHours(),2)+":"+pad(date.getMinutes(),2);
			}
		});
	}

	// VIEW 2
	$scope.image = {
		width: window.screen.width*8/10,
		height: window.screen.height *6/8
	}

	// VIEW 3
	$scope.room = {
		name: "",
		devices : []
	}
	$scope.cambiens = [];

	$scope.chooseByLocale = function (event) {
		var target = angular.element(event.target);
		var x = event.targetTouches[0].clientX-target[0].x;
		var y = event.targetTouches[0].clientY-target[0].y;

		var floor = $scope.tabs[$scope.currentTabs]; // FlOORID
		var rooms = $storageService.getRoomFromFloor(floor.id);
		if (rooms.length > 0){
			var roomPick = rooms[0];
			var minDistance = -1;
			for(var index = 0 ; index < rooms.length; index++) {
				var distance = (rooms[index].x - x)*(rooms[index].x - x) + (rooms[index].y - y)*(rooms[index].y - y);
				if (minDistance == -1)  minDistance = distance;
				else if (minDistance > distance) {
					minDistance = distance;
					roomPick = rooms[index];
				}
			}
			// SWITCH TO MODE 3
			$scope.viewType = 3;
			$scope.room = roomPick;
			var deviceList = roomPick.deviceList;
			$scope.cambiens = [];
			var roomDevices = [];
			for(var i =0 ; i < deviceList.length ; i++){
				var device = allDevices[deviceList[i]];
				if (device) {
					if (device.type != 1 && device.type != 2) roomDevices.push(device);
					else $scope.cambiens.push(device);
				}
			}
			$scope.itemsInTabs = roomDevices;
			changeItemsOfView();


		} else {
			alert("Tầng này chưa có phòng ! ");
		}
		event.preventDefault();
		event.stopPropagation;
		return false;
	}

	$scope.gotoRoom = function(roomId){
		$scope.viewType = 3;
		var roomPick = $storageService.getRoomById(roomId);
		$scope.room = roomPick;
		var deviceList = roomPick.deviceList;
		$scope.cambiens = [];
		var roomDevices = [];
		for(var i =0 ; i < deviceList.length ; i++){
			var device = allDevices[deviceList[i]];
			if (device) {
				if (device.type != 1 && device.type != 2) roomDevices.push(device);
				else $scope.cambiens.push(device);
			}
		}
		// set active tabs
		for(var i = 0 ; i < $scope.rooms.length ; i++){
			if ($scope.rooms[i].id == roomId){
				$scope.rooms[i].active = true;
			} else $scope.rooms[i].active = false;
		}

		$scope.itemsInTabs = roomDevices;
		changeItemsOfView();
	}

	var optionPopup;
	$scope.showOption = function(){
		optionPopup = $ionicPopup.show({
			template:   '<ion-list show-delete="shouldShowDelete" show-reorder="shouldShowReorder" can-swipe="listCanSwipe" class="disable-user-behavior">' +
				'<ion-item><div class="itemcontent" ng-touchstart="changeView()"><div class="maincontent"><h2 style="line-height:46px" class="ng-binding">{{viewType == 1 ? "Chuyển sang dạng sơ đồ" : "Chuyển sang dạng danh sách"}}</h2></div></div></ion-item>'+
				'<ion-item><div class="itemcontent"><div class="maincontent"><h2 style="line-height:46px" class="ng-binding">Chon cấu hình</h2></div></div></ion-item>'+
				'<ion-item><div class="itemcontent" ng-touchstart="setupDevice()"><div class="maincontent"><h2 style="line-height:46px" class="ng-binding">Cài đặt</h2></div></div></ion-item>'+
				'<ion-item><div class="itemcontent" ng-touchstart="logout()"><div class="maincontent"><h2 style="line-height:46px" class="ng-binding">Đăng xuất</h2></div></div></ion-item>'+
				'</ion-list>',
			title: '<h2 style="color: white;">Cài đặt</h2>',
			scope: $scope,
			buttons: [
				{
					text: '<b>OK </b>',
					type: 'button-positive'
				}
			]
		});
	}

	$scope.cameras = [];
	$scope.camera = {
		id: "",
		hostname:"",
		port:"",
		username: "",
		password: ""
	};
	$ionicModal.fromTemplateUrl('view-camera-snapshot.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(camera) {
		$scope.listCamera = camera;
	});
	$scope.viewListCamera = function(){
		$scope.listCamera.show();
		$scope.cameras = $storageService.getCameras();
	}
	$scope.closeListCamera = function(){
		$scope.listCamera.hide();
	}
	$ionicModal.fromTemplateUrl('view-camera.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(currentCamera) {
		$scope.currentCamera = currentCamera;
	});
	$scope.viewCamera = function(url){
		$scope.cameraURL = url;
		$scope.currentCamera.show();
	}
	$scope.closeCamera = function(){
		$scope.cameraURL = "";
		$scope.currentCamera.hide();
	}

	var attemptReconnect = 0 ;
	$socketService.setCallback(callbackSocket);
	function callbackSocket(code,message){
		if (code == 20){ // Refresh all
			attemptReconnect = 0;

			// Refresh
			allDevices = $storageService.getDevicesRecv();
			$scope.outDoorDevices = $filter('filter')(allDevices,function(d) {return ((d.type == 1 || d.type == 2) && d.isOutdoor && d.status == 1); });
			$scope.itemsInTabs = $filter('filter')(allDevices,function(d) {return (d.type != 1 && d.type != 2 && d.status == 1); });

			$scope.$apply();

		} else if (code == 21){
			// var dv = $filter('filter')(allDevices, function(d) {return d.id == parseInt(message.id);})[0];
			var dv = allDevices[parseInt(message.id)];
			if (dv){
				dv.isOn = message.isOn;
				dv.isSchedule = message.isSchedule;
				dv.fromSchedule = message.fromSchedule;
				dv.toSchedule = message.toSchedule;
				dv.value = message.value;
			}
			$scope.$apply();
		} else if (code == 0) {
			var user = $storageService.getUser();
			$socketService.sendData($statementService.createLoginString(user.username,user.password));
		} else if (code == -2) { // close
			attemptReconnect++;
			$socketService.connect(callbackSocket);
		} else if (code == -3){ // error read

		} else if (code == -1){ // can't connect
			attemptReconnect++;
			if (attemptReconnect < 10){
				$socketService.connect(callbackSocket);
			} else {
				var confirm = comfirm("Mất kết nối với máy chủ, bạn có muốn kết nối lại ? ");
				if (confirm) $socketService.connect(callbackSocket);
				else $state.go("login");
			}

		} else {
			alert("Mất kết nối với máy chủ, vui lòng kết nối lại ! ");
			$state.go("login");

		}


	}

	function changeItemsOfView(){
		$scope.items_ToTab = [];
		reloadList(0);
	}
	function reloadList(start){
		if ((start + 1) > $scope.itemsInTabs.length){
			return;
		} else if ((start + 1) == $scope.itemsInTabs.length){
			$scope.items_ToTab.push($scope.itemsInTabs[start]);
		} else {
			$scope.items_ToTab.push($scope.itemsInTabs[start]);
			$timeout(function(){reloadList(start+1)},1);
		}
	}
	changeItemsOfView();

	function pad(num, size) {
		var s = num+"";
		while (s.length < size) s = "0" + s;
		return s;
	}
	function parseMinutesToDate(minutes){
		var date = new Date();
		var dateString  = $deviceParsingService.parseTimeToString(minutes);
		date.setHours(dateString.split(":")[0]);
		date.setMinutes(dateString.split(":")[1]);
		return date;
	}

	$scope.isActive = function (path) {
		
	};
};
angular.module('home.ctrl',[])
	.controller('HomeCtrl',['$scope', '$state','$storageService','$statementService','$socketService','$filter','$deviceParsingService','$ionicPopup','ionicTimePicker','$timeout','$cordovaDatePicker','$ionicModal','$route',HomeCtrl]);