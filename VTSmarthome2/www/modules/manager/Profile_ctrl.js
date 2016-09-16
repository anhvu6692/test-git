/**
 * Created by Trong on 6/5/2016.
 */
var ManagerProfileCtrl = function ($scope,$stateParams,$state,$storageService) {
    $scope.title = "Danh sách các cấu hình";
    $scope.profiles = $storageService.getProfiles();
    $scope.back = function(){
        $state.go("home");
    }
    $scope.add = function(){
        $state.go("manager.edit_profile",{id:-1});
    }
    $scope.remove = function(id){
        $storageService.removeProfile(id);
        $scope.profiles = $storageService.getProfiles();
    }
};

var ManagerEditProfileCtrl = function ($scope,$stateParams,$state,$storageService) {
    $storageService.loadAllConfig();
    $scope.title = "Thêm cấu hình";
    $scope.profile = {
        id : "",
        name : ""
    }
    $scope.submit = function(){
        var profile = new Profile();
        profile.name = $scope.profile.name;
        profile.id = $scope.profile.id;
        if (!profile.name || !profile.id || profile.id.length == 0 || profile.name.length == 0){
            alert("NHẬP CẤU HÌNH");
            return;
        }
        $storageService.addProfile(profile);
        $state.go("manager.profile");
    }
    $scope.back = function(){
        $state.go("manager.profile");
    }

};