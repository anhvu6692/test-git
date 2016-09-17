/**
 * Created by Trong on 6/5/2016.
 */

var ManagerFloorsCtrl = function ($scope,$storageService,$state) {
    $storageService.loadAllConfig();
    $scope.title = "Danh sách các tầng";
    $scope.floors = $storageService.getFloors();
    $scope.back = function(){
        $state.go("home");
    }
    $scope.add = function(){
        $state.go("manager.edit_floors",{id:-1});
    }
    $scope.edit = function(id){
        $state.go("manager.edit_floors",{id:id});
    }
    $scope.remove = function(id){
        $storageService.removeFloor(id);
        $scope.floors = $storageService.getFloors();
    }
};

var ManagerEditFloorsCtrl = function($scope,$stateParams,$state,$storageService,$mockingService,$deviceParsingService,$ionicHistory,$filter,$ionicPopup,$cordovaImagePicker,$cordovaFileTransfer){
    $storageService.loadAllConfig();
    var id = $stateParams.id;
    $scope.addMode = true;
    $scope.dvList = [];

    $scope.floor = {
        name : "",
        id : 0,
        image : ""
    }
    if (id < 0) { // ADD
        $scope.addMode = true;
        $scope.title = "Thêm tầng";
        $scope.dvList = [];
    } else { // EDIT
        $scope.addMode = false;
        var floor = $storageService.getFloorById(id);
        $scope.title = floor.name +"(ID: "+id+")";

        $scope.floor = {
            name : floor.name,
            id : floor.id,
            image : floor.image
        }
        $scope.dvList = floor.deviceList;
    }

    // Setup device
    var objectDeviceList = $filter('filter')($storageService.getDevices(),function(d){ return d.status == 1 ;});
    $scope.deviceList = [];
    for (var i = 0 ; i < objectDeviceList.length ; i++){
        var objectDevice = objectDeviceList[i];
        var selected = ($scope.dvList.indexOf(objectDevice.id) == -1) ? false :  true;
        var device = {
            id: objectDevice.id,
            name: objectDevice.name,
            selected: selected
        }
        $scope.deviceList.push(device);
    }

    $scope.submit = function(){
        var floor = new Floor();
        floor.name = $scope.floor.name;
        floor.image = $scope.floor.image;
        floor.deviceList = $scope.dvList;
        if (!floor.name || floor.name.length == 0){
            alert("NHẬP TÊN TẦNG");
            return;
        }
        if ($scope.addMode){ // add
            $storageService.addFloor(floor);
        } else {
            floor.id = $scope.floor.id;
            $storageService.editFloor(floor);
        }
        $state.go("manager.floors");
    }
    $scope.back = function(){
        $state.go("manager.floors");
    }
    var myPopup;
    $scope.addDevice = function(){

        var template = ''+
        '<ion-content>'+
            '<div class="list listbox">'+
                ' <div class="item" ng-repeat="device in deviceList | orderBy:\'id\' " ng-click="clicked(device.id)" ng-class="{ active: device.selected }">{{ device.name }}</div>'+
            '</div>'+
        '</ion-content>';


        // An elaborate, custom popup
        myPopup = $ionicPopup.show({
            template: template,
            title: 'Chọn thiết bị',
            scope: $scope,
            buttons: [ { text: 'Đồng ý' }]
        });

        myPopup.then(function(res) {
            // getDeviceList();
        });
    }
    $scope.clicked = function(deviceID){
        var index = $scope.dvList.indexOf(deviceID);
        if (index == -1) {
            $scope.dvList.push(deviceID);
        } else {
            $scope.dvList.splice(index,1);
        }
        var dv = $filter('filter')($scope.deviceList,function(d){ return d.id == deviceID ;})[0];
        dv.selected = !dv.selected;
    }
    $scope.browserFile = function(){
        var options = {
            maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
            width: 800,
            height: 800,
            quality: 80            // Higher is better
        };

        $cordovaImagePicker.getPictures(options).then(function (results) {
            // Loop through acquired images
            for (var i = 0; i < results.length; i++) {

                $cordovaFileTransfer.download(encodeURI(results[i]), encodeURI(cordova.file.documentsDirectory + makeid()+".jpg"), {}, true).then(
                    function(fileEntry)
                    {
                        $scope.floor.image = fileEntry.nativeURL;

                    },
                    function (error)
                    {
                        console.log(error);
                    }
                );
            }
        }, function(error) {
            alert('Error: ' + JSON.stringify(error));    // In case of error
        });
    }

    function makeid()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}