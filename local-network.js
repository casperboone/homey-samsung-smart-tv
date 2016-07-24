module.exports.mac = function () {

    var ifaces = require('os').networkInterfaces();
    var result = "00:00:00:00";
    
    Object.keys(ifaces).forEach(function (ifname) {
        ifaces[ifname].forEach(function (iface) {
            if (iface.family === 'IPv4' && iface.internal === false) {
                result = iface.mac;
                return;
            }
        });
    });
    
    return result;
}

module.exports.ip = function () {

    var ifaces = require('os').networkInterfaces();
    var result = "0.0.0.0";
    
    Object.keys(ifaces).forEach(function (ifname) {
        ifaces[ifname].forEach(function (iface) {
            if (iface.family === 'IPv4' && iface.internal === false) {
                result = iface.address;
                return;
            }
        });
    });
    
    return result;
}