/**
 * Created by trongdoduc on 5/31/16.
 */

app.factory('$mockingService', function($deviceParsingService) {
    // Might use a resource here that returns a JSON array


    function createDeviceRecvArray(){
        var stringArray = "00001=1-327-0-0-100,1-805-0-0-0,1-0-968-1099,1-0-907-1271,1-0-1102-1041,0-22-0-1043-1163,0-30-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,1-0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0,0-0-0-0";
       return stringArray;
    }

    function createSingleDevice(){
        var string = "00001.1=1-0-0-10";
        //var device = $deviceParsingService.parsingDeviceSingle(string)
        //return device;
        return string;
    }

    function createFloors(){
        var floorArray = [];
        for(var i = 0 ; i < 10 ; i++){
            var floor = new Floor();
            floor.id = i;
            floor.name = "Tang "+i;
            floor.image = "";
            floorArray.push(floor);
        }
        return floorArray;
    }

    function createRooms(){
        var roomArray = [];
        for(var i = 100; i < 105; i++){
            var room = new Room();
            room.floorID = 1;
            room.name = "Phong xxx";
            room.id = i;
            roomArray.push(room);
        }
        return roomArray;
    }

    function createDevices(){
        var deviceArray = [];
        for(var i = 1000; i < 1010; i++){
            var device = new DeviceSave();
            device.id = i;
            device.fromValue = 0;
            device.toValue = 10;
            device.name = "Thiet bi "+i;
            device.isDigital = i%2;
            device.isOn = i%2;
            device.isSchedule = i%2;
            device.fromSchedule = "00:10";
            device.toSchedule = "10:02";
            deviceArray.push(device);
        }
        return deviceArray;
    }


    return {
        createDeviceRecvArray: createDeviceRecvArray,
        createSingleDevice: createSingleDevice,
        createFloors: createFloors,
        createRooms: createRooms,
        createDevices: createDevices
    };
});