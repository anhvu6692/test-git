/**
 * Created by Trong on 6/4/2016.
 */

var ManagerDeviceCtrl = function ($scope,$stateParams,$ionicHistory,$storageService,$state) {
    $storageService.loadAllConfig();

    $scope.title = "Quản lý thiết bị";
    $scope.alldevice = true;
    $scope.devices = $storageService.getDevices();

    $scope.gotoNewDevice = function(){
        $state.go("manager.edit_device",{id:-1});
    }
    $scope.disableDevice = function(id){
        $storageService.disableDevice(id);
        $scope.devices = $storageService.getDevices();
    }
    $scope.enableDevice = function(id){
        $storageService.enableDevice(id);
        $scope.devices = $storageService.getDevices();
    }
    $scope.edit = function(id){
        $state.go("manager.edit_device",{id:id});
    }
    $scope.back = function () {
        $state.go("home");
    };
};


var ManagerEditDeviceCtrl = function($scope,$stateParams,$state,$storageService,$mockingService,$statementService,$deviceParsingService,$ionicHistory,$filter){
    $storageService.loadAllConfig();
    var id = $stateParams.id;
    var deviceType = [{
        id : 4,
        name :'Bóng đèn'
    },{
        id : 5,
        name : 'Bình nóng lạnh '
    },{
        id : 3,
        name : 'Điều hoà '
    },{
        id : 1,
        name : 'Cảm biến nhiệt độ'
    },{
        id : 2,
        name : 'Cảm biến độ ẩm'
    },{
        id : 6,
        name : "Quạt"
    },{
        id : 7,
        name : "Rèm"
    },{
        id : 8,
        name : "Bơm tưới cây"
    }];

    $scope.addMode =  true;

    $scope.deviceList = $storageService.getDevices();

    $scope.deviceTypeList = deviceType;
    if (id < 0){ // ADD
        $scope.addMode = true;
        $scope.title = "Thêm thiết bị";
        $scope.device = {
            id : 0,
            deviceType : 1,
            signalType : "DIGITAL",
            minValue : 0,
            maxValue : 100,
            isOutdoor: false
        }
        if ($scope.deviceTypeList[0].isDigital){
            $scope.device.signalType = "DIGITAL";
            $scope.isDigital = true;
        } else {
            $scope.device.signalType = "ANALOG";
            $scope.isDigital = false;
        }
    } else { // EDIT
        $scope.addMode = false;
        var device = $storageService.getDeviceById(id);
        $scope.title = device.name +"(ID: "+device.id+")";
        $scope.device = {
            id : device.id,
            deviceType : device.type,
            name : device.name,
            signalType : "DIGITAL",
            minValue : device.fromValue,
            maxValue : device.toValue,
            isOutdoor : device.isOutdoor
        }
        if (device.isDigital){
            $scope.isDigital = true;
            $scope.device.signalType = "DIGITAL";
        } else {
            $scope.isDigital = false;
            $scope.device.signalType = "ANALOG";
        }

    }

    $scope.submit = function(){
        if ($scope.device.name) {
            var device = new Device();
            device.id = $scope.device.id;
            device.name = $scope.device.name;
            device.type = $scope.device.deviceType;
            device.isDigital = $scope.device.signalType == "DIGITAL" ? true : false;
            device.fromValue = $scope.device.minValue;
            device.toValue = $scope.device.maxValue;
            device.isOutdoor = $scope.device.isOutdoor ? true : false;

            // if ($scope.addMode){
            $storageService.addDevice(device);
            // } else {
            $storageService.editDevice(device);
            // }
            $state.go("manager.device");
        } else {
            alert("Nhập tên thiết bị");
        }
    }
    $scope.back = function(){
        $state.go("manager.device");
    }

    $scope.changeDevice = function(){
        var id = $scope.device.id;
        var object = $filter('filter')($scope.deviceList, function (d) {return d.id == id;})[0];
        if (object.isDigital){
            $scope.device.signalType = "DIGITAL";
            $scope.isDigital = true;
        } else {
            $scope.device.signalType = "ANALOG";
            $scope.isDigital = false;
        }
    }
};
