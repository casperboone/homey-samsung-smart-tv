/**
 * Wrapper around samsung-remote
 */

var SamsungRemote = require('./samsung-remote/samsung-remote.js');
var LocalNetwork = require('./local-network.js');

/**
 * Construct Remote
 */
function Remote(ip) {
   
    // Connect to TV
    this.remote = new SamsungRemote({
        
        ip: ip, 
        
        host: {
            ip: LocalNetwork.ip(),
            mac: LocalNetwork.mac(),
            name: "Homey"
        }
        
    });
    
}

Remote.prototype.setChannel = function(channelNumber) { 
    
    var object = this;
    
    if (typeof channelNumber != "number") {
        return new Error("Channel number is not a number");
    }
    
    var channelNumberArray = new String(channelNumber);
    
    for (var i = 0; i < channelNumberArray.length; i++) {
        
        sendKey(object.remote, "KEY_" + channelNumberArray[i]);
        
    }
    
};

Remote.prototype.mute = function() {
    
    sendKey(this.remote, "KEY_MUTE");
    
};

Remote.prototype.volumeUp = function () {
    
    sendKey(this.remote, "KEY_VOLUP");
    
}

Remote.prototype.volumeDown = function () {
    
    sendKey(this.remote, "KEY_VOLDOWN");
    
}

Remote.prototype.powerOff = function () {
    
    sendKey(this.remote, "KEY_POWEROFF");
    
}

function sendKey(remote, key) {
    
    remote.send(key, function callback(err) {
        
        if (err) {
            
            Homey.log(err);
            
        }
        
    });
    
}

module.exports = Remote;