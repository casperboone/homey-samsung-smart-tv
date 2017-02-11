"use strict";

const networkInterface = getInterface();

module.exports = {
    mac() {
        return networkInterface.mac ? networkInterface.mac : '00:00:00:00';
    },

    ip() {
        return networkInterface.ip ? networkInterface.ip : '0.0.0.0';
    }
}

function getInterface() {
    const ifaces = require('os').networkInterfaces();
    let result = "0.0.0.0";

    Object.keys(ifaces).forEach((ifname) => {
        ifaces[ifname].forEach((iface) => {
            if (iface.family === 'IPv4' && iface.internal === false) {
                result = iface;
                return;
            }
        });
    });

    return result;
}