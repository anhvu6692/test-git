/**
 * Created by trongdoduc on 5/31/16.
 */
app.factory('$deviceParsingService', function() {
    // Might use a resource here that returns a JSON array


    function parsingDeviceArray(recvString,callback){

        try{
            // trim string
            recvString = recvString.trim();

            // Split to 2 part
            var recv  = recvString.split("=");

            // master device
            var master = recv[0];

            // parsing device
            var devicesString = recv[1].split(",");

            var arrayDevice = [];
            for(var i = 0 ; i < devicesString.length ; i++){
                var device = parseStringToDevice(i, devicesString[i]);
                arrayDevice.push(device);
            }
            callback(master,arrayDevice);
        } catch (e){
            // alert("ERROR WHEN PARSE");
        }
    }



    function parseStringToDevice(id,devString) {
        var properties = devString.split("-");
        var device = new Device();
        if (properties.length == 4){ // digital
            device.id = id;
            device.value = 0;
            device.isOn = properties[0];
            device.isDigital = true;
            device.isSchedule = properties[1];
            device.fromSchedule = parseTimeToString(properties[2]);
            device.toSchedule = parseTimeToString(properties[3]);
        } else if (properties.length == 5){ // analog
            device.id = id;
            device.isOn = properties[0];
            device.isDigital = false;
            device.value = properties[1];
            device.isSchedule = properties[2];
            device.fromSchedule = parseTimeToString(properties[3]);
            device.toSchedule = parseTimeToString(properties[4]);
        }
        return device;
    }

    function parseTimeToString(time){
        var minutes = parseInt(time,10);
        var hour = parseInt(minutes/60);
        var min = minutes%60;
        if(hour<10) hour = '0'+hour;
        if(min<10) min = '0'+min;
        return hour+':'+min;
    }

    function parseStringToTime(stringTime){
        var hour = stringTime.split(":")[0];
        var minute = stringTime.split(":")[1];
        return parseInt(hour)*60 + parseInt(minute);
    }

    function parsingDeviceSingle(recvString){
        // trim string
        recvString = recvString.trim();

        // Split to 2 part
        var recv  = recvString.split("=");

        // master device and ID
        var masterAndID = recv[0];

        var deviceID = parseInt(parseInt(masterAndID.split(".")[1]),10);

        return parseStringToDevice(deviceID, recv[1]);

    }

    return {
        parsingDeviceArray: parsingDeviceArray,
        parsingDeviceSingle: parsingDeviceSingle,
        parseTimeToString: parseTimeToString,
        parseStringToTime: parseStringToTime
    };
});