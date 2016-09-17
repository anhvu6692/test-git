/**
 * Created by Trong on 5/30/2016.
 */
app.factory('$loginService', function($socketService) {
    // Might use a resource here that returns a JSON array

    function connect(callback){
        $socketService.connect(callback);
    }

    function login(username,password,callback){
        $socketService.login(username,password,callback);
    }

    return {
        login : login,
        connect : connect
    };
});