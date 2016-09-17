/**
 * Created by Trong on 6/1/2016.
 */
app.factory('$profile', function() {
    // Might use a resource here that returns a JSON array

    var masterDevice;
    var realDevices;
    var saveDevices;
    var floors;
    var rooms;
    var user;


    return {
        masterDevice: masterDevice,
        realDevices: realDevices,
        saveDevices: saveDevices,
        floors: floors,
        rooms: rooms,
        user: user
    };
});