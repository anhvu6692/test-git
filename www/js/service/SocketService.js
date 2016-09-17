/**
 * Created by Trong on 5/30/2016.
 */
app.factory('$socketService', function($statementService,$storageService,$deviceParsingService) {
    // Might use a resource here that returns a JSON array

   /*  Message code
    0: init success
    1: init error
    20: get data all device
    21: get data single device
    3: get error
    4: close */


    var socket;
    var callback;
    var connected = false;

    function isConnected() {
        return connected;
    }
    function connect(sCallback){
        callback = sCallback;
        if (!socket || !connected){

            socket = new Socket();
            
            socket.onData = function(data) {
                var chars = new Array(data.length);
                for (var i = 0; i < data.length; i++) {
                    chars.push(String.fromCharCode(data[i]));
                }
                var dataString = chars.join("");
                dataString.split(/(?:\r\n|\r|\n)/g).forEach(function(text){
                    if (text.length > 0){
                        // callback(1,text);
                        parsing(text);
                    }
                });
            };
            socket.onError = function(errorMessage) {
                connected = false;
               callback(-3,"Connection Error! Reconnect....");
            };
            socket.onClose = function(hasError) {
                connected = false;
                callback(-2,"Connection Close! Reconnect...");
            };

            socket.open(
                "smarthome.viettracker.vn",
                // "100.100.100.102",
                8800,
                function() {
                    connected = true;
                    callback(0,"Init Connection Success");
                },
                function(errorMessage) {
                    connected = false;
                    callback(-1,"Init Connection Failre");
                });
            
        } else if (connected){
            callback(0,"init");
        }
    }

    function parsing(data){
        console.log("RECV: <="+data);
        var parts = data.split("=");
        if (parts.length > 0){
            if (parts[0].indexOf(".") == -1){ // not pattern 00001.1=1 => All device
                $deviceParsingService.parsingDeviceArray(data,function(masterDevice,deviceArr){
                    $statementService.setMasterDevice(masterDevice);
                    $storageService.setDevicesRecv(deviceArr);
                    callback(20,deviceArr);
                });
            } else {//  pattern 00001.1=1 => single device
                var device = $deviceParsingService.parsingDeviceSingle(data);
                $storageService.setSingleDeviceStatus(device);
                callback(21,device);
            }
        }
    }

    function setCallback(newCallback){
        callback = newCallback;
    }

    function sendData(dataString){
        console.log("SEND: =>"+dataString);
        var data = convertStringToByte(dataString);
        socket.write(data);
    }
    function convertStringToByte(dataString){
        var data = new Uint8Array(dataString.length);
        for (var i = 0; i < data.length; i++) {
            data[i] = dataString.charCodeAt(i);
        }
        return data;
    }

    function login(username,password,newCallback){
        callback = newCallback;
        var loginString = "*"+username+","+password+"#";
        var data = convertStringToByte(loginString);
        socket.write(data);
    }

    return {
        connect: connect,
        sendData : sendData,
        setCallback: setCallback,
        login : login,
        isConnected: isConnected
    };
});