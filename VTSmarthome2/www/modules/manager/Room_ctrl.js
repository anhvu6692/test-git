/**
 * Created by Trong on 6/5/2016.
 */

var ManagerRoomCtrl = function ($scope,$stateParams,$storageService,$ionicHistory,$state) {
    $storageService.loadAllConfig();
    var floorID = $stateParams.id;
    $scope.title = "Phòng của "+$storageService.getFloorById(floorID).name;
    $scope.rooms = $storageService.getRoomFromFloor(floorID);

    $scope.back = function(){
        $state.go("manager.floors");
    }
    $scope.add = function(){
        $state.go("edit_room",{id:-1,floorID:floorID});
    }
    $scope.edit = function(roomID){
        $state.go("edit_room",{id:roomID,floorID:floorID});
    }
    $scope.remove = function(roomID){
        $storageService.removeRoom(roomID);
        $scope.rooms = $storageService.getRoomFromFloor(floorID);
    }
};

var ManagerEditRoomCtrl = function ($scope,$stateParams,$storageService,$ionicHistory,$state,$ionicPopup,$ionicModal,$filter) {
    $storageService.loadAllConfig();
    var id = $stateParams.id;
    var floorID = $stateParams.floorID;
    $scope.addMode = true;
    $scope.dvList = [];
    $scope.floor = $storageService.getFloorById(floorID);

    if (id < 0) { // ADD
        $scope.addMode = true;
        $scope.title = "Thêm phòng";
        $scope.room = {
            name : "",
            id : 0,
            x : 0,
            y : 0
        }

    } else { // EDIT
        $scope.addMode = false;
        var room = $storageService.getRoomById(id);
        $scope.title = room.name +"(ID: "+id+")";
        $scope.room = {
            name : room.name,
            id : room.id,
            x : room.x,
            y : room.y
        }
        $scope.dvList = room.deviceList;
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
        var room = new Room();
        room.name = $scope.room.name;
        room.floorID = floorID;
        room.x = $scope.room.x;
        room.y = $scope.room.y;
        room.deviceList = $scope.dvList;

        if ($scope.addMode){ // add
            $storageService.addRoom(room);
        } else {
            room.id = $scope.room.id;
            $storageService.editRoom(room);
        }
        $state.go("room",{id:floorID});
    }
    $scope.back = function(){
        $state.go("room",{id:floorID});
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
            buttons: [ { text: 'Đồng ý' } ]
        });

        myPopup.then(function(res) {

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

    var paddingLeft = window.screen.width/10;
    var paddingTop = window.screen.height/8;

    $scope.findLocation = function(){
        var width = window.screen.width*8/10;
        var height = window.screen.height *6/8;
        $scope.modal = $ionicModal.fromTemplate( '<ion-modal-view>' +
            ' <ion-header-bar>' +
            '<h1 class = "title">Chọn toạ độ chạm</h1>' +
            '<button class = "button" ng-click = "closeModal()">Cancel</button>' +
            '</ion-header-bar>' +

            '<ion-content>'+
            '<img ng-click="addOnClick($event)" width='+width+'px height="'+height+'px" style="margin-left:'+paddingLeft+'px;margin-top:'+paddingTop+'px" src="'+$scope.floor.image+'" />'+
            
            '</ion-content>' +

            '</ion-modal-view>', {
            scope: $scope,
            animation: 'slide-in-up'
        })

        $scope.modal.show();

        $scope.closeModal = function() {
            $scope.modal.remove();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
        // Execute action
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
        // Execute action
        });
    }
    $scope.addOnClick = function(event){
        var target = angular.element(event.target);
        $scope.room.x = event.clientX-target[0].x;
        $scope.room.y = event.clientY-target[0].y;
        $scope.modal.remove();
    }
};