/**
 * Created by LongPC on 6/3/2016.
 */
app.factory('$statementService', function($deviceParsingService) {

    var masterDevice = "";

    function setMasterDevice(dv){
        masterDevice = dv;
    }

    function getMasterDevice(){
        return masterDevice;
    }

    function createLoginString(username,password){
        var s = "*" +username + "," + password +"#";
        return s;
    }

    function turnOnDevice(deviceID){
        var deviceID = pad(deviceID,3);
        var s = "*" + masterDevice+"."+deviceID+"=1#";
        return s;
    }

    function turnOffDevice(deviceID){
        var deviceID = pad(deviceID,3);
        var s = "*" + masterDevice+"."+deviceID+"=0#";
        return s;
    }

    function changeAnalogValue(deviceID,value){
        var deviceID = pad(deviceID,3);
        var s = "*" + masterDevice+"."+deviceID+"="+pad(value,3)+"#";
        return s;
    }

    function switchToAutomatic(deviceID){
        var deviceID = pad(deviceID,3);
        var s = "*" + masterDevice+"."+deviceID+"=_1#";
        return s;
    }

    function switchToManual(deviceID){
        var deviceID = pad(deviceID,3);
        var s = "*" + masterDevice+"."+deviceID+"=_0#";
        return s;
    }

    function scheduleDevice(deviceID,fromTime,toTime){
        var deviceID = pad(deviceID,3);
        var s = "*" + masterDevice+"."+deviceID+"="+$deviceParsingService.parseStringToTime(fromTime)+"-"+$deviceParsingService.parseStringToTime(toTime)+"m#";
        return s;
    }

    function pad(number, length) {

        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }

        return str;

    }

    return {
        setMasterDevice : setMasterDevice,
        getMasterDevice : getMasterDevice,

        createLoginString : createLoginString,
        turnOnDevice : turnOnDevice,
        turnOffDevice : turnOffDevice,
        changeAnalogValue : changeAnalogValue,
        switchToAutomatic : switchToAutomatic,
        switchToManual : switchToManual,
        scheduleDevice : scheduleDevice
    };
});