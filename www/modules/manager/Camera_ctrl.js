/**
 * Created by Trong on 9/6/2016.
 */
var ManagerCameraCtrl = function ($scope,$storageService,$state) {
    $storageService.loadAllConfig();
    $scope.title = "Danh sách Camera";
    $scope.cameras = $storageService.getCameras();
    console.log($scope.cameras);
    $scope.back = function(){
        $state.go("home");
    }
    $scope.add = function(){
        $state.go("manager.edit_camera",{id:-1});
    }
    $scope.edit = function(id){
        $state.go("manager.edit_camera",{id:id});
    }
    $scope.remove = function(id){
        $storageService.removeCamera(id);
        $scope.cameras = $storageService.getCameras();
    }
};
var ManagerEditCameraCtrl = function($scope,$stateParams,$state,$storageService) {
    $storageService.loadAllConfig();
    var id = $stateParams.id;
    $scope.addMode = true;
    $scope.camera = {
        id: 0,
        name : "",
        hostname : "",
        port : "",
        username: "",
        password: ""
    }
    if (id < 0) { // ADD
        $scope.addMode = true;
        $scope.title = "Thêm Camera";
    } else { // EDIT
        $scope.addMode = false;
        var camera = $storageService.getCameraById(id);
        $scope.title = camera.name +"(ID: "+id+")";

        $scope.camera = {
            id: camera.id,
            name : camera.name,
            hostname : camera.hostname,
            port : camera.port,
            username: camera.username,
            password: camera.password
        }
    }
    $scope.submit = function(){
        if (!$scope.camera.name || $scope.camera.name.length == 0){
            alert("NHẬP TÊN CAMERA");
            return;
        }
        if (!$scope.camera.hostname || $scope.camera.hostname.length == 0){
            alert("NHẬP DOMAIN");
            return;
        }
        console.log($scope.camera);
        if($scope.addMode) $storageService.addCamera($scope.camera);
        else  $storageService.editCamera($scope.camera);
        $state.go("manager.camera");
    }
    $scope.back = function(){
        $state.go("manager.camera");
    }

}