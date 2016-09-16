/**
 * Created by LongPC on 6/3/2016.
 */
app.factory('$storageService', function($window, $filter) {
    var floors = [];
    var rooms = [];
    var devices = [];
    var profiles = [];
    var cameras = [];
    var user;
    var view;

    function setDeviceString(string){
        $window.localStorage["devices"] = string;
    }

    function saveFloorToStorage(){ //tested
        $window.localStorage["floors"] = JSON.stringify(floors);
    }

    function saveRoomToStorage(){
        $window.localStorage["rooms"] = JSON.stringify(rooms);
    }

    function saveDeviceToStorage(){
        $window.localStorage["devices"] =  JSON.stringify(devices);
    }

    function saveProfileToStorage(){
        $window.localStorage["profiles"] =  JSON.stringify(profiles);
    }

    function saveUserToStorage(username,password){
        user = {
            username: username,
            password: password
        };
        $window.localStorage["user"] =  JSON.stringify(user);
    }
    function saveViewToStorage(_view){
        view = _view;
        $window.localStorage['view'] = view;
    }
    function saveCameraToStorage(){
        $window.localStorage["cameras"] =  JSON.stringify(cameras);
    }


    function loadAllConfig(){
        loadFloorFromStorage();
        loadRoomFromStorage();
        loadDeviceFromStorage();
        loadProfileFromStorage();
        loadUserFromStorage();
        loadViewFromStorage();
        loadCameraFromStorage();
    }

    function loadFloorFromStorage(){
        if($window.localStorage["floors"]){
            var objects =  JSON.parse($window.localStorage["floors"]);
            floors = [];
            if (objects){
                for(var i = 0 ; i < objects.length ; i++){
                    var floor = new Floor();
                    floor.id = objects[i]['id'];
                    floor.name = objects[i]['name'];
                    floor.image = objects[i]['image'];
                    floor.deviceList = objects[i]['deviceList'];
                    floor.view = objects[i]['view'];
                    floors.push(floor);
                }
            }
        }
    }

    function loadRoomFromStorage(){
        if($window.localStorage["rooms"]){
            var objects = JSON.parse($window.localStorage["rooms"]);
            rooms = [];
            if (objects){
                for(var i = 0 ; i < objects.length ; i++){
                    var room = new Room();
                    room.id = objects[i]['id'];
                    room.name = objects[i]['name'];
                    room.floorID = objects[i]['floorID'];
                    room.deviceList = objects[i]['deviceList'];
                    room.x = objects[i]['x'];
                    room.y = objects[i]['y'];
                    rooms.push(room);
                }
            }
        }
    }

    function loadDeviceFromStorage(){
        if($window.localStorage["devices"]){
            var objects = JSON.parse($window.localStorage["devices"]);
            devices = [];
            if (objects){
                for(var i = 0 ; i < objects.length ; i++){
                    var device = new Device();
                    device.id = objects[i]['id'];
                    device.name = objects[i]['name'];
                    device.type = objects[i]['type'];
                    device.fromValue = objects[i]['fromValue'];
                    device.toValue = objects[i]['toValue'];
                    device.isDigital = objects[i]['isDigital'];
                    device.isOutdoor = objects[i]['isOutdoor'];
                    device.status = objects[i]['status'];
                    devices.push(device);
                }
            }
        }
    }

    function loadProfileFromStorage(){
        if($window.localStorage["profiles"]){
            var objects = JSON.parse($window.localStorage["profiles"]);
            profiles = [];
            if (objects){
                for(var i = 0 ; i < objects.length ; i++){
                    var profile = new Profile();
                    profile.id = objects[i]['id'];
                    profile.name = objects[i]['name'];
                    profiles.push(profile);
                }
            }
        }
    }

    function loadUserFromStorage(){
        if ($window.localStorage["user"]){
            user = JSON.parse($window.localStorage["user"]);

        } else {
            user = {
                username : "",
                password : ""
            }
        }
    }

    function loadViewFromStorage(){
        if ($window.localStorage["view"]){
            view = $window.localStorage["view"];
        } else {
            view = 1;
        }
    }

    function loadCameraFromStorage(){
        if($window.localStorage["cameras"]){
            var objects = JSON.parse($window.localStorage["cameras"]);
            cameras = [];
            if (objects){
                for(var i = 0 ; i < objects.length ; i++){
                    var camera = new Camera();
                    camera.id = objects[i]['id'];
                    camera.name = objects[i]['name'];
                    camera.hostname = objects[i]['hostname'];
                    camera.port = objects[i]['port'];
                    camera.username = objects[i]['username'];
                    camera.password = objects[i]['password'];
                    cameras.push(camera);
                }
            }
        }
    }
    // Floor
    function addFloor(newFloor){
        newFloor.id = makeid();
        var floor = $filter('filter')(floors, function (d) {return d.id == newFloor.id;})[0];
        if (!floor){
            floors.push(newFloor);
            saveFloorToStorage();
        }
    }

    function editFloor(ffloor){
        var floor = $filter('filter')(floors, function (d) {return d.id == ffloor.id;})[0];
        if (floor){
            floor.name = ffloor.name;
            floor.image = ffloor.image;
            floor.deviceList = ffloor.deviceList;
            saveFloorToStorage();
        }
    }

    function removeFloor(id){
        floors = $filter('filter')(floors, function (d) {return d.id != id;});
        saveFloorToStorage();
    }

    function addDeviceToFloor(floorID,deviceID){
        var floor = $filter('filter')(floors, function (d) {return d.id == floorID;})[0];
        if (floor && floor.deviceList.indexOf(deviceID) == -1){
            floor.deviceList.push(deviceID);
            saveFloorToStorage();
        }
    }

    function removeDeviceFromFloor(floorID,deviceID){
        var floor = $filter('filter')(floors, function (d) {return d.id == floorID;})[0];
        if (floor && floor.deviceList.indexOf(deviceID) != -1){
            floor.deviceList.splice(floor.deviceList.indexOf(deviceID),1);
            saveFloorToStorage();
        }
    }

    function getFloorById(id){
        return $filter('filter')(floors, function (d) {return d.id == id;})[0];
    }

    function setFloorView(id,view){
        var floor = $filter('filter')(floors, function (d) {return d.id == id;})[0];
        if (floor){
            floor.view = view;
            saveFloorToStorage();
        }
    }

    // Room
    function addRoom(newRoom){
        newRoom.id = makeid();
        var room = $filter('filter')(rooms, function (d) {return d.id == newRoom.id;})[0];
        if (!room){
            rooms.push(newRoom);
            saveRoomToStorage();
        }
    }

    function editRoom(rroom){
        var room = $filter('filter')(rooms, function (d) {return d.id == rroom.id;})[0];
        if (room){
            room.name = rroom.name;
            room.deviceList = rroom.deviceList;
            room.x = rroom.x;
            room.y = rroom.y;
            saveRoomToStorage();
        }
    }

    function removeRoom(id){
        rooms = $filter('filter')(rooms, function (d) {return d.id != id;});
        saveRoomToStorage();
    }

    function addDeviceToRooms(roomID,deviceID){
        var room = $filter('filter')(rooms, function (d) {return d.id == roomID;})[0];
        if (room && room.deviceList.indexOf(deviceID) == -1){
            room.deviceList.push(deviceID);
            saveRoomToStorage();
        }
    }

    function removeDeviceFromRoom(roomID,deviceID){
        var room = $filter('filter')(rooms, function (d) {return d.id == roomID;})[0];
        if (room && room.deviceList.indexOf(deviceID) != -1){
            room.deviceList.splice(room.deviceList.indexOf(deviceID),1);
            saveRoomToStorage();
        }
    }

    function getRoomById(roomID){
        return $filter('filter')(rooms, function (d) {return d.id == roomID;})[0];
    }
    // Device
    function addDevice(newDevice){
        devices[parseInt(newDevice.id)] = newDevice;
        saveDeviceToStorage();
    }

    // Ignore
    function editDevice(device){
        // var dv = $filter('filter')(devices, function (d) {return d.id == device.id;})[0];
        var dv = devices[parseInt(device.id)];
        if (dv){
            dv.name = device.name;
            dv.fromValue = device.fromValue;
            dv.toValue = device.toValue;
            dv.isDigital = device.isDigital;
            dv.type = device.type;
            dv.isOutdoor = device.isOutdoor;
            saveDeviceToStorage();
        }
    }

    function disableDevice(id){
        devices[parseInt(id)].status = 0;
        saveDeviceToStorage();
    }
    function enableDevice(id){
        devices[parseInt(id)].status = 1;
        saveDeviceToStorage();
    }

    function getDeviceById(id){
        return $filter('filter')(devices, function (d) {return d.id == id;})[0];
    }

    // Profile
    function addProfile(newProfile){
        var profile = $filter('filter')(profiles, function (d) {return d.id == newProfile.id;})[0];
        if (!profile){
            profiles.push(newProfile);
            saveProfileToStorage();
        }
    }

    function removeProfile(id){
        profiles = $filter('filter')(profiles, function (d) {return d.id != id;});
        saveProfileToStorage();
    }

    function getProfileById(id){
        return $filter('filter')(profiles, function (d) {return d.id == id;})[0];
    }

    // Camera
    function addCamera(_camera){
        _camera.id = makeid();
        var camera = $filter('filter')(cameras, function (d) {return d.id == _camera.id;})[0];
        if (!camera){
            cameras.push(_camera);
            saveCameraToStorage();
        }
    }
    function editCamera(_camera){
        var camera = $filter('filter')(cameras, function (d) {return d.id == _camera.id;})[0];
        if (camera){
            camera.name = _camera.name;
            camera.hostname = _camera.hostname;
            camera.port = _camera.port;
            camera.username = _camera.username;
            camera.password = _camera.password;
            saveCameraToStorage();
        }
    }
    function removeCamera(id){
        cameras = $filter('filter')(cameras, function (d) {return d.id != id;});
        saveCameraToStorage();
    }
    function getCameraById(id){
        return $filter('filter')(cameras, function (d) {return d.id == id;})[0];
    }

    // getter
    function getFloors(){
        return floors;
    }

    function getRooms(){
        return rooms;
    }

    function getDevices(){
        return devices;
    }

    function getProfiles(){
        return profiles;
    }

    function getUser(){
        return user;
    }
    function getView(){
        return view;
    }
    function getCameras(){
        return cameras;
    }

    function getItemFromFloor(floorID){
        var devices = [];
        var floor = $filter('filter')(floors, function (d) {return d.id == floorID;})[0];
        for(var i = 0 ; i < floor.deviceList.length ; i++){
            var device = $filter('filter')(devices, function (d) {return d.id != floor.deviceList[i];})[0];
            if (device){
                devices.push(device);
            }
        }
        return devices;
    }

    function getRoomFromFloor(floorID){
        return $filter('filter')(rooms, function (d) {return d.floorID == floorID;});
    }

    function getItemFromRoom(roomID){
        var devices = [];
        var room = $filter('filter')(rooms, function (d) {return d.id == roomID;})[0];
        for(var i = 0 ; i < room.deviceList.length ; i++){
            var device = $filter('filter')(devices, function (d) {return d.id != room.deviceList[i];})[0];
            if (device){
                devices.push(device);
            }
        }
        return devices;
    }

    // function getDevicesRecv(){
    //     return devices_revc;
    // }

    function setDevicesRecv(recv){
        // reset all information of device
        for(var i = 0 ; i < recv.length; i++){
            var recvDevice = recv[i];
            if (i < devices.length){ // have index
                devices[i].isDigital = recvDevice.isDigital; // renew is digital
                devices[i].isOn = recvDevice.isOn;
                devices[i].isSchedule = recvDevice.isSchedule;
                devices[i].value = recvDevice.value;
                devices[i].fromSchedule = recvDevice.fromSchedule;
                devices[i].toSchedule = recvDevice.toSchedule;
            } else { // create devices
                var device = new Device();
                device.isDigital = recvDevice.isDigital;
                device.id = recvDevice.id;
                device.name = "Thiết bị số "+device.id;
                device.type = 3;
                device.fromValue = 0;
                device.toValue = 10;
                device.isOn = recvDevice.isOn;
                device.isSchedule = recvDevice.isSchedule;
                device.value = recvDevice.value;
                device.fromSchedule = recvDevice.fromSchedule;
                device.toSchedule = recvDevice.toSchedule;
                device.status = 1;
                devices.push(device);
            }
        }
        saveDeviceToStorage();

    }

    function setSingleDeviceStatus(dv){
        var device = devices[parseInt(dv.id)];
        if(device){
            device.isOn = dv.isOn;
            device.isSchedule = dv.isSchedule;
            device.value = dv.value;
            device.fromSchedule = dv.fromSchedule;
            device.toSchedule = dv.toSchedule;
        }
    }

    function makeid()
    {
        var text = "";
        var possible = "123456789";

        for( var i=0; i < 8; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    // function
    return {

        // Mock
        setDeviceString : setDeviceString,


        //saveFloorToStorage : saveFloorToStorage,
        //saveRoomToStorage : saveRoomToStorage,
        //saveDeviceToStorage : saveDeviceToStorage,
        saveUserToStorage: saveUserToStorage,
        saveViewToStorage: saveViewToStorage,

        loadFloorFromStorage : loadFloorFromStorage,
        loadRoomFromStorage : loadRoomFromStorage,
        loadDeviceFromStorage : loadDeviceFromStorage,
        loadProfileFromStorage : loadProfileFromStorage,
        loadUserFromStorage: loadUserFromStorage,
        loadAllConfig: loadAllConfig,

        addFloor : addFloor,
        editFloor : editFloor,
        removeFloor : removeFloor,
        addDeviceToFloor : addDeviceToFloor,
        removeDeviceFromFloor : removeDeviceFromFloor,
        getFloorById : getFloorById,
        setFloorView : setFloorView,

        addRoom : addRoom,
        editRoom : editRoom,
        removeRoom : removeRoom,
        addDeviceToRooms : addDeviceToRooms,
        removeDeviceFromRoom : removeDeviceFromRoom,
        getRoomById: getRoomById,

        addDevice : addDevice,
        editDevice : editDevice,
        disableDevice : disableDevice,
        enableDevice : enableDevice,
        getDeviceById : getDeviceById,

        addProfile : addProfile,
        removeProfile : removeProfile,
        getProfileById : getProfileById,

        getFloors: getFloors,
        getRooms: getRooms,
        getDevices: getDevices,
        getProfiles : getProfiles,
        getUser : getUser,
        getView: getView,

        addCamera : addCamera,
        editCamera : editCamera,
        removeCamera : removeCamera,
        getCameras : getCameras,
        getCameraById: getCameraById,

        // getDevicesRecv : getDevicesRecv,
        setDevicesRecv : setDevicesRecv,
        setSingleDeviceStatus: setSingleDeviceStatus,

        getItemFromFloor: getItemFromFloor,
        getRoomFromFloor: getRoomFromFloor,
        getItemFromRoom: getItemFromRoom


    };

});
